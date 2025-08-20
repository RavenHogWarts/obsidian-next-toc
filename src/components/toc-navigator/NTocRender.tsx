import { SettingsContext } from "@src/context/SettingsContext";
import SettingsStore from "@src/settings/SettingsStore";
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
		return !!activeMarkdownView && activeMarkdownView === this.view;
	}

	private findContainers(view: MarkdownView): HTMLElement[] {
		const nodeList = view.contentEl.querySelectorAll(".NToc__view");
		return Array.from(nodeList).filter(
			(el): el is HTMLElement => el instanceof HTMLElement
		);
	}

	private getOrCreateContainer(view: MarkdownView): HTMLElement {
		const containers = this.findContainers(view);
		if (containers.length === 0) {
			return view.contentEl.createDiv("NToc__view");
		}

		const [primary, ...duplicates] = containers;
		for (const dup of duplicates) {
			const dupRoot = containerRootMap.get(dup);
			if (dupRoot) {
				dupRoot.unmount();
				containerRootMap.delete(dup);
			}
			dup.remove();
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
		const root = containerRootMap.get(container);
		if (root) {
			root.unmount();
			containerRootMap.delete(container);
		}
		container.remove();
	}

	// Destroy all containers for a specific view
	private destroyView(view: MarkdownView): void {
		const containers = this.findContainers(view);
		for (const container of containers) {
			this.destroyContainer(container);
		}
	}

	async update(view: MarkdownView, props: NTocRenderProps): Promise<void> {
		if (this.view && this.view !== view) {
			this.destroyView(this.view);
		}
		this.view = view;
		this.headings = props.headings;
		this.activeHeadingIndex = props.activeHeadingIndex;
		console.debug("Active heading index:", this.activeHeadingIndex);

		this.display();
	}

	display() {
		if (!this.view) return;

		if (!this.isActiveLeaf()) {
			this.destroy();
			return;
		}

		const container = this.getOrCreateContainer(this.view);
		const root = this.getOrCreateRoot(container);
		root.render(
			<StrictMode>
				<SettingsContext.Provider value={this.settingsStore}>
					<TocNavigator
						currentView={this.view}
						headings={this.headings}
						activeHeadingIndex={this.activeHeadingIndex}
					/>
				</SettingsContext.Provider>
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
	view: MarkdownView,
	props: NTocRenderProps
): void {
	NTocRender.getInstance(settingsStore).update(view, props);
}
