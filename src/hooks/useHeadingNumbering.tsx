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
			const currentHeading = headings[index];

			if (
				!currentHeading ||
				skipHeadingLevels.includes(currentHeading.level)
			) {
				return "";
			}

			const levelStack: number[] = [];
			const numberStack: number[] = [];

			for (let i = 0; i <= index; i++) {
				const { level } = headings[i];

				if (skipHeadingLevels.includes(level)) {
					continue;
				}

				while (
					levelStack.length > 0 &&
					levelStack[levelStack.length - 1] >= level
				) {
					levelStack.pop();
				}

				const depth = levelStack.length;
				if (numberStack.length <= depth) {
					numberStack.push(startIndex);
				} else {
					numberStack[depth] += 1;
					numberStack.length = depth + 1;
				}
				levelStack.push(level);
			}

			return numberStack.join(".") + ".";
		},
		[headings, skipHeadingLevels, startIndex],
	);

	return generateHeadingNumber;
};
