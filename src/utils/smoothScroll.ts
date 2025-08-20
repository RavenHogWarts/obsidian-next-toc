export default function (
	container: HTMLElement,
	element: HTMLElement,
	duration = 300
) {
	const startTime = performance.now();
	const startScroll = container.scrollTop;
	const containerHeight = container.clientHeight;
	const elementOffset = element.offsetTop;
	const elementHeight = element.offsetHeight;
	const targetScroll = elementOffset - (containerHeight - elementHeight) / 2;
	const distance = targetScroll - startScroll;

	const animate = (currentTime: number) => {
		const elapsed = currentTime - startTime;
		const progress = Math.min(elapsed / duration, 1);
		const easeProgress = 1 - Math.pow(1 - progress, 3);
		container.scrollTop = startScroll + distance * easeProgress;

		if (progress < 1) {
			requestAnimationFrame(animate);
		}
	};

	requestAnimationFrame(animate);
}
