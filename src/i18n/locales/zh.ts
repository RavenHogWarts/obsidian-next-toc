import { BaseMessage } from "../types";

const translations: BaseMessage = {
	commands: {
		returnToCursor: "返回光标位置",
		scrollToTop: "滚动到顶部",
		scrollToBottom: "滚动到底部",
		navigatePreviousHeading: "导航到上一个标题",
		navigateNextHeading: "导航到下一个标题",
		tocExpand: "展开/收起目录",
		insertReadingTimeCard: "插入阅读时间卡片",
		insertTableOfContentsCard: "插入目录卡片",
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
				desc: "启用或禁用始终展开目录",
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
				name: "渲染Markdown",
				desc: "启用或禁用在目录中渲染Markdown",
			},
		},
		tool: {
			name: "工具",
			useToolbar: {
				name: "使用工具栏",
				desc: "显示带有导航按钮的工具栏",
			},
			showProgress: {
				name: "显示进度",
				desc: "显示阅读进度指示器",
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
};

export default translations;
