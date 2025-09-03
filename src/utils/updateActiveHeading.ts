import { HeadingCache, MarkdownView } from "obsidian";
import binarySearchClosestHeading from "./binarySearchClosestHeading";

export default function (view: MarkdownView, headings: HeadingCache[]): number {
	if (!view || !headings || headings.length === 0) {
		return -1;
	}

	let activeHeadingIndex;

	const mode = view.getMode();
	if (mode === "source") {
		const editor = view.editor;

		const currentLine = editor.getCursor().line;
		headings.forEach((heading, index) => {
			if (heading.position.start.line <= currentLine) {
				activeHeadingIndex = index;
			}
		});
	} else if (mode === "preview") {
		const scrollLine = view.currentMode.getScroll();
		activeHeadingIndex = binarySearchClosestHeading(headings, scrollLine);
	}

	return activeHeadingIndex;
}
