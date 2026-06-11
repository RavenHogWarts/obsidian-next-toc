import { HeadingCache, MarkdownView } from "obsidian";

export type ReorderFailReason =
	| "noFile"
	| "noHeadings"
	| "invalidIndex"
	| "samePosition"
	| "targetIsDescendant"
	| "editorError";

export interface ReorderResult {
	success: boolean;
	reason?: ReorderFailReason;
}

/**
 * 获取标题对应的完整章节范围（包含所有子标题内容）
 */
function getSectionRange(
	headings: HeadingCache[],
	currentIndex: number,
	totalLines: number,
): { startLine: number; endLine: number } {
	const currentLevel = headings[currentIndex].level;
	const startLine = headings[currentIndex].position.start.line;

	let endLine = totalLines;
	for (let i = currentIndex + 1; i < headings.length; i++) {
		if (headings[i].level <= currentLevel) {
			endLine = headings[i].position.start.line;
			break;
		}
	}

	return { startLine, endLine };
}

/**
 * 校验移动操作的合法性
 */
function validateReorder(
	headings: HeadingCache[],
	sourceIndex: number,
	targetIndex: number,
): ReorderResult {
	if (headings.length === 0) {
		return { success: false, reason: "noHeadings" };
	}
	if (
		sourceIndex < 0 ||
		sourceIndex >= headings.length ||
		targetIndex < 0 ||
		targetIndex >= headings.length
	) {
		return { success: false, reason: "invalidIndex" };
	}
	if (sourceIndex === targetIndex) {
		return { success: false, reason: "samePosition" };
	}

	// 检查目标是否在源标题的子树内（移动父标题到自身子树会导致文档损坏）
	if (targetIndex > sourceIndex) {
		const sourceLevel = headings[sourceIndex].level;
		for (let i = sourceIndex + 1; i <= targetIndex; i++) {
			if (headings[i].level <= sourceLevel) break;
			if (i === targetIndex) {
				return { success: false, reason: "targetIsDescendant" };
			}
		}
	}

	return { success: true };
}

/**
 * 在编辑器中移动章节内容
 * 编辑模式：使用 editor.transaction（支持 undo）
 * 阅读模式：使用 Vault.process（原子读写，避免竞态）
 */
export async function reorderSections(
	view: MarkdownView,
	headings: HeadingCache[],
	sourceIndex: number,
	targetIndex: number,
): Promise<ReorderResult> {
	if (!view.file) {
		return { success: false, reason: "noFile" };
	}

	const validation = validateReorder(headings, sourceIndex, targetIndex);
	if (!validation.success) {
		return validation;
	}

	try {
		if (view.getMode() === "preview") {
			// 阅读模式：使用 Vault.process 原子读写
			await view.app.vault.process(view.file, (data) => {
				const lines = data.split("\n");
				const totalLines = lines.length;
				// 排除文档末尾空行（由 trailing newline 产生），避免移动时带入多余空行
				const effectiveTotalLines =
					totalLines > 0 && lines[totalLines - 1] === ""
						? totalLines - 1
						: totalLines;
				const sourceRange = getSectionRange(
					headings,
					sourceIndex,
					effectiveTotalLines,
				);
				const movedLines = lines.slice(
					sourceRange.startLine,
					sourceRange.endLine,
				);

				let targetLine: number;
				if (targetIndex < sourceIndex) {
					targetLine = headings[targetIndex].position.start.line;
				} else {
					const targetRange = getSectionRange(
						headings,
						targetIndex,
						effectiveTotalLines,
					);
					targetLine = targetRange.endLine;
				}

				// 先删后插
				lines.splice(
					sourceRange.startLine,
					sourceRange.endLine - sourceRange.startLine,
				);
				if (targetLine > sourceRange.startLine) {
					targetLine -= sourceRange.endLine - sourceRange.startLine;
				}
				lines.splice(targetLine, 0, ...movedLines);

				return lines.join("\n");
			});
		} else {
			// 编辑模式：使用 editor.transaction（支持 undo）
			const editor = view.editor;
			const totalLines = editor.lineCount();
			// 排除文档末尾空行（由 trailing newline 产生），避免移动时带入多余空行
			const effectiveTotalLines =
				totalLines > 0 && editor.getLine(totalLines - 1) === ""
					? totalLines - 1
					: totalLines;
			const sourceRange = getSectionRange(
				headings,
				sourceIndex,
				effectiveTotalLines,
			);

			const sourceLines: string[] = [];
			for (let i = sourceRange.startLine; i < sourceRange.endLine; i++) {
				sourceLines.push(editor.getLine(i));
			}

			let targetLine: number;
			if (targetIndex < sourceIndex) {
				targetLine = headings[targetIndex].position.start.line;
			} else {
				const targetRange = getSectionRange(
					headings,
					targetIndex,
					effectiveTotalLines,
				);
				targetLine = targetRange.endLine;
			}

			const content = sourceLines.join("\n") + "\n";

			editor.transaction({
				changes: [
					{
						from: { line: sourceRange.startLine, ch: 0 },
						to: { line: sourceRange.endLine, ch: 0 },
						text: "",
					},
					{
						from: { line: targetLine, ch: 0 },
						to: { line: targetLine, ch: 0 },
						text: content,
					},
				],
			});
		}

		return { success: true };
	} catch (error) {
		console.error("[Reorder] 移动标题内容失败:", error);
		return {
			success: false,
			reason: "editorError",
		};
	}
}
