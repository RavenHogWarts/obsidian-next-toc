interface IButtonTool {
	enabled: boolean;
	icon: string;
}

export type NTocPosition = "left" | "right";
export type NTocIndicatorMode = "bar" | "dot" | "hidden";

export interface NTocPluginSettings {
	toc: {
		show: boolean;
		alwaysExpand: boolean;
		width: number;
		position: NTocPosition;
		offset: number;
		indicatorMode: NTocIndicatorMode;
	};
	render: {
		useHeadingNumber: boolean;
		skipHeading1: boolean;
		renderMarkdown: boolean;
		showWhenSingleHeading: boolean;
		hideHeadingNumberBlacklist: string[]; // Files that should hide heading numbers (only works when useHeadingNumber is true)
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
}

export const DEFAULT_SETTINGS: NTocPluginSettings = {
	toc: {
		show: true,
		alwaysExpand: true,
		width: 240,
		position: "right",
		offset: 12,
		indicatorMode: "bar",
	},
	render: {
		useHeadingNumber: false,
		skipHeading1: false,
		renderMarkdown: true,
		showWhenSingleHeading: true,
		hideHeadingNumberBlacklist: [],
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
};
