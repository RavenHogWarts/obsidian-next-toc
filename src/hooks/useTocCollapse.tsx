import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { useCallback, useEffect, useState } from "react";

/**
 * TOC 折叠/展开状态管理的 Hook
 * @param currentView 当前视图
 * @param headings 标题列表
 * @returns 折叠状态集合、切换折叠函数、折叠全部函数、展开全部函数
 */
export const useTocCollapse = (
	currentView: MarkdownView,
	headings: HeadingCache[]
) => {
	const [collapsedSet, setCollapsedSet] = useState<Set<number>>(new Set());

	// 当视图或标题列表变化时，重置折叠状态
	useEffect(() => {
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

	return {
		collapsedSet,
		toggleCollapsedAt,
		onCollapseAll,
		onExpandAll,
	};
};
