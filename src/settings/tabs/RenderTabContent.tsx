import { InlineCodeBlock } from "@src/components/code-block/InlineCodeBlock";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { LL } from "@src/i18n/i18n";
import { FC } from "react";
import ObsidianSetting from "../ObsidianSetting";

export const RenderTabContent: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	return (
		<ObsidianSetting.Container>
			<ObsidianSetting
				slots={{
					name: LL.settings.render.useHeadingNumber.name(),
					desc: (
						<>
							{LL.settings.render.useHeadingNumber.desc()}
							<InlineCodeBlock code="number-ntoc" />
							<InlineCodeBlock code="unnumber-ntoc" />
						</>
					),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.useHeadingNumber}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.useHeadingNumber",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				// visible={settings.render.useHeadingNumber}
				slots={{
					name: LL.settings.render.numberingStartIndex.name(),
					desc: LL.settings.render.numberingStartIndex.desc(),
					control: (
						<ObsidianSetting.Dropdown
							value={settings.render.numberingStartIndex.toString()}
							options={{
								"0": LL.settings.render.numberingStartIndex.options.zero(),
								"1": LL.settings.render.numberingStartIndex.options.one(),
							}}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.numberingStartIndex",
									parseInt(value),
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.render.skipHeadingLevels.name(),
					desc: LL.settings.render.skipHeadingLevels.desc(),
					control: (
						<div
							style={{
								display: "flex",
								gap: "8px",
								flexWrap: "wrap",
							}}
						>
							{[1, 2, 3, 4, 5, 6].map((level) => (
								<label
									key={level}
									style={{
										display: "flex",
										alignItems: "center",
										gap: "4px",
										cursor: "pointer",
									}}
								>
									<input
										type="checkbox"
										checked={settings.render.skipHeadingLevels.includes(
											level,
										)}
										onChange={async (e) => {
											const current =
												settings.render
													.skipHeadingLevels;
											const updated = e.target.checked
												? [...current, level]
												: current.filter(
														(l) => l !== level,
													);
											await settingsStore.updateSettingByPath(
												"render.skipHeadingLevels",
												updated,
											);
										}}
									/>
									<span>H{level}</span>
								</label>
							))}
						</div>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.render.renderMarkdown.name(),
					desc: LL.settings.render.renderMarkdown.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.renderMarkdown}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.renderMarkdown",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.render.showWhenSingleHeading.name(),
					desc: LL.settings.render.showWhenSingleHeading.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.showWhenSingleHeading}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.showWhenSingleHeading",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				visible={settings.render.useHeadingNumber}
				slots={{
					name: LL.settings.render.hideHeadingNumberBlacklist.name(),
					desc: LL.settings.render.hideHeadingNumberBlacklist.desc(),
					control: (
						<ObsidianSetting.TextArea
							value={settings.render.hideHeadingNumberBlacklist.join(
								"\n",
							)}
							onChange={async (value) => {
								const list = value
									.split("\n")
									.map((line) => line.trim())
									.filter((line) => line.length > 0);
								await settingsStore.updateSettingByPath(
									"render.hideHeadingNumberBlacklist",
									list,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.render.enableDragSort.name(),
					desc: LL.settings.render.enableDragSort.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.enableDragSort}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.enableDragSort",
									value,
								);
							}}
						/>
					),
				}}
			/>
		</ObsidianSetting.Container>
	);
};
