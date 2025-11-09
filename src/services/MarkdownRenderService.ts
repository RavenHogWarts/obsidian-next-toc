import { App, Component, MarkdownRenderer } from "obsidian";

/**
 * Markdown 渲染服务
 * 提供安全的 Markdown 渲染功能，避免在组件中直接使用插件实例
 */
export class MarkdownRenderService {
	private app: App;
	private component: Component;
	private renderedElements: Set<HTMLElement> = new Set();
	private isUnloaded: boolean = false;

	constructor(app: App, component: Component) {
		this.app = app;
		this.component = component;

		// 注册组件卸载时的清理逻辑
		this.component.register(() => {
			this.unload();
		});
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
		if (this.isUnloaded) {
			console.warn(
				"MarkdownRenderService: Attempted to render after unload"
			);
			return;
		}

		try {
			await MarkdownRenderer.render(
				this.app,
				content,
				element,
				sourcePath,
				this.component
			);
			// 跟踪已渲染的元素
			this.renderedElements.add(element);
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
		// 从跟踪集合中移除
		this.renderedElements.delete(element);
	}

	/**
	 * 设置纯文本内容
	 * @param content - 文本内容
	 * @param element - 目标 DOM 元素
	 */
	setTextContent(content: string, element: HTMLElement): void {
		if (this.isUnloaded) {
			console.warn(
				"MarkdownRenderService: Attempted to set text after unload"
			);
			return;
		}
		element.textContent = content;
	}

	/**
	 * 卸载服务，清理所有已渲染的元素和资源
	 */
	unload(): void {
		if (this.isUnloaded) {
			return;
		}

		this.isUnloaded = true;

		// 清理所有已渲染的元素
		this.renderedElements.forEach((element) => {
			try {
				element.replaceChildren();
				element.classList.remove("markdown-rendered");
			} catch (error) {
				console.error("Error clearing rendered element:", error);
			}
		});

		// 清空跟踪集合
		this.renderedElements.clear();
	}

	/**
	 * 检查服务是否已卸载
	 * @returns 是否已卸载
	 */
	isServiceUnloaded(): boolean {
		return this.isUnloaded;
	}

	/**
	 * 获取当前已渲染的元素数量
	 * @returns 已渲染元素的数量
	 */
	getRenderedElementsCount(): number {
		return this.renderedElements.size;
	}
}

/**
 * 创建 Markdown 渲染服务的工厂函数
 * @param app - Obsidian App 实例
 * @param component - 组件实例，用于生命周期管理。服务会自动注册清理函数到此组件
 * @returns MarkdownRenderService 实例
 *
 * @example
 * ```typescript
 * const component = new Component();
 * const service = createMarkdownRenderService(app, component);
 *
 * // 渲染 Markdown
 * await service.renderMarkdown("# Hello", element);
 *
 * // 当组件卸载时，服务会自动清理
 * component.unload(); // 会触发 service.unload()
 * ```
 */
export function createMarkdownRenderService(
	app: App,
	component: Component
): MarkdownRenderService {
	return new MarkdownRenderService(app, component);
}
