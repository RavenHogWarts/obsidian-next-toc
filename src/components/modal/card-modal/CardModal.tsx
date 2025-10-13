import { ReadingTimeCard } from "@src/components/cards/ReadingTimeCard";
import { TocCard } from "@src/components/cards/TocCard";
import { Tab, TabItem } from "@src/components/tab/Tab";
import { t } from "@src/i18n/i18n";
import { CardConfig } from "@src/types/cards";
import { App, HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { CardBasicSettings } from "../card-settings/CardBasicSettings";
import { CardStyleSettings } from "../card-settings/CardStyleSettings";
import "./CardModal.css";

interface CardModalProps {
	app: App;
	cardConfig: CardConfig;
	onSubmit: (cardConfig: CardConfig) => void;
	headings?: HeadingCache[];
	content?: string;
	currentView?: MarkdownView | null;
}

export const CardModal: FC<CardModalProps> = ({
	app,
	cardConfig,
	onSubmit,
	headings,
	content = "",
	currentView,
}) => {
	const previewContainerRef = useRef<HTMLDivElement>(null);
	const previewRootRef = useRef<Root | null>(null);
	const [formData, setFormData] = useState<CardConfig>(cardConfig);

	const handleSubmit = () => {
		onSubmit(formData);
	};

	const handleConfigChange = (newConfig: CardConfig) => {
		setFormData(newConfig);
	};

	// 组件卸载时清理预览
	useEffect(() => {
		return () => {
			if (previewRootRef.current) {
				try {
					previewRootRef.current.unmount();
				} catch (e) {
					console.warn("Component unmount error:", e);
				}
				previewRootRef.current = null;
			}
		};
	}, []);

	// 更新预览
	useEffect(() => {
		if (!previewContainerRef.current) return;

		// 如果还没有 root，创建一个
		if (!previewRootRef.current) {
			const container = previewContainerRef.current;
			container.innerHTML = "";
			previewRootRef.current = createRoot(container);
		}

		const renderPreview = () => {
			if (formData.type === "toc-card") {
				return (
					<TocCard
						config={formData}
						headings={headings}
						currentView={currentView}
					/>
				);
			} else if (formData.type === "reading-time") {
				return <ReadingTimeCard config={formData} content={content} />;
			}
			return null;
		};

		try {
			previewRootRef.current.render(renderPreview());
		} catch (e) {
			console.error("Preview render error:", e);
			// 如果渲染失败，重新创建 root
			const container = previewContainerRef.current;
			if (container) {
				container.innerHTML = "";
				previewRootRef.current = createRoot(container);
				previewRootRef.current.render(renderPreview());
			}
		}
	}, [formData, headings, content, currentView]);

	const tabItems: TabItem[] = [
		{
			id: "basic",
			title: t("cards.basicSetting"),
			content: (
				<CardBasicSettings
					cardConfig={formData}
					onChange={handleConfigChange}
				/>
			),
		},
		{
			id: "style",
			title: t("cards.styleSetting"),
			content: (
				<CardStyleSettings
					cardConfig={formData}
					onChange={handleConfigChange}
				/>
			),
		},
	];

	return (
		<div className="NToc__inline-card-manager">
			<div className="NToc__inline-card-preview-section">
				<h3>{t("cards.preview")}</h3>
				<div
					ref={previewContainerRef}
					className="NToc__inline-card-preview"
				></div>
			</div>

			<div className="NToc__inline-card-configure">
				<Tab
					items={tabItems}
					defaultValue="basic"
					orientation="horizontal"
					className="NToc__inline-card-config-tabs"
				/>

				<div className="NToc__inline-card-modal-actions">
					<button
						type="button"
						className="NToc__inline-card-modal-submit"
						onClick={handleSubmit}
					>
						✔
					</button>
				</div>
			</div>
		</div>
	);
};
