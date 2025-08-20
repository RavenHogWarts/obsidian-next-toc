import "@styles/styles";
import { MarkdownView, Plugin } from "obsidian";
import {
	NTocRenderProps,
	updateNTocRender,
} from "./components/toc-navigator/NTocRender";
import SettingsStore from "./settings/SettingsStore";
import { NTocPluginSettings } from "./types/types";
import getFileHeadings from "./utils/getFileHeadings";
import updateActiveHeading from "./utils/updateActiveHeading";

export default class NTocPlugin extends Plugin {
	settings: NTocPluginSettings;
	currentView = this.app.workspace.getActiveViewOfType(MarkdownView);
	readonly settingsStore = new SettingsStore(this);

	async onload() {
		await this.settingsStore.loadSettings();
		// console.debug("NTocPlugin loaded with settings:", this.settings);
		this.registerCommands();
		this.registerEvents();

		await this.updateNToc();
		// console.debug("Current Markdown view:", this.currentView);
	}

	onunload() {}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private registerCommands() {
		// Register commands here
	}

	private registerEvents() {
		this.registerEvent(
			this.app.workspace.on("active-leaf-change", async (leaf) => {
				if (leaf?.view instanceof MarkdownView) {
					this.currentView = leaf.view;
					await this.updateNToc();
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

	private renderNToc(view: MarkdownView, props: NTocRenderProps) {
		updateNTocRender(this.settingsStore, view, props);
	}
}
