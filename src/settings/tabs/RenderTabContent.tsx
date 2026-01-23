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
				slots={{
					name: LL.settings.render.skipHeading1.name(),
					desc: LL.settings.render.skipHeading1.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.skipHeading1}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"render.skipHeading1",
									value,
								);
							}}
						/>
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
		</ObsidianSetting.Container>
	);
};
