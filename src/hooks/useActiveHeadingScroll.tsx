import smoothScroll, { cancelSmoothScroll } from "@src/utils/smoothScroll";
import { RefObject, useEffect, useRef } from "react";

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
	disabled = false,
) => {
	const lastScrollTargetRef = useRef<number | null>(null);
	const scrollTarget =
		visibleHeadingIndices && visibleHeadingIndices.length > 0
			? visibleHeadingIndices[0]
			: activeHeadingIndex;

	useEffect(() => {
		const containers = containerRefs
			.map((containerRef) => containerRef.current)
			.filter(
				(container): container is HTMLElement => container !== null,
			);

		if (disabled) {
			containers.forEach(cancelSmoothScroll);
			return;
		}

		if (scrollTarget === -1) return;
		if (lastScrollTargetRef.current === scrollTarget) return;

		lastScrollTargetRef.current = scrollTarget;

		const cancelFns = containers.map((container) => {
			const activeHeadingEl = container.querySelector(
				`[data-index="${scrollTarget}"]`,
			) as HTMLElement;

			if (activeHeadingEl) {
				return smoothScroll(container, activeHeadingEl);
			}

			return () => {};
		});

		return () => {
			cancelFns.forEach((cancel) => cancel());
		};
	}, [containerRefs, disabled, scrollTarget]);
};
