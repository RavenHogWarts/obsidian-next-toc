import { MarkdownView } from "obsidian";
import { useEffect, useState } from "react";

interface UseTocExpansionProps {
	currentView: MarkdownView;
	alwaysExpand: boolean;
}

/**
 * Hook to determine if TOC should be expanded based on:
 * 1. Frontmatter properties (pin-ntoc, unpin-ntoc)
 * 2. Global alwaysExpand setting
 *
 * Priority: Frontmatter > alwaysExpand setting
 */
export const useTocExpansion = ({
	currentView,
	alwaysExpand,
}: UseTocExpansionProps): boolean => {
	const [shouldExpand, setShouldExpand] = useState<boolean>(alwaysExpand);

	useEffect(() => {
		const updateExpansionState = () => {
			if (!currentView?.file) {
				setShouldExpand(alwaysExpand);
				return;
			}

			// Get metadata cache
			const metadata = currentView.app.metadataCache.getFileCache(
				currentView.file
			);
			const frontmatter = metadata?.frontmatter;

			// Check for frontmatter cssclasses property
			if (frontmatter) {
				// Get cssclasses - can be array or string
				const cssclasses =
					frontmatter.cssclasses || frontmatter.cssclass;
				let classArray: string[] = [];

				if (typeof cssclasses === "string") {
					classArray = [cssclasses];
				} else if (Array.isArray(cssclasses)) {
					classArray = cssclasses;
				}

				// pin-ntoc takes precedence - force expand
				if (classArray.includes("pin-ntoc")) {
					setShouldExpand(true);
					return;
				}

				// unpin-ntoc takes precedence - force collapse
				if (classArray.includes("unpin-ntoc")) {
					setShouldExpand(false);
					return;
				}
			}

			// Fall back to global setting
			setShouldExpand(alwaysExpand);
		};

		updateExpansionState();

		// Listen for metadata changes
		const metadataChangeHandler = currentView.app.metadataCache.on(
			"changed",
			(file) => {
				if (file === currentView.file) {
					updateExpansionState();
				}
			}
		);

		return () => {
			currentView.app.metadataCache.offref(metadataChangeHandler);
		};
	}, [currentView, alwaysExpand]);

	return shouldExpand;
};
