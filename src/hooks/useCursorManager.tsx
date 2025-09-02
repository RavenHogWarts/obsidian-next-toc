import { MarkdownView } from "obsidian";
import { useCallback, useRef } from "react";

interface CursorPosition {
	line: number;
	ch: number;
}

export const useCursorManager = (currentView: MarkdownView) => {
	const savedCursorRef = useRef<CursorPosition | null>(null);

	const saveCursorPosition = useCallback(() => {
		const editor = currentView?.editor;
		if (editor) {
			savedCursorRef.current = editor.getCursor();
		}
	}, [currentView]);

	const restoreCursorPosition = useCallback(() => {
		const editor = currentView?.editor;
		if (editor && savedCursorRef.current) {
			editor.setCursor(savedCursorRef.current);
			editor.scrollIntoView(
				{ from: savedCursorRef.current, to: savedCursorRef.current },
				true
			);
		}
	}, [currentView]);

	const getCurrentCursorPosition = useCallback((): CursorPosition | null => {
		const editor = currentView?.editor;
		if (editor) {
			return editor.getCursor();
		}
		return null;
	}, [currentView]);

	const setCursorPosition = useCallback(
		(position: CursorPosition) => {
			const editor = currentView?.editor;
			if (editor) {
				editor.setCursor(position);
				editor.scrollIntoView({ from: position, to: position }, true);
			}
		},
		[currentView]
	);

	return {
		saveCursorPosition,
		restoreCursorPosition,
		getCurrentCursorPosition,
		setCursorPosition,
		savedCursor: savedCursorRef.current,
	};
};
