interface IButtonTool {
	enabled: boolean;
	icon: string;
}

export type NTocPosition = "left" | "right";

export interface NTocPluginSettings {
	toc: {
		show: boolean;
		alwaysExpand: boolean;
		width: number;
		position: NTocPosition;
		offset: number;
	};
	render: {
		useHeadingNumber: boolean;
		skipHeading1: boolean;
		renderMarkdown: boolean;
	};
	tool: {
		useToolbar: boolean;
		showProgressBar: boolean;
		showProgressCircle: boolean;
		returnToCursor: IButtonTool;
		returnToTop: IButtonTool;
		returnToBottom: IButtonTool;
		jumpToNextHeading: IButtonTool;
		jumpToPrevHeading: IButtonTool;
	};
	advanced: {
		customClassNames: {
			showToc: string;
			hideToc: string;
			showTocNumber: string;
			hideTocNumber: string;
		};
	};
}

export const DEFAULT_SETTINGS: NTocPluginSettings = {
	toc: {
		show: true,
		alwaysExpand: true,
		width: 240,
		position: "right",
		offset: 12,
	},
	render: {
		useHeadingNumber: false,
		skipHeading1: false,
		renderMarkdown: true,
	},
	tool: {
		useToolbar: true,
		showProgressBar: true,
		showProgressCircle: true,
		returnToCursor: {
			enabled: true,
			icon: "text-cursor-input",
		},
		returnToTop: {
			enabled: true,
			icon: "arrow-up-to-line",
		},
		returnToBottom: {
			enabled: false,
			icon: "arrow-down-to-line",
		},
		jumpToNextHeading: {
			enabled: false,
			icon: "corner-right-down",
		},
		jumpToPrevHeading: {
			enabled: false,
			icon: "corner-left-up",
		},
	},
	advanced: {
		customClassNames: {
			showToc: "NToc__SHOW-TOC",
			hideToc: "NToc__HIDE-TOC",
			showTocNumber: "NToc__SHOW-TOC-NUMBER",
			hideTocNumber: "NToc__HIDE-TOC-NUMBER",
		},
	},
};
