import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { useCallback, useState } from "react";

/**
 * 生成标题的折叠键（基于内容签名，与数组下标解耦）。
 * 使折叠态在标题重排 / headings 引用变化时保持稳定，
 * 修复「拖拽排序后自动展开」的问题。
 */
export const getCollapseKey = (heading: HeadingCache): string =>
	`${heading.level}::${heading.heading}`;

/**
 * TOC 折叠/展开状态管理的 Hook
 *
 * 折叠态以 `${level}::${heading}` 内容签名作为键，而非数组下标。
 * 这样在拖拽排序、editor-change 热刷新、metadataCache 异步修正等
 * 导致 headings 引用变化的场景下，折叠状态都能保持稳定。
 *
 * @param currentView 当前视图（保留以兼容调用方，内部未使用）
 * @param headings 标题列表
 */
export const useTocCollapse = (
	currentView: MarkdownView,
	headings: HeadingCache[],
) => {
	const [collapsedSet, setCollapsedSet] = useState<Set<string>>(new Set());

	const isCollapsed = useCallback(
		(index: number): boolean => {
			const heading = headings[index];
			return heading ? collapsedSet.has(getCollapseKey(heading)) : false;
		},
		[headings, collapsedSet],
	);

	const toggleCollapsedAt = useCallback(
		(index: number) => {
			const heading = headings[index];
			if (!heading) return;
			const key = getCollapseKey(heading);
			setCollapsedSet((prev) => {
				const next = new Set(prev);
				if (next.has(key)) {
					next.delete(key);
				} else {
					next.add(key);
				}
				return next;
			});
		},
		[headings],
	);

	const onCollapseAll = useCallback(() => {
		setCollapsedSet(
			new Set(
				headings
					.filter((_, index) => hasChildren(index, headings))
					.map((heading) => getCollapseKey(heading)),
			),
		);
	}, [headings]);

	const onExpandAll = useCallback(() => {
		setCollapsedSet(new Set());
	}, []);

	return {
		collapsedSet,
		isCollapsed,
		toggleCollapsedAt,
		onCollapseAll,
		onExpandAll,
	};
};
