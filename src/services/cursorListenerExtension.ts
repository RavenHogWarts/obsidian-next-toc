import type { Extension } from "@codemirror/state";
import type { ViewUpdate } from "@codemirror/view";
import { EditorView } from "@codemirror/view";

interface CursorMoveHandler {
	onCursorMoved(view: EditorView): void;
}

export function createCursorListenerExtension(
	plugin: CursorMoveHandler
): Extension {
	let scheduled = false;
	const pendingViews = new Set<EditorView>();

	const scheduleFlush = () => {
		if (scheduled) return;
		scheduled = true;
		requestAnimationFrame(() => {
			scheduled = false;
			for (const view of pendingViews) {
				plugin.onCursorMoved(view);
			}
			pendingViews.clear();
		});
	};

	return EditorView.updateListener.of((vu: ViewUpdate) => {
		// Only react when selection changed and document itself didn't change
		if (vu.selectionSet && !vu.docChanged) {
			pendingViews.add(vu.view);
			scheduleFlush();
		}
	});
}
