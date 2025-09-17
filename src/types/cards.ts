export type CardType = "reading-time" | "toc-card";

export interface BaseCardConfig {
	id: string;
	type: CardType;
	title?: string;
	containerStyle?: Partial<CSSStyleDeclaration>;
	titleStyle?: Partial<CSSStyleDeclaration>;
	contentStyle?: Partial<CSSStyleDeclaration>;
}

export interface ReadingTimeCardConfig extends BaseCardConfig {
	type: "reading-time";
	title: "Reading Time";
	chineseWordsPerMinute?: number;
	englishWordsPerMinute?: number;
	removeCodeBlocks?: boolean;
	removeWikiLinks?: boolean;
	removeImageLinks?: boolean;
	removeNormalLinks?: boolean;
	showWordCount?: boolean;
	iconName?: string;
	textBefore?: string;
	textAfter?: string;
}

export interface TocCardConfig extends BaseCardConfig {
	type: "toc-card";
	title: "Table of Contents";
	maxDepth?: number;
	minDepth?: number;
	redirect?: boolean;
	showNumbers?: boolean;
	collapsible?: boolean;
}

export type CardConfig = ReadingTimeCardConfig | TocCardConfig;

// 统一默认卡片配置
export const DEFAULT_READING_TIME_CARD: ReadingTimeCardConfig = {
	id: `card-${Date.now()}`,
	type: "reading-time",
	title: "Reading Time",
	chineseWordsPerMinute: 300,
	englishWordsPerMinute: 200,
	removeCodeBlocks: false,
	removeWikiLinks: false,
	removeImageLinks: false,
	removeNormalLinks: false,
	showWordCount: true,
	iconName: "clock",
	textBefore: "Estimated: ",
	textAfter: "",
	containerStyle: {
		backgroundColor: "var(--background-secondary)",
		borderRadius: "8px",
		padding: "12px 16px",
		fontSize: "1em",
		fontWeight: "normal",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
		border: "1px solid var(--background-modifier-border)",
		width: "auto",
		maxWidth: "100%",
		margin: "1em 0",
	},
};

export const DEFAULT_TOC_CARD: TocCardConfig = {
	id: `card-${Date.now()}`,
	type: "toc-card",
	title: "Table of Contents",
	maxDepth: 6,
	minDepth: 1,
	redirect: true,
	showNumbers: true,
	collapsible: true,
	containerStyle: {
		backgroundColor: "var(--background-secondary)",
		borderRadius: "8px",
		padding: "12px 16px",
		fontSize: "1em",
		fontWeight: "normal",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
		border: "1px solid var(--background-modifier-border)",
		width: "auto",
		maxWidth: "100%",
		margin: "1em 0",
	},
};
