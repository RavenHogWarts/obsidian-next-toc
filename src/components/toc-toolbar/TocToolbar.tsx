import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { t } from "@src/i18n/i18n";
import cleanHeading from "@src/utils/cleanHeading";
import {
	ArrowLeftRight,
	ChevronLeft,
	ChevronRight,
	ChevronsDownUp,
	ChevronsUpDown,
	ClipboardCopy,
	Pin,
} from "lucide-react";
import { HeadingCache, Notice } from "obsidian";
import { FC, useCallback } from "react";
import "./TocToolbar.css";

interface TocToolbarProps {
	headings: HeadingCache[];
	onCollapseAll: () => void;
	onExpandAll: () => void;
	hasAnyCollapsed: boolean;
}

export const TocToolbar: FC<TocToolbarProps> = ({
	headings,
	onCollapseAll,
	onExpandAll,
	hasAnyCollapsed,
}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);

	const handleOffsetChange = useCallback(
		(direction: "left" | "right") => {
			settingsStore.updateSettingByPath(
				"toc.offset",
				settings.toc.offset +
					(direction === "left"
						? settings.toc.position === "left"
							? -1
							: 1
						: settings.toc.position === "left"
						? 1
						: -1)
			);
		},
		[settings.toc.offset, settings.toc.position]
	);

	const handleCopyToClipboard = useCallback(async () => {
		const toc = headings
			.map((heading) => {
				const indent = "\t".repeat(heading.level - 1);
				return `${indent}${cleanHeading(heading.heading)}`;
			})
			.join("\n");

		try {
			await navigator.clipboard.writeText(toc);
			new Notice("Successfully copied toc");
		} catch (error) {
			console.error("Failed to copy Toc:", error);
		}
	}, [headings]);

	return (
		<div className="NToc__toc-toolbar">
			<button
				className={`NToc__toc-toolbar-button  ${
					settings.toc.alwaysExpand ? "active" : ""
				}`}
				aria-label={t("tools.pinTOC")}
				onClick={() => {
					settingsStore.updateSettingByPath(
						"toc.alwaysExpand",
						!settings.toc.alwaysExpand
					);
				}}
			>
				<span className="NToc__toc-toolbar-button-icon">
					<Pin size={16} />
				</span>
			</button>
			<button
				className="NToc__toc-toolbar-button"
				aria-label={t("tools.changePosition")}
				onClick={() => {
					settingsStore.updateSettingByPath(
						"toc.position",
						settings.toc.position === "left" ? "right" : "left"
					);
				}}
			>
				<span className="NToc__toc-toolbar-button-icon">
					<ArrowLeftRight size={16} />
				</span>
			</button>
			<button
				className="NToc__toc-toolbar-button"
				aria-label={t("tools.expandCollapse")}
				onClick={hasAnyCollapsed ? onExpandAll : onCollapseAll}
			>
				<span className="NToc__toc-toolbar-button-icon">
					{hasAnyCollapsed ? (
						<ChevronsUpDown size={16} />
					) : (
						<ChevronsDownUp size={16} />
					)}
				</span>
			</button>
			<button
				className="NToc__toc-toolbar-button"
				aria-label={t("tools.leftOffset")}
				onClick={() => handleOffsetChange("left")}
			>
				<span className="NToc__toc-toolbar-button-icon">
					<ChevronLeft size={16} />
				</span>
			</button>
			<button
				className="NToc__toc-toolbar-button"
				aria-label={t("tools.rightOffset")}
				onClick={() => handleOffsetChange("right")}
			>
				<span className="NToc__toc-toolbar-button-icon">
					<ChevronRight size={16} />
				</span>
			</button>
			<button
				className="NToc__toc-toolbar-button"
				aria-label={t("tools.copyTOC")}
				onClick={() => {
					handleCopyToClipboard();
				}}
			>
				<span className="NToc__toc-toolbar-button-icon">
					<ClipboardCopy size={16} />
				</span>
			</button>
		</div>
	);
};
