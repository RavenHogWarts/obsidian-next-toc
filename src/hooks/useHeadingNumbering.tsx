import { HeadingCache } from "obsidian";
import { useCallback } from "react";

/**
 * 生成标题编号的 Hook
 * @param headings 标题列表
 * @param skipHeadingLevels 需要跳过的标题层级列表
 * @param startIndex 标题编号起始值 (默认1)
 * @returns 生成标题编号的函数
 */
export const useHeadingNumbering = (
	headings: HeadingCache[],
	skipHeadingLevels: number[],
	startIndex: number,
) => {
	const generateHeadingNumber = useCallback(
		(index: number): string => {
			if (skipHeadingLevels.includes(headings[index].level)) {
				return "";
			}

			const numberStack: number[] = [];
			let prevLevel = 0;

			for (let i = 0; i <= index; i++) {
				const { level } = headings[i];

				// 跳过配置中指定的层级
				if (skipHeadingLevels.includes(level)) {
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
		[headings, skipHeadingLevels, startIndex],
	);

	return generateHeadingNumber;
};
