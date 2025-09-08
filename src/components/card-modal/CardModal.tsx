import { ReadingTimeCard } from "@src/components/cards/ReadingTimeCard";
import { TocCard } from "@src/components/cards/TocCard";
import { Tab, TabItem } from "@src/components/tab/Tab";
import { CardConfig } from "@src/types/cards";
import { App, HeadingCache, MarkdownView } from "obsidian";
import { FC, useEffect, useRef, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { BasicSettings } from "./BasicSettings";
import "./CardModal.css";
import { StyleSettings } from "./StyleSettings";

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

	// 更新预览
	useEffect(() => {
		if (!previewContainerRef.current) return;

		// 清理之前的预览
		if (previewRootRef.current) {
			previewRootRef.current.unmount();
		}

		// 创建新的预览
		const container = previewContainerRef.current;
		container.innerHTML = "";
		previewRootRef.current = createRoot(container);

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

		previewRootRef.current.render(renderPreview());

		return () => {
			if (previewRootRef.current) {
				previewRootRef.current.unmount();
				previewRootRef.current = null;
			}
		};
	}, [formData, headings, content, currentView]);

	const tabItems: TabItem[] = [
		{
			id: "basic",
			title: "Basic Settings",
			content: (
				<BasicSettings
					cardConfig={formData}
					onChange={handleConfigChange}
				/>
			),
		},
		{
			id: "style",
			title: "Style Design",
			content: (
				<StyleSettings
					cardConfig={formData}
					onChange={handleConfigChange}
				/>
			),
		},
	];

	return (
		<div className="NToc__inline-card-manager">
			<div className="NToc__inline-card-preview-section">
				<h3>Preview</h3>
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
					className="NToc__card-config-tabs"
				/>

				<div className="NToc__card-modal-actions">
					<button
						type="button"
						className="NToc__card-modal-submit"
						onClick={handleSubmit}
					>
						Apply Changes
					</button>
				</div>
			</div>
		</div>
	);
};
