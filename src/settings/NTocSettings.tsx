import { Tab, TabItem } from "@src/components/tab/Tab";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { NTocPosition } from "@src/types/types";
import { FC } from "react";
import ObsidianSetting from "./ObsidianSetting";

export const NTocSettings: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	const tabItems: TabItem[] = [
		{
			id: "toc",
			title: "TOC",
			content: (
				<ObsidianSetting.Container>
					<ObsidianSetting
						slots={{
							name: "TOC show",
							desc: "Enable or disable the table of contents",
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
							name: "TOC always expand",
							desc: "Always expand the table of contents",
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
							name: "TOC width",
							desc: "Width of the table of contents panel",
							control: (
								<ObsidianSetting.Text
									value={settings.toc.width.toString()}
									onChange={(value) => {
										const numValue = parseInt(value) || 240;
										settingsStore.updateSettingByPath(
											"toc.width",
											numValue
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "TOC position",
							desc: "Position of the table of contents panel",
							control: (
								<ObsidianSetting.Dropdown
									value={settings.toc.position}
									options={{
										left: "Left",
										right: "Right",
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
							name: "TOC offset",
							desc: "Offset of the table of contents panel",
							control: (
								<ObsidianSetting.Text
									value={settings.toc.offset.toString()}
									onChange={(value) => {
										const numValue = parseInt(value) || 0;
										settingsStore.updateSettingByPath(
											"toc.offset",
											numValue
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
			title: "Render",
			content: (
				<ObsidianSetting.Container>
					<ObsidianSetting
						slots={{
							name: "Use heading number",
							desc: "Show heading numbers in the table of contents",
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
							name: "Skip heading 1",
							desc: "Skip the first heading (H1) in the table of contents",
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
							name: "Render markdown",
							desc: "Render markdown formatting in headings",
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
			title: "Tool",
			content: (
				<ObsidianSetting.Container>
					<ObsidianSetting
						slots={{
							name: "Use toolbar",
							desc: "Show the toolbar with navigation buttons",
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
							name: "Use progress",
							desc: "Show the reading progress indicator",
							control: (
								<ObsidianSetting.Toggle
									value={settings.tool.showProgress}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.showProgress",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "Return to cursor",
							desc: "Button to return to the last cursor position",
							control: (
								<ObsidianSetting.Toggle
									value={settings.tool.returnToCursor.enabled}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.returnToCursor.enabled",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "Return to top",
							desc: "Button to return to the top of the document",
							control: (
								<ObsidianSetting.Toggle
									value={settings.tool.returnToTop.enabled}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.returnToTop.enabled",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "Return to bottom",
							desc: "Button to return to the bottom of the document",
							control: (
								<ObsidianSetting.Toggle
									value={settings.tool.returnToBottom.enabled}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.returnToBottom.enabled",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "Jump to next heading",
							desc: "Button to jump to the next heading",
							control: (
								<ObsidianSetting.Toggle
									value={
										settings.tool.jumpToNextHeading.enabled
									}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.jumpToNextHeading.enabled",
											value
										);
									}}
								/>
							),
						}}
					/>

					<ObsidianSetting
						slots={{
							name: "Jump to previous heading",
							desc: "Button to jump to the previous heading",
							control: (
								<ObsidianSetting.Toggle
									value={
										settings.tool.jumpToPrevHeading.enabled
									}
									onChange={(value) => {
										settingsStore.updateSettingByPath(
											"tool.jumpToPrevHeading.enabled",
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
