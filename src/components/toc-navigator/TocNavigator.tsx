import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import calculateActualDepth from "@src/utils/calculateActualDepth";
import { HeadingCache, MarkdownView } from "obsidian";
import {
	FC,
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { TocItem } from "../toc-item/TocItem";
import "./TocNavigator.css";

interface TocNavigatorProps {
	currentView: MarkdownView;
	headings: HeadingCache[];
	activeHeadingIndex: number;
}

export const TocNavigator: FC<TocNavigatorProps> = ({
	currentView,
	headings,
	activeHeadingIndex,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const NTocContainerRef = useRef<HTMLDivElement>(null);
	const NTocGroupRef = useRef<HTMLDivElement>(null);
	const NTocGroupContentRef = useRef<HTMLDivElement>(null);
	const NTocGroupTocItemsRef = useRef<HTMLDivElement>(null);

	const [isHovered, setIsHovered] = useState(false);
	const [isMouseDragging, setIsMouseDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startWidth, setStartWidth] = useState(0);

	useEffect(() => {
		if (NTocContainerRef.current) {
			const container = NTocContainerRef.current;
			// 移除所有可能的位置类
			container.classList.remove(
				"NToc__container-left",
				"NToc__container-right"
			);
			// 清除之前位置的样式
			container.style.left = "";
			container.style.right = "";
			// 设置新位置
			container.classList.add(`NToc__container-${settings.toc.position}`);
			container.style[settings.toc.position] = `${settings.toc.offset}px`;
		}
		if (NTocGroupRef.current) {
			const group = NTocGroupRef.current;
			if (settings.toc.show === false) {
				group.classList.add("NToc__group-hidden");
			} else {
				group.classList.remove("NToc__group-hidden");
			}
		}
	}, [settings.toc.position, settings.toc.offset, settings.toc.show]);

	useEffect(() => {
		if (NTocGroupContentRef.current) {
			const content = NTocGroupContentRef.current;
			if (settings.toc.alwaysExpand || isHovered) {
				content.classList.add("NToc__group-content-expanded");
			} else {
				content.classList.remove("NToc__group-content-expanded");
			}
		}
	}, [settings.toc.alwaysExpand, isHovered]);

	const handleMouseDragStart = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsMouseDragging(true);
			setStartX(e.clientX);
			setStartWidth(settings.toc.width);
		},
		[settings.toc.width]
	);

	const handleMouseDrag = useCallback(
		(e: globalThis.MouseEvent) => {
			if (!isMouseDragging || !NTocGroupTocItemsRef.current) {
				return;
			}

			const delta = e.clientX - startX;
			const widthDelta =
				settings.toc.position === "left" ? delta : -delta;
			const newWidth = startWidth + widthDelta;

			NTocGroupTocItemsRef.current.style.width = `${newWidth}px`;
		},
		[
			isMouseDragging,
			startX,
			startWidth,
			settings.toc.position,
			NTocGroupTocItemsRef,
		]
	);

	const handleMouseDragEnd = useCallback(() => {
		if (!isMouseDragging) {
			return;
		}

		setIsMouseDragging(false);

		if (NTocGroupTocItemsRef.current) {
			const newWidth = NTocGroupTocItemsRef.current.offsetWidth;
			settingsStore.updateSettingByPath("toc.width", newWidth);
		}
	}, [isMouseDragging, NTocGroupTocItemsRef, settings, settingsStore]);

	useEffect(() => {
		if (isMouseDragging) {
			currentView.contentEl.addEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.addEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		}

		return () => {
			currentView.contentEl.removeEventListener(
				"mousemove",
				handleMouseDrag
			);
			currentView.contentEl.removeEventListener(
				"mouseup",
				handleMouseDragEnd
			);
		};
	}, [isMouseDragging, currentView, handleMouseDrag, handleMouseDragEnd]);

	const generateHeadingNumber = useCallback(
		(index: number): string => {
			if (settings.render.skipHeading1 && headings[index].level === 1) {
				return "";
			}

			const numberStack: number[] = [];
			let prevLevel = 0;

			for (let i = 0; i <= index; i++) {
				const heading = headings[i];
				const level = heading.level;

				// 跳过 h1（如果配置了跳过）
				if (settings.render.skipHeading1 && level === 1) {
					continue;
				}

				if (numberStack.length === 0) {
					numberStack.push(1);
				} else if (level > prevLevel) {
					numberStack.push(1);
				} else if (level === prevLevel) {
					numberStack[numberStack.length - 1]++;
				} else {
					// 回退到当前层级
					while (
						numberStack.length > 0 &&
						numberStack.length >
							level - (settings.render.skipHeading1 ? 2 : 1)
					) {
						numberStack.pop();
					}
					if (numberStack.length === 0) {
						numberStack.push(1);
					} else {
						numberStack[numberStack.length - 1]++;
					}
				}
				prevLevel = level;
			}

			return numberStack.join(".") + ".";
		},
		[headings, settings.render.skipHeading1]
	);

	return (
		<div ref={NTocContainerRef} className="NToc__container">
			<div
				ref={NTocGroupRef}
				className="NToc__group"
				onMouseEnter={() =>
					!settings.toc.alwaysExpand && setIsHovered(true)
				}
				onMouseLeave={() =>
					!settings.toc.alwaysExpand && setIsHovered(false)
				}
			>
				<div
					className="NToc__group-resize"
					onMouseDown={handleMouseDragStart}
				/>
				<div ref={NTocGroupContentRef} className="NToc__group-content">
					<div className="NToc__toc-tools"></div>
					<div ref={NTocGroupTocItemsRef} className="NToc__toc-items">
						{headings.map((heading, index) => {
							const actualDepth = calculateActualDepth(
								index,
								headings
							);

							return (
								<TocItem
									currentView={currentView}
									heading={heading}
									headingIndex={index}
									headingActualDepth={actualDepth}
									headingNumber={generateHeadingNumber(index)}
									headingActive={index === activeHeadingIndex}
								/>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
