import { App, Component, MarkdownRenderer } from "obsidian";

/**
 * Markdown 渲染服务
 * 提供安全的 Markdown 渲染功能，避免在组件中直接使用插件实例
 */
export class MarkdownRenderService {
	private app: App;
	private component: Component;

	constructor(app: App, component: Component) {
		this.app = app;
		this.component = component;
	}

	/**
	 * 渲染 Markdown 内容到指定的 DOM 元素
	 * @param content - 要渲染的 Markdown 内容
	 * @param element - 目标 DOM 元素
	 * @param sourcePath - 源文件路径，用于解析相对链接
	 */
	async renderMarkdown(
		content: string,
		element: HTMLElement,
		sourcePath = ""
	): Promise<void> {
		try {
			await MarkdownRenderer.render(
				this.app,
				content,
				element,
				sourcePath,
				this.component
			);
		} catch (error) {
			console.error("Failed to render markdown:", error);
			// 如果渲染失败，回退到纯文本
			element.textContent = content;
		}
	}

	/**
	 * 清理元素内容
	 * @param element - 要清理的 DOM 元素
	 */
	clearElement(element: HTMLElement): void {
		element.replaceChildren();
		element.classList.remove("markdown-rendered");
	}

	/**
	 * 设置纯文本内容
	 * @param content - 文本内容
	 * @param element - 目标 DOM 元素
	 */
	setTextContent(content: string, element: HTMLElement): void {
		element.textContent = content;
	}
}

/**
 * 创建 Markdown 渲染服务的工厂函数
 * @param app - Obsidian App 实例
 * @param component - 组件实例，用于生命周期管理
 * @returns MarkdownRenderService 实例
 */
export function createMarkdownRenderService(
	app: App,
	component: Component
): MarkdownRenderService {
	return new MarkdownRenderService(app, component);
}
