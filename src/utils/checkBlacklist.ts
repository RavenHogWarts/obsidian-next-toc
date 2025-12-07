import { TFile } from "obsidian";

/**
 * Check if a file is in the blacklist
 * Supports exact match and glob patterns with wildcards
 * @param file - The file to check
 * @param blacklist - Array of file paths or patterns (e.g., "folder/file.md", "*.md", "folder/*.md")
 * @returns true if the file matches any pattern in the blacklist
 */
export function isFileInBlacklist(
	file: TFile | null,
	blacklist: string[]
): boolean {
	if (!file || blacklist.length === 0) {
		return false;
	}

	const filePath = file.path;

	return blacklist.some((pattern) => {
		// Exact match
		if (pattern === filePath) {
			return true;
		}

		// Convert glob pattern to regex
		// Escape special regex characters except * and ?
		const regexPattern = pattern
			.replace(/[.+^${}()|[\]\\]/g, "\\$&") // Escape special chars
			.replace(/\*/g, ".*") // * matches any characters
			.replace(/\?/g, "."); // ? matches single character

		const regex = new RegExp(`^${regexPattern}$`);
		return regex.test(filePath);
	});
}

/**
 * Get the final value for whether to use heading numbers based on settings and blacklist
 * Only checks blacklist when useHeadingNumber is true
 * @param defaultUseHeadingNumber - The default useHeadingNumber setting value
 * @param file - The current file
 * @param hideHeadingNumberBlacklist - Files that should hide heading numbers
 * @returns true if heading numbers should be shown
 */
export function shouldUseHeadingNumber(
	defaultUseHeadingNumber: boolean,
	file: TFile | null,
	hideHeadingNumberBlacklist: string[]
): boolean {
	// If useHeadingNumber is disabled, always return false
	if (!defaultUseHeadingNumber) {
		return false;
	}

	// If useHeadingNumber is enabled, check if file is in blacklist
	if (isFileInBlacklist(file, hideHeadingNumberBlacklist)) {
		return false;
	}

	// Otherwise show heading numbers
	return true;
}
