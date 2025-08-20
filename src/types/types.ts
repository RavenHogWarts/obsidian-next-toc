interface IButtonTool {
	enabled: boolean;
	icon: string;
}

export interface NTocPluginSettings {
	toc: {
		show: boolean;
		alwaysExpand: boolean;
		width: number;
		position: "left" | "right";
		offset: number;
	};
	render: {
		useHeadingNumber: boolean;
		skipHeading1: boolean;
		renderMarkdown: boolean;
	};
	tool: {
		useToolbar: boolean;
		progressStyle: "none" | "bar" | "ring" | "both";
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
		alwaysExpand: false,
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
		progressStyle: "none",
		returnToCursor: {
			enabled: true,
			icon: "text-cursor-input",
		},
		returnToTop: {
			enabled: true,
			icon: "arrow-up-to-line",
		},
		returnToBottom: {
			enabled: true,
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
