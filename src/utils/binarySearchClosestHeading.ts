import { HeadingCache } from "obsidian";

export default function (headings: HeadingCache[], line: number): number {
	let left = 0;
	let right = headings.length - 1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const midLine = headings[mid].position.start.line;

		if (midLine === line) {
			return mid;
		} else if (midLine < line) {
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return right;
}
