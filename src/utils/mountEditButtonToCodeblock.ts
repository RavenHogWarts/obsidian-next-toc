import { App, MarkdownView, setIcon } from "obsidian";

export default function (app: App, code: string, codeblockDom: HTMLElement) {
	const cardEditBtn = codeblockDom.createDiv("NToc__inline-card-edit-btn");
	setIcon(cardEditBtn, "pencil");

	codeblockDom.addEventListener("mouseover", () => {
		const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView && markdownView.getMode() !== "preview") {
			cardEditBtn.addClass("NToc__inline-card-edit-btn--visible");
		}
	});
	codeblockDom.addEventListener("mouseout", () => {
		cardEditBtn.removeClass("NToc__inline-card-edit-btn--visible");
	});

	cardEditBtn.onclick = () => {
		// new CardCreateModal(app, code, (content) => {
		// 	const markdownView =
		// 		app.workspace.getActiveViewOfType(MarkdownView);
		// 	if (!markdownView) {
		// 		return;
		// 	}
		// 	const editor = markdownView.editor;
		// 	// @ts-ignore
		// 	const editorView = editor.cm as EditorView;
		// 	const pos = editorView.posAtDOM(codeblockDom);
		// 	const start = pos + "```ntoc-card\n".length;
		// 	editorView.dispatch({
		// 		changes: {
		// 			from: start,
		// 			to: start + code.length,
		// 			insert: content,
		// 		},
		// 	});
		// }).open();
	};
	return cardEditBtn;
}
