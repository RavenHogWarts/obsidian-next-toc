import { MarkdownView } from "obsidian";
import { useEffect, useState } from "react";

interface UseTocExpansionProps {
	currentView: MarkdownView;
	alwaysExpand: boolean;
}

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

			const metadata = currentView.app.metadataCache.getFileCache(
				currentView.file
			);
			const frontmatter = metadata?.frontmatter;

			if (frontmatter) {
				const cssclasses =
					frontmatter.cssclasses || frontmatter.cssclass;
				let classArray: string[] = [];

				if (typeof cssclasses === "string") {
					classArray = [cssclasses];
				} else if (Array.isArray(cssclasses)) {
					classArray = cssclasses;
				}

				if (classArray.includes("pin-ntoc")) {
					setShouldExpand(true);
					return;
				}

				if (classArray.includes("unpin-ntoc")) {
					setShouldExpand(false);
					return;
				}
			}

			setShouldExpand(alwaysExpand);
		};

		updateExpansionState();

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
