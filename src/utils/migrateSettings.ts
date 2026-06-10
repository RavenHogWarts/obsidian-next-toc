/**
 * 迁移旧配置数据，使其与新版本的数据结构兼容。
 * 必须在 mergeWithDefaults 之前调用，否则已删除的旧键会被丢弃。
 */
export function migrateSettings(saved: Record<string, unknown>): void {
	const render = saved.render as Record<string, unknown> | undefined;
	if (
		render &&
		"skipHeading1" in render &&
		!("skipHeadingLevels" in render)
	) {
		render.skipHeadingLevels = render.skipHeading1 === true ? [1] : [];
		delete render.skipHeading1;
	}
}
