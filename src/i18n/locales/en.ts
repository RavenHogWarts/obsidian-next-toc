import { BaseMessage } from "../types";

// Remember [use sentence case in UI](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Use+sentence+case+in+UI)
const translations: BaseMessage = {
	commands: {
		returnToCursor: "Return to cursor",
		scrollToTop: "Scroll to top",
		scrollToBottom: "Scroll to bottom",
		navigatePreviousHeading: "Navigate to previous heading",
		navigateNextHeading: "Navigate to next heading",
		tocExpand: "Expand/Collapse TOC",
		insertReadingTimeCard: "Insert reading time card",
		insertTableOfContentsCard: "Insert table of contents card",
	},
	settings: {
		toc: {
			name: "TOC",
			show: {
				name: "TOC show",
				desc: "Enable or disable the table of contents feature",
			},
			alwaysExpand: {
				name: "TOC always expand",
				desc: "Enable or disable always expanding the table of contents",
			},
			width: {
				name: "TOC width",
				desc: "Set the width of the table of contents",
			},
			position: {
				name: "TOC position",
				desc: "Set the position of the table of contents",
				options: {
					left: "Left",
					right: "Right",
				},
			},
			offset: {
				name: "TOC offset",
				desc: "Set the offset of the table of contents",
			},
		},
		render: {
			name: "Render",
			useHeadingNumber: {
				name: "Use heading number",
				desc: "Enable or disable using heading numbers in the table of contents",
			},
			skipHeading1: {
				name: "Skip heading 1",
				desc: "Enable or disable skipping level 1 headings in the table of contents",
			},
			renderMarkdown: {
				name: "Render markdown",
				desc: "Enable or disable rendering markdown in the table of contents",
			},
		},
		tool: {
			name: "Tool",
			useToolbar: {
				name: "Use toolbar",
				desc: "Show the toolbar with navigation buttons",
			},
			showProgressBar: {
				name: "Use progress bar",
				desc: "Show the reading progress bar above the table of contents",
			},
			showProgressCircle: {
				name: "Use progress circle",
				desc: "Show the circular reading progress indicator above the toggle button, when the TOC is collapsed",
			},
			returnToCursor: {
				name: "Return to cursor",
				desc: "Button to return to the last cursor position (available only in edit mode)",
			},
			returnToTop: {
				name: "Return to top",
				desc: "Button to return to the top of the document",
			},
			returnToBottom: {
				name: "Return to bottom",
				desc: "Button to return to the bottom of the document",
			},
			jumpToNextHeading: {
				name: "Jump to next heading",
				desc: "Button to jump to the next heading",
			},
			jumpToPrevHeading: {
				name: "Jump to previous heading",
				desc: "Button to jump to the previous heading",
			},
		},
		advanced: {
			name: "Advanced",
			customClassNames: {
				name: "Custom class names",
				desc: "Customize the CSS class names used for page-specific TOC control",
				showToc: {
					name: "Show TOC class",
					desc: "Class name to force show the TOC (default: NToc__SHOW-TOC)",
				},
				hideToc: {
					name: "Hide TOC class", 
					desc: "Class name to force hide the TOC (default: NToc__HIDE-TOC)",
				},
				showTocNumber: {
					name: "Show TOC number class",
					desc: "Class name to force show TOC heading numbers (default: NToc__SHOW-TOC-NUMBER)",
				},
				hideTocNumber: {
					name: "Hide TOC number class",
					desc: "Class name to force hide TOC heading numbers (default: NToc__HIDE-TOC-NUMBER)",
				},
			},
		},
	},
	cards: {
		preview: "Preview",
		property: "Property",
		basicSetting: "Basic settings",
		styleSetting: "Style design",
		readingTimeCard: {
			heading: "Reading time card settings",
			title: "Title",
			chineseWordsPerMinute: "Chinese words per minute",
			englishWordsPerMinute: "English words per minute",
			textBefore: "Text before reading time",
			textAfter: "Text after reading time",
			iconName: "Icon name (from Obsidian icon set)",
			removeCodeBlocks: "Remove code blocks",
			removeWikiLinks: "Remove wiki links",
			removeImageLinks: "Remove image links",
			removeNormalLinks: "Remove normal links",
			showWordCount: "Show word count",
		},
		tableOfContentsCard: {
			heading: "Table of contents card settings",
			title: "Title",
			minDepth: "Minimum heading depth",
			maxDepth: "Maximum heading depth",
			redirect: "Enable redirect to headings",
			showNumbers: "Show heading numbers",
			collapsible: "Make TOC collapsible",
		},
		styles: {
			currentProperties: "Current properties",
			addNewProperty: "Add new property",
			noneCustomProperty: "No custom properties defined for ",
		},
	},
};

export default translations;
