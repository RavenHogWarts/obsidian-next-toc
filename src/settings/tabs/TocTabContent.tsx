import { InlineCodeBlock } from "@src/components/code-block/InlineCodeBlock";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { LL } from "@src/i18n/i18n";
import { NTocIndicatorMode, NTocPosition } from "@src/types/types";
import { FC } from "react";
import ObsidianSetting from "../ObsidianSetting";

export const TocTabContent: FC = () => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	return (
		<ObsidianSetting.Container>
			<ObsidianSetting
				slots={{
					name: LL.settings.toc.show.name(),
					desc: LL.settings.toc.show.desc(),
					control: (
						<ObsidianSetting.Toggle
							value={settings.toc.show}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.show",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.toc.alwaysExpand.name(),
					desc: (
						<>
							{LL.settings.toc.alwaysExpand.desc()}
							<InlineCodeBlock code="pin-ntoc" />
							<InlineCodeBlock code="unpin-ntoc" />
						</>
					),
					control: (
						<ObsidianSetting.Toggle
							value={settings.toc.alwaysExpand}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.alwaysExpand",
									value,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.toc.width.name(),
					desc: LL.settings.toc.width.desc(),
					control: (
						<ObsidianSetting.Text
							value={settings.toc.width.toString()}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.width",
									Number(value),
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.toc.position.name(),
					desc: LL.settings.toc.position.desc(),
					control: (
						<ObsidianSetting.Dropdown
							value={settings.toc.position}
							options={{
								left: LL.settings.toc.position.options.left(),
								right: LL.settings.toc.position.options.right(),
							}}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.position",
									value as NTocPosition,
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.toc.offset.name(),
					desc: LL.settings.toc.offset.desc(),
					control: (
						<ObsidianSetting.Text
							value={settings.toc.offset.toString()}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.offset",
									Number(value),
								);
							}}
						/>
					),
				}}
			/>

			<ObsidianSetting
				slots={{
					name: LL.settings.toc.indicatorMode.name(),
					desc: LL.settings.toc.indicatorMode.desc(),
					control: (
						<ObsidianSetting.Dropdown
							value={settings.toc.indicatorMode}
							options={{
								bar: LL.settings.toc.indicatorMode.options.bar(),
								dot: LL.settings.toc.indicatorMode.options.dot(),
								hidden: LL.settings.toc.indicatorMode.options.hidden(),
							}}
							onChange={async (value) => {
								await settingsStore.updateSettingByPath(
									"toc.indicatorMode",
									value as NTocIndicatorMode,
								);
							}}
						/>
					),
				}}
			/>
		</ObsidianSetting.Container>
	);
};
