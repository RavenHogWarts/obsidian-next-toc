import { IconPicker } from "@src/components/icon-picker/IconPicker";
import { Tab, TabItem } from "@src/components/tab/Tab";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { t } from "@src/i18n/i18n";
import { DEFAULT_SETTINGS, NTocPosition } from "@src/types/types";
import { FC } from "react";
import ObsidianSetting from "./ObsidianSetting";

export const NTocSettings: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const app = settingsStore.app;

	const tabItems: TabItem[] = [
		{
			id: "toc",
			title: t("settings.toc.name"),
			content: (
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
							desc: t("settings.toc.alwaysExpand.desc"),
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
										left: t(
											"settings.toc.position.options.left"
										),
										right: t(
											"settings.toc.position.options.right"
										),
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
				</ObsidianSetting.Container>
			),
		},
		{
			id: "render",
			title: t("settings.render.name"),
			content: (
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
			),
		},
		{
			id: "tool",
			title: t("settings.tool.name"),
			content: (
				<ObsidianSetting.Container>
					<ObsidianSetting
						slots={{
							name: t("settings.tool.useToolbar.name"),
							desc: t("settings.tool.useToolbar.desc"),
							control: (
								<ObsidianSetting.Toggle
									value={settings.tool.useToolbar}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
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
									onChange={(value) => {
										settingsStore.updateSettingByPath(
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
									onChange={(value) => {
										settingsStore.updateSettingByPath(
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
							name: t("settings.tool.returnToCursor.name"),
							desc: t("settings.tool.returnToCursor.desc"),
							control: (
								<>
									<ObsidianSetting.Toggle
										value={
											settings.tool.returnToCursor.enabled
										}
										onChange={(value) => {
											settingsStore.updateSettingByPath(
												"tool.returnToCursor.enabled",
												value
											);
										}}
									/>
									<ObsidianSetting.ExtraButton
										icon="reset"
										onClick={() => {
											settingsStore.updateSettingByPath(
												"tool.returnToCursor.icon",
												DEFAULT_SETTINGS.tool
													.returnToCursor.icon
											);
										}}
									/>
									<IconPicker
										app={app}
										value={
											settings.tool.returnToCursor.icon
										}
										onChange={(icon) => {
											settingsStore.updateSettingByPath(
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
										value={
											settings.tool.returnToTop.enabled
										}
										onChange={(value) => {
											settingsStore.updateSettingByPath(
												"tool.returnToTop.enabled",
												value
											);
										}}
									/>
									<ObsidianSetting.ExtraButton
										icon="reset"
										onClick={() => {
											settingsStore.updateSettingByPath(
												"tool.returnToTop.icon",
												DEFAULT_SETTINGS.tool
													.returnToTop.icon
											);
										}}
									/>
									<IconPicker
										app={app}
										value={settings.tool.returnToTop.icon}
										onChange={(icon) => {
											settingsStore.updateSettingByPath(
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
										value={
											settings.tool.returnToBottom.enabled
										}
										onChange={(value) => {
											settingsStore.updateSettingByPath(
												"tool.returnToBottom.enabled",
												value
											);
										}}
									/>
									<ObsidianSetting.ExtraButton
										icon="reset"
										onClick={() => {
											settingsStore.updateSettingByPath(
												"tool.returnToBottom.icon",
												DEFAULT_SETTINGS.tool
													.returnToBottom.icon
											);
										}}
									/>
									<IconPicker
										app={app}
										value={
											settings.tool.returnToBottom.icon
										}
										onChange={(icon) => {
											settingsStore.updateSettingByPath(
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
										value={
											settings.tool.jumpToNextHeading
												.enabled
										}
										onChange={(value) => {
											settingsStore.updateSettingByPath(
												"tool.jumpToNextHeading.enabled",
												value
											);
										}}
									/>
									<ObsidianSetting.ExtraButton
										icon="reset"
										onClick={() => {
											settingsStore.updateSettingByPath(
												"tool.jumpToNextHeading.icon",
												DEFAULT_SETTINGS.tool
													.jumpToNextHeading.icon
											);
										}}
									/>
									<IconPicker
										app={app}
										value={
											settings.tool.jumpToNextHeading.icon
										}
										onChange={(icon) => {
											settingsStore.updateSettingByPath(
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
										value={
											settings.tool.jumpToPrevHeading
												.enabled
										}
										onChange={(value) => {
											settingsStore.updateSettingByPath(
												"tool.jumpToPrevHeading.enabled",
												value
											);
										}}
									/>
									<ObsidianSetting.ExtraButton
										icon="reset"
										onClick={() => {
											settingsStore.updateSettingByPath(
												"tool.jumpToPrevHeading.icon",
												DEFAULT_SETTINGS.tool
													.jumpToPrevHeading.icon
											);
										}}
									/>
									<IconPicker
										app={app}
										value={
											settings.tool.jumpToPrevHeading.icon
										}
										onChange={(icon) => {
											settingsStore.updateSettingByPath(
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
			),
		},
		{
			id: "advanced",
			title: t("settings.advanced.name"),
			content: (
				<ObsidianSetting.Container>
					<ObsidianSetting
						slots={{
							name: t("settings.advanced.customClassNames.name"),
							desc: t("settings.advanced.customClassNames.desc"),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: t("settings.advanced.customClassNames.showToc.name"),
							desc: t("settings.advanced.customClassNames.showToc.desc"),
							control: (
								<ObsidianSetting.Text
									value={settings.advanced.customClassNames.showToc}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"advanced.customClassNames.showToc",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: t("settings.advanced.customClassNames.hideToc.name"),
							desc: t("settings.advanced.customClassNames.hideToc.desc"),
							control: (
								<ObsidianSetting.Text
									value={settings.advanced.customClassNames.hideToc}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"advanced.customClassNames.hideToc",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: t("settings.advanced.customClassNames.showTocNumber.name"),
							desc: t("settings.advanced.customClassNames.showTocNumber.desc"),
							control: (
								<ObsidianSetting.Text
									value={settings.advanced.customClassNames.showTocNumber}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"advanced.customClassNames.showTocNumber",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: t("settings.advanced.customClassNames.hideTocNumber.name"),
							desc: t("settings.advanced.customClassNames.hideTocNumber.desc"),
							control: (
								<ObsidianSetting.Text
									value={settings.advanced.customClassNames.hideTocNumber}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"advanced.customClassNames.hideTocNumber",
											value
										);
									}}
								/>
							),
						}}
					/>
				</ObsidianSetting.Container>
			),
		},
	];

	return (
		<Tab
			items={tabItems}
			defaultValue="toc"
			orientation="horizontal"
			className="NToc__settings-tabs"
		/>
	);
};
