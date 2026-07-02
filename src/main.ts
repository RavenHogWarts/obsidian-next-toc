import { EditorView } from "@codemirror/view";
import "@styles/styles";
import { Editor, HeadingCache, MarkdownView, Plugin } from "obsidian";
import {
	destroyNTocRenderForView,
	NTocRenderProps,
	updateNTocRender,
} from "./components/toc-navigator/NTocRender";
import { LL } from "./i18n/i18n";
import { createCursorListenerExtension } from "./services/cursorListenerExtension";
import { PluginSettingTab } from "./settings/PluginSettingTab";
import SettingsStore from "./settings/SettingsStore";
import { IPluginSettings } from "./types/types";
import {
	toggleFileInBlacklist,
	toggleFolderInBlacklist,
} from "./utils/blacklistManager";
import { createScrollListener } from "./utils/eventListenerManager";
import getFileHeadings, {
	getHeadingsFromEditor,
} from "./utils/getFileHeadings";
import {
	navigateHeading,
	returnToCursor,
	scrollTopBottom,
} from "./utils/tocToolsActions";
import updateActiveHeading from "./utils/updateActiveHeading";
import { NTocView, VIEW_TYPE_NTOC } from "./view/NTocView";

export default class NTocPlugin extends Plugin {
	settings: IPluginSettings;
	currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
	readonly settingsStore = new SettingsStore(this);
	private scrollListenerCleanup: (() => void) | null = null;
	private visibleViewScrollCleanups: WeakMap<MarkdownView, () => void> =
		new WeakMap();

	async onload() {
		await this.settingsStore.loadSettings();

		this.addSettingTab(new PluginSettingTab(this));
		this.registerView(VIEW_TYPE_NTOC, (leaf) => new NTocView(leaf, this));

		this.registerCommands();
		this.registerEvents();
		this.registerContextMenu();
		this.registerCodeblockProcessor();

		// Register CM6 cursor listener extension
		this.registerEditorExtension(createCursorListenerExtension(this));

		// Setup initial scroll listener
		this.setupScrollListener();

		if (this.settings.toc.renderInAllVisibleViews) {
			this.updateVisibleNTocs();
		} else {
			this.updateNToc();
		}

		// Listen for setting changes to handle renderInAllVisibleViews toggle
		this.settingsStore.store.subscribe(() => {
			this.onSettingsChanged();
		});
	}

	onunload() {
		this.cleanupScrollListener();
		this.cleanupAllVisibleViewScrollListeners();
		this.app.workspace
			.getLeavesOfType(VIEW_TYPE_NTOC)
			.forEach((leaf) => leaf.detach());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * 初始化 NTocView，确保只有一个实例
	 */
	async initLeaf(): Promise<void> {
		if (this.app.workspace.getLeavesOfType(VIEW_TYPE_NTOC).length === 0) {
			const rightLeaf = this.app.workspace.getRightLeaf(false);
			if (rightLeaf) {
				await rightLeaf.setViewState({
					type: VIEW_TYPE_NTOC,
				});
			}
		}
		await this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_NTOC)[0],
		);
	}

	private registerCommands() {
		this.addCommand({
			id: "enable-disable-toc",
			name: LL.commands.enableDisableToc(),
			callback: async () => {
				await this.settingsStore.updateSettingByPath(
					"toc.show",
					!this.settingsStore.settings.toc.show,
				);
			},
		});

		this.addCommand({
			id: "open-toc-view",
			name: LL.commands.openTocView(),
			callback: async () => {
				await this.initLeaf();
			},
		});

		this.addCommand({
			id: "return-to-cursor",
			name: LL.commands.returnToCursor(),
			editorCallback: (editor: Editor) => {
				const view = this.getActiveMarkdownView();
				if (view && editor === view.editor) {
					returnToCursor(view);
				}
			},
		});

		this.addCommand({
			id: "scroll-to-top",
			name: LL.commands.scrollToTop(),
			callback: () => {
				const view = this.getActiveMarkdownView();
				if (view) {
					scrollTopBottom(view, "top");
				}
			},
		});

		this.addCommand({
			id: "scroll-to-bottom",
			name: LL.commands.scrollToBottom(),
			callback: () => {
				const view = this.getActiveMarkdownView();
				if (view) {
					scrollTopBottom(view, "bottom");
				}
			},
		});

		this.addCommand({
			id: "navigate-previous-heading",
			name: LL.commands.navigatePreviousHeading(),
			callback: () => {
				const view = this.getActiveMarkdownView();
				if (view) {
					const headings = getFileHeadings(view);
					void navigateHeading(view, headings, "prev");
				}
			},
		});

		this.addCommand({
			id: "navigate-next-heading",
			name: LL.commands.navigateNextHeading(),
			callback: () => {
				const view = this.getActiveMarkdownView();
				if (view) {
					const headings = getFileHeadings(view);
					void navigateHeading(view, headings, "next");
				}
			},
		});

		this.addCommand({
			id: "toc-expand",
			name: LL.commands.tocExpand(),
			callback: async () => {
				await this.settingsStore.updateSettingByPath(
					"toc.alwaysExpand",
					!this.settingsStore.settings.toc.alwaysExpand,
				);
			},
		});

		// Toggle current file in hide heading number blacklist
		this.addCommand({
			id: "add-current-file-to-hide-heading-number-blacklist",
			name: LL.commands.addCurrentFileToHideHeadingNumberBlacklist(),
			callback: async () => {
				const file = this.app.workspace.getActiveFile();
				if (!file) {
					return;
				}

				const newBlacklist = toggleFileInBlacklist(
					file,
					this.settingsStore.settings.render
						.hideHeadingNumberBlacklist,
				);

				if (newBlacklist) {
					await this.settingsStore.updateSettingByPath(
						"render.hideHeadingNumberBlacklist",
						newBlacklist,
					);
				}
			},
		});

		// Toggle current folder in hide heading number blacklist
		this.addCommand({
			id: "add-current-folder-to-hide-heading-number-blacklist",
			name: LL.commands.addCurrentFolderToHideHeadingNumberBlacklist(),
			callback: async () => {
				const file = this.app.workspace.getActiveFile();
				if (!file) {
					return;
				}

				const newBlacklist = toggleFolderInBlacklist(
					file,
					this.settingsStore.settings.render
						.hideHeadingNumberBlacklist,
				);

				if (newBlacklist) {
					await this.settingsStore.updateSettingByPath(
						"render.hideHeadingNumberBlacklist",
						newBlacklist,
					);
				}
			},
		});

		// this.addCommand({
		// 	id: "insert-reading-time-card",
		// 	name: LL.commands.insertReadingTimeCard(),
		// 	editorCallback: (editor: Editor) => {
		// 		new CardCreateModal(
		// 			this.app,
		// 			JSON.stringify(DEFAULT_READING_TIME_CARD)
		// 		).open();
		// 	},
		// });

		// this.addCommand({
		// 	id: "insert-table-of-contents-card",
		// 	name: LL.commands.insertTableOfContentsCard(),
		// 	editorCallback: (editor: Editor) => {
		// 		new CardCreateModal(
		// 			this.app,
		// 			JSON.stringify(DEFAULT_TOC_CARD)
		// 		).open();
		// 	},
		// });
	}

	private registerContextMenu() {
		// this.registerEvent(
		// 	this.app.workspace.on("editor-menu", (menu, editor, view) => {
		// 		if (view instanceof MarkdownView) {
		// 			menu.addItem((item) => {
		// 				item.setTitle(LL.commands.insertReadingTimeCard());
		// 				item.setIcon("clock");
		// 				item.onClick(() => {
		// 					new CardCreateModal(
		// 						this.app,
		// 						JSON.stringify(DEFAULT_READING_TIME_CARD)
		// 					).open();
		// 				});
		// 			});
		// 			menu.addItem((item) => {
		// 				item.setTitle(LL.commands.insertTableOfContentsCard());
		// 				item.setIcon("table-of-contents");
		// 				item.onClick(() => {
		// 					new CardCreateModal(
		// 						this.app,
		// 						JSON.stringify(DEFAULT_TOC_CARD)
		// 					).open();
		// 				});
		// 			});
		// 		}
		// 	})
		// );
	}

	private registerEvents() {
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf) => {
				// 如果切换到 NTocView，隐藏内联导航但保持 currentView
				if (leaf?.view.getViewType() === VIEW_TYPE_NTOC) {
					// 强制更新以触发内联导航的隐藏检查
					if (this.currentView && this.currentView.file) {
						const headings = getFileHeadings(this.currentView);
						const { activeHeadingIndex, visibleHeadingIndices } =
							updateActiveHeading(this.currentView, headings);
						this.renderNToc(this.currentView, {
							headings,
							activeHeadingIndex,
							visibleHeadingIndices,
						});
					}
					return;
				}

				this.cleanupScrollListener();

				if (leaf?.view instanceof MarkdownView) {
					this.currentView = leaf.view;

					// 使用 requestAnimationFrame 延迟初始化，避免闪烁
					window.requestAnimationFrame(() => {
						this.setupScrollListener();
						if (this.settings.toc.renderInAllVisibleViews) {
							this.updateVisibleNTocs();
						} else {
							this.updateViewNToc(this.currentView!);
						}
					});
				} else {
					// 切换到非MarkdownView（且非NTocView），清理当前TOC
					this.currentView = null;
					// 通知NTocRender销毁当前显示
					this.renderNToc(null, {
						headings: [],
						activeHeadingIndex: -1,
					});
					// Also clear sidebar
					this.updateSidebarNToc();
				}
			}),
		);

		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				if (this.settings.toc.renderInAllVisibleViews) {
					this.updateVisibleNTocs();
				} else {
					this.updateNToc();
				}
			}),
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", (editor) => {
				// Parse the editor's live text directly: metadataCache lags behind
				// edits, so reading it here would re-render with stale headings and
				// the TOC wouldn't visibly update until metadataCache.on("changed")
				// fires later (the perceived "slow" update).
				if (this.settings.toc.renderInAllVisibleViews) {
					// Find the visible view that owns this editor and update it
					const visibleViews = this.getVisibleMarkdownViews();
					for (const view of visibleViews) {
						if (view.editor === editor) {
							const liveHeadings = getHeadingsFromEditor(view);
							this.updateViewNToc(view, liveHeadings);
							// Sidebar always follows the active view; update it
							// live too so it doesn't lag behind metadataCache.
							if (view === this.currentView) {
								this.updateSidebarNToc(liveHeadings);
							}
							break;
						}
					}
				} else {
					if (
						this.currentView &&
						this.currentView.editor === editor
					) {
						this.updateNToc(
							getHeadingsFromEditor(this.currentView),
						);
					}
				}
			}),
		);

		this.registerEvent(
			this.app.metadataCache.on("changed", (file) => {
				if (this.settings.toc.renderInAllVisibleViews) {
					const visibleViews = this.getVisibleMarkdownViews();
					for (const view of visibleViews) {
						if (view.file === file) {
							this.updateViewNToc(view);
						}
					}
				} else {
					if (this.currentView && this.currentView.file === file) {
						this.updateNToc();
					}
				}
			}),
		);
	}

	private registerCodeblockProcessor() {
		// this.registerMarkdownCodeBlockProcessor(
		// 	"ntoc-card",
		// 	async (code, el, ctx) => {
		// 		const processor = new CardProcessor();
		// 		processor.renderFormCodeBlock(code, el, ctx, this.app);
		// 		if (el.parentElement) {
		// 			mountEditButtonToCodeblock(
		// 				this.app,
		// 				code,
		// 				el.parentElement
		// 			);
		// 		}
		// 	}
		// );
	}

	private setupScrollListener() {
		if (!this.currentView?.contentEl) return;

		this.scrollListenerCleanup = createScrollListener(
			this.currentView.contentEl,
			{
				debounceMs: 16,
				onScroll: (event) => {
					const target = event.target as HTMLElement;
					if (
						target.classList.contains("cm-scroller") ||
						target.classList.contains("markdown-preview-view")
					) {
						this.updateNToc();
					}
				},
			},
		);
	}

	private setupViewScrollListener(view: MarkdownView): () => void {
		if (!view.contentEl) return () => {};

		const cleanup = createScrollListener(view.contentEl, {
			debounceMs: 16,
			onScroll: (event) => {
				const target = event.target as HTMLElement;
				if (
					target.classList.contains("cm-scroller") ||
					target.classList.contains("markdown-preview-view")
				) {
					this.updateViewNToc(view);
				}
			},
		});

		this.visibleViewScrollCleanups.set(view, cleanup);
		return cleanup;
	}

	private cleanupScrollListener() {
		if (this.scrollListenerCleanup) {
			this.scrollListenerCleanup();
			this.scrollListenerCleanup = null;
		}
	}

	private cleanupAllVisibleViewScrollListeners() {
		// WeakMap doesn't support iteration, so we clean up via getVisibleMarkdownViews
		const views = this.getVisibleMarkdownViews();
		for (const view of views) {
			const cleanup = this.visibleViewScrollCleanups.get(view);
			if (cleanup) {
				cleanup();
				this.visibleViewScrollCleanups.delete(view);
			}
		}
	}

	private getVisibleMarkdownViews(): MarkdownView[] {
		const result: MarkdownView[] = [];
		const leaves = this.app.workspace.getLeavesOfType("markdown");

		for (const leaf of leaves) {
			const view = leaf.view;
			if (!(view instanceof MarkdownView)) continue;

			// A leaf is "visible" if its contentEl has an offsetParent
			// (meaning it's actually rendered in the DOM and displayed)
			if (view.contentEl && view.contentEl.offsetParent !== null) {
				result.push(view);
			}
		}

		return result;
	}

	private getActiveMarkdownView(): MarkdownView | null {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);

		// 如果当前活跃视图是 MarkdownView，更新并返回
		if (activeView) {
			return activeView;
		}

		// 否则，检查当前活跃的是否是 NTocView
		const activeLeaf = this.app.workspace.getMostRecentLeaf();
		if (activeLeaf?.view.getViewType() === VIEW_TYPE_NTOC) {
			// 如果是 NTocView，返回之前保存的 currentView
			return this.currentView;
		}

		// 其他情况返回 null
		return null;
	}

	private updateNToc(headings?: HeadingCache[]) {
		if (!this.currentView || !this.currentView.file) {
			return;
		}

		this.updateViewNToc(this.currentView, headings);
		this.updateSidebarNToc(headings);
	}

	private updateViewNToc(view: MarkdownView, headings?: HeadingCache[]) {
		if (!view || !view.file) {
			return;
		}

		const resolvedHeadings = headings ?? getFileHeadings(view);
		const { activeHeadingIndex, visibleHeadingIndices } =
			updateActiveHeading(view, resolvedHeadings);
		this.renderNToc(view, {
			headings: resolvedHeadings,
			activeHeadingIndex,
			visibleHeadingIndices,
		});
	}

	private updateVisibleNTocs() {
		const visibleViews = this.getVisibleMarkdownViews();

		// Setup scroll listeners for all visible views
		for (const view of visibleViews) {
			if (!this.visibleViewScrollCleanups.has(view)) {
				this.setupViewScrollListener(view);
			}
		}

		// Update each visible view's inline TOC
		for (const view of visibleViews) {
			this.updateViewNToc(view);
		}

		// Sidebar always follows the active view
		this.updateSidebarNToc();
	}

	private renderNToc(view: MarkdownView | null, props: NTocRenderProps) {
		// 更新内联 TOC（页面内显示）
		updateNTocRender(this.settingsStore, view, {
			...props,
			multiViewMode: this.settings.toc.renderInAllVisibleViews,
		});
	}

	private updateSidebarNToc(headings?: HeadingCache[]) {
		// 更新侧边栏 TOC 视图（始终跟随当前活动文档）
		const ntocViews = this.app.workspace.getLeavesOfType(VIEW_TYPE_NTOC);

		if (!this.currentView || !this.currentView.file) {
			ntocViews.forEach((leaf) => {
				if (leaf.view instanceof NTocView) {
					leaf.view.updateTocData(null, [], -1, []);
				}
			});
			return;
		}

		const resolvedHeadings = headings ?? getFileHeadings(this.currentView);
		const { activeHeadingIndex, visibleHeadingIndices } =
			updateActiveHeading(this.currentView, resolvedHeadings);

		ntocViews.forEach((leaf) => {
			if (leaf.view instanceof NTocView) {
				leaf.view.updateTocData(
					this.currentView,
					resolvedHeadings,
					activeHeadingIndex,
					visibleHeadingIndices,
				);
			}
		});
	}

	private onSettingsChanged() {
		if (this.settings.toc.renderInAllVisibleViews) {
			// Clean up single-view scroll listener since we're using per-view ones
			this.cleanupScrollListener();
			this.updateVisibleNTocs();
		} else {
			// Clean up all per-view scroll listeners
			this.cleanupAllVisibleViewScrollListeners();
			// Destroy non-active inline TOCs via NTocRender
			this.destroyNonActiveInlineNTocs();
			this.setupScrollListener();
			this.updateNToc();
		}
	}

	private destroyNonActiveInlineNTocs() {
		const visibleViews = this.getVisibleMarkdownViews();
		for (const view of visibleViews) {
			if (view !== this.currentView) {
				destroyNTocRenderForView(view);
			}
		}
	}

	onCursorMoved(_view: EditorView): void {
		// Debounced via rAF in the extension. Keep minimal work here.
		// Update ToC highlighting on cursor/selection movement.
		if (this.settings.toc.renderInAllVisibleViews) {
			// Find the visible view that owns this editor
			const visibleViews = this.getVisibleMarkdownViews();
			for (const mdView of visibleViews) {
				if (
					(mdView.editor as unknown as { cm: EditorView }).cm ===
					_view
				) {
					this.updateViewNToc(mdView);
					break;
				}
			}
			this.updateSidebarNToc();
		} else {
			void this.updateNToc();
		}
	}
}
