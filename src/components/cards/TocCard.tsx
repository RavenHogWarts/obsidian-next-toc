import { TocCardConfig } from "@src/types/cards";
import hasChildren from "@src/utils/hasChildren";
import scrollToHeading from "@src/utils/scrollToHeading";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HeadingCache, MarkdownView } from "obsidian";
import { useCallback, useEffect, useRef, useState } from "react";

interface TocCardProps {
	config: TocCardConfig;
	headings: HeadingCache[] | undefined;
	currentView?: MarkdownView | null;
}

export const TocCard: React.FC<TocCardProps> = ({
	config,
	headings,
	currentView,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const itemTextRefs = useRef<HTMLDivElement[]>([]);

	const [filteredHeadings, setFilteredHeadings] = useState<HeadingCache[]>(
		[]
	);
	const [collapsedSet, setCollapsedSet] = useState<Set<number>>(new Set());

	useEffect(() => {
		if (!headings) {
			setFilteredHeadings([]);
			return;
		}

		const minDepth = config.minDepth ?? 1;
		const maxDepth = config.maxDepth ?? 6;
		const filtered = headings.filter((h) => {
			return h.level <= maxDepth && h.level >= minDepth;
		});
		setFilteredHeadings(filtered);

		// 清理 refs 数组，移除多余的引用
		itemTextRefs.current = itemTextRefs.current.slice(0, filtered.length);

		// 重置折叠状态
		setCollapsedSet(new Set());
	}, [headings, config.maxDepth, config.minDepth]);

	const generateHeadingNumber = useCallback(
		(index: number): string => {
			const numberStack: number[] = [];
			let prevLevel = 0;

			for (let i = 0; i <= index; i++) {
				const { level } = filteredHeadings[i];

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
		[filteredHeadings]
	);

	const toggleCollapse = useCallback((index: number) => {
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

	const isItemHidden = useCallback(
		(index: number): boolean => {
			if (!config.collapsible) return false;

			const currentLevel = filteredHeadings[index].level;

			// 向前查找是否有被折叠的父级
			for (let i = index - 1; i >= 0; i--) {
				const parentLevel = filteredHeadings[i].level;
				if (parentLevel < currentLevel) {
					if (collapsedSet.has(i)) {
						return true;
					}
				}
			}
			return false;
		},
		[filteredHeadings, collapsedSet, config.collapsible]
	);

	const handelClick = useCallback(
		(e: React.MouseEvent, heading: HeadingCache) => {
			e.preventDefault();
			if (currentView && config.redirect) {
				scrollToHeading(currentView, heading);
			}
		},
		[currentView, config.redirect]
	);

	useEffect(() => {
		if (config.containerStyle && containerRef.current) {
			Object.entries(config.containerStyle).forEach(([key, value]) => {
				containerRef.current?.style.setProperty(
					key,
					value != null ? String(value) : ""
				);
			});
		}
	}, [config.containerStyle]);

	useEffect(() => {
		if (config.titleStyle && titleRef.current) {
			Object.entries(config.titleStyle).forEach(([key, value]) => {
				titleRef.current?.style.setProperty(
					key,
					value != null ? String(value) : ""
				);
			});
		}
	}, [config.titleStyle]);

	useEffect(() => {
		itemTextRefs.current.forEach((element) => {
			if (element) {
				element.classList.remove("NToc__clickable-btn");
				if (config.redirect) {
					element.classList.add("NToc__clickable-btn");
				}
			}
		});
	}, [config.redirect, filteredHeadings.length]);

	return (
		<div ref={containerRef} className="NToc__inline-card-toc">
			{config.title && (
				<div ref={titleRef} className="NToc__inline-card-toc-title">
					{config.title}
				</div>
			)}

			<div className="NToc__inline-card-toc-content">
				{filteredHeadings.length === 0 && (
					<div className="NToc__inline-card-toc-empty">
						No headings found.
					</div>
				)}
				{filteredHeadings.map((heading, index) => {
					const hasChildHeadings = hasChildren(
						index,
						filteredHeadings
					);
					const isCollapsed = collapsedSet.has(index);
					const isHidden = isItemHidden(index);

					if (isHidden) return null;

					return (
						<div
							key={index}
							className="NToc__inline-card-toc-item"
							data-level={heading.level}
						>
							{config.collapsible && hasChildHeadings && (
								<button
									className="NToc__inline-card-toc-item-collapse clickable-icon"
									onClick={(e) => {
										e.stopPropagation();
										toggleCollapse(index);
									}}
									aria-expanded={!isCollapsed}
								>
									<i className="NToc__inline-card-toc-item-collapse-icon">
										{isCollapsed ? (
											<ChevronRight size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</i>
								</button>
							)}
							<div className="NToc__inline-card-toc-item-content">
								{config.showNumbers && (
									<div className="NToc__inline-card-toc-item-number">
										{generateHeadingNumber(index)}
									</div>
								)}
								<div
									ref={(el) => {
										if (el) {
											itemTextRefs.current[index] = el;
										}
									}}
									className="NToc__inline-card-toc-item-text"
									onClick={(e) => handelClick(e, heading)}
								>
									{heading.heading}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
