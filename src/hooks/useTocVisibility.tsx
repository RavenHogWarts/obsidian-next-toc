import { HeadingCache } from "obsidian";
import { useMemo } from "react";

interface UseTocVisibilityParams {
	headings: HeadingCache[];
	collapsedSet: Set<number>;
	skipHeading1: boolean;
	showWhenSingleHeading: boolean;
}

interface UseTocVisibilityReturn {
	visibilityMap: boolean[];
	shouldShowToc: boolean;
}

/**
 * 计算 TOC 可见性的 Hook
 * @param params 参数对象
 * @returns 可见性映射和是否应该显示 TOC
 */
export const useTocVisibility = ({
	headings,
	collapsedSet,
	skipHeading1,
	showWhenSingleHeading,
}: UseTocVisibilityParams): UseTocVisibilityReturn => {
	const visibilityMap = useMemo(() => {
		const result: boolean[] = new Array(headings.length).fill(true);
		const collapsedLevels: number[] = [];

		for (let i = 0; i < headings.length; i++) {
			const level = headings[i].level;

			// 如果开启了 skipHeading1 且当前是一级标题，则隐藏
			if (skipHeading1 && level === 1) {
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
	}, [headings, collapsedSet, skipHeading1]);

	const shouldShowToc = useMemo(() => {
		if (skipHeading1) {
			const hasOnlyH1 = headings.every((heading) => heading.level === 1);
			if (hasOnlyH1) return false;
		}

		// 如果配置了不在单标题时显示，检查可见标题数量
		if (!showWhenSingleHeading) {
			const visibleHeadingsCount = headings.filter((heading) => {
				// 如果开启了 skipHeading1，排除 h1
				if (skipHeading1 && heading.level === 1) {
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
	}, [headings, skipHeading1, showWhenSingleHeading]);

	return {
		visibilityMap,
		shouldShowToc,
	};
};
