import type { BaseTranslation } from "../i18n-types";

const zh_TW = {
	commands: {
		enableDisableToc: "啟用/停用目錄",
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
		reorderSuccess: "已移動「{heading}」",
		reorderFailedNoFile: "移動失敗：未找到檔案",
		reorderFailedInvalidIndex: "移動失敗：標題索引超出範圍",
		reorderFailedSamePosition: "移動失敗：源位置與目標位置相同",
		reorderFailedTargetIsDescendant: "移動失敗：不能將標題移入自身子樹內",
		reorderFailedNoHeadings: "移動失敗：文件沒有標題",
		reorderFailedEditor: "移動失敗：編輯器操作失敗",
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
			renderInAllVisibleViews: {
				name: "在所有可見視圖中渲染目錄",
				desc: "開啟後，會在所有當前可見的 Markdown 視圖中顯示內聯目錄；關閉時僅在當前活動視圖中顯示。預設關閉以避免額外渲染開銷。",
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
			offsetY: {
				name: "目錄縱向偏移",
				desc: "設定目錄的縱向偏移量",
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
			numberingStartIndex: {
				name: "標題編號起始序號",
				desc: "選擇標題編號是從 0 開始還是從 1 開始。",
				options: {
					zero: "0",
					one: "1",
				},
			},
			skipHeadingLevels: {
				name: "跳過標題層級",
				desc: "選擇在目錄中需要跳過的標題層級",
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
			enableDragSort: {
				name: "啟用拖曳排序",
				desc: "允許在目錄中拖曳標題來重新排序文件章節內容",
			},
		},
		tool: {
			name: "工具",
			headings: {
				returnButtons: "文件導覽按鈕",
				toolbarButtons: "目錄工具列按鈕",
			},
			useToolbar: {
				name: "使用工具列",
				desc: "顯示用於控制目錄的工具列（固定、位置、展開、偏移、複製）",
			},
			toolbarAlwaysShow: {
				name: "目錄工具列常駐顯示",
				desc: "目錄展開時，目錄工具列始終可見，無需懸停觸發",
			},
			showProgressBar: {
				name: "顯示進度條",
				desc: "在目錄上方顯示閱讀進度",
			},
			showProgressCircle: {
				name: "顯示進度圓環",
				desc: "在指示器上方顯示閱讀進度，即收縮目錄後",
			},
			toolbarButtons: {
				pinTOC: {
					name: "固定／取消固定目錄",
					desc: "切換目錄是否常駐展開",
				},
				changePosition: {
					name: "更改位置",
					desc: "在左右兩側之間切換目錄位置",
				},
				expandCollapse: {
					name: "展開／收合目錄項目",
					desc: "一鍵展開或收合所有目錄項目",
				},
				leftOffset: {
					name: "向左偏移",
					desc: "將目錄向左移動一步",
				},
				rightOffset: {
					name: "向右偏移",
					desc: "將目錄向右移動一步",
				},
				upOffset: {
					name: "向上移動",
					desc: "將目錄向上移動一步",
				},
				downOffset: {
					name: "向下移動",
					desc: "將目錄向下移動一步",
				},
				locateActiveHeading: {
					name: "定位到目前標題",
					desc: "捲動目錄列表，使目前活動的標題進入可視範圍",
				},
				copyTOC: {
					name: "複製目錄",
					desc: "將目錄複製到剪貼簿",
				},
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
		upOffset: "向上移動",
		downOffset: "向下移動",
		locateActiveHeading: "定位到目前標題",
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
