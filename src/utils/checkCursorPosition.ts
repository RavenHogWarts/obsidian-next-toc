import { MarkdownView } from "obsidian";

export default function (view: MarkdownView) {
	if (!view) {
		return;
	}

	const interval = window.setInterval(() => {
		if (view.getMode() === "source") {
			const editor = view.editor;
			const cursor = editor.getCursor();
			const line = cursor.line;
		}
	}, 100);

	return () => {
		window.clearInterval(interval);
	};
}
