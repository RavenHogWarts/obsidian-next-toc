const scrollAnimationMap = new WeakMap<HTMLElement, number>();

export const cancelSmoothScroll = (container: HTMLElement) => {
	const frameId = scrollAnimationMap.get(container);
	if (frameId !== undefined) {
		window.cancelAnimationFrame(frameId);
		scrollAnimationMap.delete(container);
	}
};

export default function (
	container: HTMLElement,
	element: HTMLElement,
	duration = 300,
) {
	cancelSmoothScroll(container);

	const startTime = performance.now();
	const startScroll = container.scrollTop;
	const containerHeight = container.clientHeight;
	const elementOffset = element.offsetTop;
	const elementHeight = element.offsetHeight;
	const targetScroll = elementOffset - (containerHeight - elementHeight) / 2;
	const distance = targetScroll - startScroll;

	if (distance === 0) {
		return () => {};
	}

	const animate = (currentTime: number) => {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easeProgress = 1 - Math.pow(1 - progress, 3);
		container.scrollTop = startScroll + distance * easeProgress;

		if (progress < 1) {
			const frameId = window.requestAnimationFrame(animate);
			scrollAnimationMap.set(container, frameId);
		} else {
			scrollAnimationMap.delete(container);
		}
	};

	const frameId = window.requestAnimationFrame(animate);
	scrollAnimationMap.set(container, frameId);

	return () => {
		cancelSmoothScroll(container);
	};
}
