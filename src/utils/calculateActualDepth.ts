import { HeadingCache } from "obsidian";

export default function (index: number, headings: HeadingCache[]): number {
	const currentHeading = headings[index];
	let depth = 0;
	let minLevel = currentHeading.level;

	// 向前遍历寻找父级标题
	for (let i = index - 1; i >= 0; i--) {
		const prevHeading = headings[i];
		// 只关注比当前标题级别小的标题
		if (prevHeading.level < currentHeading.level) {
			// 如果找到新的最小级别，增加深度
			if (prevHeading.level < minLevel) {
				depth++;
				minLevel = prevHeading.level;
			}
		}
	}

	return depth;
}
