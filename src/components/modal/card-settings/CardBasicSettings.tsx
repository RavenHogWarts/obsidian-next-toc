import {
	CardConfig,
	ReadingTimeCardConfig,
	TocCardConfig,
} from "@src/types/cards";
import { FC } from "react";
import "./CardBasicSettings.css";

interface CardBasicSettingsProps {
	cardConfig: CardConfig;
	onChange: (config: CardConfig) => void;
}

export const CardBasicSettings: FC<CardBasicSettingsProps> = ({
	cardConfig,
	onChange,
}) => {
	const handleInputChange = (
		field: string,
		value: string | number | boolean
	) => {
		onChange({
			...cardConfig,
			[field]: value,
		});
	};

	const renderReadingTimeSettings = (config: ReadingTimeCardConfig) => (
		<div className="NToc__inline-card-basic-settings-section">
			<h3>Reading Time Settings</h3>

			<div className="NToc__inline-card-setting-item">
				<label>Title</label>
				<input
					type="text"
					value={config.title || ""}
					onChange={(e) => handleInputChange("title", e.target.value)}
					placeholder="Enter card title"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Chinese Words Per Minute</label>
				<input
					type="number"
					value={config.chineseWordsPerMinute || 300}
					onChange={(e) =>
						handleInputChange(
							"chineseWordsPerMinute",
							parseInt(e.target.value)
						)
					}
					min="1"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>English Words Per Minute</label>
				<input
					type="number"
					value={config.englishWordsPerMinute || 200}
					onChange={(e) =>
						handleInputChange(
							"englishWordsPerMinute",
							parseInt(e.target.value)
						)
					}
					min="1"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Text Before</label>
				<input
					type="text"
					value={config.textBefore || ""}
					onChange={(e) =>
						handleInputChange("textBefore", e.target.value)
					}
					placeholder="Text before reading time"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Text After</label>
				<input
					type="text"
					value={config.textAfter || ""}
					onChange={(e) =>
						handleInputChange("textAfter", e.target.value)
					}
					placeholder="Text after reading time"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Icon Name</label>
				<input
					type="text"
					value={config.iconName || ""}
					onChange={(e) =>
						handleInputChange("iconName", e.target.value)
					}
					placeholder="Lucide icon name"
				/>
			</div>

			<div className="NToc__inline-card-setting-checkboxes">
				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="removeCodeBlocks"
						checked={config.removeCodeBlocks || false}
						onChange={(e) =>
							handleInputChange(
								"removeCodeBlocks",
								e.target.checked
							)
						}
					/>
					<label htmlFor="removeCodeBlocks">Remove Code Blocks</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="removeWikiLinks"
						checked={config.removeWikiLinks || false}
						onChange={(e) =>
							handleInputChange(
								"removeWikiLinks",
								e.target.checked
							)
						}
					/>
					<label htmlFor="removeWikiLinks">Remove Wiki Links</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="removeImageLinks"
						checked={config.removeImageLinks || false}
						onChange={(e) =>
							handleInputChange(
								"removeImageLinks",
								e.target.checked
							)
						}
					/>
					<label htmlFor="removeImageLinks">Remove Image Links</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="removeNormalLinks"
						checked={config.removeNormalLinks || false}
						onChange={(e) =>
							handleInputChange(
								"removeNormalLinks",
								e.target.checked
							)
						}
					/>
					<label htmlFor="removeNormalLinks">
						Remove Normal Links
					</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="showWordCount"
						checked={config.showWordCount || false}
						onChange={(e) =>
							handleInputChange("showWordCount", e.target.checked)
						}
					/>
					<label htmlFor="showWordCount">Show Word Count</label>
				</div>
			</div>
		</div>
	);

	const renderTocSettings = (config: TocCardConfig) => (
		<div className="NToc__inline-card-basic-settings-section">
			<h3>Table of Contents Settings</h3>

			<div className="NToc__inline-card-setting-item">
				<label>Title</label>
				<input
					type="text"
					value={config.title || ""}
					onChange={(e) => handleInputChange("title", e.target.value)}
					placeholder="Enter card title"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Min Depth</label>
				<input
					type="number"
					value={config.minDepth || 1}
					onChange={(e) =>
						handleInputChange("minDepth", parseInt(e.target.value))
					}
					min="1"
					max="6"
				/>
			</div>

			<div className="NToc__inline-card-setting-item">
				<label>Max Depth</label>
				<input
					type="number"
					value={config.maxDepth || 6}
					onChange={(e) =>
						handleInputChange("maxDepth", parseInt(e.target.value))
					}
					min="1"
					max="6"
				/>
			</div>

			<div className="NToc__inline-card-setting-checkboxes">
				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="redirect"
						checked={config.redirect || false}
						onChange={(e) =>
							handleInputChange("redirect", e.target.checked)
						}
					/>
					<label htmlFor="redirect">Enable Click to Navigate</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="showNumbers"
						checked={config.showNumbers || false}
						onChange={(e) =>
							handleInputChange("showNumbers", e.target.checked)
						}
					/>
					<label htmlFor="showNumbers">Show Numbers</label>
				</div>

				<div className="NToc__inline-card-checkbox-item">
					<input
						type="checkbox"
						id="collapsible"
						checked={config.collapsible || false}
						onChange={(e) =>
							handleInputChange("collapsible", e.target.checked)
						}
					/>
					<label htmlFor="collapsible">Collapsible</label>
				</div>
			</div>
		</div>
	);

	return (
		<div className="NToc__inline-card-basic-settings">
			{cardConfig.type === "reading-time"
				? renderReadingTimeSettings(cardConfig as ReadingTimeCardConfig)
				: renderTocSettings(cardConfig as TocCardConfig)}
		</div>
	);
};
