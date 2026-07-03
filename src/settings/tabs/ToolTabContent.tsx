import { IconPicker } from "@src/components/icon-picker/IconPicker";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { LL } from "@src/i18n/i18n";
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
					name: LL.settings.tool.toolbarAlwaysShow.name(),
					desc: LL.settings.tool.toolbarAlwaysShow.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarAlwaysShow}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarAlwaysShow",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.showProgressBar.name(),
					desc: LL.settings.tool.showProgressBar.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.showProgressBar}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.showProgressBar",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.showProgressCircle.name(),
					desc: LL.settings.tool.showProgressCircle.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.showProgressCircle}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.showProgressCircle",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.useToolbar.name(),
					desc: LL.settings.tool.useToolbar.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.useToolbar}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.useToolbar",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.headings.toolbarButtons(),
				}}
				heading={true}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.pinTOC.name(),
					desc: LL.settings.tool.toolbarButtons.pinTOC.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.pinTOC}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.pinTOC",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.changePosition.name(),
					desc: LL.settings.tool.toolbarButtons.changePosition.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.changePosition}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.changePosition",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.expandCollapse.name(),
					desc: LL.settings.tool.toolbarButtons.expandCollapse.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.expandCollapse}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.expandCollapse",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.leftOffset.name(),
					desc: LL.settings.tool.toolbarButtons.leftOffset.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.leftOffset}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.leftOffset",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.rightOffset.name(),
					desc: LL.settings.tool.toolbarButtons.rightOffset.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.rightOffset}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.rightOffset",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.upOffset.name(),
					desc: LL.settings.tool.toolbarButtons.upOffset.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.upOffset}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.upOffset",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.downOffset.name(),
					desc: LL.settings.tool.toolbarButtons.downOffset.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.downOffset}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.downOffset",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.toolbarButtons.copyTOC.name(),
					desc: LL.settings.tool.toolbarButtons.copyTOC.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.tool.toolbarButtons.copyTOC}
							onChange={(value) => {
								void settingsStore.updateSettingByPath(
									"tool.toolbarButtons.copyTOC",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.headings.returnButtons(),
				}}
				heading={true}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.returnToCursor.name(),
					desc: LL.settings.tool.returnToCursor.desc(),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToCursor.enabled}
								onChange={(value) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToCursor.enabled",
										value,
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={() => {
									void settingsStore.updateSettingByPath(
										"tool.returnToCursor.icon",
										DEFAULT_SETTINGS.tool.returnToCursor
											.icon,
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToCursor.icon}
								onChange={(icon) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToCursor.icon",
										icon,
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.returnToTop.name(),
					desc: LL.settings.tool.returnToTop.desc(),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToTop.enabled}
								onChange={(value) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToTop.enabled",
										value,
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={() => {
									void settingsStore.updateSettingByPath(
										"tool.returnToTop.icon",
										DEFAULT_SETTINGS.tool.returnToTop.icon,
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToTop.icon}
								onChange={(icon) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToTop.icon",
										icon,
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.returnToBottom.name(),
					desc: LL.settings.tool.returnToBottom.desc(),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.returnToBottom.enabled}
								onChange={(value) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToBottom.enabled",
										value,
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={() => {
									void settingsStore.updateSettingByPath(
										"tool.returnToBottom.icon",
										DEFAULT_SETTINGS.tool.returnToBottom
											.icon,
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.returnToBottom.icon}
								onChange={(icon) => {
									void settingsStore.updateSettingByPath(
										"tool.returnToBottom.icon",
										icon,
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.jumpToNextHeading.name(),
					desc: LL.settings.tool.jumpToNextHeading.desc(),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.jumpToNextHeading.enabled}
								onChange={(value) => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.enabled",
										value,
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={() => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.icon",
										DEFAULT_SETTINGS.tool.jumpToNextHeading
											.icon,
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.jumpToNextHeading.icon}
								onChange={(icon) => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToNextHeading.icon",
										icon,
									);
								}}
							/>
						</>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.tool.jumpToPrevHeading.name(),
					desc: LL.settings.tool.jumpToPrevHeading.desc(),
					control: (
						<>
							<ObsidianSetting.Toggle
								value={settings.tool.jumpToPrevHeading.enabled}
								onChange={(value) => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.enabled",
										value,
									);
								}}
							/>
							<ObsidianSetting.ExtraButton
								icon={"reset"}
								onClick={() => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.icon",
										DEFAULT_SETTINGS.tool.jumpToPrevHeading
											.icon,
									);
								}}
							/>
							<IconPicker
								app={app}
								value={settings.tool.jumpToPrevHeading.icon}
								onChange={(icon) => {
									void settingsStore.updateSettingByPath(
										"tool.jumpToPrevHeading.icon",
										icon,
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
