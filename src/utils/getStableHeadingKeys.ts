import { HeadingCache } from "obsidian";

/**
 * 为一组标题生成稳定的、与行号解耦的身份键，用于 React key。
 *
 * 采用「内容签名 + 出现序号」：`${level}::${heading}::${occurrence}`。
 * 同级同文本的重复标题通过出现序号消歧，保证同一次渲染内键全局唯一。
 *
 * 相比原先的 `toc-item-${index}-${start.line}`：在编辑（插入/删除行导致行号
 * 偏移）、拖拽排序、metadataCache 异步刷新等场景下，只要标题本身的层级与文本
 * 不变，键就保持稳定，React 不会重挂载对应列表项——从而避免这些场景误触发
 * `@starting-style` 进场动画（仅在标题真正新增 / 内容变化时才重挂载并播放动画）。
 *
 * 与 useTocCollapse 的 getCollapseKey 同源，但额外追加出现序号以满足 React key
 * 的全局唯一约束（Set 去重不需要，React key 需要）。
 *
 * @param headings 标题列表（文档顺序）
 * @returns 与 `headings` 等长、按下标对应的稳定键数组
 */
export function getStableHeadingKeys(headings: HeadingCache[]): string[] {
	const seen = new Map<string, number>();
	return headings.map((heading) => {
		const base = `${heading.level}::${heading.heading}`;
		const occurrence = seen.get(base) ?? 0;
		seen.set(base, occurrence + 1);
		return `${base}::${occurrence}`;
	});
}
