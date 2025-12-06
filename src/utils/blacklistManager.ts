import { Notice, TFile } from "obsidian";
import { t } from "../i18n/i18n";
import { isFileInBlacklist } from "./checkBlacklist";

/**
 * Check if a path/pattern would be redundant in the blacklist
 * @param newPattern - The pattern to check
 * @param blacklist - Current blacklist
 * @returns true if the pattern is already covered by existing patterns
 */
export function isPatternRedundant(
	newPattern: string,
	blacklist: string[]
): boolean {
	// Check if exact pattern already exists
	if (blacklist.includes(newPattern)) {
		return true;
	}

	// Check if a broader pattern already covers this one
	// For example, if "test/*.md" exists, "test/123.md" is redundant
	for (const pattern of blacklist) {
		if (pattern === newPattern) continue;

		// Convert glob pattern to regex
		const regexPattern = pattern
			.replace(/[.+^${}()|[\]\\]/g, "\\$&")
			.replace(/\*/g, ".*")
			.replace(/\?/g, ".");

		const regex = new RegExp(`^${regexPattern}$`);
		if (regex.test(newPattern)) {
			return true;
		}
	}

	return false;
}

/**
 * Check if adding a pattern would make existing patterns redundant
 * @param newPattern - The new pattern to add
 * @param blacklist - Current blacklist
 * @returns Array of patterns that would become redundant
 */
export function findRedundantPatterns(
	newPattern: string,
	blacklist: string[]
): string[] {
	const redundant: string[] = [];

	// Convert new pattern to regex
	const regexPattern = newPattern
		.replace(/[.+^${}()|[\]\\]/g, "\\$&")
		.replace(/\*/g, ".*")
		.replace(/\?/g, ".");

	const regex = new RegExp(`^${regexPattern}$`);

	for (const pattern of blacklist) {
		if (pattern === newPattern) continue;
		// If new pattern matches existing pattern, the existing one is redundant
		if (regex.test(pattern)) {
			redundant.push(pattern);
		}
	}

	return redundant;
}

/**
 * Add a file path to blacklist with smart duplicate detection
 * @param filePath - The file path to add
 * @param blacklist - Current blacklist
 * @returns Updated blacklist or null if no change
 */
export function addToBlacklist(
	filePath: string,
	blacklist: string[]
): string[] | null {
	// Check if pattern is redundant
	if (isPatternRedundant(filePath, blacklist)) {
		new Notice(`${filePath}: ${t("notices.alreadyCovered")}`);
		return null;
	}

	// Find patterns that would become redundant
	const redundant = findRedundantPatterns(filePath, blacklist);

	// Add new pattern and remove redundant ones
	const newBlacklist = blacklist.filter((p) => !redundant.includes(p));
	newBlacklist.push(filePath);

	if (redundant.length > 0) {
		new Notice(
			`${filePath}: ${t("notices.addedAndRemovedRedundant", {
				count: redundant.length,
			})}`
		);
	} else {
		new Notice(`${filePath}: ${t("notices.added")}`);
	}

	return newBlacklist;
}

/**
 * Remove a file path from blacklist
 * @param filePath - The file path to remove
 * @param blacklist - Current blacklist
 * @returns Updated blacklist or null if no change
 */
export function removeFromBlacklist(
	filePath: string,
	blacklist: string[]
): string[] | null {
	if (!blacklist.includes(filePath)) {
		new Notice(`${filePath}: ${t("notices.notInBlacklist")}`);
		return null;
	}

	const newBlacklist = blacklist.filter((p) => p !== filePath);
	new Notice(`${filePath}: ${t("notices.removed")}`);
	return newBlacklist;
}

/**
 * Toggle file in blacklist (add if not present, remove if present)
 * @param file - The file to toggle
 * @param blacklist - Current blacklist
 * @returns Updated blacklist or null if no change
 */
export function toggleFileInBlacklist(
	file: TFile,
	blacklist: string[]
): string[] | null {
	const filePath = file.path;

	// Check if file is covered by any pattern in blacklist
	if (isFileInBlacklist(file, blacklist)) {
		// Try to remove exact match first
		if (blacklist.includes(filePath)) {
			return removeFromBlacklist(filePath, blacklist);
		} else {
			// File is covered by a pattern, inform user
			new Notice(`${filePath}: ${t("notices.coveredByPattern")}`);
			return null;
		}
	} else {
		// Add to blacklist
		return addToBlacklist(filePath, blacklist);
	}
}

/**
 * Toggle folder in blacklist (add if not present, remove if present)
 * @param file - A file in the folder
 * @param blacklist - Current blacklist
 * @returns Updated blacklist or null if no change
 */
export function toggleFolderInBlacklist(
	file: TFile,
	blacklist: string[]
): string[] | null {
	const folderPath = file.parent?.path || "";
	const pattern = folderPath ? `${folderPath}/*.md` : "*.md";

	// Check if pattern exists
	if (blacklist.includes(pattern)) {
		return removeFromBlacklist(pattern, blacklist);
	} else {
		return addToBlacklist(pattern, blacklist);
	}
}
