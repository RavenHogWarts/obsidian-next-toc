import { useHeadingNumberState } from "@src/hooks/useHeadingNumberState";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Component, HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useMemo, useRef } from "react";
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

	// 计算是否使用标题编号（结合 frontmatter cssclass 和黑名单）
	const effectiveUseHeadingNumber = useHeadingNumberState({
		currentView,
		defaultUseHeadingNumber: settings.render.useHeadingNumber,
		hideHeadingNumberBlacklist: settings.render.hideHeadingNumberBlacklist,
	});

	const NTocItemTextRef = useRef<HTMLDivElement>(null);

	// 创建一个临时的 Component 实例用于 Markdown 渲染
	const markdownComponent = useMemo(() => new Component(), []);

	// 创建 Markdown 渲染服务
	const markdownRenderService = useMemo(
		() => settingsStore.createMarkdownRenderService(markdownComponent),
		[settingsStore, markdownComponent],
	);

	useEffect(() => {
		const renderContent = async () => {
			if (NTocItemTextRef.current) {
				markdownRenderService.clearElement(NTocItemTextRef.current);

				if (settings.render.renderMarkdown) {
					NTocItemTextRef.current.classList.add("markdown-rendered");
					await markdownRenderService.renderMarkdown(
						heading.heading,
						NTocItemTextRef.current,
						"",
					);
				} else {
					markdownRenderService.setTextContent(
						heading.heading,
						NTocItemTextRef.current,
					);
				}
			}
		};

		void renderContent();
	}, [
		settings.render.renderMarkdown,
		heading.heading,
		markdownRenderService,
	]);

	// 清理组件时卸载临时的 Component
	useEffect(() => {
		return () => {
			markdownComponent.unload();
		};
	}, [markdownComponent]);

	return (
		<div
			className="NToc__toc-item-container"
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			onClick={() => {
				void scrollToHeading(currentView, heading);
			}}
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
					{effectiveUseHeadingNumber && (
						<div className="NToc__toc-item-number">
							{headingNumber}
						</div>
					)}
					<div
						ref={NTocItemTextRef}
						className="NToc__toc-item-text"
					></div>
				</div>
			</div>
			<div className="NToc__toc-item-level">H{heading.level}</div>
		</div>
	);
};
