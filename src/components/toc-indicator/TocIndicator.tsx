import { HeadingCache } from "obsidian";
import { FC } from "react";
import "./TocIndicator.css";

interface TocIndicatorProps {
	heading: HeadingCache;
	headingIndex: number;
	headingActualDepth: number;
	headingActive: boolean;
}

export const TocIndicator: FC<TocIndicatorProps> = ({
	heading,
	headingIndex,
	headingActualDepth,
	headingActive,
}) => {
	return (
		<div
			className={"NToc__group-indicator-container"}
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
		>
			<span className="NToc__group-indicator" />
		</div>
	);
};
