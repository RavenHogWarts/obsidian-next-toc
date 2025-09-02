import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import "./TocReturnTools.css";

interface TocReturnToolsProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
}

export const TocReturnTools: FC<TocReturnToolsProps> = ({
	currentView,
	headings,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const [isExpanded, setIsExpanded] = useState(false);
	const savedCursorRef = useRef<{ line: number; ch: number } | null>(null);
	const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 鼠标进入时展开
	const handleMouseEnter = useCallback(() => {
		if (hoverTimeoutRef.current) {
			clearTimeout(hoverTimeoutRef.current);
			hoverTimeoutRef.current = null;
		}
		setIsExpanded(true);
	}, []);

	// 鼠标离开时延迟收起
	const handleMouseLeave = useCallback(() => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsExpanded(false);
		}, 300); // 300ms延迟
	}, []);

	// 清理定时器
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	// 保存当前光标位置
	const saveCursorPosition = useCallback(() => {
		const editor = currentView?.editor;
		if (editor) {
			savedCursorRef.current = editor.getCursor();
		}
	}, [currentView]);

	// 返回到保存的光标位置
	const returnToCursor = useCallback(() => {
		const editor = currentView?.editor;
		if (editor && savedCursorRef.current) {
			editor.setCursor(savedCursorRef.current);
			editor.scrollIntoView(
				{ from: savedCursorRef.current, to: savedCursorRef.current },
				true
			);
		}
	}, [currentView]);

	// 返回顶部
	const returnToTop = useCallback(() => {
		saveCursorPosition(); // 保存当前位置
		const editor = currentView?.editor;
		if (editor) {
			const pos = { line: 0, ch: 0 };
			editor.setCursor(pos);
			editor.scrollIntoView({ from: pos, to: pos }, true);
		}
	}, [currentView, saveCursorPosition]);

	// 返回底部
	const returnToBottom = useCallback(() => {
		saveCursorPosition(); // 保存当前位置
		const editor = currentView?.editor;
		if (editor) {
			const lastLine = editor.lastLine();
			const pos = { line: lastLine, ch: editor.getLine(lastLine).length };
			editor.setCursor(pos);
			editor.scrollIntoView({ from: pos, to: pos }, true);
		}
	}, [currentView, saveCursorPosition]);

	// 跳转到下一个标题
	const jumpToNextHeading = useCallback(() => {
		saveCursorPosition(); // 保存当前位置
		const editor = currentView?.editor;
		if (!editor || headings.length === 0) return;

		const currentPos = editor.getCursor();
		const nextHeading = headings.find(
			(heading) => heading.position.start.line > currentPos.line
		);

		if (nextHeading) {
			scrollToHeading(currentView, nextHeading);
		}
	}, [currentView, headings, saveCursorPosition]);

	// 跳转到上一个标题
	const jumpToPrevHeading = useCallback(() => {
		saveCursorPosition(); // 保存当前位置
		const editor = currentView?.editor;
		if (!editor || headings.length === 0) return;

		const currentPos = editor.getCursor();
		const prevHeading = headings
			.slice()
			.reverse()
			.find((heading) => heading.position.start.line < currentPos.line);

		if (prevHeading) {
			scrollToHeading(currentView, prevHeading);
		}
	}, [currentView, headings, saveCursorPosition]);

	// 工具按钮配置
	const tools = [
		{
			key: "returnToCursor",
			config: settings.tool.returnToCursor,
			action: returnToCursor,
			title: "Return to Cursor",
		},
		{
			key: "returnToTop",
			config: settings.tool.returnToTop,
			action: returnToTop,
			title: "Return to Top",
		},
		{
			key: "returnToBottom",
			config: settings.tool.returnToBottom,
			action: returnToBottom,
			title: "Return to Bottom",
		},
		{
			key: "jumpToNextHeading",
			config: settings.tool.jumpToNextHeading,
			action: jumpToNextHeading,
			title: "Jump to Next Heading",
		},
		{
			key: "jumpToPrevHeading",
			config: settings.tool.jumpToPrevHeading,
			action: jumpToPrevHeading,
			title: "Jump to Previous Heading",
		},
	];

	// 过滤启用的工具
	const enabledTools = tools.filter((tool) => tool.config.enabled);

	// 如果没有启用的工具，不显示组件
	if (enabledTools.length === 0) {
		return null;
	}

	return (
		<div
			className={`NToc__return-tools ${
				isExpanded ? "NToc__return-tools--expanded" : ""
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* 主按钮 */}
			<div className="NToc__return-tools-main-button">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<circle cx="12" cy="12" r="3" />
					<circle cx="12" cy="3" r="1" />
					<circle cx="12" cy="21" r="1" />
					<circle cx="3" cy="12" r="1" />
					<circle cx="21" cy="12" r="1" />
				</svg>
			</div>

			{/* 展开的工具按钮 */}
			<div className="NToc__return-tools-expanded-buttons">
				{enabledTools.map((tool, index) => (
					<button
						key={tool.key}
						className="NToc__return-tools-button"
						style={
							{
								"--tool-index": index,
								"--total-tools": enabledTools.length,
							} as React.CSSProperties
						}
						onClick={tool.action}
						title={tool.title}
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							{/* 根据不同的图标类型渲染不同的 SVG */}
							{tool.config.icon === "text-cursor-input" && (
								<>
									<path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1" />
									<path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5" />
									<path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
									<path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" />
									<path d="M9 7v10" />
								</>
							)}
							{tool.config.icon === "arrow-up-to-line" && (
								<>
									<path d="M5 3h14" />
									<path d="m18 13-6-6-6 6" />
									<path d="M12 7v14" />
								</>
							)}
							{tool.config.icon === "arrow-down-to-line" && (
								<>
									<path d="M12 17V3" />
									<path d="m6 11 6 6 6-6" />
									<path d="M19 21H5" />
								</>
							)}
							{tool.config.icon === "corner-right-down" && (
								<>
									<polyline points="10,15 15,20 20,15" />
									<path d="M4 4h7a4 4 0 0 1 4 4v12" />
								</>
							)}
							{tool.config.icon === "corner-left-up" && (
								<>
									<polyline points="14,9 9,4 4,9" />
									<path d="M20 20h-7a4 4 0 0 1-4-4V4" />
								</>
							)}
						</svg>
					</button>
				))}
			</div>
		</div>
	);
};
