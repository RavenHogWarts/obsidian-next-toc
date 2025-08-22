import { EditorView } from "@codemirror/view";
import "@styles/styles";
import { MarkdownView, Plugin } from "obsidian";
import {
	NTocRenderProps,
	updateNTocRender,
} from "./components/toc-navigator/NTocRender";
import { createCursorListenerExtension } from "./services/cursorListenerExtension";
import SettingsStore from "./settings/SettingsStore";
import { NTocPluginSettings } from "./types/types";
import { createScrollListener } from "./utils/eventListenerManager";
import getFileHeadings from "./utils/getFileHeadings";
import updateActiveHeading from "./utils/updateActiveHeading";

export default class NTocPlugin extends Plugin {
	settings: NTocPluginSettings;
	currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
	readonly settingsStore = new SettingsStore(this);
	private scrollListenerCleanup: (() => void) | null = null;

	async onload() {
		await this.settingsStore.loadSettings();

		this.registerCommands();
		this.registerEvents();

		// Register CM6 cursor listener extension
		this.registerEditorExtension(createCursorListenerExtension(this));

		// Setup initial scroll listener
		this.setupScrollListener();

		await this.updateNToc();
	}

	onunload() {
		this.cleanupScrollListener();
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private registerCommands() {
		// Register commands here
	}

	private registerEvents() {
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", async (leaf) => {
				this.cleanupScrollListener();

				if (leaf?.view instanceof MarkdownView) {
					this.currentView = leaf.view;
					this.setupScrollListener();
					await this.updateNToc();
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
