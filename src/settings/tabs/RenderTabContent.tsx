import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { t } from "@src/i18n/i18n";
import { FC } from "react";
import ObsidianSetting from "../ObsidianSetting";

export const RenderTabContent: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	return (
		<ObsidianSetting.Container>
			<ObsidianSetting
				slots={{
					name: t("settings.render.useHeadingNumber.name"),
					desc: t("settings.render.useHeadingNumber.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.useHeadingNumber}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"render.useHeadingNumber",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.render.skipHeading1.name"),
					desc: t("settings.render.skipHeading1.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.skipHeading1}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"render.skipHeading1",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.render.renderMarkdown.name"),
					desc: t("settings.render.renderMarkdown.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.render.renderMarkdown}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"render.renderMarkdown",
									value
								);
							}}
						/>
					),
				}}
			/>
		</ObsidianSetting.Container>
	);
};
