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
	visibleHeadingIndices?: number[];
	multiViewMode?: boolean;
}

const containerRootMap: WeakMap<HTMLElement, Root> = new WeakMap();

// Per-view render state for multi-view mode
const viewRenderStates: WeakMap<
	MarkdownView,
	{
		headings: HeadingCache[];
		activeHeadingIndex: number;
		visibleHeadingIndices: number[];
		settingsStore: SettingsStore;
	}
> = new WeakMap();

export class NTocRender {
	private static instance: NTocRender | null = null;

	settingsStore: SettingsStore;
	view: MarkdownView | null = null;
	root: Root | null = null;

	headings: HeadingCache[] = [];
	activeHeadingIndex: number = -1;
	visibleHeadingIndices: number[] = [];

	constructor(settingsStore: SettingsStore) {
		this.settingsStore = settingsStore;
	}

	static getInstance(settingsStore: SettingsStore): NTocRender {
		if (!NTocRender.instance) {
			NTocRender.instance = new NTocRender(settingsStore);
		}
		return NTocRender.instance;
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
		return Array.from(nodeList).filter((el): el is HTMLElement =>
			el.instanceOf(HTMLElement),
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

	update(view: MarkdownView | null, props: NTocRenderProps): void {
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
		this.visibleHeadingIndices = props.visibleHeadingIndices ?? [];

		this.display();
	}

	display() {
		if (!this.view) return;

		// 检查是否应该显示内联导航
		if (!this.shouldShowInlineNav()) {
			this.destroy();
			return;
		}

		this.renderView(
			this.view,
			this.headings,
			this.activeHeadingIndex,
			this.visibleHeadingIndices,
		);
		this.root =
			containerRootMap.get(this.findContainers(this.view)[0]!) ?? null;
	}

	private renderView(
		view: MarkdownView,
		headings: HeadingCache[],
		activeHeadingIndex: number,
		visibleHeadingIndices: number[],
	) {
		const container = this.getOrCreateContainer(view);
		const root = this.getOrCreateRoot(container);
		root.render(
			<StrictMode>
				<SettingsStoreContext.Provider value={this.settingsStore}>
					<TocNavigator
						currentView={view}
						headings={headings}
						activeHeadingIndex={activeHeadingIndex}
						visibleHeadingIndices={visibleHeadingIndices}
					/>
				</SettingsStoreContext.Provider>
			</StrictMode>,
		);
	}

	destroy() {
		if (this.view) {
			this.destroyView(this.view);
			this.view = null;
		}
		this.root = null;
	}
}

export function updateNTocRender(
	settingsStore: SettingsStore,
	view: MarkdownView | null,
	props: NTocRenderProps,
): void {
	if (props.multiViewMode && view) {
		// In multi-view mode, render per-view without the active-leaf restriction
		renderViewNToc(
			settingsStore,
			view,
			props.headings,
			props.activeHeadingIndex,
			props.visibleHeadingIndices ?? [],
		);
	} else {
		NTocRender.getInstance(settingsStore).update(view, props);
	}
}

function renderViewNToc(
	settingsStore: SettingsStore,
	view: MarkdownView,
	headings: HeadingCache[],
	activeHeadingIndex: number,
	visibleHeadingIndices: number[],
): void {
	// Store render state
	viewRenderStates.set(view, {
		headings,
		activeHeadingIndex,
		visibleHeadingIndices,
		settingsStore,
	});

	// Find or create container
	const nodeList = view.contentEl.querySelectorAll(".NToc__view");
	const containers = Array.from(nodeList).filter((el): el is HTMLElement =>
		el.instanceOf(HTMLElement),
	);

	let container: HTMLElement;
	if (containers.length === 0) {
		container = view.contentEl.createDiv("NToc__view");
	} else {
		container = containers[0]!;
		// Remove duplicates
		for (let i = 1; i < containers.length; i++) {
			const dup = containers[i]!;
			const root = containerRootMap.get(dup);
			if (root) {
				try {
					root.unmount();
				} catch {}
				containerRootMap.delete(dup);
			}
			try {
				dup.remove();
			} catch {}
		}
	}

	const root = containerRootMap.get(container) ?? createRoot(container);
	containerRootMap.set(container, root);

	root.render(
		<StrictMode>
			<SettingsStoreContext.Provider value={settingsStore}>
				<TocNavigator
					currentView={view}
					headings={headings}
					activeHeadingIndex={activeHeadingIndex}
					visibleHeadingIndices={visibleHeadingIndices}
				/>
			</SettingsStoreContext.Provider>
		</StrictMode>,
	);
}

export function destroyNTocRenderForView(view: MarkdownView): void {
	// Clean up render state
	viewRenderStates.delete(view);

	// Find and destroy containers
	const nodeList = view.contentEl.querySelectorAll(".NToc__view");
	const containers = Array.from(nodeList).filter((el): el is HTMLElement =>
		el.instanceOf(HTMLElement),
	);

	for (const container of containers) {
		const root = containerRootMap.get(container);
		if (root) {
			try {
				root.unmount();
			} catch {}
			containerRootMap.delete(container);
		}
		try {
			if (container.parentNode) container.remove();
		} catch {}
	}
}
