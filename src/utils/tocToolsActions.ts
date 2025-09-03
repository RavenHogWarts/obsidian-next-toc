import { HeadingCache, MarkdownView } from "obsidian";
import binarySearchClosestHeading from "./binarySearchClosestHeading";
import scrollToHeading from "./scrollToHeading";

/**
 * 检查当前视图是否为阅读模式
 */
export const isSourceMode = (view: MarkdownView): boolean => {
	return view.getMode() === "source";
};

/**
 * 返回到光标位置
 */
export const returnToCursor = (view: MarkdownView): void => {
	if (!isSourceMode(view)) return;

	const editor = view.editor;
	const cursor = editor.getCursor();
	editor.scrollIntoView({ from: cursor, to: cursor }, true);
	editor.focus();
};

export const scrollTopBottom = (view: MarkdownView, to: "top" | "bottom") => {
	if (to === "top") {
		// 滚动到顶部
		view.currentMode.applyScroll(0);
		return;
	}

	// 滚动到底部
	if (view.getMode() === "source") {
		// 源码模式：滚动到最后一行
		const editor = view.editor;
		const lastLine = editor.lastLine();
		editor.scrollIntoView(
			{ from: { line: lastLine, ch: 0 }, to: { line: lastLine, ch: 0 } },
			true
		);
	} else {
		// 阅读模式：使用最可靠的方法
		const scrollToBottomReading = () => {
			// 获取阅读模式的滚动容器
			const previewContainer = view.contentEl.querySelector(
				".markdown-preview-view"
			) as HTMLElement;

			setTimeout(() => {
				const finalMaxScroll = Math.max(
					0,
					previewContainer.scrollHeight -
						previewContainer.clientHeight
				);
				view.currentMode.applyScroll(finalMaxScroll);
				previewContainer.scrollTop = finalMaxScroll;
			}, 50);
		};

		scrollToBottomReading();
	}
};

export const navigateHeading = (
	view: MarkdownView,
	headings: HeadingCache[],
	direction: "next" | "prev"
) => {
	let targetIndex = -1;

	if (isSourceMode(view)) {
		if (headings.length === 0) return;

		const editor = view.editor;
		const cursorLine = editor.getCursor().line;

		if (direction === "next") {
			targetIndex = headings.findIndex((h) => {
				return h.position.start.line > cursorLine;
			});
			if (targetIndex === -1) {
				targetIndex = 0;
			}
		} else {
			for (let i = headings.length - 1; i >= 0; i--) {
				if (headings[i].position.start.line < cursorLine) {
					targetIndex = i;
					break;
				}
			}
			if (targetIndex === -1) {
				targetIndex = headings.length - 1;
			}
		}
	} else {
		const scrollInfo = Math.ceil(view.currentMode.getScroll());
		const headingIndex = binarySearchClosestHeading(headings, scrollInfo);

		if (direction === "next") {
			targetIndex =
				headingIndex < headings.length - 1 ? headingIndex + 1 : 0;
		} else {
			targetIndex =
				headingIndex > 0 ? headingIndex - 1 : headings.length - 1;
		}
	}

	// console.log("Target Index:", targetIndex);

	if (targetIndex >= 0 && targetIndex < headings.length) {
		scrollToHeading(view, headings[targetIndex]);
	}
};
