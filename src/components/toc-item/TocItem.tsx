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
	headingVisible: boolean;
	headingChildren: boolean;
	isCollapsedParent: boolean;
	onToggleCollapse: (index: number) => void;
	// 拖拽排序相关
	enableDrag?: boolean;
	isDragging?: boolean;
	isDragOver?: boolean;
	dragOverPosition?: "before" | "after" | null;
	isDragReady?: boolean;
	onDragStart?: (e: React.DragEvent, index: number) => void;
	onDragOver?: (e: React.DragEvent, index: number) => void;
	onDragLeave?: (e: React.DragEvent) => void;
	onDrop?: (e: React.DragEvent, index: number) => void;
	onDragEnd?: () => void;
	onPointerDown?: (e: React.PointerEvent, index: number) => void;
	onPointerUp?: (e: React.PointerEvent) => void;
	onPointerMove?: (e: React.PointerEvent) => void;
	onPointerLeave?: (e: React.PointerEvent) => void;
	consumeLongPressClick?: () => boolean;
}

export const TocItem: FC<TocItemProps> = ({
	currentView,
	heading,
	headingIndex,
	headingActualDepth,
	headingNumber,
	headingActive,
	headingVisible,
	headingChildren,
	isCollapsedParent,
	onToggleCollapse,
	enableDrag = false,
	isDragging = false,
	isDragOver = false,
	dragOverPosition = null,
	isDragReady = false,
	onDragStart,
	onDragOver,
	onDragLeave,
	onDrop,
	onDragEnd,
	onPointerDown,
	onPointerUp,
	onPointerMove,
	onPointerLeave,
	consumeLongPressClick,
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
			className={`NToc__toc-item-container${isDragging ? " NToc__toc-item-container--dragging" : ""}${isDragOver && dragOverPosition === "before" ? " NToc__toc-item-container--drag-over-before" : ""}${isDragOver && dragOverPosition === "after" ? " NToc__toc-item-container--drag-over-after" : ""}${isDragReady ? " NToc__toc-item-container--drag-ready" : ""}`}
			data-index={headingIndex}
			data-level={heading.level}
			data-actual-depth={headingActualDepth}
			data-start-line={heading.position.start.line}
			data-active={headingActive}
			data-visible={headingVisible}
			onDragStart={
				enableDrag ? (e) => onDragStart?.(e, headingIndex) : undefined
			}
			onDragOver={
				enableDrag ? (e) => onDragOver?.(e, headingIndex) : undefined
			}
			onDragLeave={enableDrag ? onDragLeave : undefined}
			onDrop={enableDrag ? (e) => onDrop?.(e, headingIndex) : undefined}
			onDragEnd={enableDrag ? onDragEnd : undefined}
			onPointerDown={
				enableDrag ? (e) => onPointerDown?.(e, headingIndex) : undefined
			}
			onPointerUp={enableDrag ? onPointerUp : undefined}
			onPointerMove={enableDrag ? onPointerMove : undefined}
			onPointerLeave={enableDrag ? onPointerLeave : undefined}
			onClick={() => {
				if (enableDrag && consumeLongPressClick?.()) return;
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
