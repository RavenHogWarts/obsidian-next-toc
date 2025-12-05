import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import hasChildren from "@src/utils/hasChildren";
import smoothScroll from "@src/utils/smoothScroll";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TocItem } from "../toc-item/TocItem";
import { TocToolbar } from "../toc-toolbar/TocToolbar";
import "./TocList.css";

interface TocListProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

export const TocList: FC<TocListProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const [collapsedSet, setCollapsedSet] = useState<Set<number>>(new Set());
	const listItemsRef = useRef<HTMLDivElement>(null);

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

	// 同步滚动：当活跃标题变化时，自动滚动到该标题
	useEffect(() => {
		if (activeHeadingIndex !== -1 && listItemsRef.current) {
			const activeHeadingEl = listItemsRef.current.querySelector(
				`[data-index="${activeHeadingIndex}"]`
			) as HTMLElement;
			if (activeHeadingEl) {
				smoothScroll(listItemsRef.current, activeHeadingEl);
			}
		}
	}, [activeHeadingIndex]);

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

			// 如果开启了 skipHeading1 且当前是一级标题，则隐藏
			if (settings.render.skipHeading1 && level === 1) {
				result[i] = false;
				continue;
			}

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
	}, [headings, collapsedSet, settings.render.skipHeading1]);

	const shouldShowToc = useMemo(() => {
		if (settings.render.skipHeading1) {
			const hasOnlyH1 = headings.every((heading) => heading.level === 1);
			if (hasOnlyH1) return false;
		}

		// 如果配置了不在单标题时显示，检查可见标题数量
		if (!settings.render.showWhenSingleHeading) {
			const visibleHeadingsCount = headings.filter((heading, index) => {
				// 如果开启了 skipHeading1，排除 h1
				if (settings.render.skipHeading1 && heading.level === 1) {
					return false;
				}
				return true;
			}).length;

			// 只有一个或没有可见标题时不显示
			if (visibleHeadingsCount <= 1) {
				return false;
			}
		}

		return headings.length > 0;
	}, [
		headings,
		settings.render.skipHeading1,
		settings.render.showWhenSingleHeading,
	]);

	if (!shouldShowToc) {
		return null;
	}

	return (
		<div className="NToc__list-container">
			<TocToolbar
				headings={headings}
				onCollapseAll={onCollapseAll}
				onExpandAll={onExpandAll}
				hasAnyCollapsed={collapsedSet.size > 0}
			/>
			<div ref={listItemsRef} className="NToc__list-items">
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
