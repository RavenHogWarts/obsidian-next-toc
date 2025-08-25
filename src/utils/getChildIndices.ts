import { HeadingCache } from "obsidian";

export default function (index: number, headings: HeadingCache[]): number[] {
	const indices: number[] = [];
	const parentLevel = headings[index].level;

	for (let i = index + 1; i < headings.length; i++) {
		if (headings[i].level <= parentLevel) break;
		indices.push(i);
	}

	return indices;
}
