import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useHeadingNumbering } from "@src/hooks/useHeadingNumbering";
import usePluginSettings from "@src/hooks/usePluginSettings";
import { useResizableToc } from "@src/hooks/useResizableToc";
import { useScrollProgress } from "@src/hooks/useScrollProgress";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { useTocCollapse } from "@src/hooks/useTocCollapse";
import { useTocExpansion } from "@src/hooks/useTocExpansion";
import { useTocVisibility } from "@src/hooks/useTocVisibility";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useRef, useState } from "react";
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
}

export const TocNavigator: FC<TocNavigatorProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
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

	// 获取滚动进度
	const scrollProgress = useScrollProgress(currentView);

	// 使用 TOC 展开状态 Hook（结合 frontmatter 和 alwaysExpand）
	const shouldExpandToc = useTocExpansion({
		currentView,
		alwaysExpand: settings.toc.alwaysExpand,
	});

	// 使用折叠管理 Hook
	const { collapsedSet, toggleCollapsedAt, onCollapseAll, onExpandAll } =
		useTocCollapse(currentView, headings);

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
	useActiveHeadingScroll(
		activeHeadingIndex,
		NTocGroupTocItemsRef,
		NTocGroupIndicatorsRef,
	);

	// 使用可调整大小 Hook
	const { handleMouseDragStart } = useResizableToc({
		currentView,
		tocItemsRef: NTocGroupTocItemsRef,
		tocWidth: settings.toc.width,
		tocPosition: settings.toc.position,
		onWidthChange: (width) => {
			void settingsStore.updateSettingByPath("toc.width", width);
		},
	});

	// 使用useEffect来设置CSS变量，避免内联样式
	useEffect(() => {
		if (NTocContainerRef.current) {
			const container = NTocContainerRef.current;
			container.style.setProperty(
				"--NToc__toc-offset",
				`${settings.toc.offset}px`,
			);
		}
	}, [settings.toc.offset]);

	// 更新进度条宽度
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
			if (settings.toc.show === false) {
				group.classList.add("NToc__group-hidden");
				// 当隐藏TOC时，重置悬停状态
				setIsHovered(false);
			} else {
				group.classList.remove("NToc__group-hidden");
			}
		}
	}, [settings.toc.show]);

	useEffect(() => {
		if (NTocGroupContentRef.current) {
			const content = NTocGroupContentRef.current;
			if (shouldExpandToc || isHovered) {
				content.classList.add("NToc__group-content-expanded");
			} else {
				content.classList.remove("NToc__group-content-expanded");
			}
		}
	}, [shouldExpandToc, isHovered]);

	// 当 TOC 显示状态变化时重新应用宽度样式
	useEffect(() => {
		if (NTocGroupTocItemsRef.current && shouldShowToc) {
			NTocGroupTocItemsRef.current.style.width = `${settings.toc.width}px`;
		}
	}, [shouldShowToc, settings.toc.width]);

	return (
		<div
			ref={NTocContainerRef}
			className={`NToc__container NToc__container-${settings.toc.position}`}
		>
			{settings.tool.useToolbar && (
				<TocReturnTools currentView={currentView} headings={headings} />
			)}
			<div
				ref={NTocGroupRef}
				className="NToc__group"
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
					className="NToc__group-indicators"
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

				<div ref={NTocGroupContentRef} className="NToc__group-content">
					{shouldShowToc && (
						<TocToolbar
							headings={headings}
							onCollapseAll={onCollapseAll}
							onExpandAll={onExpandAll}
							hasAnyCollapsed={collapsedSet.size > 0}
						/>
					)}

					{shouldShowToc && (
						<div
							ref={NTocGroupTocItemsRef}
							className="NToc__toc-items"
						>
							<div
								className="NToc__group-resize"
								onMouseDown={handleMouseDragStart}
							/>
							{settings.tool.showProgressBar && (
								<div
									ref={NTocProgressBarRef}
									className="NToc__toc-progress-bar"
								></div>
							)}
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
										headingNumber={generateHeadingNumber(
											index,
										)}
										headingActive={
											index === activeHeadingIndex
										}
										headingChildren={hasChildren(
											index,
											headings,
										)}
										isCollapsedParent={collapsedSet.has(
											index,
										)}
										onToggleCollapse={toggleCollapsedAt}
									/>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
