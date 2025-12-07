import smoothScroll from "@src/utils/smoothScroll";
import { RefObject, useEffect } from "react";

/**
 * 自动滚动到活跃标题的 Hook
 * @param activeHeadingIndex 活跃标题的索引
 * @param containerRefs 容器的引用数组（可以是多个容器）
 */
export const useActiveHeadingScroll = (
	activeHeadingIndex: number,
	...containerRefs: RefObject<HTMLElement | null>[]
) => {
	useEffect(() => {
		if (activeHeadingIndex === -1) return;

		containerRefs.forEach((containerRef) => {
			if (!containerRef.current) return;

			const activeHeadingEl = containerRef.current.querySelector(
				`[data-index="${activeHeadingIndex}"]`
			) as HTMLElement;

			if (activeHeadingEl) {
				smoothScroll(containerRef.current, activeHeadingEl);
			}
		});
	}, [activeHeadingIndex, containerRefs]);
};
