import { SettingsStoreContext } from "@src/context/SettingsStoreContext";
import SettingsStore from "@src/settings/SettingsStore";
import { isElementValid } from "@src/utils/eventListenerManager";
import { HeadingCache, MarkdownView } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { TocNavigator } from "./TocNavigator";

export interface NTocRenderProps {
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

const containerRootMap: WeakMap<HTMLElement, Root> = new WeakMap();

export class NTocRender {
	private static instance: NTocRender | null = null;

	settingsStore: SettingsStore;
	view: MarkdownView | null = null;
	root: Root | null = null;

	headings: HeadingCache[] = [];
	activeHeadingIndex: number = -1;

	constructor(settingsStore: SettingsStore) {
		this.settingsStore = settingsStore;
	}

	static getInstance(settingsStore: SettingsStore): NTocRender {
		if (!NTocRender.instance) {
			NTocRender.instance = new NTocRender(settingsStore);
		}
		return NTocRender.instance;
	}

	private isActiveLeaf(): boolean {
		if (!this.view) return false;
		const activeMarkdownView =
			this.view.app.workspace.getActiveViewOfType(MarkdownView);
		// console.debug("Active markdown view:", activeMarkdownView);
		return !!activeMarkdownView && activeMarkdownView === this.view;
	}

	private shouldShowInlineNav(): boolean {
		if (!this.view) return false;

		// 检查当前活跃的 leaf 是否是当前 view
		const activeMdView =
			this.view.app.workspace.getActiveViewOfType(MarkdownView);
		if (!activeMdView || activeMdView !== this.view) {
			return false;
		}

		return true;
	}

	private findContainers(view: MarkdownView): HTMLElement[] {
		const nodeList = view.contentEl.querySelectorAll(".NToc__view");
		return Array.from(nodeList).filter(
			(el): el is HTMLElement => el instanceof HTMLElement
		);
	}

	private isContainerValid(container: HTMLElement): boolean {
		return (
			isElementValid(container) &&
			container.classList.contains("NToc__view")
		);
	}

	private getOrCreateContainer(view: MarkdownView): HTMLElement {
		const containers = this.findContainers(view);
		if (containers.length === 0) {
			return view.contentEl.createDiv("NToc__view");
		}

		const [primary, ...duplicates] = containers;
		for (const dup of duplicates) {
			this.destroyContainer(dup);
		}
		return primary;
	}

	private getOrCreateRoot(container: HTMLElement): Root {
		const existing = containerRootMap.get(container);
		if (existing) return existing;
		const root = createRoot(container);
		containerRootMap.set(container, root);
		return root;
	}

	private destroyContainer(container: HTMLElement): void {
		if (!this.isContainerValid(container)) {
			return;
		}

		const root = containerRootMap.get(container);
		if (root) {
			try {
				root.unmount();
			} catch (error) {
				console.warn("Error unmounting React root:", error);
			}
			containerRootMap.delete(container);
		}

		try {
			if (container.parentNode) {
				container.remove();
			}
		} catch (error) {
			console.warn("Error removing container:", error);
		}
	}

	// Destroy all containers for a specific view
	private destroyView(view: MarkdownView): void {
		const containers = this.findContainers(view);
		for (const container of containers) {
			this.destroyContainer(container);
		}
	}

	async update(
		view: MarkdownView | null,
		props: NTocRenderProps
	): Promise<void> {
		if (view === null) {
			// 视图为null，销毁所有内容
			this.destroy();
			return;
		}

		if (this.view && this.view !== view) {
			this.destroyView(this.view);
		}
		this.view = view;
		this.headings = props.headings;
		this.activeHeadingIndex = props.activeHeadingIndex;
		// console.debug("Active heading index:", this.activeHeadingIndex);

		this.display();
	}

	display() {
		if (!this.view) return;

		// 检查是否应该显示内联导航
		if (!this.shouldShowInlineNav()) {
			this.destroy();
			return;
		}

		const container = this.getOrCreateContainer(this.view);
		const root = this.getOrCreateRoot(container);
		root.render(
			<StrictMode>
				<SettingsStoreContext.Provider value={this.settingsStore}>
					<TocNavigator
						currentView={this.view}
						headings={this.headings}
						activeHeadingIndex={this.activeHeadingIndex}
					/>
				</SettingsStoreContext.Provider>
			</StrictMode>
		);
		this.root = root;
	}

	destroy() {
		if (this.view) {
			this.destroyView(this.view);
			this.view = null;
		}
		this.root = null;
	}
}

// 导出便捷函数
export function updateNTocRender(
	settingsStore: SettingsStore,
	view: MarkdownView | null,
	props: NTocRenderProps
): void {
	NTocRender.getInstance(settingsStore).update(view, props);
}
