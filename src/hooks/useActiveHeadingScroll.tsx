import smoothScroll from "@src/utils/smoothScroll";
import { RefObject, useEffect } from "react";

/**
 * 自动滚动到活跃标题或可视标题的 Hook
 * @param activeHeadingIndex 活跃标题的索引
 * @param containerRefs 容器的引用数组（可以是多个容器）
 * @param visibleHeadingIndices 可视标题的索引数组（滚动时优先跟随）
 */
export const useActiveHeadingScroll = (
	activeHeadingIndex: number,
	containerRefs: RefObject<HTMLElement | null>[],
	visibleHeadingIndices?: number[],
) => {
	useEffect(() => {
		// 优先滚动到可视区域的第一个标题，否则跟随光标位置
		const scrollTarget =
			visibleHeadingIndices && visibleHeadingIndices.length > 0
				? visibleHeadingIndices[0]
				: activeHeadingIndex;

		if (scrollTarget === -1) return;

		containerRefs.forEach((containerRef) => {
			if (!containerRef.current) return;

			const activeHeadingEl = containerRef.current.querySelector(
				`[data-index="${scrollTarget}"]`,
			) as HTMLElement;

			if (activeHeadingEl) {
				smoothScroll(containerRef.current, activeHeadingEl);
			}
		});
	}, [activeHeadingIndex, containerRefs, visibleHeadingIndices]);
};
