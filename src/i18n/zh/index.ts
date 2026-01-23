import type { BaseTranslation } from "../i18n-types";

const zh = {
	commands: {
		openTocView: "打开目录侧边视图",
		returnToCursor: "返回光标位置",
		scrollToTop: "滚动到顶部",
		scrollToBottom: "滚动到底部",
		navigatePreviousHeading: "导航到上一个标题",
		navigateNextHeading: "导航到下一个标题",
		tocExpand: "展开/收起目录",
		insertReadingTimeCard: "插入阅读时间卡片",
		insertTableOfContentsCard: "插入目录卡片",
		addCurrentFileToHideHeadingNumberBlacklist:
			"添加/移除当前文件到标题编号黑名单",
		addCurrentFolderToHideHeadingNumberBlacklist:
			"添加/移除当前文件夹到标题编号黑名单",
	},
	notices: {
		alreadyCovered: "已被现有规则覆盖",
		added: "已添加",
		addedAndRemovedRedundant: "已添加，并移除了 {count:number} 个冗余规则",
		notInBlacklist: "不在黑名单中",
		removed: "已移除",
		coveredByPattern: "已被某个规则覆盖，如需移除请手动删除该规则",
	},
	view: {
		view_empty:
			"未找到标题，请确保当前文档包含标题，或者激活markdown文档视图。",
	},
	settings: {
		toc: {
			name: "目录",
			show: {
				name: "显示目录",
				desc: "启用或禁用目录功能",
			},
			alwaysExpand: {
				name: "始终展开目录",
				desc: "启用或禁用始终展开目录，可使用文档属性 `cssclasses` 来控制显示与隐藏：",
			},
			width: {
				name: "目录宽度",
				desc: "设置目录的宽度",
			},
			position: {
				name: "目录位置",
				desc: "设置目录的位置",
				options: {
					left: "左侧",
					right: "右侧",
				},
			},
			offset: {
				name: "目录偏移",
				desc: "设置目录的偏移量",
			},
			indicatorMode: {
				name: "指示器模式",
				desc: "设置目录收起时指示器的显示模式",
				options: {
					bar: "长条",
					dot: "圆点",
					hidden: "隐藏",
				},
			},
		},
		render: {
			name: "渲染",
			useHeadingNumber: {
				name: "使用标题编号",
				desc: "启用或禁用在目录中使用标题编号",
			},
			skipHeading1: {
				name: "跳过一级标题",
				desc: "启用或禁用在目录中跳过一级标题",
			},
			renderMarkdown: {
				name: "渲染 Markdown",
				desc: "启用或禁用在目录中渲染 Markdown",
			},
			showWhenSingleHeading: {
				name: "单一标题时显示目录",
				desc: "启用或禁用在文档仅有单一标题时显示目录",
			},
			hideHeadingNumberBlacklist: {
				name: "标题编号黑名单",
				desc: "指定需要隐藏标题编号的文件（每行一个路径）。支持通配符：* (任意字符)，? (单个字符)。仅在「使用标题编号」开启时生效。示例：folder/file.md 或 *.md",
			},
		},
		tool: {
			name: "工具",
			headings: {
				returnButtons: "导航按钮组",
			},
			useToolbar: {
				name: "使用工具栏",
				desc: "显示带有导航按钮的工具栏",
			},
			showProgressBar: {
				name: "显示进度条",
				desc: "在目录上方显示阅读进度",
			},
			showProgressCircle: {
				name: "显示进度圆环",
				desc: "在指示器上方显示阅读进度，即收缩目录后",
			},
			returnToCursor: {
				name: "返回光标",
				desc: "返回到上次光标位置的按钮（仅在编辑模式下可用）",
			},
			returnToTop: {
				name: "返回顶部",
				desc: "返回到文档顶部的按钮",
			},
			returnToBottom: {
				name: "返回底部",
				desc: "返回到文档底部的按钮",
			},
			jumpToNextHeading: {
				name: "跳转到下一个标题",
				desc: "跳转到下一个标题的按钮",
			},
			jumpToPrevHeading: {
				name: "跳转到上一个标题",
				desc: "跳转到上一个标题的按钮",
			},
		},
	},
	cards: {
		preview: "预览",
		property: "属性",
		basicSetting: "基本设置",
		styleSetting: "样式设置",
		readingTimeCard: {
			heading: "阅读时间卡片设置",
			title: "标题",
			chineseWordsPerMinute: "每分钟中文单词数",
			englishWordsPerMinute: "每分钟英文单词数",
			textBefore: "阅读时间前的文本",
			textAfter: "阅读时间后的文本",
			iconName: "图标名称（来自Obsidian图标集）",
			removeCodeBlocks: "移除代码块",
			removeWikiLinks: "移除wiki链接",
			removeImageLinks: "移除图片链接",
			removeNormalLinks: "移除普通链接",
			showWordCount: "显示字数",
		},
		tableOfContentsCard: {
			heading: "目录卡片设置",
			title: "标题",
			minDepth: "最小标题深度",
			maxDepth: "最大标题深度",
			redirect: "启用标题重定向",
			showNumbers: "显示标题编号",
			collapsible: "使目录可折叠",
		},
		styles: {
			currentProperties: "当前属性",
			addNewProperty: "添加新属性",
			noneCustomProperty: "未定义自定义属性",
		},
	},
	tools: {
		pinTOC: "固定/取消固定目录",
		changePosition: "更改目录位置",
		expandCollapse: "展开/收起目录项",
		leftOffset: "向左偏移",
		rightOffset: "向右偏移",
		copyTOC: "复制目录到剪贴板",
		returnNavigation: "返回导航",
		returnToCursor: "返回光标位置",
		returnToTop: "返回顶部",
		returnToBottom: "返回底部",
		jumpToNextHeading: "下一个标题",
		jumpToPrevHeading: "上一个标题",
	},
} satisfies BaseTranslation;

export default zh;
