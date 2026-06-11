import { LL } from "@src/i18n/i18n";
import {
	type ReorderFailReason,
	reorderSections,
} from "@src/utils/reorderSections";
import { HeadingCache, MarkdownView, Notice } from "obsidian";
import { useCallback, useRef, useState } from "react";

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

export const useDragSort = (
	currentView: MarkdownView,
	headings: HeadingCache[],
	enabled: boolean,
) => {
	const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
	const [dragReadyIndex, setDragReadyIndex] = useState<number | null>(null);
	const [wasLongPress, setWasLongPress] = useState(false);

	const longPressTimerRef = useRef<number | null>(
		null,
	);
	const activeElementRef = useRef<HTMLElement | null>(null);

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

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.stopPropagation();
		setDragState((prev) => ({
			...prev,
			overIndex: null,
			dropPosition: null,
		}));
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent, targetIndex: number) => {
			e.preventDefault();
			e.stopPropagation();

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
		[enabled, currentView, headings],
	);

	const handleDragEnd = useCallback(() => {
		if (activeElementRef.current) {
			activeElementRef.current.draggable = false;
		}
		activeElementRef.current = null;
		setDragReadyIndex(null);
		setWasLongPress(false);
		setDragState(INITIAL_DRAG_STATE);
	}, []);

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
