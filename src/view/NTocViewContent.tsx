import { TocItem } from "@src/components/toc-item/TocItem";
import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useHeadingNumbering } from "@src/hooks/useHeadingNumbering";
import usePluginSettings from "@src/hooks/usePluginSettings";
import { useScrollProgress } from "@src/hooks/useScrollProgress";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { useTocCollapse } from "@src/hooks/useTocCollapse";
import { useTocVisibility } from "@src/hooks/useTocVisibility";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useRef } from "react";

interface NTocViewContentProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

export const NTocViewContent: FC<NTocViewContentProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const listItemsRef = useRef<HTMLDivElement>(null);
	const NTocProgressBarRef = useRef<HTMLDivElement>(null);

	// 获取滚动进度
	const scrollProgress = useScrollProgress(currentView);

	// 使用折叠管理 Hook
	const { collapsedSet, toggleCollapsedAt } = useTocCollapse(
		currentView,
		headings,
	);

	// 使用标题编号 Hook
	const generateHeadingNumber = useHeadingNumbering(
		headings,
		settings.render.skipHeading1,
		settings.render.numberingStartIndex,
	);

	// 使用可见性计算 Hook
	const { visibilityMap, shouldShowToc } = useTocVisibility({
		headings,
		collapsedSet,
		skipHeading1: settings.render.skipHeading1,
		showWhenSingleHeading: settings.render.showWhenSingleHeading,
	});

	// 使用自动滚动 Hook
	useActiveHeadingScroll(activeHeadingIndex, listItemsRef);

	// 更新进度条宽度
	useEffect(() => {
		if (NTocProgressBarRef.current && settings.tool.showProgressBar) {
			NTocProgressBarRef.current.style.setProperty(
				"--NToc__toc-progress-width",
				`${scrollProgress}%`,
			);
		}
	}, [scrollProgress, settings.tool.showProgressBar]);

	if (!shouldShowToc) {
		return null;
	}

	return (
		<div className="NToc__view-content-container">
			{settings.tool.showProgressBar && (
				<div
					ref={NTocProgressBarRef}
					className="NToc__toc-progress-bar"
				></div>
			)}
			<div ref={listItemsRef} className="NToc__view-content-items">
				{headings.map((heading, index) => {
					if (!visibilityMap[index]) return null;
					return (
						<TocItem
							key={`toc-item-${index}-${heading.position.start.line}`}
							currentView={currentView}
							heading={heading}
							headingIndex={index}
							headingActualDepth={calculateActualDepth(
								index,
								headings,
							)}
							headingNumber={generateHeadingNumber(index)}
							headingActive={index === activeHeadingIndex}
							headingChildren={hasChildren(index, headings)}
							isCollapsedParent={collapsedSet.has(index)}
							onToggleCollapse={toggleCollapsedAt}
						/>
					);
				})}
			</div>
		</div>
	);
};
