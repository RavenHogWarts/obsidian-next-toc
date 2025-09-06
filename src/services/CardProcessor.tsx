import { ReadingTimeCard } from "@src/components/cards/ReadingTimeCard";
import {
	CardConfig,
	ReadingTimeCardConfig,
	TocCardConfig,
} from "@src/types/cards";
import {
	App,
	MarkdownPostProcessorContext,
	MarkdownView,
	TFile,
} from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class CardProcessor {
	private roots: Map<HTMLElement, Root> = new Map();

	async renderFormCodeBlock(
		code: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext,
		app: App
	) {
		try {
			const config = JSON.parse(code) as CardConfig;
			this.renderCard(config, el, app);
		} catch (e) {
			console.error("Failed to parse card config:", e);
		}
	}

	async renderCard(config: CardConfig, el: HTMLElement, app: App) {
		const existingRoot = this.roots.get(el);
		if (existingRoot) {
			existingRoot.unmount();
			this.roots.delete(el);
		}

		el.empty();

		const root = createRoot(el);
		this.roots.set(el, root);

		const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView) {
			return;
		}

		const file = markdownView.file;

		if (config.type === "reading-time") {
			const readingConfig = config as ReadingTimeCardConfig;
			const content =
				file instanceof TFile ? await app.vault.read(file) : "";
			root.render(
				<StrictMode>
					<ReadingTimeCard config={readingConfig} content={content} />
				</StrictMode>
			);
		} else if (config.type === "toc-card") {
			const tocConfig = config as TocCardConfig;
			root.render(
				<StrictMode>
					<></>
				</StrictMode>
			);
		}
	}

	cleanup() {
		// 清理所有 React 根节点
		this.roots.forEach((root) => {
			root.unmount();
		});
		this.roots.clear();
	}
}
