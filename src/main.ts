import { EditorView } from "@codemirror/view";
import "@styles/styles";
import { Editor, MarkdownView, Plugin } from "obsidian";
import {
	NTocRenderProps,
	updateNTocRender,
} from "./components/toc-navigator/NTocRender";
import { t } from "./i18n/i18n";
import { PluginSettingTab } from "./settings/PluginSettingTab";
import SettingsStore from "./settings/SettingsStore";
import { NTocPluginSettings } from "./types/types";
import { updateDynamicCSS, removeDynamicCSS } from "./utils/dynamicCSS";
import { createScrollListener } from "./utils/eventListenerManager";
import getFileHeadings from "./utils/getFileHeadings";
import {
	navigateHeading,
	returnToCursor,
	scrollTopBottom,
} from "./utils/tocToolsActions";
import updateActiveHeading from "./utils/updateActiveHeading";

export default class NTocPlugin extends Plugin {
	settings: NTocPluginSettings;
	currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
	readonly settingsStore = new SettingsStore(this);
	private scrollListenerCleanup: (() => void) | null = null;

	async onload() {
		await this.settingsStore.loadSettings();

		// 初始化动态CSS
		updateDynamicCSS(this.settings);

		this.addSettingTab(new PluginSettingTab(this));

		this.registerCommands();
		this.registerEvents();
		this.registerContextMenu();
		this.registerCodeblockProcessor();

		// Register CM6 cursor listener extension
		// this.registerEditorExtension(createCursorListenerExtension(this));

		// Setup initial scroll listener
		this.setupScrollListener();

		await this.updateNToc();
	}

	onunload() {
		this.cleanupScrollListener();
		// 清理动态CSS
		removeDynamicCSS();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private registerCommands() {
		this.addCommand({
			id: "return-to-cursor",
			name: t("commands.returnToCursor"),
			hotkeys: [],
			editorCallback: (editor: Editor) => {
				if (this.currentView && editor === this.currentView.editor) {
					returnToCursor(this.currentView);
				}
			},
		});

		this.addCommand({
			id: "scroll-to-top",
			name: t("commands.scrollToTop"),
			hotkeys: [],
			callback: () => {
				if (this.currentView) {
					scrollTopBottom(this.currentView, "top");
				}
			},
		});

		this.addCommand({
			id: "scroll-to-bottom",
			name: t("commands.scrollToBottom"),
			hotkeys: [],
			callback: () => {
				if (this.currentView) {
					scrollTopBottom(this.currentView, "bottom");
				}
			},
		});

		this.addCommand({
			id: "navigate-previous-heading",
			name: t("commands.navigatePreviousHeading"),
			hotkeys: [],
			callback: async () => {
				if (this.currentView) {
					const headings = await getFileHeadings(this.currentView);
					navigateHeading(this.currentView, headings, "prev");
				}
			},
		});

		this.addCommand({
			id: "navigate-next-heading",
			name: t("commands.navigateNextHeading"),
			hotkeys: [],
			callback: async () => {
				if (this.currentView) {
					const headings = await getFileHeadings(this.currentView);
					navigateHeading(this.currentView, headings, "next");
				}
			},
		});

		this.addCommand({
			id: "toc-expand",
			name: t("commands.tocExpand"),
			hotkeys: [],
			callback: () => {
				this.settingsStore.updateSettingByPath(
					"toc.alwaysExpand",
					!this.settingsStore.settings.toc.alwaysExpand
				);
			},
		});

		// this.addCommand({
		// 	id: "insert-reading-time-card",
		// 	name: t("commands.insertReadingTimeCard"),
		// 	editorCallback: (editor: Editor) => {
		// 		new CardCreateModal(
		// 			this.app,
		// 			JSON.stringify(DEFAULT_READING_TIME_CARD)
		// 		).open();
		// 	},
		// });

		// this.addCommand({
		// 	id: "insert-table-of-contents-card",
		// 	name: t("commands.insertTableOfContentsCard"),
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
		// 				item.setTitle(t("commands.insertReadingTimeCard"));
		// 				item.setIcon("clock");
		// 				item.onClick(() => {
		// 					new CardCreateModal(
		// 						this.app,
		// 						JSON.stringify(DEFAULT_READING_TIME_CARD)
		// 					).open();
		// 				});
		// 			});
		// 			menu.addItem((item) => {
		// 				item.setTitle(t("commands.insertTableOfContentsCard"));
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
			this.app.workspace.on("active-leaf-change", async (leaf) => {
				this.cleanupScrollListener();

				if (leaf?.view instanceof MarkdownView) {
					this.currentView = leaf.view;

					// 使用 requestAnimationFrame 延迟初始化，避免闪烁
					requestAnimationFrame(async () => {
						this.setupScrollListener();
						await this.updateNToc();
					});
				} else {
					// 切换到非MarkdownView，清理当前TOC
					this.currentView = null;
					// 通知NTocRender销毁当前显示
					updateNTocRender(this.settingsStore, null, {
						headings: [],
						activeHeadingIndex: -1,
					});
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on("layout-change", async () => {
				await this.updateNToc();
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-change", async (editor) => {
				if (this.currentView && this.currentView.editor === editor) {
					await this.updateNToc();
				}
			})
		);

		this.registerEvent(
			this.app.metadataCache.on("changed", async (file) => {
				if (this.currentView && this.currentView.file === file) {
					await this.updateNToc();
				}
			})
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
				onScroll: async (event) => {
					const target = event.target as HTMLElement;
					if (
						target.classList.contains("cm-scroller") ||
						target.classList.contains("markdown-preview-view")
					) {
						await this.updateNToc();
					}
				},
			}
		);
	}

	private cleanupScrollListener() {
		if (this.scrollListenerCleanup) {
			this.scrollListenerCleanup();
			this.scrollListenerCleanup = null;
		}
	}

	private async updateNToc() {
		if (!this.currentView || !this.currentView.file) {
			return;
		}

		const headings = await getFileHeadings(this.currentView);
		const activeHeadingIndex = updateActiveHeading(
			this.currentView,
			headings
		);
		this.renderNToc(this.currentView, {
			headings,
			activeHeadingIndex,
		});
	}

	private renderNToc(view: MarkdownView | null, props: NTocRenderProps) {
		updateNTocRender(this.settingsStore, view, props);
	}

	onCursorMoved(_view: EditorView): void {
		// Debounced via rAF in the extension. Keep minimal work here.
		// Update ToC highlighting on cursor/selection movement.
		// No await to keep it snappy; internal updateNToc uses async.
		void this.updateNToc();
	}
}
