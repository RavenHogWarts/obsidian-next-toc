import type { BaseTranslation } from "../i18n-types";

const en = {
	commands: {
		openTocView: "Open toc view",
		returnToCursor: "Return to cursor",
		scrollToTop: "Scroll to top",
		scrollToBottom: "Scroll to bottom",
		navigatePreviousHeading: "Navigate to previous heading",
		navigateNextHeading: "Navigate to next heading",
		tocExpand: "Expand/collapse toc",
		insertReadingTimeCard: "Insert reading time card",
		insertTableOfContentsCard: "Insert table of contents card",
		addCurrentFileToHideHeadingNumberBlacklist:
			"Toggle current file in heading number blacklist",
		addCurrentFolderToHideHeadingNumberBlacklist:
			"Toggle current folder in heading number blacklist",
	},
	notices: {
		alreadyCovered: "Already covered by existing patterns",
		added: "Added",
		addedAndRemovedRedundant:
			"Added and removed {count:number} redundant pattern(s)",
		notInBlacklist: "Not in blacklist",
		removed: "Removed",
		coveredByPattern:
			"Covered by a pattern. Remove the pattern manually if needed",
	},
	view: {
		view_empty:
			"No headings found. Please ensure the current document contains headings, or activate the Markdown document view.",
	},
	settings: {
		toc: {
			name: "Toc",
			show: {
				name: "Toc show",
				desc: "Enable or disable the table of contents feature",
			},
			alwaysExpand: {
				name: "Toc always expand",
				desc: "Enable or disable always expanding the table of contents， you can use the document property `cssclasses` to control show and hide: ",
			},
			width: {
				name: "Toc width",
				desc: "Set the width of the table of contents",
			},
			position: {
				name: "Toc position",
				desc: "Set the position of the table of contents",
				options: {
					left: "Left",
					right: "Right",
				},
			},
			offset: {
				name: "Toc offset",
				desc: "Set the offset of the table of contents",
			},
			indicatorMode: {
				name: "Indicator mode",
				desc: "Set the display mode for TOC indicators when collapsed",
				options: {
					bar: "Bar",
					dot: "Dot",
					hidden: "Hidden",
				},
			},
		},
		render: {
			name: "Render",
			useHeadingNumber: {
				name: "Use heading number",
				desc: "Enable or disable using heading numbers in the table of contents. You can use the document property `cssclasses` to control show and hide (Priority higher than blacklist): ",
			},
			skipHeading1: {
				name: "Skip heading 1",
				desc: "Enable or disable skipping level 1 headings in the table of contents",
			},
			renderMarkdown: {
				name: "Render Markdown syntax",
				desc: "Enable or disable rendering Markdown syntax in the table of contents",
			},
			showWhenSingleHeading: {
				name: "Show when single heading",
				desc: "Enable or disable showing the table of contents when the document has only a single heading",
			},
			hideHeadingNumberBlacklist: {
				name: "Heading number blacklist",
				desc: "Specify files that should hide heading numbers (one path per line). supports wildcards: * (any characters), ? (single character). only works when 'Use heading number' is enabled. example: folder/file.md or *.md",
			},
		},
		tool: {
			name: "Tool",
			headings: {
				returnButtons: "Navigation button group",
			},
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
				desc: "Show the circular reading progress indicator above the toggle button, when the toc is collapsed",
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
			collapsible: "Make toc collapsible",
		},
		styles: {
			currentProperties: "Current properties",
			addNewProperty: "Add new property",
			noneCustomProperty: "No custom properties defined for ",
		},
	},
	tools: {
		pinTOC: "Pin/unpin toc",
		changePosition: "Change toc position",
		expandCollapse: "Expand/collapse toc items",
		leftOffset: "Add offset to the left",
		rightOffset: "Add offset to the right",
		copyTOC: "Copy toc to clipboard",
		returnNavigation: "Return navigation",
		returnToCursor: "To cursor",
		returnToTop: "To top",
		returnToBottom: "To bottom",
		jumpToNextHeading: "Next heading",
		jumpToPrevHeading: "Previous heading",
	},
} satisfies BaseTranslation;

export default en;
