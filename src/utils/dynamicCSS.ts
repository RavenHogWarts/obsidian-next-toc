import { NTocPluginSettings } from "@src/types/types";

export function updateDynamicCSS(settings: NTocPluginSettings) {
	const styleId = "NToc__dynamic-styles";
	
	// 移除已存在的样式
	const existingStyle = document.getElementById(styleId);
	if (existingStyle) {
		existingStyle.remove();
	}

	// 创建新的样式元素
	const style = document.createElement("style");
	style.id = styleId;
	
	const { showToc, hideToc, showTocNumber, hideTocNumber } = settings.render.customClassNames;
    const defaultOffset = settings.toc.offset || 12;
    // 设置CSS变量用于偏移量
    document.documentElement.style.setProperty('--ntoc-offset', `${defaultOffset}px`);

	// 生成动态CSS规则
	style.textContent = `
		/* 特定页面控制样式 - 动态生成 */
		.${showToc} ~ .NToc__view .NToc__container {
			opacity: 1;
			visibility: visible;
		}
		.${hideToc} ~ .NToc__view .NToc__container {
			opacity: 0;
			visibility: hidden;
		}

		.${showTocNumber} ~ .NToc__view .NToc__toc-item-number {
			display: block !important;
		}
		.${hideTocNumber} ~ .NToc__view .NToc__toc-item-number {
			display: none !important;
		}
	`;

	// 将样式添加到文档头部
	document.head.appendChild(style);
}

export function removeDynamicCSS() {
	const styleId = "NToc__dynamic-styles";
	const existingStyle = document.getElementById(styleId);
	if (existingStyle) {
		existingStyle.remove();
	}
}