import { DndContext, closestCenter } from "@dnd-kit/core";
import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useDragSort } from "@src/hooks/useDragSort";
import { useHeadingNumbering } from "@src/hooks/useHeadingNumbering";
import usePluginSettings from "@src/hooks/usePluginSettings";
import { useResizableToc } from "@src/hooks/useResizableToc";
import { useScrollProgress } from "@src/hooks/useScrollProgress";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { useTocCollapse } from "@src/hooks/useTocCollapse";
import { useTocExpansion } from "@src/hooks/useTocExpansion";
import { useTocVisibility } from "@src/hooks/useTocVisibility";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import { getStableHeadingKeys } from "@src/utils/getStableHeadingKeys";
import hasChildren from "@src/utils/hasChildren";
import smoothScroll from "@src/utils/smoothScroll";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProgressCircle } from "../progress-circle/ProgressCircle";
import { TocIndicator } from "../toc-indicator/TocIndicator";
import { TocItem } from "../toc-item/TocItem";
import { TocReturnTools } from "../toc-return-tools/TocReturnTools";
import { TocToolbar } from "../toc-toolbar/TocToolbar";
import "./TocNavigator.css";

interface TocNavigatorProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
	visibleHeadingIndices?: number[];
}

export const TocNavigator: FC<TocNavigatorProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
	visibleHeadingIndices = [],
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	const NTocContainerRef = useRef<HTMLDivElement>(null);
	const NTocGroupRef = useRef<HTMLDivElement>(null);
	const NTocGroupIndicatorsRef = useRef<HTMLDivElement>(null);
	const NTocGroupContentRef = useRef<HTMLDivElement>(null);
	const NTocGroupTocItemsRef = useRef<HTMLDivElement>(null);
	const NTocProgressBarRef = useRef<HTMLDivElement>(null);

	const [isHovered, setIsHovered] = useState<boolean>(false);

	const scrollProgress = useScrollProgress(currentView);

	const shouldExpandToc = useTocExpansion({
		currentView,
		alwaysExpand: settings.toc.alwaysExpand,
	});

	const {
		collapsedSet,
		isCollapsed,
		toggleCollapsedAt,
		onCollapseAll,
		onExpandAll,
	} = useTocCollapse(currentView, headings);

	const generateHeadingNumber = useHeadingNumbering(
		headings,
		settings.render.skipHeadingLevels,
		settings.render.numberingStartIndex,
	);

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

	const { handleMouseDragStart, isMouseDragging } = useResizableToc({
		currentView,
		tocItemsRef: NTocGroupTocItemsRef,
		tocWidth: settings.toc.width,
		tocPosition: settings.toc.position,
		onWidthChange: (width) => {
			void settingsStore.updateSettingByPath("toc.width", width);
		},
	});

	const {
		sensors,
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
		NTocGroupTocItemsRef,
	);

	const scrollRefs = useMemo(
		() => [NTocGroupTocItemsRef, NTocGroupIndicatorsRef],
		[],
	);

	useActiveHeadingScroll(
		activeHeadingIndex,
		scrollRefs,
		visibleHeadingIndices,
		interactionActive,
	);

	// 手动将目录列表滚动到当前活动标题（即使索引未变化也强制滚动）
	const handleLocateActiveHeading = useCallback(() => {
		const container = NTocGroupTocItemsRef.current;
		if (!container) return;
		if (activeHeadingIndex < 0 || activeHeadingIndex >= headings.length)
			return;
		const activeHeadingEl = container.querySelector(
			`[data-index="${activeHeadingIndex}"]`,
		);
		if (activeHeadingEl) {
			smoothScroll(container, activeHeadingEl);
		}
	}, [activeHeadingIndex, headings.length]);

	useEffect(() => {
		if (NTocContainerRef.current) {
			const container = NTocContainerRef.current;
			container.style.setProperty(
				"--NToc__toc-offset",
				`${settings.toc.offset}px`,
			);
			container.style.setProperty(
				"--NToc__toc-offset-y",
				`${settings.toc.offsetY}%`,
			);
		}
	}, [settings.toc.offset, settings.toc.offsetY]);

	useEffect(() => {
		if (NTocProgressBarRef.current && settings.tool.showProgressBar) {
			NTocProgressBarRef.current.style.setProperty(
				"--NToc__toc-progress-width",
				`${scrollProgress}%`,
			);
		}
	}, [scrollProgress, settings.tool.showProgressBar]);

	useEffect(() => {
		if (NTocGroupRef.current) {
			const group = NTocGroupRef.current;
			if (settings.toc.show === false || !shouldShowToc) {
				group.classList.add("NToc__group-hidden");
				setIsHovered(false);
			} else {
				group.classList.remove("NToc__group-hidden");
			}
		}
	}, [settings.toc.show, shouldShowToc]);

	useEffect(() => {
		if (NTocGroupTocItemsRef.current && shouldShowToc) {
			NTocGroupTocItemsRef.current.style.width = `${settings.toc.width}px`;
		}
	}, [shouldShowToc, settings.toc.width]);

	const normalizedDrop = useMemo(() => {
		if (dragState.overIndex === null || dragState.dropPosition === null) {
			return {
				overIndex: null as number | null,
				position: null as "before" | "after" | null,
			};
		}
		// 将 "before" 转为上一项的 "after"，确保相邻项之间只显示一条指示线
		if (dragState.dropPosition === "before" && dragState.overIndex > 0) {
			return {
				overIndex: dragState.overIndex - 1,
				position: "after" as const,
			};
		}
		return {
			overIndex: dragState.overIndex,
			position: dragState.dropPosition,
		};
	}, [dragState.overIndex, dragState.dropPosition]);

	return (
		<div
			ref={NTocContainerRef}
			className={`NToc__container NToc__container-${settings.toc.position}${settings.tool.toolbarAlwaysShow ? " NToc__container-toolbar-always" : ""}`}
		>
			{settings.tool.useToolbar && (
				<TocReturnTools currentView={currentView} headings={headings} />
			)}
			<div
				ref={NTocGroupRef}
				className={`NToc__group ${shouldExpandToc || isHovered ? "NToc__group-content-expanded" : ""}`}
				onMouseEnter={() =>
					settings.toc.show && !shouldExpandToc && setIsHovered(true)
				}
				onMouseLeave={() =>
					settings.toc.show && !shouldExpandToc && setIsHovered(false)
				}
			>
				{settings.tool.showProgressCircle && (
					<div className="NToc__progress-circle-container">
						<ProgressCircle
							percentage={scrollProgress}
							showText={true}
						/>
					</div>
				)}
				<div
					ref={NTocGroupIndicatorsRef}
					className={`NToc__group-indicators NToc__group-indicators-${settings.toc.indicatorMode}`}
				>
					{headings.map((heading, index) => {
						if (!visibilityMap[index]) return null;
						return (
							<TocIndicator
								key={`indicator-${index}-${heading.position.start.line}`}
								heading={heading}
								headingIndex={index}
								headingActualDepth={calculateActualDepth(
									index,
									headings,
								)}
								headingActive={index === activeHeadingIndex}
								indicatorMode={settings.toc.indicatorMode}
							/>
						);
					})}
				</div>

				<div
					ref={NTocGroupContentRef}
					className={`NToc__group-content${settings.tool.toolbarAlwaysShow ? " NToc__group-content-toolbar-always" : ""}${shouldExpandToc || isHovered ? " NToc__group-content-expanded" : ""}`}
				>
					{shouldShowToc && (
						<TocToolbar
							headings={headings}
							onCollapseAll={onCollapseAll}
							onExpandAll={onExpandAll}
							hasAnyCollapsed={collapsedSet.size > 0}
							onLocateActiveHeading={handleLocateActiveHeading}
							canLocateActiveHeading={
								activeHeadingIndex >= 0 &&
								activeHeadingIndex < headings.length
							}
						/>
					)}

					{shouldShowToc && (
						<div
							ref={NTocGroupTocItemsRef}
							className={`NToc__toc-items ${isMouseDragging ? "NToc__toc-items-resizing" : ""} ${dragState.isDragging ? "NToc__toc-items--dragging" : ""}`}
							onMouseDown={onContainerMouseDown}
						>
							<div
								className="NToc__group-resize"
								onMouseDown={handleMouseDragStart}
								aria-hidden="true"
							/>
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
										headingNumber={generateHeadingNumber(
											index,
										)}
										headingActive={
											index === activeHeadingIndex
										}
										headingVisible={visibleHeadingIndices.includes(
											index,
										)}
										headingChildren={hasChildren(
											index,
											headings,
										)}
										isCollapsedParent={isCollapsed(index)}
										onToggleCollapse={toggleCollapsedAt}
										enableDrag={
											settings.render.enableDragSort
										}
										dndId={getItemId(index)}
										isDragging={
											dragState.dragIndex === index
										}
										isDragOver={
											normalizedDrop.overIndex === index
										}
										dragOverPosition={
											normalizedDrop.overIndex === index
												? normalizedDrop.position
												: null
										}
										isDragReady={dragReadyIndex === index}
										onPointerDown={handlePointerDown}
										consumeLongPressClick={
											consumeLongPressClick
										}
									/>
								))}
							</DndContext>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
