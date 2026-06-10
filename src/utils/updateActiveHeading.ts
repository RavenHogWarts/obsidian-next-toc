import { EditorView } from "@codemirror/view";
import { HeadingCache, MarkdownView } from "obsidian";
import binarySearchClosestHeading from "./binarySearchClosestHeading";

interface ActiveHeadingResult {
	activeHeadingIndex: number;
	visibleHeadingIndices: number[];
}

export default function (
	view: MarkdownView,
	headings: HeadingCache[],
): ActiveHeadingResult {
	if (!view || !headings || headings.length === 0) {
		return { activeHeadingIndex: -1, visibleHeadingIndices: [] };
	}

	let activeHeadingIndex: number | undefined;
	const visibleHeadingIndices: number[] = [];

	const mode = view.getMode();
	if (mode === "source") {
		const editor = view.editor;

		const currentLine = editor.getCursor().line;
		headings.forEach((heading, index) => {
			if (heading.position.start.line <= currentLine) {
				activeHeadingIndex = index;
			}
		});

		// Calculate visible headings using CM6 EditorView coordsAtPos
		const cmView = (editor as unknown as { cm: EditorView }).cm;
		const cmScroller = view.contentEl.querySelector(
			".cm-scroller",
		) as HTMLElement | null;
		if (cmView && cmScroller) {
			const scrollerRect = cmScroller.getBoundingClientRect();

			headings.forEach((heading, index) => {
				const pos = heading.position.start.line;
				const lineStartOffset = editor.posToOffset({
					line: pos,
					ch: 0,
				});
				const coords = cmView.coordsAtPos(lineStartOffset);
				if (coords) {
					if (
						coords.top >= scrollerRect.top - 30 &&
						coords.top <= scrollerRect.bottom + 30
					) {
						visibleHeadingIndices.push(index);
					}
				}
			});
		}
	} else if (mode === "preview") {
		const scrollLine = view.currentMode.getScroll();
		activeHeadingIndex = binarySearchClosestHeading(headings, scrollLine);

		// In preview mode, all headings near the scroll position are considered visible
		// Use the preview container to determine visible headings
		const previewView = view.contentEl.querySelector(
			".markdown-preview-view",
		) as HTMLElement | null;
		if (previewView) {
			const scrollTop = previewView.scrollTop;
			const viewportBottom = scrollTop + previewView.clientHeight;

			// Find all heading elements in the preview
			const headingEls = previewView.querySelectorAll(
				"h1, h2, h3, h4, h5, h6",
			);
			const headingElList = Array.from(headingEls) as HTMLElement[];

			headings.forEach((heading, index) => {
				// Find matching heading element by text content
				const matchingEl = headingElList.find(
					(el) => el.textContent?.trim() === heading.heading.trim(),
				);
				if (matchingEl) {
					const rect = matchingEl.getBoundingClientRect();
					const containerRect = previewView.getBoundingClientRect();
					const relativeTop =
						rect.top - containerRect.top + scrollTop;
					if (
						relativeTop >= scrollTop - rect.height &&
						relativeTop <= viewportBottom + rect.height
					) {
						visibleHeadingIndices.push(index);
					}
				}
			});
		}
	}

	return {
		activeHeadingIndex: activeHeadingIndex ?? -1,
		visibleHeadingIndices,
	};
}
