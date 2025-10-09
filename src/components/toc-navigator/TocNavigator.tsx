import usePluginSettings from "@src/hooks/usePluginSettings";
import { useScrollProgress } from "@src/hooks/useScrollProgress";
import useSettingsStore from "@src/hooks/useSettingsStore";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import hasChildren from "@src/utils/hasChildren";
import smoothScroll from "@src/utils/smoothScroll";
import { HeadingCache, MarkdownView } from "obsidian";
import {
	FC,
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
	const [isMouseDragging, setIsMouseDragging] = useState<boolean>(false);
	const [startX, setStartX] = useState<number>(0);
	const [startWidth, setStartWidth] = useState<number>(0);
	const [collapsedSet, setCollapsedSet] = useState<Set<number>>(new Set());

	// 获取滚动进度
	const scrollProgress = useScrollProgress(currentView);

	// 更新进度条宽度
	useEffect(() => {
		if (NTocProgressBarRef.current && settings.tool.showProgress) {
			NTocProgressBarRef.current.style.setProperty(
				"--NToc__toc-progress-width",
				`${scrollProgress}%`
			);
		}
	}, [scrollProgress, settings.tool.showProgress]);

	useEffect(() => {
		if (NTocContainerRef.current) {
			const container = NTocContainerRef.current;
			// 移除所有可能的位置类
			container.classList.remove(
				"NToc__container-left",
				"NToc__container-right"
			);
			// 清除之前位置的样式
			container.style.left = "";
			container.style.right = "";
			// 设置新位置
			container.classList.add(`NToc__container-${settings.toc.position}`);
			container.style[settings.toc.position] = `${settings.toc.offset}px`;
		}
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
	}, [settings.toc.position, settings.toc.offset, settings.toc.show]);

	useEffect(() => {
		if (NTocGroupContentRef.current) {
			const content = NTocGroupContentRef.current;
			if (settings.toc.alwaysExpand || isHovered) {
				content.classList.add("NToc__group-content-expanded");
			} else {
				content.classList.remove("NToc__group-content-expanded");
			}
		}
	}, [settings.toc.alwaysExpand, isHovered]);

	useEffect(() => {
		if (activeHeadingIndex !== -1) {
			const tocItems = NTocGroupTocItemsRef.current;
			const indicator = NTocGroupIndicatorsRef.current;

			if (tocItems) {
				const activeHeadingEl = tocItems.querySelector(
					`[data-index="${activeHeadingIndex}"]`
				) as HTMLElement;
				if (activeHeadingEl) {
					smoothScroll(tocItems, activeHeadingEl);
				}
			}

			if (indicator) {
				const activeIndicatorEl = indicator.querySelector(
					`[data-index="${activeHeadingIndex}"]`
				) as HTMLElement;
				if (activeIndicatorEl) {
					smoothScroll(indicator, activeIndicatorEl);
				}
			}
		}
	}, [activeHeadingIndex]);

	const handleMouseDragStart = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsMouseDragging(true);
			setStartX(e.clientX);
			setStartWidth(settings.toc.width);
		},
		[settings.toc.width]
	);

	const handleMouseDrag = useCallback(
		(e: globalThis.MouseEvent) => {
			if (!isMouseDragging || !NTocGroupTocItemsRef.current) {
				return;
			}

			const delta = e.clientX - startX;
			const widthDelta =
				settings.toc.position === "left" ? delta : -delta;
			const newWidth = startWidth + widthDelta;

			NTocGroupTocItemsRef.current.style.width = `${newWidth}px`;
		},
		[
			isMouseDragging,
			startX,
			startWidth,
			settings.toc.position,
			NTocGroupTocItemsRef,
		]
	);

	const handleMouseDragEnd = useCallback(() => {
		if (!isMouseDragging) {
			return;
		}

		setIsMouseDragging(false);

		if (NTocGroupTocItemsRef.current) {
			const newWidth = NTocGroupTocItemsRef.current.offsetWidth;
			settingsStore.updateSettingByPath("toc.width", newWidth);
		}
	}, [isMouseDragging, NTocGroupTocItemsRef, settings, settingsStore]);

	useEffect(() => {
		if (isMouseDragging) {
			currentView.contentEl.addEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.addEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		}

		return () => {
			currentView.contentEl.removeEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.removeEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		};
	}, [isMouseDragging, currentView, handleMouseDrag, handleMouseDragEnd]);

	const generateHeadingNumber = useCallback(
		(index: number): string => {
			if (settings.render.skipHeading1 && headings[index].level === 1) {
				return "";
			}

			const numberStack: number[] = [];
			let prevLevel = 0;

			for (let i = 0; i <= index; i++) {
				const { level } = headings[i];

				// 跳过 h1（如果配置了跳过）
				if (settings.render.skipHeading1 && level === 1) {
					continue;
				}

				if (level > prevLevel) {
					// 新的更深层级，补 1
					numberStack.push(1);
				} else if (level === prevLevel) {
					// 同级，递增
					numberStack[numberStack.length - 1]++;
				} else {
					// 回到上层，弹出多余层级，递增
					const diff = prevLevel - level;
					for (let d = 0; d < diff; d++) {
						numberStack.pop();
					}
					numberStack[numberStack.length - 1]++;
				}
				prevLevel = level;
			}

			return numberStack.join(".") + ".";
		},
		[headings, settings.render.skipHeading1]
	);

	useEffect(() => {
		// 当视图或标题列表变化时，重置折叠状态
		setCollapsedSet(new Set());
	}, [currentView, headings]);

	const toggleCollapsedAt = useCallback((index: number) => {
		setCollapsedSet((prev) => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	}, []);

	const onCollapseAll = useCallback(() => {
		setCollapsedSet(
			new Set(
				headings
					.map((_, index) => index)
					.filter((index) => hasChildren(index, headings))
			)
		);
	}, [headings]);

	const onExpandAll = useCallback(() => {
		setCollapsedSet(new Set());
	}, []);

	const visibilityMap = useMemo(() => {
		const result: boolean[] = new Array(headings.length).fill(true);
		const collapsedLevels: number[] = [];
		for (let i = 0; i < headings.length; i++) {
			const level = headings[i].level;
			// 离开较深的折叠子树：弹出所有 >= 当前层级的折叠层级
			while (
				collapsedLevels.length > 0 &&
				level <= collapsedLevels[collapsedLevels.length - 1]
			) {
				collapsedLevels.pop();
			}
			// 如果仍存在折叠祖先，则当前项不可见
			result[i] = collapsedLevels.length === 0;
			// 若当前项为折叠父节点，则把其层级压栈，影响其后代
			if (collapsedSet.has(i)) {
				collapsedLevels.push(level);
			}
		}
		return result;
	}, [headings, collapsedSet]);

	const shouldShowToc = useMemo(() => {
		if (settings.render.skipHeading1) {
			const hasOnlyH1 = headings.every((heading) => heading.level === 1);
			return !hasOnlyH1;
		}

		return headings.length > 0;
	}, [headings, settings.render.skipHeading1]);

	// 当 TOC 显示状态变化时重新应用宽度样式
	useEffect(() => {
		if (NTocGroupTocItemsRef.current && shouldShowToc) {
			NTocGroupTocItemsRef.current.style.width = `${settings.toc.width}px`;
		}
	}, [shouldShowToc, settings.toc.width]);

	return (
		<div ref={NTocContainerRef} className="NToc__container">
			{settings.tool.useToolbar && (
				<TocReturnTools currentView={currentView} headings={headings} />
			)}
			<div
				ref={NTocGroupRef}
				className="NToc__group"
				onMouseEnter={() =>
					settings.toc.show &&
					!settings.toc.alwaysExpand &&
					setIsHovered(true)
				}
				onMouseLeave={() =>
					settings.toc.show &&
					!settings.toc.alwaysExpand &&
					setIsHovered(false)
				}
			>
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
									headings
								)}
								headingActive={index === activeHeadingIndex}
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
							{settings.tool.showProgress && (
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
											headings
										)}
										headingNumber={generateHeadingNumber(
											index
										)}
										headingActive={
											index === activeHeadingIndex
										}
										headingChildren={hasChildren(
											index,
											headings
										)}
										isCollapsedParent={collapsedSet.has(
											index
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
