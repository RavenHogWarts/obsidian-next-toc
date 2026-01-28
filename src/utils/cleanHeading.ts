export function removeHeadingMark(s: string) {
	return s.replace(/^#+\s+/, "");
}
export function handleInternalLinks(s: string) {
	return s.replace(/\[\[([^\]]+)\]\]/g, "$1");
}
export function handleExternalLinks(s: string) {
	return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
export function keepBlockLatex(s: string) {
	return s.replace(/\$\$([^$]*)\$\$/g, "$1");
}
export function keepInlineLatex(s: string) {
	return s.replace(/\$([^$]*)\$/g, "$1");
}
export function removeHighlight(s: string) {
	return s.replace(/==([^=]+)==/g, "$1");
}
export function removeStrikethrough(s: string) {
	return s.replace(/~~([^~]+)~~/g, "$1");
}
export function removeHtmlTags(s: string) {
	let previous;
	do {
		previous = s;
		s = s.replace(/<[^>]+>/g, "");
	} while (s !== previous);
	return s;
}
export function removeSuperscript(s: string) {
	return s.replace(/\^([^^]+)\^/g, "$1");
}
export function removeComments(s: string) {
	return s.replace(/%%[^%]*%%/g, "");
}
export function removeBold(s: string) {
	return s.replace(/\*\*([^*]+)\*\*/g, "$1");
}
export function removeItalic(s: string) {
	return s.replace(/\*([^*]+)\*/g, "$1");
}
export function removeSingleEmphasis(s: string) {
	return s.replace(/(?:^|[^\w{}])([*`~])(?![^\w{}]|$)/g, "$1");
}

export default function (heading: string) {
	return [
		removeHeadingMark,
		handleInternalLinks,
		handleExternalLinks,
		keepBlockLatex,
		keepInlineLatex,
		removeHighlight,
		removeStrikethrough,
		removeHtmlTags,
		removeSuperscript,
		removeComments,
		removeBold,
		removeItalic,
		removeSingleEmphasis,
	]
		.reduce((s, fn) => fn(s), heading)
		.trim();
}
