import { HeadingCache } from "obsidian";
import { useMemo } from "react";

interface UseTocVisibilityParams {
	headings: HeadingCache[];
	/**
	 * 判定指定下标标题是否处于折叠态。
	 * 由调用方基于内容签名提供，与下标解耦。
	 */
	isCollapsed: (index: number) => boolean;
	skipHeadingLevels: number[];
	showWhenSingleHeading: boolean;
}

interface UseTocVisibilityReturn {
	/** 完全可见：未跳过、且无折叠祖先 */
	visibilityMap: boolean[];
	/** 应作为列表项渲染：未跳过（含被折叠祖先隐藏的项，供出场动画保留在 DOM） */
	renderMap: boolean[];
	/** 已渲染但因折叠祖先需 display:none 的项（B-2 出场动画标记） */
	collapsedHiddenMap: boolean[];
	shouldShowToc: boolean;
}

/**
 * 计算 TOC 可见性的 Hook
 * @param params 参数对象
 * @returns 可见性 / 渲染 / 折叠隐藏映射，以及是否应该显示 TOC
 */
export const useTocVisibility = ({
	headings,
	isCollapsed,
	skipHeadingLevels,
	showWhenSingleHeading,
}: UseTocVisibilityParams): UseTocVisibilityReturn => {
	const { visibilityMap, renderMap, collapsedHiddenMap } = useMemo(() => {
		const visibility: boolean[] = new Array<boolean>(
			headings.length,
		).fill(true);
		const render: boolean[] = new Array<boolean>(headings.length).fill(
			true,
		);
		const collapsedHidden: boolean[] = new Array<boolean>(
			headings.length,
		).fill(false);
		const collapsedLevels: number[] = [];

		for (let i = 0; i < headings.length; i++) {
			const level = headings[i].level;

			// 跳过层级：完全不渲染
			if (skipHeadingLevels.includes(level)) {
				visibility[i] = false;
				render[i] = false;
				collapsedHidden[i] = false;
				continue;
			}

			// 离开较深的折叠子树：弹出所有 >= 当前层级的折叠层级
			while (
				collapsedLevels.length > 0 &&
				level <= collapsedLevels[collapsedLevels.length - 1]
			) {
				collapsedLevels.pop();
			}

			// 存在折叠祖先 → 渲染但隐藏（display:none），保留在 DOM 供出场动画
			const underCollapsed = collapsedLevels.length > 0;
			collapsedHidden[i] = underCollapsed;
			visibility[i] = !underCollapsed;
			render[i] = true;

			// 若当前项为折叠父节点，则把其层级压栈，影响其后代
			if (isCollapsed(i)) {
				collapsedLevels.push(level);
			}
		}

		return {
			visibilityMap: visibility,
			renderMap: render,
			collapsedHiddenMap: collapsedHidden,
		};
	}, [headings, isCollapsed, skipHeadingLevels]);

	const shouldShowToc = useMemo(() => {
		if (skipHeadingLevels.length > 0) {
			const hasOnlySkipped = headings.every((heading) =>
				skipHeadingLevels.includes(heading.level),
			);
			if (hasOnlySkipped) return false;
		}

		// 如果配置了不在单标题时显示，检查可见标题数量
		if (!showWhenSingleHeading) {
			const visibleHeadingsCount = headings.filter((heading) => {
				// 排除跳过列表中的标题
				if (skipHeadingLevels.includes(heading.level)) {
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
	}, [headings, skipHeadingLevels, showWhenSingleHeading]);

	return {
		visibilityMap,
		renderMap,
		collapsedHiddenMap,
		shouldShowToc,
	};
};
