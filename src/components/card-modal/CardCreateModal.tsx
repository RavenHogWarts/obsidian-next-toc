import { CardConfig } from "@src/types/cards";
import { App, MarkdownView, Modal, parseYaml, stringifyYaml } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { CardForm } from "./CardForm";

export class CardCreateModal extends Modal {
	root: Root | null = null;
	onSave?: (content: string) => void;
	originalConfigContent?: string;

	constructor(
		app: App,
		originalConfigContent?: string,
		onSave?: (content: string) => void
	) {
		super(app);
		this.originalConfigContent = originalConfigContent;
		this.onSave = onSave;
	}

	async onOpen() {
		const { contentEl } = this;
		const rootContainer = createDiv({
			parent: contentEl,
		});

		let cardConfig: CardConfig;
		let ignoreLanguagePrefix = false;

		if (this.originalConfigContent) {
			cardConfig = this.parseFromOriginalConfig()!;
		} else {
			cardConfig = this.parseFromSelection()!;
			if (cardConfig) {
				ignoreLanguagePrefix = true;
			}
		}

		if (!cardConfig) {
			// 默认创建阅读时间卡片
			cardConfig = {
				id: `card-${Date.now()}`,
				type: "reading-time",
				title: "Reading Time",
			};
		}

		let onSubmit: (cardConfig: CardConfig) => void;
		if (this.onSave) {
			// 更新现有卡片
			onSubmit = (cardConfig: CardConfig) => {
				this.close();
				this.onSave!(stringifyYaml(cardConfig));
			};
		} else {
			// 创建新卡片
			onSubmit = (cardConfig: CardConfig) => {
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (!markdownView) {
					return;
				}
				const editor = markdownView.editor;
				this.close();

				if (ignoreLanguagePrefix) {
					editor.replaceSelection(stringifyYaml(cardConfig));
				} else {
					const codeblock = `\`\`\`ntoc-card\n${stringifyYaml(
						cardConfig
					)}\n\`\`\`\n`;
					editor.replaceSelection(codeblock);
				}
			};
		}

		this.root = createRoot(rootContainer);
		this.root.render(
			<StrictMode>
				<CardForm
					app={this.app}
					cardConfig={cardConfig}
					onSubmit={onSubmit}
				/>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
		const { contentEl } = this;
		contentEl.empty();
	}

	parseFromOriginalConfig(): CardConfig | null {
		if (
			this.originalConfigContent &&
			this.originalConfigContent.trim() !== ""
		) {
			try {
				return parseYaml(this.originalConfigContent) as CardConfig;
			} catch (e) {
				console.error(e);
				return null;
			}
		} else {
			return null;
		}
	}

	parseFromSelection(): CardConfig | null {
		const markdownView =
			this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!markdownView) {
			return null;
		}
		const editor = markdownView.editor;
		const selection = editor.getSelection();
		if (selection && selection.trim() !== "") {
			try {
				return parseYaml(selection) as CardConfig;
			} catch (e) {
				console.error(e);
				return null;
			}
		} else {
			return null;
		}
	}
}
