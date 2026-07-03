import {
	DragCancelEvent,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { LL } from "@src/i18n/i18n";
import {
	type ReorderFailReason,
	reorderSections,
} from "@src/utils/reorderSections";
import { HeadingCache, MarkdownView, Notice } from "obsidian";
import {
	type RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

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

interface ItemRectSnapshot {
	index: number;
	top: number;
	bottom: number;
	height: number;
}

export const useDragSort = (
	currentView: MarkdownView,
	headings: HeadingCache[],
	enabled: boolean,
	containerRef?: RefObject<HTMLElement | null>,
) => {
	const [dragState, setDragState] = useState<DragState>(INITIAL_DRAG_STATE);
	const [dragReadyIndex, setDragReadyIndex] = useState<number | null>(null);
	const suppressClickRef = useRef(false);
	const clientYRef = useRef<number | null>(null);
	const rafIdRef = useRef<number | null>(null);
	const dragIndexRef = useRef<number | null>(null);

	const itemIds = useMemo(
		() => headings.map((_heading, index) => `toc-heading-${index}`),
		[headings],
	);
	const idToIndex = useMemo(
		() => new Map(itemIds.map((id, index) => [id, index])),
		[itemIds],
	);

	const sensors = useSensors(
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: LONG_PRESS_MS,
				tolerance: POINTER_TOLERANCE_PX,
			},
		}),
	);

	const resetInteraction = useCallback(() => {
		setDragReadyIndex(null);
		setDragState(INITIAL_DRAG_STATE);
		clientYRef.current = null;
		dragIndexRef.current = null;
		suppressClickRef.current = false;
		if (rafIdRef.current !== null) {
			window.cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}
	}, []);

	const resolveDropTarget = useCallback(
		(clientY: number | null) => {
			if (clientY === null) return null;
			const container = containerRef?.current ?? null;
			if (!container) return null;

			const elements =
				container.querySelectorAll<HTMLElement>("[data-index]");

			const rects: ItemRectSnapshot[] = [];
			elements.forEach((element) => {
				const index = Number(element.dataset.index);
				if (!Number.isInteger(index)) return;
				// 跳过被拖拽项本身（跟随鼠标移动，位置不可靠）
				if (index === dragIndexRef.current) return;
				const rect = element.getBoundingClientRect();
				rects.push({
					index,
					top: rect.top,
					bottom: rect.bottom,
					height: rect.height,
				});
			});
			rects.sort((a, b) => a.top - b.top);

			if (rects.length === 0) return null;

			const first = rects[0];
			const last = rects[rects.length - 1];

			if (clientY <= first.top) {
				return {
					overIndex: first.index,
					dropPosition: "before" as const,
				};
			}
			if (clientY >= last.bottom) {
				return {
					overIndex: last.index,
					dropPosition: "after" as const,
				};
			}

			for (const rect of rects) {
				const midY = rect.top + rect.height / 2;
				if (clientY < rect.bottom) {
					return {
						overIndex: rect.index,
						dropPosition:
							clientY < midY
								? ("before" as const)
								: ("after" as const),
					};
				}
			}

			return {
				overIndex: last.index,
				dropPosition: "after" as const,
			};
		},
		[containerRef],
	);

	const applyDrop = useCallback(
		async (
			sourceIndex: number,
			targetIndex: number,
			dropPosition: "before" | "after",
		) => {
			if (Number.isNaN(sourceIndex)) {
				setDragState(INITIAL_DRAG_STATE);
				return;
			}

			const gap =
				dropPosition === "before" ? targetIndex : targetIndex + 1;
			const finalTarget = gap <= sourceIndex ? gap : gap - 1;

			// 源位置与最终目标位置一致 → 无需移动，静默退出
			if (sourceIndex === finalTarget) {
				setDragState(INITIAL_DRAG_STATE);
				return;
			}

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
			clientYRef.current = e.clientY;
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
			dragIndexRef.current = dragIndex;
			if (event.activatorEvent && "clientY" in event.activatorEvent) {
				clientYRef.current = (
					event.activatorEvent as PointerEvent
				).clientY;
			}
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

	useEffect(() => {
		if (dragState.phase !== "dragging") return;

		const handlePointerMove = (event: PointerEvent) => {
			clientYRef.current = event.clientY;

			if (rafIdRef.current !== null) return;
			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				const target = resolveDropTarget(clientYRef.current);
				if (!target) return;

				setDragState((prev) => {
					if (prev.phase !== "dragging") return prev;
					if (
						prev.overIndex === target.overIndex &&
						prev.dropPosition === target.dropPosition
					) {
						return prev;
					}
					return {
						...prev,
						overIndex: target.overIndex,
						dropPosition: target.dropPosition,
					};
				});
			});
		};

		window.addEventListener("pointermove", handlePointerMove, true);
		return () => {
			window.removeEventListener("pointermove", handlePointerMove, true);
			if (rafIdRef.current !== null) {
				window.cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [dragState.phase, resolveDropTarget]);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			if (!enabled) return;

			let pointerY = clientYRef.current;
			if (pointerY === null) {
				const activeRect = event.active.rect.current.translated;
				pointerY = activeRect
					? activeRect.top + activeRect.height / 2
					: null;
			}

			const target = resolveDropTarget(pointerY);
			if (!target) return;

			setDragState((prev) => {
				if (
					prev.phase === "dragging" &&
					prev.overIndex === target.overIndex &&
					prev.dropPosition === target.dropPosition
				) {
					return prev;
				}
				return {
					...prev,
					overIndex: target.overIndex,
					dropPosition: target.dropPosition,
				};
			});
		},
		[enabled, resolveDropTarget],
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const sourceIndex = idToIndex.get(String(event.active.id));

			let pointerY = clientYRef.current;
			if (pointerY === null) {
				const activeRect = event.active.rect.current.translated;
				pointerY = activeRect
					? activeRect.top + activeRect.height / 2
					: null;
			}
			const target = resolveDropTarget(pointerY);

			if (
				sourceIndex === undefined ||
				!target ||
				(target.overIndex === sourceIndex &&
					target.dropPosition === "before")
			) {
				resetInteraction();
				return;
			}

			await applyDrop(sourceIndex, target.overIndex, target.dropPosition);
			resetInteraction();
		},
		[applyDrop, idToIndex, resolveDropTarget, resetInteraction],
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

	// ---- 桌面端鼠标拖拽（无 MouseSensor） ----
	const startMouseDrag = useCallback(
		(index: number) => {
			if (!enabled) return;
			suppressClickRef.current = true;
			dragIndexRef.current = index;
			setDragReadyIndex(index);
			setDragState({
				phase: "dragging",
				isDragging: true,
				dragIndex: index,
				overIndex: null,
				dropPosition: null,
			});
		},
		[enabled],
	);

	const updateMouseDrag = useCallback(
		(clientY: number) => {
			if (rafIdRef.current !== null) return;
			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				const target = resolveDropTarget(clientY);
				if (!target) return;
				setDragState((prev) => {
					if (prev.phase !== "dragging") return prev;
					if (
						prev.overIndex === target.overIndex &&
						prev.dropPosition === target.dropPosition
					) {
						return prev;
					}
					return {
						...prev,
						overIndex: target.overIndex,
						dropPosition: target.dropPosition,
					};
				});
			});
		},
		[resolveDropTarget],
	);

	const endMouseDrag = useCallback(
		async (clientY: number | null) => {
			const sourceIndex = dragIndexRef.current;
			const target = resolveDropTarget(clientY);

			if (
				sourceIndex === null ||
				!target ||
				(target.overIndex === sourceIndex &&
					target.dropPosition === "before")
			) {
				resetInteraction();
				return;
			}

			await applyDrop(sourceIndex, target.overIndex, target.dropPosition);
			resetInteraction();
		},
		[resolveDropTarget, applyDrop, resetInteraction],
	);

	// ---- 桌面端鼠标拖拽（无 MouseSensor）的事件装配 ----
	// 注意：useDragSort 仅注册了 TouchSensor，鼠标拖拽依赖此处手动监听
	// window 的 mousemove/mouseup。每个消费方只需把 onContainerMouseDown
	// 绑定到承载 [data-index] 子项的容器上即可。
	const mouseDragRef = useRef<{
		startY: number;
		startIndex: number | null;
		dragging: boolean;
	}>({ startY: 0, startIndex: null, dragging: false });

	const onContainerMouseDown = useCallback(
		(e: React.MouseEvent) => {
			if (e.button !== 0 || !enabled) return;
			const target = (e.target as HTMLElement).closest<HTMLElement>(
				"[data-index]",
			);
			if (!target) return;
			const idx = Number(target.dataset.index);
			if (!Number.isInteger(idx)) return;
			mouseDragRef.current = {
				startY: e.clientY,
				startIndex: idx,
				dragging: false,
			};
		},
		[enabled],
	);

	useEffect(() => {
		if (!enabled) return;

		const onMouseMove = (e: MouseEvent) => {
			const md = mouseDragRef.current;
			if (md.startIndex === null) return;
			if (!md.dragging) {
				if (Math.abs(e.clientY - md.startY) > 5) {
					md.dragging = true;
					startMouseDrag(md.startIndex);
				}
				return;
			}
			updateMouseDrag(e.clientY);
		};

		const onMouseUp = (e: MouseEvent) => {
			const md = mouseDragRef.current;
			if (md.startIndex === null) return;
			if (md.dragging) {
				void endMouseDrag(e.clientY);
			}
			md.startIndex = null;
			md.dragging = false;
		};

		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [enabled, startMouseDrag, updateMouseDrag, endMouseDrag]);

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
		startMouseDrag,
		updateMouseDrag,
		endMouseDrag,
		onContainerMouseDown,
	};
};
