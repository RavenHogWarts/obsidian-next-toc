import { IconPicker } from "@src/components/icon-picker/IconPicker";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { t } from "@src/i18n/i18n";
import { DEFAULT_SETTINGS } from "@src/types/types";
import { FC } from "react";
import ObsidianSetting from "../ObsidianSetting";

export const ToolTabContent: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const app = settingsStore.app;

	return (
		<ObsidianSetting.Container>
			<ObsidianSetting
				slots={{
					name: t("settings.tool.useToolbar.name"),
					desc: t("settings.tool.useToolbar.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.useToolbar}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"tool.useToolbar",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.showProgressBar.name"),
					desc: t("settings.tool.showProgressBar.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.showProgressBar}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"tool.showProgressBar",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.showProgressCircle.name"),
					desc: t("settings.tool.showProgressCircle.desc"),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.showProgressCircle}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"tool.showProgressCircle",
									value
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.headings.returnButtons"),
				}}
				heading={true}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.returnToCursor.name"),
					desc: t("settings.tool.returnToCursor.desc"),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToCursor.enabled}
								onChange={async (value) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToCursor.enabled",
										value
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={async () => {
									await settingsStore.updateSettingByPath(
										"tool.returnToCursor.icon",
										DEFAULT_SETTINGS.tool.returnToCursor
											.icon
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToCursor.icon}
								onChange={async (icon) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToCursor.icon",
										icon
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.returnToTop.name"),
					desc: t("settings.tool.returnToTop.desc"),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToTop.enabled}
								onChange={async (value) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToTop.enabled",
										value
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={async () => {
									await settingsStore.updateSettingByPath(
										"tool.returnToTop.icon",
										DEFAULT_SETTINGS.tool.returnToTop.icon
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToTop.icon}
								onChange={async (icon) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToTop.icon",
										icon
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.returnToBottom.name"),
					desc: t("settings.tool.returnToBottom.desc"),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToBottom.enabled}
								onChange={async (value) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToBottom.enabled",
										value
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={async () => {
									await settingsStore.updateSettingByPath(
										"tool.returnToBottom.icon",
										DEFAULT_SETTINGS.tool.returnToBottom
											.icon
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToBottom.icon}
								onChange={async (icon) => {
									await settingsStore.updateSettingByPath(
										"tool.returnToBottom.icon",
										icon
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.jumpToNextHeading.name"),
					desc: t("settings.tool.jumpToNextHeading.desc"),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.jumpToNextHeading.enabled}
								onChange={async (value) => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.enabled",
										value
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={async () => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.icon",
										DEFAULT_SETTINGS.tool.jumpToNextHeading
											.icon
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.jumpToNextHeading.icon}
								onChange={async (icon) => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.icon",
										icon
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: t("settings.tool.jumpToPrevHeading.name"),
					desc: t("settings.tool.jumpToPrevHeading.desc"),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.jumpToPrevHeading.enabled}
								onChange={async (value) => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.enabled",
										value
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={async () => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.icon",
										DEFAULT_SETTINGS.tool.jumpToPrevHeading
											.icon
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.jumpToPrevHeading.icon}
								onChange={async (icon) => {
									await settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.icon",
										icon
									);
								}}
							/>
						</>
					),
				}}
			/>
		</ObsidianSetting.Container>
	);
};
