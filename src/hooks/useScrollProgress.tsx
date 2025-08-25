import { MarkdownView } from "obsidian";
import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollProgress = (currentView: MarkdownView | null) => {
	const [progress, setProgress] = useState(0);
	const scrollListenerRef = useRef<(() => void) | null>(null);

	const calculateProgress = useCallback((scrollElement: HTMLElement) => {
		const scrollTop = scrollElement.scrollTop;
		const scrollHeight = scrollElement.scrollHeight;
		const clientHeight = scrollElement.clientHeight;
		const maxScroll = scrollHeight - clientHeight;

		if (maxScroll <= 0) {
			return 0;
		}

		return Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
	}, []);

	const findScrollElement = useCallback(
		(view: MarkdownView): HTMLElement | null => {
			if (!view?.contentEl) return null;

			const mode = view.getMode();

			if (mode === "source") {
				// 在source模式下，查找.cm-scroller元素
				const cmScroller = view.contentEl.querySelector(
					".cm-scroller"
				) as HTMLElement;
				if (cmScroller) return cmScroller;
			} else if (mode === "preview") {
				// 在preview模式下，查找.markdown-preview-view元素
				const previewView = view.contentEl.querySelector(
					".markdown-preview-view"
				) as HTMLElement;
				if (previewView) return previewView;
			}

			// 如果找不到特定元素，使用contentEl本身
			return view.contentEl;
		},
		[]
	);

	const handleScroll = useCallback(
		(event: Event) => {
			const target = event.target as HTMLElement;
			if (target) {
				const newProgress = calculateProgress(target);
				setProgress(newProgress);
			}
		},
		[calculateProgress]
	);

	useEffect(() => {
		if (!currentView) {
			setProgress(0);
			return;
		}

		const scrollElement = findScrollElement(currentView);
		if (!scrollElement) {
			setProgress(0);
			return;
		}

		// 清理之前的监听器
		if (scrollListenerRef.current) {
			scrollListenerRef.current();
			scrollListenerRef.current = null;
		}

		// 创建新的滚动监听器
		let timeoutId: number | null = null;
		const debouncedHandler = (event: Event) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = window.setTimeout(() => {
				handleScroll(event);
			}, 16); // 约60fps的防抖
		};

		scrollElement.addEventListener("scroll", debouncedHandler, {
			passive: true,
		});

		// 计算初始进度
		const initialProgress = calculateProgress(scrollElement);
		setProgress(initialProgress);

		// 保存清理函数
		scrollListenerRef.current = () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			scrollElement.removeEventListener("scroll", debouncedHandler);
		};

		// 返回清理函数
		return () => {
			if (scrollListenerRef.current) {
				scrollListenerRef.current();
				scrollListenerRef.current = null;
			}
		};
	}, [currentView, findScrollElement, handleScroll, calculateProgress]);

	return progress;
};
