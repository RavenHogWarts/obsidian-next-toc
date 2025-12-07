import { InlineCodeBlock } from "@src/components/code-block/InlineCodeBlock";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { t } from "@src/i18n/i18n";
import { NTocPosition } from "@src/types/types";
import { FC } from "react";
import ObsidianSetting from "../ObsidianSetting";

export const TocTabContent: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	return (
		<ObsidianSetting.Container>
			<ObsidianSetting
				slots={{
					name: t("settings.toc.show.name"),
					desc: t("settings.toc.show.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.toc.show}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"toc.show",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.toc.alwaysExpand.name"),
					desc: (
						<>
							{t("settings.toc.alwaysExpand.desc")}
							<InlineCodeBlock code="pin-ntoc" />
							<InlineCodeBlock code="unpin-ntoc" />
						</>
					),
					control: (
						<ObsidianSetting.Toggle
							value={settings.toc.alwaysExpand}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"toc.alwaysExpand",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.toc.width.name"),
					desc: t("settings.toc.width.desc"),
					control: (
						<ObsidianSetting.Text
							value={settings.toc.width.toString()}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"toc.width",
									Number(value)
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.toc.position.name"),
					desc: t("settings.toc.position.desc"),
					control: (
						<ObsidianSetting.Dropdown
							value={settings.toc.position}
							options={{
								left: t("settings.toc.position.options.left"),
								right: t("settings.toc.position.options.right"),
							}}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"toc.position",
									value as NTocPosition
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.toc.offset.name"),
					desc: t("settings.toc.offset.desc"),
					control: (
						<ObsidianSetting.Text
							value={settings.toc.offset.toString()}
							onChange={(value) => {
								settingsStore.updateSettingByPath(
									"toc.offset",
									Number(value)
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				visible={settings.toc.show}
				slots={{
					name: t("settings.toc.hideBlacklist.name"),
					desc: t("settings.toc.hideBlacklist.desc"),
					control: (
						<ObsidianSetting.TextArea
							value={settings.toc.hideBlacklist.join("\n")}
							onChange={(value) => {
								const list = value
									.split("\n")
									.map((line) => line.trim())
									.filter((line) => line.length > 0);
								settingsStore.updateSettingByPath(
									"toc.hideBlacklist",
									list
								);
							}}
						/>
					),
				}}
			/>
		</ObsidianSetting.Container>
	);
};
