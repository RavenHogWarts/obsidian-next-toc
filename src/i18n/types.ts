import en from "./locales/en";
import zh from "./locales/zh";
import zhTW from "./locales/zh-TW";

// 定义支持的语言类型
export const SupportedLocales: Record<string, BaseMessage> = {
	en,
	zh,
	"zh-TW": zhTW,
};

interface IBaseSettingsItem {
	name: string;
	desc: string;
}
type SettingsItem<T = Record<string, never>> = IBaseSettingsItem & T;

// 定义翻译结构类型
export type BaseMessage = {
	commands: {
		"return-to-cursor": string;
		"scroll-to-top": string;
		"scroll-to-bottom": string;
		"navigate-previous-heading": string;
		"navigate-next-heading": string;
		"toc-expand": string;
		"insert-reading-time-card": string;
		"insert-table-of-contents-card": string;
	};
	settings: {
		toc: {
			name: string;
			show: IBaseSettingsItem;
			alwaysExpand: IBaseSettingsItem;
			width: IBaseSettingsItem;
			position: SettingsItem<{
				options: {
					left: string;
					right: string;
				};
			}>;
			offset: IBaseSettingsItem;
		};
		render: {
			name: string;
			useHeadingNumber: IBaseSettingsItem;
			skipHeading1: IBaseSettingsItem;
			renderMarkdown: IBaseSettingsItem;
		};
		tool: {
			name: string;
			useToolbar: IBaseSettingsItem;
			showProgress: IBaseSettingsItem;
			returnToCursor: IBaseSettingsItem;
			returnToTop: IBaseSettingsItem;
			returnToBottom: IBaseSettingsItem;
			jumpToNextHeading: IBaseSettingsItem;
			jumpToPrevHeading: IBaseSettingsItem;
		};
	};
	cards: {
		preview: string;
		property: string;
		basicSetting: string;
		styleSetting: string;
		readingTimeCard: {
			heading: string;
			title: string;
			chineseWordsPerMinute: string;
			englishWordsPerMinute: string;
			textBefore: string;
			textAfter: string;
			iconName: string;
			removeCodeBlocks: string;
			removeWikiLinks: string;
			removeImageLinks: string;
			removeNormalLinks: string;
			showWordCount: string;
		};
		tableOfContentsCard: {
			heading: string;
			title: string;
			minDepth: string;
			maxDepth: string;
			redirect: string;
			showNumbers: string;
			collapsible: string;
		};
		styles: {
			currentProperties: string;
			addNewProperty: string;
			noneCustomProperty: string;
		};
	};
};

// 生成所有可能的翻译键路径类型
type PathsToStringProps<T> = T extends string
	? []
	: {
			[K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
	  }[Extract<keyof T, string>];

// 将路径数组转换为点号分隔的字符串
type JoinPath<T extends string[]> = T extends []
	? never
	: T extends [infer F]
	? F extends string
		? F
		: never
	: T extends [infer F, ...infer R]
	? F extends string
		? R extends string[]
			? `${F}.${JoinPath<R>}`
			: never
		: never
	: never;

// 生成所有可能的翻译键
export type TranslationKeys = JoinPath<PathsToStringProps<BaseMessage>>;

// 参数类型定义
export type TranslationParams = Record<string, any> | any[];
