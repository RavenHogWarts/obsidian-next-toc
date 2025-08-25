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
		showProgress: boolean;
		returnToCursor: IButtonTool;
		returnToTop: IButtonTool;
		returnToBottom: IButtonTool;
		jumpToNextHeading: IButtonTool;
		jumpToPrevHeading: IButtonTool;
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
		renderMarkdown: false,
	},
	tool: {
		useToolbar: true,
		showProgress: true,
		returnToCursor: {
			enabled: true,
			icon: "text-cursor-input",
		},
		returnToTop: {
			enabled: false,
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
};
