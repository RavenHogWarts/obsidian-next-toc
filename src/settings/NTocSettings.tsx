import { Tab, TabItem } from "@src/components/tab/Tab";
import { LL } from "@src/i18n/i18n";
import { FC } from "react";
import { RenderTabContent } from "./tabs/RenderTabContent";
import { TocTabContent } from "./tabs/TocTabContent";
import { ToolTabContent } from "./tabs/ToolTabContent";

export const NTocSettings: FC = () => {
	const tabItems: TabItem[] = [
		{
			id: "toc",
			title: LL.settings.toc.name(),
			content: <TocTabContent />,
		},
		{
			id: "render",
			title: LL.settings.render.name(),
			content: <RenderTabContent />,
		},
		{
			id: "tool",
			title: LL.settings.tool.name(),
			content: <ToolTabContent />,
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
