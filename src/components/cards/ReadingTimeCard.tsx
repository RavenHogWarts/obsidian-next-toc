import { ReadingTimeCardConfig } from "@src/types/cards";
import getWordCounts from "@src/utils/getWordCounts";
import { setIcon } from "obsidian";
import { useEffect, useRef, useState } from "react";

interface ReadingTimeCardProps {
	config: ReadingTimeCardConfig;
	content: string;
}

export const ReadingTimeCard: React.FC<ReadingTimeCardProps> = ({
	config,
	content,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);

	const [prediction, setPrediction] = useState<string>("");
	const [chineseCount, setChineseCount] = useState<number>(0);
	const [englishCount, setEnglishCount] = useState<number>(0);
	const [cleanContent, setCleanContent] = useState<string>(content);

	useEffect(() => {
		let cleanedContent = content
			.replace(/---[\s\S]*?---/, "") // 移除 front matter
			.trim();

		if (config?.removeCodeBlocks) {
			cleanedContent = cleanedContent.replace(/```[\s\S]*?```/g, "");
		}
		if (config?.removeWikiLinks) {
			cleanedContent = cleanedContent.replace(/\[\[.*?\]\]/g, "");
		}
		if (config?.removeImageLinks) {
			cleanedContent = cleanedContent.replace(/!\[\[.*?\]\]/g, "");
		}
		if (config?.removeNormalLinks) {
			cleanedContent = cleanedContent.replace(/\[.*?\]\(.*?\)/g, "");
		}

		setCleanContent(cleanedContent);
	}, [
		content,
		config.removeCodeBlocks,
		config.removeImageLinks,
		config.removeNormalLinks,
		config.removeWikiLinks,
	]);

	useEffect(() => {
		const wordCounts = getWordCounts(cleanContent);
		setChineseCount(wordCounts.chineseCount);
		setEnglishCount(wordCounts.englishCount);
	}, [cleanContent]);

	useEffect(() => {
		const chineseTime = Math.ceil(
			chineseCount / (config.chineseWordsPerMinute || 300)
		);
		const englishTime = Math.ceil(
			englishCount / (config.englishWordsPerMinute || 200)
		);
		const totalTime = chineseTime + englishTime;

		if (totalTime <= 0) {
			setPrediction("Less than a minute");
		} else if (totalTime === 1) {
			setPrediction("About a minute");
		} else if (totalTime < 60) {
			setPrediction(`About ${totalTime} minutes`);
		} else {
			const hours = Math.floor(totalTime / 60);
			const minutes = totalTime % 60;
			if (minutes === 0) {
				setPrediction(`About ${hours} hour${hours > 1 ? "s" : ""}`);
			} else {
				setPrediction(
					`About ${hours} hour${
						hours > 1 ? "s" : ""
					} ${minutes} minute${minutes > 1 ? "s" : ""}`
				);
			}
		}
	}, [
		config.chineseWordsPerMinute,
		config.englishWordsPerMinute,
		chineseCount,
		englishCount,
	]);

	useEffect(() => {
		if (config.containerStyle && containerRef.current) {
			Object.entries(config.containerStyle).forEach(([key, value]) => {
				containerRef.current?.style.setProperty(
					key,
					value != null ? String(value) : ""
				);
			});
		}
	}, [config.containerStyle]);

	useEffect(() => {
		if (config.titleStyle && titleRef.current) {
			Object.entries(config.titleStyle).forEach(([key, value]) => {
				titleRef.current?.style.setProperty(
					key,
					value != null ? String(value) : ""
				);
			});
		}
	}, [config.titleStyle]);

	useEffect(() => {
		if (config.contentStyle && contentRef.current) {
			Object.entries(config.contentStyle).forEach(([key, value]) => {
				contentRef.current?.style.setProperty(
					key,
					value != null ? String(value) : ""
				);
			});
		}
	}, [config.contentStyle]);

	useEffect(() => {
		if (config.iconName && iconRef.current) {
			setIcon(iconRef.current, config.iconName);
		}
	}, [config.iconName]);

	return (
		<div ref={containerRef} className="NToc__inline-card-reading-time">
			{config.title && (
				<div
					ref={titleRef}
					className="NToc__inline-card-reading-time-title"
				>
					{config.title}
				</div>
			)}

			<div
				ref={contentRef}
				className="NToc__inline-card-reading-time-content"
			>
				<div className="NToc__inline-card-reading-time-prediction">
					<div
						ref={iconRef}
						className="NToc__inline-card-reading-time-icon"
					></div>
					<span className="NToc__inline-card-reading-time-text">
						{config.textBefore}
						{prediction}
						{config.textAfter}
					</span>
				</div>
				{config.showWordCount && (
					<div className="NToc__inline-card-reading-time-stats">
						<div className="NToc__inline-card-reading-time-stat-item">
							<span className="NToc__inline-card-reading-time-stat-label">
								Chinese:
							</span>
							<span className="NToc__inline-card-reading-time-stat-value">
								{chineseCount}
							</span>
						</div>
						<div className="NToc__inline-card-reading-time-stat-item">
							<span className="NToc__inline-card-reading-time-stat-label">
								English:
							</span>
							<span className="NToc__inline-card-reading-time-stat-value">
								{englishCount}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
