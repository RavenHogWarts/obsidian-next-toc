function removeHeadingMark(s: string) {
	return s.replace(/^#+\s+/, "");
}
function handleInternalLinks(s: string) {
	return s.replace(/\[\[([^\]]+)\]\]/g, "$1");
}
function handleExternalLinks(s: string) {
	return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}
function keepBlockLatex(s: string) {
	return s.replace(/\$\$([^$]*)\$\$/g, "$1");
}
function keepInlineLatex(s: string) {
	return s.replace(/\$([^$]*)\$/g, "$1");
}
function removeHighlight(s: string) {
	return s.replace(/==([^=]+)==/g, "$1");
}
function removeStrikethrough(s: string) {
	return s.replace(/~~([^~]+)~~/g, "$1");
}
function removeHtmlTags(s: string) {
	return s.replace(/<[^>]+>/g, "");
}
function removeSuperscript(s: string) {
	return s.replace(/\^([^^]+)\^/g, "$1");
}
function removeComments(s: string) {
	return s.replace(/%%[^%]*%%/g, "");
}
function removeBold(s: string) {
	return s.replace(/\*\*([^*]+)\*\*/g, "$1");
}
function removeItalic(s: string) {
	return s.replace(/\*([^*]+)\*/g, "$1");
}
function removeSingleEmphasis(s: string) {
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
