import { LL } from "@src/i18n/i18n";
import {
	type ReorderFailReason,
	reorderSections,
} from "@src/utils/reorderSections";
import { HeadingCache, MarkdownView, Notice } from "obsidian";
import { RefObject, useCallback, useRef, useState } from "react";

const FAIL_NOTICE_MAP: Record<ReorderFailReason, () => string> = {
	noFile: LL.notices.reorderFailedNoFile,
	noHeadings: LL.notices.reorderFailedNoHeadings,
	invalidIndex: LL.notices.reorderFailedInvalidIndex,
	samePosition: LL.notices.reorderFailedSamePosition,
	targetIsDescendant: LL.notices.reorderFailedTargetIsDescendant,
	editorError: LL.notices.reorderFailedEditor,
};

interface DragState {
	isDragging: boolean;
	dragIndex: number | null;
	overIndex: number | null;
	dropPosition: "before" | "after" | null;
}

const INITIAL_DRAG_STATE: DragState = {
	isDragging: false,
	dragIndex: null,
	overIndex: null,
	dropPosition: null,
};

const LONG_PRESS_MS = 200;
const AUTO_SCROLL_EDGE_PX = 48;
const AUTO_SCROLL_MAX_SPEED = 18;

export const useDragSort = (
	currentView: MarkdownView,
	headings: HeadingCache[],
	enabled: boolean,
	scrollContainerRef?: RefObject<HTMLElement | null>,
) => {
	const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
	const [dragReadyIndex, setDragReadyIndex] = useState<number | null>(null);
	const [wasLongPress, setWasLongPress] = useState(false);

	const longPressTimerRef = useRef<number | null>(null);
	const activeElementRef = useRef<HTMLElement | null>(null);
	const autoScrollFrameRef = useRef<number | null>(null);
	const autoScrollContainerRef = useRef<HTMLElement | null>(null);
	const autoScrollVelocityRef = useRef(0);

	const stopAutoScroll = useCallback(() => {
		if (autoScrollFrameRef.current !== null) {
			window.cancelAnimationFrame(autoScrollFrameRef.current);
			autoScrollFrameRef.current = null;
		}
		autoScrollContainerRef.current = null;
		autoScrollVelocityRef.current = 0;
	}, []);

	const runAutoScroll = useCallback(() => {
		const container = autoScrollContainerRef.current;
		const velocity = autoScrollVelocityRef.current;

		if (!container || velocity === 0) {
			autoScrollFrameRef.current = null;
			return;
		}

		const maxScrollTop = container.scrollHeight - container.clientHeight;
		const nextScrollTop = Math.max(
			0,
			Math.min(container.scrollTop + velocity, maxScrollTop),
		);

		if (nextScrollTop === container.scrollTop) {
			stopAutoScroll();
			return;
		}

		container.scrollTop = nextScrollTop;
		autoScrollFrameRef.current =
			window.requestAnimationFrame(runAutoScroll);
	}, [stopAutoScroll]);

	const updateAutoScroll = useCallback(
		(target: HTMLElement, clientY: number) => {
			const container =
				scrollContainerRef?.current ??
				(target.closest(
					".NToc__toc-items, .NToc__view-content-items",
				) as HTMLElement | null);

			if (
				!container ||
				container.scrollHeight <= container.clientHeight
			) {
				stopAutoScroll();
				return;
			}

			const rect = container.getBoundingClientRect();
			const topDistance = clientY - rect.top;
			const bottomDistance = rect.bottom - clientY;
			let velocity = 0;

			if (topDistance < AUTO_SCROLL_EDGE_PX) {
				const ratio = Math.max(
					0,
					(AUTO_SCROLL_EDGE_PX - topDistance) / AUTO_SCROLL_EDGE_PX,
				);
				velocity = -Math.max(
					1,
					Math.ceil(ratio * AUTO_SCROLL_MAX_SPEED),
				);
			} else if (bottomDistance < AUTO_SCROLL_EDGE_PX) {
				const ratio = Math.max(
					0,
					(AUTO_SCROLL_EDGE_PX - bottomDistance) /
						AUTO_SCROLL_EDGE_PX,
				);
				velocity = Math.max(
					1,
					Math.ceil(ratio * AUTO_SCROLL_MAX_SPEED),
				);
			}

			if (velocity === 0) {
				stopAutoScroll();
				return;
			}

			autoScrollContainerRef.current = container;
			autoScrollVelocityRef.current = velocity;

			if (autoScrollFrameRef.current === null) {
				autoScrollFrameRef.current =
					window.requestAnimationFrame(runAutoScroll);
			}
		},
		[runAutoScroll, scrollContainerRef, stopAutoScroll],
	);

	const cancelLongPress = useCallback(() => {
		if (longPressTimerRef.current) {
			window.clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
		if (activeElementRef.current) {
			activeElementRef.current.draggable = false;
		}
		activeElementRef.current = null;
		setDragReadyIndex(null);
	}, []);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent, index: number) => {
			if (!enabled || e.button !== 0) return;
			cancelLongPress();

			const element = e.currentTarget as HTMLElement;
			activeElementRef.current = element;

			longPressTimerRef.current = window.setTimeout(() => {
				element.draggable = true;
				setDragReadyIndex(index);
				setWasLongPress(true);
			}, LONG_PRESS_MS);
		},
		[enabled, cancelLongPress],
	);

	const handlePointerUp = useCallback(() => {
		if (longPressTimerRef.current) {
			window.clearTimeout(longPressTimerRef.current);
			longPressTimerRef.current = null;
		}
		// 长按已触发但未拖动 → 清理 draggable，保留 wasLongPress 供 click 判断
		if (dragReadyIndex !== null && activeElementRef.current) {
			activeElementRef.current.draggable = false;
			activeElementRef.current = null;
			setDragReadyIndex(null);
		}
	}, [dragReadyIndex]);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			// 长按已触发，让 HTML5 DnD 接管
			if (dragReadyIndex !== null) return;
			// 长按等待中移动 → 取消长按
			if (longPressTimerRef.current) {
				cancelLongPress();
			}
		},
		[dragReadyIndex, cancelLongPress],
	);

	const handlePointerLeave = useCallback(() => {
		// 长按等待中离开元素 → 取消长按
		if (longPressTimerRef.current) {
			cancelLongPress();
		}
	}, [cancelLongPress]);

	const consumeLongPressClick = useCallback(() => {
		if (wasLongPress) {
			setWasLongPress(false);
			return true;
		}
		return false;
	}, [wasLongPress]);

	const handleDragStart = useCallback(
		(e: React.DragEvent, index: number) => {
			if (!enabled) return;
			stopAutoScroll();
			// 只允许长按触发的拖拽
			if (dragReadyIndex !== index) {
				e.preventDefault();
				return;
			}
			e.stopPropagation();
			e.dataTransfer.effectAllowed = "move";
			e.dataTransfer.setData("text/plain", String(index));
			window.requestAnimationFrame(() => {
				setDragState({
					isDragging: true,
					dragIndex: index,
					overIndex: null,
					dropPosition: null,
				});
			});
		},
		[enabled, dragReadyIndex, headings],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) => {
			if (!enabled || !dragState.isDragging) return;
			e.preventDefault();
			e.stopPropagation();
			e.dataTransfer.dropEffect = "move";
			updateAutoScroll(e.currentTarget as HTMLElement, e.clientY);

			const rect = (
				e.currentTarget as HTMLElement
			).getBoundingClientRect();
			const midY = rect.top + rect.height / 2;

			setDragState((prev) => ({
				...prev,
				overIndex: index,
				dropPosition: e.clientY < midY ? "before" : "after",
			}));
		},
		[enabled, dragState.isDragging],
	);

	const handleDragLeave = useCallback(
		(e: React.DragEvent) => {
			e.stopPropagation();
			stopAutoScroll();
			setDragState((prev) => ({
				...prev,
				overIndex: null,
				dropPosition: null,
			}));
		},
		[stopAutoScroll],
	);

	const handleDrop = useCallback(
		async (e: React.DragEvent, targetIndex: number) => {
			e.preventDefault();
			e.stopPropagation();
			stopAutoScroll();

			const sourceIndexStr = e.dataTransfer?.getData("text/plain");
			if (!sourceIndexStr) {
				console.warn("[DragSort] drop: no sourceIndex data");
				setDragState(INITIAL_DRAG_STATE);
				return;
			}

			const sourceIndex = parseInt(sourceIndexStr);
			if (isNaN(sourceIndex) || sourceIndex === targetIndex) {
				console.warn("[DragSort] drop: invalid or same index", {
					sourceIndex,
					targetIndex,
				});
				setDragState(INITIAL_DRAG_STATE);
				return;
			}

			// 计算鼠标在目标元素的上半还是下半
			const rect = (
				e.currentTarget as HTMLElement
			).getBoundingClientRect();
			const midY = rect.top + rect.height / 2;
			const dropBefore = e.clientY < midY;

			/**
			 * 使用 gap 模型计算目标索引：
			 * gap i = heading i 前面的位置, gap N = 所有标题之后
			 * dropBefore heading[targetIndex] → gap targetIndex
			 * dropAfter  heading[targetIndex] → gap targetIndex + 1
			 *
			 * reorderSections 的 targetIndex 语义：
			 *   targetIndex < sourceIndex → 插入到 headings[targetIndex] 的起始行（gap targetIndex）
			 *   targetIndex >= sourceIndex → 插入到 headings[targetIndex] 的节末尾（gap targetIndex + 1）
			 *
			 * 所以将 gap 转为 finalTarget：
			 *   gap <= sourceIndex → finalTarget = gap
			 *   gap > sourceIndex  → finalTarget = gap - 1
			 */
			const gap = dropBefore ? targetIndex : targetIndex + 1;
			const finalTarget = gap <= sourceIndex ? gap : gap - 1;

			const result = await reorderSections(
				currentView,
				headings,
				sourceIndex,
				finalTarget,
			);

			if (result.success) {
				const src = headings[sourceIndex]?.heading ?? "";
				new Notice(LL.notices.reorderSuccess({ heading: src }));
			} else if (result.reason) {
				new Notice(FAIL_NOTICE_MAP[result.reason]());
			}

			setDragState(INITIAL_DRAG_STATE);
		},
		[currentView, headings, stopAutoScroll],
	);

	const handleDragEnd = useCallback(() => {
		stopAutoScroll();
		if (activeElementRef.current) {
			activeElementRef.current.draggable = false;
		}
		activeElementRef.current = null;
		setDragReadyIndex(null);
		setWasLongPress(false);
		setDragState(INITIAL_DRAG_STATE);
	}, [stopAutoScroll]);

	return {
		dragState,
		dragReadyIndex,
		handlePointerDown,
		handlePointerUp,
		handlePointerMove,
		handlePointerLeave,
		handleDragStart,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleDragEnd,
		consumeLongPressClick,
	};
};
