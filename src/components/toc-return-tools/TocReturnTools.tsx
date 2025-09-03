import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { Component } from "lucide-react";
import { HeadingCache, MarkdownView, setIcon } from "obsidian";
import { FC, useEffect, useRef, useState } from "react";
import "./TocReturnTools.css";

interface TocReturnToolsProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
}

// 主组件
export const TocReturnTools: FC<TocReturnToolsProps> = ({
	currentView,
	headings,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	const NTocReturnToolsRef = useRef<HTMLDivElement>(null);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	// 获取启用的按钮工具
	const enabledTools = [
		{ key: "returnToCursor", config: settings.tool.returnToCursor },
		{ key: "returnToTop", config: settings.tool.returnToTop },
		{ key: "returnToBottom", config: settings.tool.returnToBottom },
		{ key: "jumpToNextHeading", config: settings.tool.jumpToNextHeading },
		{ key: "jumpToPrevHeading", config: settings.tool.jumpToPrevHeading },
	].filter((tool) => tool.config.enabled);

	useEffect(() => {
		if (NTocReturnToolsRef.current) {
			if (settings.toc.position === "left") {
				NTocReturnToolsRef.current.style.justifyContent = "flex-start";
			} else {
				NTocReturnToolsRef.current.style.justifyContent = "flex-end";
			}
		}
	}, [settings.toc.position]);

	// 监听点击外部区域关闭展开状态
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isExpanded &&
				NTocReturnToolsRef.current &&
				!NTocReturnToolsRef.current.contains(event.target as Node)
			) {
				setIsExpanded(false);
			}
		};

		if (isExpanded) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isExpanded]);

	const handleMasterClick = () => {
		setIsExpanded(!isExpanded);
	};

	const handleToolClick = (toolKey: string) => {
		// TODO: 实现具体的工具功能
		console.log(`Clicked tool: ${toolKey}`);
	};

	return (
		<div ref={NTocReturnToolsRef} className="NToc__return-tools">
			{/* 主按钮 */}
			<button
				className="NToc__return-button-master"
				onClick={handleMasterClick}
			>
				<Component size={16} />
			</button>

			{/* 展开的工具按钮 */}
			{isExpanded && enabledTools.length > 0 && (
				<div
					className={`NToc__tool-buttons ${
						settings.toc.position === "left"
							? "NToc__tool-expand-right"
							: "NToc__tool-expand-left"
					}`}
				>
					{enabledTools.map((tool) => {
						return (
							<button
								key={tool.key}
								ref={(el) => {
									if (el) setIcon(el, tool.config.icon);
								}}
								className="NToc__tool-button"
								onClick={() => handleToolClick(tool.key)}
							></button>
						);
					})}
				</div>
			)}
		</div>
	);
};
