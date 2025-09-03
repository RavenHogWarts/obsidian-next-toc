import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import scrollToHeading from "@src/utils/scrollToHeading";
import { HeadingCache, MarkdownView } from "obsidian";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./TocReturnTools.css";

interface TocReturnToolsProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
}

interface ToolConfig {
	key: string;
	config: { enabled: boolean; icon: string };
	action: () => void;
	title: string;
}

interface FanButtonProps {
	tool: ToolConfig;
	index: number;
	totalCount: number;
	isExpanded: boolean;
	radius: number;
	onClick: () => void;
}

// 图标组件映射
const IconMap: Record<string, React.ReactElement> = {
	"text-cursor-input": (
		<>
			<path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1" />
			<path d="M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5" />
			<path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
			<path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" />
			<path d="M9 7v10" />
		</>
	),
	"arrow-up-to-line": (
		<>
			<path d="M5 3h14" />
			<path d="m18 13-6-6-6 6" />
			<path d="M12 7v14" />
		</>
	),
	"arrow-down-to-line": (
		<>
			<path d="M12 17V3" />
			<path d="m6 11 6 6 6-6" />
			<path d="M19 21H5" />
		</>
	),
	"corner-right-down": (
		<>
			<polyline points="10,15 15,20 20,15" />
			<path d="M4 4h7a4 4 0 0 1 4 4v12" />
		</>
	),
	"corner-left-up": (
		<>
			<polyline points="14,9 9,4 4,9" />
			<path d="M20 20h-7a4 4 0 0 1-4-4V4" />
		</>
	),
};

// 扇形按钮组件
const FanButton: FC<FanButtonProps> = ({
	tool,
	index,
	totalCount,
	isExpanded,
	radius,
	onClick,
}) => {
	// 计算扇形分布角度（从顶部开始，顺时针分布）
	const angle = useMemo(() => {
		if (totalCount === 1) return -90; // 单个按钮在正上方
		const totalAngle = Math.min(180, totalCount * 45); // 最大展开180度
		const startAngle = -90 - totalAngle / 2; // 起始角度
		return startAngle + (totalAngle / (totalCount - 1)) * index;
	}, [index, totalCount]);

	// 计算位置
	const position = useMemo(() => {
		const rad = (angle * Math.PI) / 180;
		const x = Math.cos(rad) * radius;
		const y = Math.sin(rad) * radius;
		return { x, y };
	}, [angle, radius]);

	// 动画样式
	const animationStyle = useMemo(() => {
		const baseDelay = index * 0.05; // 错开动画时间
		return {
			transform: isExpanded
				? `translate(${position.x}px, ${position.y}px) scale(1)`
				: "translate(0, 0) scale(0)",
			opacity: isExpanded ? 1 : 0,
			transitionDelay: isExpanded ? `${baseDelay}s` : "0s",
			transitionDuration: "0.3s",
			transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
		};
	}, [isExpanded, position, index]);

	return (
		<button
			className="NToc__fan-button"
			style={animationStyle}
			onClick={onClick}
			title={tool.title}
			aria-label={tool.title}
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
				{IconMap[tool.config.icon] || IconMap["text-cursor-input"]}
			</svg>
		</button>
	);
};

// 主组件
export const TocReturnTools: FC<TocReturnToolsProps> = ({
	currentView,
	headings,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const [isExpanded, setIsExpanded] = useState(false);
	const savedCursorRef = useRef<{ line: number; ch: number } | null>(null);
	const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// 编辑器操作函数
	const editorActions = useMemo(() => {
		const saveCursorPosition = () => {
			const editor = currentView?.editor;
			if (editor) {
				savedCursorRef.current = editor.getCursor();
			}
		};

		const returnToCursor = () => {
			const editor = currentView?.editor;
			if (editor && savedCursorRef.current) {
				editor.setCursor(savedCursorRef.current);
				editor.scrollIntoView(
					{
						from: savedCursorRef.current,
						to: savedCursorRef.current,
					},
					true
				);
			}
		};

		const returnToTop = () => {
			saveCursorPosition();
			const editor = currentView?.editor;
			if (editor) {
				const pos = { line: 0, ch: 0 };
				editor.setCursor(pos);
				editor.scrollIntoView({ from: pos, to: pos }, true);
			}
		};

		const returnToBottom = () => {
			saveCursorPosition();
			const editor = currentView?.editor;
			if (editor) {
				const lastLine = editor.lastLine();
				const pos = {
					line: lastLine,
					ch: editor.getLine(lastLine).length,
				};
				editor.setCursor(pos);
				editor.scrollIntoView({ from: pos, to: pos }, true);
			}
		};

		const jumpToNextHeading = () => {
			saveCursorPosition();
			const editor = currentView?.editor;
			if (!editor || headings.length === 0) return;

			const currentPos = editor.getCursor();
			const nextHeading = headings.find(
				(heading) => heading.position.start.line > currentPos.line
			);

			if (nextHeading) {
				scrollToHeading(currentView, nextHeading);
			}
		};

		const jumpToPrevHeading = () => {
			saveCursorPosition();
			const editor = currentView?.editor;
			if (!editor || headings.length === 0) return;

			const currentPos = editor.getCursor();
			const prevHeading = headings
				.slice()
				.reverse()
				.find(
					(heading) => heading.position.start.line < currentPos.line
				);

			if (prevHeading) {
				scrollToHeading(currentView, prevHeading);
			}
		};

		return {
			returnToCursor,
			returnToTop,
			returnToBottom,
			jumpToNextHeading,
			jumpToPrevHeading,
		};
	}, [currentView, headings]);

	// 工具配置
	const tools: ToolConfig[] = useMemo(
		() => [
			{
				key: "returnToCursor",
				config: settings.tool.returnToCursor,
				action: editorActions.returnToCursor,
				title: "Return to Cursor",
			},
			{
				key: "returnToTop",
				config: settings.tool.returnToTop,
				action: editorActions.returnToTop,
				title: "Return to Top",
			},
			{
				key: "returnToBottom",
				config: settings.tool.returnToBottom,
				action: editorActions.returnToBottom,
				title: "Return to Bottom",
			},
			{
				key: "jumpToNextHeading",
				config: settings.tool.jumpToNextHeading,
				action: editorActions.jumpToNextHeading,
				title: "Jump to Next Heading",
			},
			{
				key: "jumpToPrevHeading",
				config: settings.tool.jumpToPrevHeading,
				action: editorActions.jumpToPrevHeading,
				title: "Jump to Previous Heading",
			},
		],
		[settings, editorActions]
	);

	// 过滤启用的工具
	const enabledTools = useMemo(
		() => tools.filter((tool) => tool.config.enabled),
		[tools]
	);

	// 鼠标事件处理
	const handleMouseEnter = useCallback(() => {
		if (collapseTimeoutRef.current) {
			clearTimeout(collapseTimeoutRef.current);
			collapseTimeoutRef.current = null;
		}
		setIsExpanded(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		collapseTimeoutRef.current = setTimeout(() => {
			setIsExpanded(false);
		}, 300);
	}, []);

	// 清理定时器
	useEffect(() => {
		return () => {
			if (collapseTimeoutRef.current) {
				clearTimeout(collapseTimeoutRef.current);
			}
		};
	}, []);

	// 工具按钮点击处理
	const handleToolClick = useCallback((action: () => void) => {
		action();
		setIsExpanded(false);
	}, []);

	// 如果没有启用的工具，不显示组件
	if (enabledTools.length === 0) {
		return null;
	}

	const radius = 70; // 扇形半径

	return (
		<div
			className={`NToc__fan-container ${
				isExpanded ? "NToc__fan-container--expanded" : ""
			}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* 主按钮 */}
			<button
				className={`NToc__fan-main-button ${
					isExpanded ? "NToc__fan-main-button--expanded" : ""
				}`}
				aria-label="Toggle navigation tools"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					style={{
						transform: isExpanded
							? "rotate(45deg)"
							: "rotate(0deg)",
						transition:
							"transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
					}}
				>
					<circle cx="12" cy="12" r="3" />
					<circle cx="12" cy="3" r="1" />
					<circle cx="12" cy="21" r="1" />
					<circle cx="3" cy="12" r="1" />
					<circle cx="21" cy="12" r="1" />
				</svg>
			</button>

			{/* 扇形按钮容器 */}
			<div className="NToc__fan-buttons-container">
				{enabledTools.map((tool, index) => (
					<FanButton
						key={tool.key}
						tool={tool}
						index={index}
						totalCount={enabledTools.length}
						isExpanded={isExpanded}
						radius={radius}
						onClick={() => handleToolClick(tool.action)}
					/>
				))}
			</div>
		</div>
	);
};
