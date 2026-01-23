import { NTocIndicatorMode } from "@src/types/types";
import { HeadingCache } from "obsidian";
import { FC } from "react";
import "./TocIndicator.css";

interface TocIndicatorProps {
	heading: HeadingCache;
	headingIndex: number;
	headingActualDepth: number;
	headingActive: boolean;
	indicatorMode: NTocIndicatorMode;
}

export const TocIndicator: FC<TocIndicatorProps> = ({
	heading,
	headingIndex,
	headingActualDepth,
	headingActive,
	indicatorMode,
}) => {
	return (
		<div
			className={`NToc__group-indicator-container NToc__group-indicator-container--${indicatorMode}`}
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			data-mode={indicatorMode}
		>
			{/* 隐藏模式下不渲染 span，但保留容器以触发悬停事件 */}
			{indicatorMode !== "hidden" && (
				<span className="NToc__group-indicator" />
			)}
		</div>
	);
};
