import { HeadingCache } from "obsidian";
import { useCallback } from "react";

/**
 * 生成标题编号的 Hook
 * @param headings 标题列表
 * @param skipHeading1 是否跳过一级标题
 * @param startIndex 标题编号起始值 (默认1)
 * @returns 生成标题编号的函数
 */
export const useHeadingNumbering = (
	headings: HeadingCache[],
	skipHeading1: boolean,
	startIndex: number,
) => {
	const generateHeadingNumber = useCallback(
		(index: number): string => {
			if (skipHeading1 && headings[index].level === 1) {
				return "";
			}

			const numberStack: number[] = [];
			let prevLevel = 0;

			for (let i = 0; i <= index; i++) {
				const { level } = headings[i];

				// 跳过 h1（如果配置了跳过）
				if (skipHeading1 && level === 1) {
					continue;
				}

				if (level > prevLevel) {
					// 新的更深层级，补 startIndex
					numberStack.push(startIndex);
				} else if (level === prevLevel) {
					// 同级，递增
					numberStack[numberStack.length - 1]++;
				} else {
					// 回到上层，弹出多余层级，递增
					const diff = prevLevel - level;
					for (let d = 0; d < diff; d++) {
						numberStack.pop();
					}
					// 确保栈不为空 (处理异常情况)
					if (numberStack.length > 0) {
						numberStack[numberStack.length - 1]++;
					}
				}
				prevLevel = level;
			}

			return numberStack.join(".") + ".";
		},
		[headings, skipHeading1, startIndex],
	);

	return generateHeadingNumber;
};
