import { SettingsStoreContext } from "@src/context/SettingsStoreContext";
import NTocPlugin from "@src/main";
import SettingsStore from "@src/settings/SettingsStore";
import {
	HeadingCache,
	IconName,
	ItemView,
	MarkdownView,
	WorkspaceLeaf,
} from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import "./NTocView.css";
import { NTocViewContent } from "./NTocViewContent";

export const VIEW_TYPE_NTOC = "next-toc";

export class NTocView extends ItemView {
	private plugin: NTocPlugin;
	private root: Root | null = null;
	settingsStore: SettingsStore;

	// 用于存储当前的 TOC 数据
	private currentView: MarkdownView | null = null;
	private headings: HeadingCache[] = [];
	private activeHeadingIndex: number = -1;

	constructor(leaf: WorkspaceLeaf, plugin: NTocPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.settingsStore = this.plugin.settingsStore;
	}

	getViewType(): string {
		return VIEW_TYPE_NTOC;
	}

	getDisplayText(): string {
		return "Next TOC";
	}

	getIcon(): IconName {
		return "table-of-contents";
	}

	protected async onOpen(): Promise<void> {
		this.root = createRoot(this.contentEl);
		this.render();
	}

	/**
	 * 更新视图数据并重新渲染
	 */
	updateTocData(
		view: MarkdownView | null,
		headings: HeadingCache[],
		activeHeadingIndex: number
	): void {
		this.currentView = view;
		this.headings = headings;
		this.activeHeadingIndex = activeHeadingIndex;
		this.render();
	}

	/**
	 * 渲染 TOC 内容
	 */
	private render(): void {
		if (!this.root) return;

		this.root.render(
			<StrictMode>
				<SettingsStoreContext.Provider value={this.settingsStore}>
					{this.currentView && this.headings.length > 0 ? (
						<NTocViewContent
							currentView={this.currentView}
							headings={this.headings}
							activeHeadingIndex={this.activeHeadingIndex}
						/>
					) : (
						<div className="NToc__view-empty">
							<div className="NToc__view-empty-text">
								No headings found in current document
							</div>
						</div>
					)}
				</SettingsStoreContext.Provider>
			</StrictMode>
		);
	}

	protected async onClose(): Promise<void> {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
