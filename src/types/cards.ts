export type CardType = "reading-time" | "toc-card";

export interface BaseCardConfig {
	id: string;
	type: CardType;
	title?: string;
	titleStyle?: Partial<CSSStyleDeclaration>;
	containerStyle?: Partial<CSSStyleDeclaration>;
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
