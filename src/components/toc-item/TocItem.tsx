import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HeadingCache, MarkdownRenderer, MarkdownView } from "obsidian";
import { FC, useEffect, useRef } from "react";
import "./TocItem.css";

interface TocItemProps {
	currentView: MarkdownView;
	heading: HeadingCache;
	headingIndex: number;
	headingActualDepth: number;
	headingNumber: string;
	headingActive: boolean;
	headingChildren: boolean;
	isCollapsedParent: boolean;
	onToggleCollapse: (index: number) => void;
}

export const TocItem: FC<TocItemProps> = ({
	currentView,
	heading,
	headingIndex,
	headingActualDepth,
	headingNumber,
	headingActive,
	headingChildren,
	isCollapsedParent,
	onToggleCollapse,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	const NTocItemTextRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (NTocItemTextRef.current) {
			// 使用 replaceChildren() 清空所有子节点
			NTocItemTextRef.current.replaceChildren();
			NTocItemTextRef.current.classList.remove("markdown-rendered");

			if (settings.render.renderMarkdown) {
				NTocItemTextRef.current.classList.add("markdown-rendered");

				MarkdownRenderer.render(
					settingsStore.app,
					heading.heading,
					NTocItemTextRef.current,
					"",
					settingsStore.plugin
				);
			}
		}
	}, [settings.render.renderMarkdown, heading.heading]);

	return (
		<div
			className="NToc__toc-item-container"
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			onClick={() => scrollToHeading(currentView, heading)}
		>
			<div className="NToc__toc-item">
				{headingChildren && (
					<button
						className="NToc__toc-item-collapse clickable-icon"
						onClick={(e) => {
							e.stopPropagation();
							onToggleCollapse(headingIndex);
						}}
						aria-expanded={!isCollapsedParent}
					>
						<i className="NToc__toc-item-collapse-icon">
							{isCollapsedParent ? (
								<ChevronRight size={16} />
							) : (
								<ChevronDown size={16} />
							)}
						</i>
					</button>
				)}
				<div className="NToc__toc-item-content">
					{settings.render.useHeadingNumber && (
						<div className="NToc__toc-item-number">
							{headingNumber}
						</div>
					)}
					<div ref={NTocItemTextRef} className="NToc__toc-item-text">
						{!settings.render.renderMarkdown && heading.heading}
					</div>
				</div>
			</div>
			<div className="NToc__toc-item-level">H{heading.level}</div>
		</div>
	);
};
