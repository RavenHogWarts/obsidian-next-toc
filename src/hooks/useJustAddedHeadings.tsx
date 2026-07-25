import { useEffect, useRef, useState } from "react";

/** 高亮持续时长（ms）：超过后移出集合，避免折叠再展开时重复闪 */
const JUST_ADDED_MS = 750;
/** 单次渲染最多高亮的新增数量，超过视为大段插入 / 切换文档，不闪 */
const MAX_FLASH_BURST = 3;

/**
 * 检测「相对上一次渲染净新增」的标题（按稳定 key），返回这些 key 的集合，
 * 供给新插入的 TOC 项打 `data-just-added` 触发一次高亮闪烁（方案 C）。
 *
 * 判定规则（尽量只在"键入了一个新标题"时触发）：
 * - 首次渲染只做种子，不判定新增（避免整表闪）。
 * - 仅在标题**总数净增加**时才闪：纯文本编辑会让内容签名 key 变化，但总数不变，
 *   因此不会在逐字键入标题标题文本时反复闪。
 * - 与上次无交集（切换文档）或单次新增过多（大段粘贴）时不闪。
 * - 每个新增 key 在 {@link JUST_ADDED_MS} 后自动移出集合。
 *
 * @param stableKeys 由 getStableHeadingKeys 生成的稳定 key 数组（与 headings 等长）
 */
export function useJustAddedHeadings(stableKeys: string[]): Set<string> {
	const prevKeysRef = useRef<Set<string> | null>(null);
	const timersRef = useRef<Map<string, number>>(new Map());
	const [justAdded, setJustAdded] = useState<Set<string>>(() => new Set());

	useEffect(() => {
		const current = new Set(stableKeys);
		const prev = prevKeysRef.current;
		prevKeysRef.current = current;

		// 首次渲染：仅种子，不判定新增
		if (prev === null) return;

		const added = stableKeys.filter((k) => !prev.has(k));
		if (added.length === 0) return;
		// 仅在标题"净增加"时闪（键入新标题），排除纯文本编辑（键换但总数不变）
		if (current.size <= prev.size) return;
		// 排除切换文档 / 大段插入：与上次无交集，或单次新增过多
		const hasOverlap = stableKeys.some((k) => prev.has(k));
		if (!hasOverlap || added.length > MAX_FLASH_BURST) return;

		setJustAdded((s) => {
			const next = new Set(s);
			added.forEach((k) => next.add(k));
			return next;
		});

		const timers = timersRef.current;
		added.forEach((k) => {
			const existing = timers.get(k);
			if (existing) window.clearTimeout(existing);
			const id = window.setTimeout(() => {
				timers.delete(k);
				setJustAdded((s) => {
					if (!s.has(k)) return s;
					const next = new Set(s);
					next.delete(k);
					return next;
				});
			}, JUST_ADDED_MS);
			timers.set(k, id);
		});
	}, [stableKeys]);

	// 卸载时清理所有计时器
	useEffect(() => {
		const timers = timersRef.current;
		return () => {
			timers.forEach((id) => window.clearTimeout(id));
			timers.clear();
		};
	}, []);

	return justAdded;
}
