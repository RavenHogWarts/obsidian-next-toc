import { HeadingCache, MarkdownView } from "obsidian";

export default function (view: MarkdownView): HeadingCache[] {
	if (!view.file) {
		return [];
	}

	const cache = view.app.metadataCache.getFileCache(view.file);
	return cache?.headings || [];
}
