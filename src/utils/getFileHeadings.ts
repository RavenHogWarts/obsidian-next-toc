import { HeadingCache, MarkdownView } from "obsidian";

export default async function (view: MarkdownView): Promise<HeadingCache[]> {
	if (!view.file) {
		return [];
	}

	const cache = await view.app.metadataCache.getFileCache(view.file);
	return cache?.headings || [];
}
