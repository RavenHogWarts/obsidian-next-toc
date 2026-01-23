import type { BaseTranslation } from "../i18n-types";

const zh_TW = {
	commands: {
		openTocView: "開啟目錄側邊視圖",
		returnToCursor: "返回游標位置",
		scrollToTop: "捲動到頂部",
		scrollToBottom: "捲動到底部",
		navigatePreviousHeading: "跳至上一個標題",
		navigateNextHeading: "跳至下一個標題",
		tocExpand: "展開／收合目錄",
		insertReadingTimeCard: "插入閱讀時間卡片",
		insertTableOfContentsCard: "插入目錄卡片",
		addCurrentFileToHideHeadingNumberBlacklist:
			"新增/移除目前檔案至標題編號黑名單",
		addCurrentFolderToHideHeadingNumberBlacklist:
			"新增/移除目前資料夾至標題編號黑名單",
	},
	notices: {
		alreadyCovered: "已被現有規則覆蓋",
		added: "已新增",
		addedAndRemovedRedundant: "已新增，並移除了 {count:number} 個冗餘規則",
		notInBlacklist: "不在黑名單中",
		removed: "已移除",
		coveredByPattern: "已被某個規則覆蓋，如需移除請手動刪除該規則",
	},
	view: {
		view_empty:
			"未找到標題，請確保當前文件包含標題，或者啟動markdown文件視圖。",
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
				desc: "啟用或停用目錄永遠展開，可使用文件屬性 `cssclasses` 來控制顯示與隱藏：",
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
			indicatorMode: {
				name: "指示器模式",
				desc: "設定目錄收起時指示器的顯示模式",
				options: {
					bar: "長條",
					dot: "圓點",
					hidden: "隱藏",
				},
			},
		},
		render: {
			name: "渲染",
			useHeadingNumber: {
				name: "使用標題編號",
				desc: "啟用或停用在目錄中使用標題編號，可使用文件屬性 `cssclasses` 來控制顯示與隱藏（優先級高於黑名單）：",
			},
			skipHeading1: {
				name: "跳過一級標題",
				desc: "啟用或停用在目錄中跳過一級標題",
			},
			renderMarkdown: {
				name: "渲染 Markdown",
				desc: "啟用或停用在目錄中渲染 Markdown",
			},
			showWhenSingleHeading: {
				name: "單一標題時顯示目錄",
				desc: "啟用或停用在文件僅有單一標題時顯示目錄",
			},
			hideHeadingNumberBlacklist: {
				name: "標題編號黑名單",
				desc: "指定需要隱藏標題編號的檔案（每行一個路徑）。支援萬用字元：* (任意字元)，? (單一字元)。僅在「使用標題編號」開啟時生效。範例：folder/file.md 或 *.md",
			},
		},
		tool: {
			name: "工具",
			headings: {
				returnButtons: "導航按鈕組",
			},
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
	tools: {
		pinTOC: "固定／取消固定目錄",
		changePosition: "更改目錄位置",
		expandCollapse: "展開／收合目錄項目",
		leftOffset: "向左偏移",
		rightOffset: "向右偏移",
		copyTOC: "複製目錄到剪貼簿",
		returnNavigation: "返回導航",
		returnToCursor: "返回游標位置",
		returnToTop: "返回頂部",
		returnToBottom: "返回底部",
		jumpToNextHeading: "下一个标题",
		jumpToPrevHeading: "上一个标题",
	},
} satisfies BaseTranslation;

export default zh_TW;
