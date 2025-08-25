import { HeadingCache } from "obsidian";

export default function (index: number, headings: HeadingCache[]): boolean {
	if (index >= headings.length - 1) return false;
	return headings[index + 1].level > headings[index].level;
}
