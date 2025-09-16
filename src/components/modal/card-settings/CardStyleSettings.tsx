import { Tab, TabItem } from "@src/components/tab/Tab";
import { CardConfig } from "@src/types/cards";
import { FC, useState } from "react";
import "./CardStyleSettings.css";

interface CardStyleSettingsProps {
	cardConfig: CardConfig;
	onChange: (config: CardConfig) => void;
}

type StyleTarget = "containerStyle" | "titleStyle" | "contentStyle";

export const CardStyleSettings: FC<CardStyleSettingsProps> = ({
	cardConfig,
	onChange,
}) => {
	const [customProperty, setCustomProperty] = useState("");
	const [customValue, setCustomValue] = useState("");

	const updateStyle = (
		target: StyleTarget,
		property: string,
		value: string
	) => {
		const currentStyle = cardConfig[target] || {};
		const updatedStyle = {
			...currentStyle,
			[property]: value || undefined,
		};

		// 清理空值
		Object.keys(updatedStyle).forEach((key) => {
			if (!updatedStyle[key as keyof typeof updatedStyle]) {
				delete updatedStyle[key as keyof typeof updatedStyle];
			}
		});

		onChange({
			...cardConfig,
			[target]:
				Object.keys(updatedStyle).length > 0 ? updatedStyle : undefined,
		});
	};

	const getCurrentStyle = (
		target: StyleTarget
	): Partial<CSSStyleDeclaration> => {
		return cardConfig[target] || {};
	};

	const addCustomProperty = (target: StyleTarget) => {
		if (customProperty.trim() && customValue.trim()) {
			updateStyle(target, customProperty.trim(), customValue.trim());
			setCustomProperty("");
			setCustomValue("");
		}
	};

	const removeStyleProperty = (target: StyleTarget, property: string) => {
		const currentStyle = cardConfig[target] || {};
		const updatedStyle = { ...currentStyle };
		delete updatedStyle[property as keyof typeof updatedStyle];

		onChange({
			...cardConfig,
			[target]:
				Object.keys(updatedStyle).length > 0 ? updatedStyle : undefined,
		});
	};

	const renderStyleEditor = (target: StyleTarget) => {
		const currentStyle = getCurrentStyle(target);
		const styleEntries = Object.entries(currentStyle);

		return (
			<div className="NToc__inline-card-style-editor">
				<div className="NToc__inline-card-existing-properties">
					{styleEntries.length > 0 ? (
						<>
							<h4>Current Properties</h4>
							<div className="NToc__inline-card-property-list">
								{styleEntries.map(([property, value]) => (
									<div
										key={property}
										className="NToc__inline-card-property-item"
									>
										<span className="NToc__inline-card-property-name">
											{property}
										</span>
										<input
											type="text"
											className="NToc__inline-card-property-value-input"
											value={value as string}
											onChange={(e) =>
												updateStyle(
													target,
													property,
													e.target.value
												)
											}
											placeholder="Enter value"
										/>
										<button
											type="button"
											className="NToc__inline-card-remove-property"
											onClick={() =>
												removeStyleProperty(
													target,
													property
												)
											}
										>
											×
										</button>
									</div>
								))}
							</div>
						</>
					) : (
						<p className="NToc__inline-card-no-properties">
							No custom properties defined for{" "}
							{target.replace("Style", "").toLowerCase()}.
						</p>
					)}
				</div>

				<div className="NToc__inline-card-add-property">
					<h4>Add New Property</h4>
					<div className="NToc__inline-card-add-property-form">
						<input
							type="text"
							placeholder="Property name (e.g., backgroundColor, fontSize)"
							value={customProperty}
							onChange={(e) => setCustomProperty(e.target.value)}
							className="NToc__inline-card-property-name-input"
						/>
						<input
							type="text"
							placeholder="Property value (e.g., #ffffff, 16px)"
							value={customValue}
							onChange={(e) => setCustomValue(e.target.value)}
							className="NToc__inline-card-property-value-input"
						/>
						<button
							type="button"
							onClick={() => addCustomProperty(target)}
							disabled={
								!customProperty.trim() || !customValue.trim()
							}
							className="NToc__inline-card-add-property-btn"
						>
							Add Property
						</button>
					</div>
				</div>
			</div>
		);
	};

	const tabItems: TabItem[] = [
		{
			id: "containerStyle",
			title: "Container",
			content: renderStyleEditor("containerStyle"),
		},
		{
			id: "titleStyle",
			title: "Title",
			content: renderStyleEditor("titleStyle"),
		},
		{
			id: "contentStyle",
			title: "Content",
			content: renderStyleEditor("contentStyle"),
		},
	];

	return (
		<div className="NToc__inline-card-style-settings">
			<Tab
				items={tabItems}
				defaultValue="containerStyle"
				orientation="horizontal"
				className="NToc__inline-card-style-tabs"
			/>
		</div>
	);
};
