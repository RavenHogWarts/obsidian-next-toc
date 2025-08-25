import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { ChevronDown, ChevronRight } from "lucide-react";
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
	headingChildren: boolean;
	isCollapsedParent: boolean;
	onToggleCollapse: (index: number) => void;
}

export const TocItem: FC<TocItemProps> = ({
	currentView,
	heading,
	headingIndex,
	headingActualDepth,
	headingNumber,
	headingActive,
	headingChildren,
	isCollapsedParent,
	onToggleCollapse,
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
				{headingChildren && (
					<button
						className="NToc__toc-item-collapse clickable-icon"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCollapse(headingIndex);
						}}
						aria-expanded={!isCollapsedParent}
					>
						<i className="NToc__toc-item-collapse-icon">
							{isCollapsedParent ? (
								<ChevronRight size={16} />
							) : (
								<ChevronDown size={16} />
							)}
						</i>
					</button>
				)}
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
