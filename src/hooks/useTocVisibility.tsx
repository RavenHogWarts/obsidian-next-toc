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
	isCollapsed,
	skipHeadingLevels,
	showWhenSingleHeading,
}: UseTocVisibilityParams): UseTocVisibilityReturn => {
	const visibilityMap = useMemo(() => {
		const result: boolean[] = new Array(headings.length).fill(true);
		const collapsedLevels: number[] = [];

		for (let i = 0; i < headings.length; i++) {
			const level = headings[i].level;

			// 如果当前标题层级在跳过列表中，则隐藏
			if (skipHeadingLevels.includes(level)) {
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
			if (isCollapsed(i)) {
				collapsedLevels.push(level);
			}
		}

		return result;
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
		shouldShowToc,
	};
};
