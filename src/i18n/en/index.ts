import type { BaseTranslation } from "../i18n-types";

const en = {
	commands: {
		enableDisableToc: "Enable/disable toc",
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
		reorderSuccess: "Moved「{heading}」",
		reorderFailedNoFile: "Move failed: file not found",
		reorderFailedInvalidIndex: "Move failed: invalid heading index",
		reorderFailedSamePosition:
			"Move failed: source and target are the same",
		reorderFailedTargetIsDescendant:
			"Move failed: cannot move heading into its own subtree",
		reorderFailedNoHeadings: "Move failed: document has no headings",
		reorderFailedEditor: "Move failed: editor operation failed",
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
			renderInAllVisibleViews: {
				name: "Render TOC in all visible views",
				desc: "When enabled, the inline table of contents will be displayed in all currently visible Markdown views; when disabled, it will only be shown in the active view. Disabled by default to avoid additional rendering overhead.",
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
			offsetY: {
				name: "Toc vertical offset",
				desc: "Set the vertical offset of the table of contents",
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
			numberingStartIndex: {
				name: "Heading number start index",
				desc: "Choose whether to start numbering from 0 or 1.",
				options: {
					zero: "0",
					one: "1",
				},
			},
			skipHeadingLevels: {
				name: "Skip heading levels",
				desc: "Select which heading levels to skip in the table of contents",
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
			enableDragSort: {
				name: "Enable drag sort",
				desc: "Allow reordering document sections by dragging headings in the table of contents",
			},
		},
		tool: {
			name: "Tool",
			headings: {
				returnButtons: "Document navigation buttons",
				toolbarButtons: "TOC toolbar buttons",
			},
			useToolbar: {
				name: "Use toolbar",
				desc: "Show the toolbar with buttons to control the table of contents (pin, position, expand, offset, copy)",
			},
			toolbarAlwaysShow: {
				name: "Always show TOC toolbar",
				desc: "When the TOC is expanded, the TOC toolbar stays visible without hovering",
			},
			showProgressBar: {
				name: "Use progress bar",
				desc: "Show the reading progress bar above the table of contents",
			},
			showProgressCircle: {
				name: "Use progress circle",
				desc: "Show the circular reading progress indicator above the toggle button, when the toc is collapsed",
			},
			toolbarButtons: {
				pinTOC: {
					name: "Pin/Unpin TOC",
					desc: "Toggle whether the TOC stays expanded",
				},
				changePosition: {
					name: "Change position",
					desc: "Switch the TOC between left and right",
				},
				expandCollapse: {
					name: "Expand/Collapse items",
					desc: "Expand or collapse all TOC items at once",
				},
				leftOffset: {
					name: "Left offset",
					desc: "Move the TOC one step to the left",
				},
				rightOffset: {
					name: "Right offset",
					desc: "Move the TOC one step to the right",
				},
				upOffset: {
					name: "Move up",
					desc: "Move the TOC one step up",
				},
				downOffset: {
					name: "Move down",
					desc: "Move the TOC one step down",
				},
				copyTOC: {
					name: "Copy TOC",
					desc: "Copy the table of contents to the clipboard",
				},
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
		upOffset: "Move up",
		downOffset: "Move down",
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
