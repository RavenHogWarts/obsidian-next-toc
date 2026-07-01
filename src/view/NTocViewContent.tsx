import { TocItem } from "@src/components/toc-item/TocItem";
import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useDragSort } from "@src/hooks/useDragSort";
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
	visibleHeadingIndices: number[];
}

export const NTocViewContent: FC<NTocViewContentProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
	visibleHeadingIndices,
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
		settings.render.skipHeadingLevels,
		settings.render.numberingStartIndex,
	);

	// 使用可见性计算 Hook
	const { visibilityMap, shouldShowToc } = useTocVisibility({
		headings,
		collapsedSet,
		skipHeadingLevels: settings.render.skipHeadingLevels,
		showWhenSingleHeading: settings.render.showWhenSingleHeading,
	});

	// 使用拖拽排序 Hook
	const {
		dragState,
		dragReadyIndex,
		handlePointerDown,
		handlePointerUp,
		handlePointerMove,
		handlePointerLeave,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleDragEnd,
		consumeLongPressClick,
	} = useDragSort(
		currentView,
		headings,
		settings.render.enableDragSort,
		listItemsRef,
	);

	// 使用自动滚动 Hook
	useActiveHeadingScroll(
		activeHeadingIndex,
		[listItemsRef],
		visibleHeadingIndices,
		dragState.isDragging,
	);

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
							headingVisible={visibleHeadingIndices.includes(
								index,
							)}
							headingChildren={hasChildren(index, headings)}
							isCollapsedParent={collapsedSet.has(index)}
							onToggleCollapse={toggleCollapsedAt}
							enableDrag={settings.render.enableDragSort}
							isDragging={dragState.dragIndex === index}
							isDragOver={dragState.overIndex === index}
							dragOverPosition={
								dragState.overIndex === index
									? dragState.dropPosition
									: null
							}
							isDragReady={dragReadyIndex === index}
							onDragStart={handleDragStart}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onDragEnd={handleDragEnd}
							onPointerDown={handlePointerDown}
							onPointerUp={handlePointerUp}
							onPointerMove={handlePointerMove}
							onPointerLeave={handlePointerLeave}
							consumeLongPressClick={consumeLongPressClick}
						/>
					);
				})}
			</div>
		</div>
	);
};
