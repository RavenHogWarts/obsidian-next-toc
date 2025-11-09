import { debounce } from "obsidian";

export interface ScrollListenerOptions {
	debounceMs?: number;
	onScroll: (event: Event) => void;
}

export function createScrollListener(
	element: HTMLElement,
	options: ScrollListenerOptions
): () => void {
	const { debounceMs = 16, onScroll } = options;

	const debouncedHandler = debounce(onScroll, debounceMs, true);

	element.addEventListener("scroll", debouncedHandler, true);

	// 返回清理函数
	return () => {
		if (isElementValid(element)) {
			element.removeEventListener("scroll", debouncedHandler, true);
		}
	};
}

export function isElementValid(element: HTMLElement): boolean {
	return (
		element &&
		element.parentNode !== null &&
		document.contains(element) &&
		element.isConnected
	);
}

export function safeRemoveEventListener(
	element: HTMLElement,
	event: string,
	handler: EventListener,
	options?: boolean | EventListenerOptions
): void {
	if (isElementValid(element)) {
		element.removeEventListener(event, handler, options);
	}
}
