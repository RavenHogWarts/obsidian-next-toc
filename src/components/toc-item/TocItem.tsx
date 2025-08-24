import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC } from "react";
import "./TocItem.css";

interface TocItemProps {
	currentView: MarkdownView;
	heading: HeadingCache;
	headingIndex: number;
	headingActualDepth: number;
	headingNumber: string;
	headingActive: boolean;
}

export const TocItem: FC<TocItemProps> = ({
	currentView,
	heading,
	headingIndex,
	headingActualDepth,
	headingNumber,
	headingActive,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	return (
		<div
			className="NToc__toc-item-container"
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			onClick={() => scrollToHeading(currentView, heading)}
		>
			<div className="NToc__toc-item">
				<div className="NToc__toc-item-content">
					{settings.render.useHeadingNumber && (
						<div className="NToc__toc-item-number">
							{headingNumber}
						</div>
					)}
					<div className="NToc__toc-item-text">{heading.heading}</div>
				</div>
			</div>
			<div className="NToc__toc-item-level">H{heading.level}</div>
		</div>
	);
};
