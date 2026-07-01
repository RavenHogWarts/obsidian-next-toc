import { HeadingCache, MarkdownView } from "obsidian";

export default function getFileHeadings(view: MarkdownView): HeadingCache[] {
	if (!view.file) {
		return [];
	}

	const cache = view.app.metadataCache.getFileCache(view.file);
	return cache?.headings || [];
}

/**
 * Parse headings directly from the editor's live text for instant TOC feedback.
 *
 * Used in the `editor-change` event because Obsidian's `metadataCache` lags
 * behind edits (it re-parses asynchronously), which made the TOC update feel
 * slow. The authoritative data still comes from `getFileHeadings` (metadataCache),
 * fired shortly after via `metadataCache.on("changed")` to correct any edge cases.
 *
 * Handles ATX headings (`#`-`######`) and skips lines inside fenced code blocks.
 */
export function getHeadingsFromEditor(view: MarkdownView): HeadingCache[] {
	const editor = view.editor;
	if (!editor) {
		return getFileHeadings(view);
	}

	const lines = editor.getValue().split("\n");
	const headings: HeadingCache[] = [];

	let inFence = false;
	let fenceMarker = "";

	for (let lineNum = 0; lineNum < lines.length; lineNum++) {
		const line = lines[lineNum];

		// Track fenced code blocks so headings inside them are ignored
		const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
		if (fenceMatch) {
			const marker = fenceMatch[1][0];
			if (!inFence) {
				inFence = true;
				fenceMarker = marker;
			} else if (marker === fenceMarker) {
				inFence = false;
				fenceMarker = "";
			}
			continue;
		}

		if (inFence) {
			continue;
		}

		// ATX heading: up to 3 leading spaces, 1-6 `#`, required space, content
		const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+(.*\S)\s*#*\s*$/);
		if (headingMatch) {
			headings.push({
				heading: headingMatch[2],
				level: headingMatch[1].length,
				position: {
					start: { line: lineNum, col: 0, offset: 0 },
					end: { line: lineNum, col: line.length, offset: 0 },
				},
			});
		}
	}

	return headings;
}
