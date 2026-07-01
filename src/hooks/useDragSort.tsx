import {
	DragCancelEvent,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { LL } from "@src/i18n/i18n";
import {
	type ReorderFailReason,
	reorderSections,
} from "@src/utils/reorderSections";
import { HeadingCache, MarkdownView, Notice } from "obsidian";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const FAIL_NOTICE_MAP: Record<ReorderFailReason, () => string> = {
	noFile: LL.notices.reorderFailedNoFile,
	noHeadings: LL.notices.reorderFailedNoHeadings,
	invalidIndex: LL.notices.reorderFailedInvalidIndex,
	samePosition: LL.notices.reorderFailedSamePosition,
	targetIsDescendant: LL.notices.reorderFailedTargetIsDescendant,
	editorError: LL.notices.reorderFailedEditor,
};

interface DragState {
	phase: "idle" | "pressing" | "dragging";
	isDragging: boolean;
	dragIndex: number | null;
	overIndex: number | null;
	dropPosition: "before" | "after" | null;
}

const INITIAL_DRAG_STATE: DragState = {
	phase: "idle",
	isDragging: false,
	dragIndex: null,
	overIndex: null,
	dropPosition: null,
};

const LONG_PRESS_MS = 200;
const POINTER_TOLERANCE_PX = 6;

export const useDragSort = (
	currentView: MarkdownView,
	headings: HeadingCache[],
	enabled: boolean,
) => {
	const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
	const [dragReadyIndex, setDragReadyIndex] = useState<number | null>(null);
	const suppressClickRef = useRef(false);

	const itemIds = useMemo(
		() => headings.map((_heading, index) => `toc-heading-${index}`),
		[headings],
	);
	const idToIndex = useMemo(
		() => new Map(itemIds.map((id, index) => [id, index])),
		[itemIds],
	);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				delay: LONG_PRESS_MS,
				tolerance: POINTER_TOLERANCE_PX,
			},
		}),
	);

	const resetInteraction = useCallback(() => {
		setDragReadyIndex(null);
		setDragState(INITIAL_DRAG_STATE);
	}, []);

	const applyDrop = useCallback(
		async (
			sourceIndex: number,
			targetIndex: number,
			dropPosition: "before" | "after",
		) => {
			if (Number.isNaN(sourceIndex) || sourceIndex === targetIndex) {
				setDragState(INITIAL_DRAG_STATE);
				return;
			}

			const gap =
				dropPosition === "before" ? targetIndex : targetIndex + 1;
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
		[currentView, headings],
	);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent, index: number) => {
			if (!enabled || e.button !== 0) return;

			suppressClickRef.current = false;
			setDragReadyIndex(index);
			setDragState({
				phase: "pressing",
				isDragging: false,
				dragIndex: index,
				overIndex: null,
				dropPosition: null,
			});
		},
		[enabled],
	);

	useEffect(() => {
		if (dragState.phase !== "pressing") {
			return;
		}

		const clearPressing = () => {
			setDragReadyIndex(null);
			setDragState(INITIAL_DRAG_STATE);
		};

		window.addEventListener("pointerup", clearPressing, true);
		window.addEventListener("pointercancel", clearPressing, true);

		return () => {
			window.removeEventListener("pointerup", clearPressing, true);
			window.removeEventListener("pointercancel", clearPressing, true);
		};
	}, [dragState.phase]);

	useEffect(() => {
		if (!enabled) {
			resetInteraction();
			suppressClickRef.current = false;
		}
	}, [enabled, resetInteraction]);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			if (!enabled) return;

			const dragIndex = idToIndex.get(String(event.active.id));
			if (dragIndex === undefined) {
				return;
			}

			suppressClickRef.current = true;
			setDragReadyIndex(dragIndex);
			setDragState({
				phase: "dragging",
				isDragging: true,
				dragIndex,
				overIndex: null,
				dropPosition: null,
			});
		},
		[enabled, idToIndex],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (!enabled) return;

			if (!event.over) {
				setDragState((prev) =>
					prev.phase !== "dragging"
						? prev
						: { ...prev, overIndex: null, dropPosition: null },
				);
				return;
			}

			const overIndex = idToIndex.get(String(event.over.id));
			if (overIndex === undefined) {
				return;
			}

			const activeRect = event.active.rect.current.translated;
			const overRect = event.over.rect;
			const activeCenterY = activeRect
				? activeRect.top + activeRect.height / 2
				: overRect.top + overRect.height / 2;
			const overMidY = overRect.top + overRect.height / 2;
			const dropPosition = activeCenterY < overMidY ? "before" : "after";

			setDragState((prev) => {
				if (
					prev.phase === "dragging" &&
					prev.overIndex === overIndex &&
					prev.dropPosition === dropPosition
				) {
					return prev;
				}

				return {
					...prev,
					overIndex,
					dropPosition,
				};
			});
		},
		[enabled, idToIndex],
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const sourceIndex = idToIndex.get(String(event.active.id));
			const targetIndex = event.over
				? idToIndex.get(String(event.over.id))
				: dragState.overIndex;
			const dropPosition = dragState.dropPosition;

			if (
				sourceIndex === undefined ||
				targetIndex === null ||
				targetIndex === undefined ||
				dropPosition === null
			) {
				resetInteraction();
				return;
			}

			await applyDrop(sourceIndex, targetIndex, dropPosition);
			resetInteraction();
		},
		[
			applyDrop,
			dragState.dropPosition,
			dragState.overIndex,
			idToIndex,
			resetInteraction,
		],
	);

	const handleDragCancel = useCallback(() => {
		resetInteraction();
	}, [resetInteraction]);

	const consumeLongPressClick = useCallback(() => {
		if (!suppressClickRef.current) {
			return false;
		}

		suppressClickRef.current = false;
		return true;
	}, []);

	return {
		sensors,
		itemIds,
		dragState,
		dragReadyIndex,
		interactionActive: dragState.phase !== "idle",
		getItemId: (index: number) => itemIds[index] ?? `toc-heading-${index}`,
		handlePointerDown,
		handlePointerUp: () => {},
		handlePointerLeave: () => {},
		handleDragStart,
		handleDragOver,
		handleDragEnd,
		handleDragCancel: (_event: DragCancelEvent) => handleDragCancel(),
		consumeLongPressClick,
	};
};
