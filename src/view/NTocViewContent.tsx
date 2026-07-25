import { DndContext, closestCenter } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TocItem } from "@src/components/toc-item/TocItem";
import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useHeadingNumbering } from "@src/hooks/useHeadingNumbering";
import usePluginSettings from "@src/hooks/usePluginSettings";
import { useScrollProgress } from "@src/hooks/useScrollProgress";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { useTocCollapse } from "@src/hooks/useTocCollapse";
import { useTocVisibility } from "@src/hooks/useTocVisibility";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import { getStableHeadingKeys } from "@src/utils/getStableHeadingKeys";
import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useMemo, useRef } from "react";
import { useDragSort } from "../hooks/useDragSort";

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
	const { isCollapsed, toggleCollapsedAt } = useTocCollapse(
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
		isCollapsed,
		skipHeadingLevels: settings.render.skipHeadingLevels,
		showWhenSingleHeading: settings.render.showWhenSingleHeading,
	});
	const visibleItems = useMemo(
		() =>
			headings.flatMap((heading, index) =>
				visibilityMap[index] ? [{ heading, index }] : [],
			),
		[headings, visibilityMap],
	);
	// 内容签名 key：与行号解耦，避免编辑 / 排序时误触发进场动画
	const stableKeys = useMemo(
		() => getStableHeadingKeys(headings),
		[headings],
	);
	const scrollRefs = useMemo(() => [listItemsRef], []);

	// 使用拖拽排序 Hook
	const {
		sensors,
		itemIds,
		dragState,
		dragReadyIndex,
		interactionActive,
		getItemId,
		handlePointerDown,
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel,
		consumeLongPressClick,
		onContainerMouseDown,
	} = useDragSort(
		currentView,
		headings,
		settings.render.enableDragSort,
		listItemsRef,
	);
	const visibleItemIds = useMemo(
		() =>
			visibleItems.map(({ index }) => itemIds[index] ?? getItemId(index)),
		[getItemId, itemIds, visibleItems],
	);
	const lastVisibleIndex = visibleItems[visibleItems.length - 1]?.index;
	const showDropTailIndicator =
		dragState.isDragging &&
		lastVisibleIndex !== undefined &&
		dragState.overIndex === lastVisibleIndex &&
		dragState.dropPosition === "after";

	// 使用自动滚动 Hook
	useActiveHeadingScroll(
		activeHeadingIndex,
		scrollRefs,
		visibleHeadingIndices,
		interactionActive,
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
			<DndContext
				autoScroll={settings.render.enableDragSort}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
				sensors={sensors}
			>
				<SortableContext
					items={visibleItemIds}
					strategy={verticalListSortingStrategy}
				>
					<div
						ref={listItemsRef}
						className="NToc__view-content-items"
						onMouseDown={onContainerMouseDown}
					>
						{visibleItems.map(({ heading, index }) => (
							<TocItem
								key={
									stableKeys[index] ??
									`toc-item-${index}-${heading.position.start.line}`
								}
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
								isCollapsedParent={isCollapsed(index)}
								onToggleCollapse={toggleCollapsedAt}
								enableDrag={settings.render.enableDragSort}
								dndId={getItemId(index)}
								isDragging={dragState.dragIndex === index}
								isDragOver={dragState.overIndex === index}
								dragOverPosition={
									dragState.overIndex === index
										? dragState.dropPosition
										: null
								}
								isDragReady={dragReadyIndex === index}
								onPointerDown={handlePointerDown}
								consumeLongPressClick={consumeLongPressClick}
							/>
						))}
						{showDropTailIndicator && (
							<div
								className="NToc__toc-drop-tail-indicator"
								aria-hidden="true"
							/>
						)}
					</div>
				</SortableContext>
			</DndContext>
		</div>
	);
};
