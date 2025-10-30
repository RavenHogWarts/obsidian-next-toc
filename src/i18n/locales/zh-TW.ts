import { BaseMessage } from "../types";

const translations: BaseMessage = {
	commands: {
		returnToCursor: "返回游標位置",
		scrollToTop: "捲動到頂部",
		scrollToBottom: "捲動到底部",
		navigatePreviousHeading: "跳至上一個標題",
		navigateNextHeading: "跳至下一個標題",
		tocExpand: "展開／收合目錄",
		insertReadingTimeCard: "插入閱讀時間卡片",
		insertTableOfContentsCard: "插入目錄卡片",
	},
	settings: {
		toc: {
			name: "目錄",
			show: {
				name: "顯示目錄",
				desc: "啟用或停用目錄功能",
			},
			alwaysExpand: {
				name: "目錄永遠展開",
				desc: "啟用或停用目錄永遠展開",
			},
			width: {
				name: "目錄寬度",
				desc: "設定目錄的寬度",
			},
			position: {
				name: "目錄位置",
				desc: "設定目錄的位置",
				options: {
					left: "左側",
					right: "右側",
				},
			},
			offset: {
				name: "目錄偏移",
				desc: "設定目錄的偏移量",
			},
		},
		render: {
			name: "渲染",
			useHeadingNumber: {
				name: "使用標題編號",
				desc: "啟用或停用在目錄中使用標題編號",
			},
			skipHeading1: {
				name: "跳過一級標題",
				desc: "啟用或停用在目錄中跳過一級標題",
			},
			renderMarkdown: {
				name: "渲染 Markdown",
				desc: "啟用或停用在目錄中渲染 Markdown",
			},
			customClassNames: {
				name: "自訂類別名稱",
				desc: "自訂用於頁面特定TOC控制的CSS類別名稱",
				showToc: {
					name: "顯示TOC類別名稱",
					desc: "強制顯示TOC的類別名稱（預設：NToc__SHOW-TOC）",
				},
				hideToc: {
					name: "隱藏TOC類別名稱", 
					desc: "強制隱藏TOC的類別名稱（預設：NToc__HIDE-TOC）",
				},
				showTocNumber: {
					name: "顯示TOC編號類別名稱",
					desc: "強制顯示TOC標題編號的類別名稱（預設：NToc__SHOW-TOC-NUMBER）",
				},
				hideTocNumber: {
					name: "隱藏TOC編號類別名稱",
					desc: "強制隱藏TOC標題編號的類別名稱（預設：NToc__HIDE-TOC-NUMBER）",
				},
			},
		},
		tool: {
			name: "工具",
			useToolbar: {
				name: "使用工具列",
				desc: "顯示帶有導覽按鈕的工具列",
			},
			showProgressBar: {
				name: "顯示進度條",
				desc: "在目錄上方顯示閱讀進度",
			},
			showProgressCircle: {
				name: "顯示進度圓環",
				desc: "在指示器上方顯示閱讀進度，即收縮目錄後",
			},
			returnToCursor: {
				name: "返回游標",
				desc: "返回到上次游標位置的按鈕（僅在編輯模式下可用）",
			},
			returnToTop: {
				name: "返回頂部",
				desc: "返回到文件頂部的按鈕",
			},
			returnToBottom: {
				name: "返回底部",
				desc: "返回到文件底部的按鈕",
			},
			jumpToNextHeading: {
				name: "跳至下一個標題",
				desc: "跳至下一個標題的按鈕",
			},
			jumpToPrevHeading: {
				name: "跳至上一個標題",
				desc: "跳至上一個標題的按鈕",
			},
		},
	},
	cards: {
		preview: "預覽",
		property: "屬性",
		basicSetting: "基本設定",
		styleSetting: "樣式設計",
		readingTimeCard: {
			heading: "閱讀時間卡片設定",
			title: "標題",
			chineseWordsPerMinute: "每分鐘中文詞數",
			englishWordsPerMinute: "每分鐘英文詞數",
			textBefore: "閱讀時間前的文字",
			textAfter: "閱讀時間後的文字",
			iconName: "圖示名稱（來自Obsidian圖示集）",
			removeCodeBlocks: "移除程式碼區塊",
			removeWikiLinks: "移除Wiki連結",
			removeImageLinks: "移除圖片連結",
			removeNormalLinks: "移除一般連結",
			showWordCount: "顯示字數",
		},
		tableOfContentsCard: {
			heading: "目錄卡片設定",
			title: "標題",
			minDepth: "最小標題層級",
			maxDepth: "最大標題層級",
			redirect: "啟用標題導向",
			showNumbers: "顯示標題編號",
			collapsible: "使目錄可收合",
		},
		styles: {
			currentProperties: "目前屬性",
			addNewProperty: "新增屬性",
			noneCustomProperty: "尚未定義自訂屬性",
		},
	},
};

export default translations;
