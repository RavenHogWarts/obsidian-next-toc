import { isFileInBlacklist } from "@src/utils/checkBlacklist";
import { MarkdownView, TFile } from "obsidian";
import { useEffect, useState } from "react";

interface UseHeadingNumberStateProps {
	currentView: MarkdownView;
	defaultUseHeadingNumber: boolean;
	hideHeadingNumberBlacklist: string[];
}

/**
 * 通过 frontmatter cssclasses 和黑名单来确定是否使用标题编号
 *
 * 优先级（从高到低）：
 * 1. frontmatter cssclass: `number-ntoc` 强制显示，`unnumber-ntoc` 强制隐藏
 * 2. 黑名单: 如果文件在黑名单中则隐藏
 * 3. 全局设置: defaultUseHeadingNumber
 *
 * @param currentView - 当前 MarkdownView
 * @param defaultUseHeadingNumber - 全局设置的默认值
 * @param hideHeadingNumberBlacklist - 隐藏标题编号的黑名单
 * @returns 是否应该使用标题编号
 */
export const useHeadingNumberState = ({
	currentView,
	defaultUseHeadingNumber,
	hideHeadingNumberBlacklist,
}: UseHeadingNumberStateProps): boolean => {
	const [shouldUseNumber, setShouldUseNumber] = useState<boolean>(
		defaultUseHeadingNumber,
	);

	useEffect(() => {
		const updateNumberState = () => {
			const file = currentView?.file;

			if (!file) {
				setShouldUseNumber(defaultUseHeadingNumber);
				return;
			}

			const metadata = currentView.app.metadataCache.getFileCache(file);
			const frontmatter = metadata?.frontmatter;

			// 1. 优先检查 frontmatter cssclasses
			if (frontmatter) {
				const cssclasses =
					frontmatter.cssclasses || frontmatter.cssclass;
				let classArray: string[] = [];

				if (typeof cssclasses === "string") {
					classArray = [cssclasses];
				} else if (Array.isArray(cssclasses)) {
					classArray = cssclasses;
				}

				// `number-ntoc` 强制显示标题编号
				if (classArray.includes("number-ntoc")) {
					setShouldUseNumber(true);
					return;
				}

				// `unnumber-ntoc` 强制隐藏标题编号
				if (classArray.includes("unnumber-ntoc")) {
					setShouldUseNumber(false);
					return;
				}
			}

			// 2. 检查黑名单（仅在全局开启时生效）
			if (defaultUseHeadingNumber) {
				if (isFileInBlacklist(file, hideHeadingNumberBlacklist)) {
					setShouldUseNumber(false);
					return;
				}
			}

			// 3. 使用全局设置
			setShouldUseNumber(defaultUseHeadingNumber);
		};

		updateNumberState();

		// 监听 metadata 变化
		const metadataChangeHandler = currentView.app.metadataCache.on(
			"changed",
			(file: TFile) => {
				if (file === currentView.file) {
					updateNumberState();
				}
			},
		);

		return () => {
			currentView.app.metadataCache.offref(metadataChangeHandler);
		};
	}, [currentView, defaultUseHeadingNumber, hideHeadingNumberBlacklist]);

	return shouldUseNumber;
};
