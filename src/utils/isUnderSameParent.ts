import { HeadingCache } from "obsidian";

export default function (
	index1: number,
	index2: number,
	headings: HeadingCache[],
	skipH1: boolean
): boolean {
	const level = headings[index1].level;

	// 向前查找最近的上级标题
	let parent1 = -1;
	let parent2 = -1;

	for (let i = index1; i >= 0; i--) {
		if (skipH1 && headings[i].level === 1) {
			continue;
		}
		if (headings[i].level < level) {
			parent1 = i;
			break;
		}
	}

	for (let i = index2; i >= 0; i--) {
		if (skipH1 && headings[i].level === 1) {
			continue;
		}
		if (headings[i].level < level) {
			parent2 = i;
			break;
		}
	}

	return parent1 === parent2;
}
