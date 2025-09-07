import { App, MarkdownView, setIcon } from "obsidian";

export default function (app: App, code: string, codeblockDom: HTMLElement) {
	const cardEditBtn = codeblockDom.createDiv("NToc__inline-card-edit-btn");
	setIcon(cardEditBtn, "pencil");

	codeblockDom.addEventListener("mouseover", () => {
		const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView && markdownView.getMode() !== "preview") {
			cardEditBtn.style.opacity = "1";
		}
	});
	codeblockDom.addEventListener("mouseout", () => {
		cardEditBtn.style.opacity = "0";
	});

	cardEditBtn.onclick = () => {
		console.log("Edit code block:", code);
	};
	return cardEditBtn;
}
