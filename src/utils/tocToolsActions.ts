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
	const scroll = view.currentMode.getScroll();
	const targetScroll = to === "top" ? 0 : Number.MAX_SAFE_INTEGER;

	const startTime = performance.now();
	const distance = targetScroll - scroll;
	const duration = 300; // 动画持续时间，单位毫秒

	const animateScroll = () => {
		const elapsed = performance.now() - startTime;
		const progress = Math.min(elapsed / duration, 1);

		if (progress < 1) {
			const easeProgress = 1 - Math.pow(1 - progress, 3); // 使用ease-out效果
			view.currentMode.applyScroll(scroll + distance * easeProgress);
			requestAnimationFrame(animateScroll);
		} else {
			view.currentMode.applyScroll(targetScroll);
		}
	};
	requestAnimationFrame(animateScroll);
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

	console.log("Target Index:", targetIndex);

	if (targetIndex >= 0 && targetIndex < headings.length) {
		scrollToHeading(view, headings[targetIndex]);
	}
};
