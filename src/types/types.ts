interface IButtonTool {
	enabled: boolean;
	icon: string;
}

interface IToolbarButtons {
	pinTOC: boolean;
	changePosition: boolean;
	expandCollapse: boolean;
	leftOffset: boolean;
	rightOffset: boolean;
	upOffset: boolean;
	downOffset: boolean;
	locateActiveHeading: boolean;
	copyTOC: boolean;
}

export type NTocPosition = "left" | "right";
export type NTocIndicatorMode = "bar" | "dot" | "hidden";

export interface IPluginSettings {
	toc: {
		show: boolean;
		alwaysExpand: boolean;
		renderInAllVisibleViews: boolean;
		width: number;
		position: NTocPosition;
		offset: number;
		offsetY: number;
		indicatorMode: NTocIndicatorMode;
	};
	render: {
		useHeadingNumber: boolean;
		numberingStartIndex: number;
		skipHeadingLevels: number[];
		renderMarkdown: boolean;
		showWhenSingleHeading: boolean;
		hideHeadingNumberBlacklist: string[]; // Files that should hide heading numbers (only works when useHeadingNumber is true)
		enableDragSort: boolean;
	};
	tool: {
		useToolbar: boolean;
		toolbarAlwaysShow: boolean;
		showProgressBar: boolean;
		showProgressCircle: boolean;
		toolbarButtons: IToolbarButtons;
		returnToCursor: IButtonTool;
		returnToTop: IButtonTool;
		returnToBottom: IButtonTool;
		jumpToNextHeading: IButtonTool;
		jumpToPrevHeading: IButtonTool;
	};
}

export const DEFAULT_SETTINGS: IPluginSettings = {
	toc: {
		show: true,
		alwaysExpand: true,
		renderInAllVisibleViews: false,
		width: 240,
		position: "right",
		offset: 12,
		offsetY: 0,
		indicatorMode: "bar",
	},
	render: {
		useHeadingNumber: false,
		numberingStartIndex: 1,
		skipHeadingLevels: [],
		renderMarkdown: true,
		showWhenSingleHeading: true,
		hideHeadingNumberBlacklist: [],
		enableDragSort: false,
	},
	tool: {
		useToolbar: true,
		toolbarAlwaysShow: false,
		showProgressBar: true,
		showProgressCircle: true,
		toolbarButtons: {
			pinTOC: true,
			changePosition: true,
			expandCollapse: true,
			leftOffset: true,
			rightOffset: true,
			upOffset: true,
			downOffset: true,
			locateActiveHeading: true,
			copyTOC: true,
		},
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
