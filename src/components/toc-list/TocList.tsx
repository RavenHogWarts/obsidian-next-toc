import { useActiveHeadingScroll } from "@src/hooks/useActiveHeadingScroll";
import { useHeadingNumbering } from "@src/hooks/useHeadingNumbering";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { useTocCollapse } from "@src/hooks/useTocCollapse";
import { useTocVisibility } from "@src/hooks/useTocVisibility";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import hasChildren from "@src/utils/hasChildren";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useRef } from "react";
import { TocItem } from "../toc-item/TocItem";
import { TocToolbar } from "../toc-toolbar/TocToolbar";
import "./TocList.css";

interface TocListProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

export const TocList: FC<TocListProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const listItemsRef = useRef<HTMLDivElement>(null);

	// 使用折叠管理 Hook
	const { collapsedSet, toggleCollapsedAt, onCollapseAll, onExpandAll } =
		useTocCollapse(currentView, headings);

	// 使用标题编号 Hook
	const generateHeadingNumber = useHeadingNumbering(
		headings,
		settings.render.skipHeading1
	);

	// 使用可见性计算 Hook
	const { visibilityMap, shouldShowToc } = useTocVisibility({
		headings,
		collapsedSet,
		skipHeading1: settings.render.skipHeading1,
		showWhenSingleHeading: settings.render.showWhenSingleHeading,
	});

	// 使用自动滚动 Hook
	useActiveHeadingScroll(activeHeadingIndex, listItemsRef);

	if (!shouldShowToc) {
		return null;
	}

	return (
		<div className="NToc__list-container">
			<TocToolbar
				headings={headings}
				onCollapseAll={onCollapseAll}
				onExpandAll={onExpandAll}
				hasAnyCollapsed={collapsedSet.size > 0}
			/>
			<div ref={listItemsRef} className="NToc__list-items">
				{headings.map((heading, index) => {
					if (!visibilityMap[index]) return null;
					return (
						<TocItem
							key={`toc-item-${index}-${heading.position.start.line}`}
							currentView={currentView}
							heading={heading}
							headingIndex={index}
							headingActualDepth={calculateActualDepth(
								index,
								headings
							)}
							headingNumber={generateHeadingNumber(index)}
							headingActive={index === activeHeadingIndex}
							headingChildren={hasChildren(index, headings)}
							isCollapsedParent={collapsedSet.has(index)}
							onToggleCollapse={toggleCollapsedAt}
						/>
					);
				})}
			</div>
		</div>
	);
};
