import { MarkdownView } from "obsidian";
import { MouseEvent, RefObject, useCallback, useEffect, useState } from "react";

interface UseResizableTocParams {
	currentView: MarkdownView;
	tocItemsRef: RefObject<HTMLElement | null>;
	tocWidth: number;
	tocPosition: "left" | "right";
	onWidthChange: (width: number) => void;
}

/**
 * TOC 可调整大小的 Hook
 * 处理鼠标拖拽调整 TOC 宽度的逻辑
 */
export const useResizableToc = ({
	currentView,
	tocItemsRef,
	tocWidth,
	tocPosition,
	onWidthChange,
}: UseResizableTocParams) => {
	const [isMouseDragging, setIsMouseDragging] = useState<boolean>(false);
	const [startX, setStartX] = useState<number>(0);
	const [startWidth, setStartWidth] = useState<number>(0);

	const handleMouseDragStart = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsMouseDragging(true);
			setStartX(e.clientX);
			setStartWidth(tocWidth);
		},
		[tocWidth]
	);

	const handleMouseDrag = useCallback(
		(e: globalThis.MouseEvent) => {
			if (!isMouseDragging || !tocItemsRef.current) {
				return;
			}

			const delta = e.clientX - startX;
			const widthDelta = tocPosition === "left" ? delta : -delta;
			const newWidth = startWidth + widthDelta;

			tocItemsRef.current.style.width = `${newWidth}px`;
		},
		[isMouseDragging, startX, startWidth, tocPosition, tocItemsRef]
	);

	const handleMouseDragEnd = useCallback(() => {
		if (!isMouseDragging) {
			return;
		}

		setIsMouseDragging(false);

		if (tocItemsRef.current) {
			const newWidth = tocItemsRef.current.offsetWidth;
			onWidthChange(newWidth);
		}
	}, [isMouseDragging, tocItemsRef, onWidthChange]);

	useEffect(() => {
		if (isMouseDragging) {
			currentView.contentEl.addEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.addEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		}

		return () => {
			currentView.contentEl.removeEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.removeEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		};
	}, [isMouseDragging, currentView, handleMouseDrag, handleMouseDragEnd]);

	return {
		handleMouseDragStart,
		isMouseDragging,
	};
};
