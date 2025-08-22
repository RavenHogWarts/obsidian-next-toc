import useSettings from "@src/hooks/useSettings";
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
	onHeadingClick: (heading: HeadingCache) => void;
}

export const TocItem: FC<TocItemProps> = ({
	currentView,
	heading,
	headingIndex,
	headingActualDepth,
	headingNumber,
	headingActive,
	onHeadingClick,
}) => {
	const settings = useSettings();

	return (
		<div
			className="NToc__toc-item-container"
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			onClick={() => onHeadingClick(heading)}
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
