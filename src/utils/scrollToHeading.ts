import { HeadingCache, MarkdownView } from "obsidian";

export default function (view: MarkdownView, heading: HeadingCache) {
	if (!view.file) return;

	const mode = view.getMode();
	const line = heading.position.start.line;

	view.leaf.openFile(view.file, {
		eState: {
			line,
			mode,
		},
	});
}
