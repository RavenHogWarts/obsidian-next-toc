import { App, MarkdownView, setIcon } from "obsidian";

export default function (app: App, code: string, codeblockDom: HTMLElement) {
	const cardEditBtn = codeblockDom.createDiv("NToc__inline-card-edit-btn");
	setIcon(cardEditBtn, "pencil");

	codeblockDom.addEventListener("mouseover", () => {
		const markdownView = app.workspace.getActiveViewOfType(MarkdownView);
		if (markdownView && markdownView.getMode() !== "preview") {
			cardEditBtn.style.opacity = "1";
			justifyTop(codeblockDom, cardEditBtn);
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

function justifyTop(codeblockDom: HTMLElement, formEditButton: HTMLDivElement) {
	const obCodeblocButtonEls =
		codeblockDom.getElementsByClassName("edit-block-button");
	let top: string | undefined;
	if (obCodeblocButtonEls.length > 0) {
		const obCodeblocButtonEl = obCodeblocButtonEls[0];
		// @ts-ignore
		top = obCodeblocButtonEl.computedStyleMap().get("top")?.toString();
	}

	if (top) {
		formEditButton.style.top = top;
	} else {
		formEditButton.style.top = "0";
	}
}
