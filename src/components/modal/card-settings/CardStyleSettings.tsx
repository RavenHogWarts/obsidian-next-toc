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
	const [activeStyleTarget, setActiveStyleTarget] =
		useState<StyleTarget>("containerStyle");
	const [showAdvanced, setShowAdvanced] = useState(false);
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

	const addCustomProperty = () => {
		if (customProperty.trim() && customValue.trim()) {
			updateStyle(
				activeStyleTarget,
				customProperty.trim(),
				customValue.trim()
			);
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

	const renderCommonStyleControls = (target: StyleTarget) => {
		const currentStyle = getCurrentStyle(target);

		return (
			<div className="NToc__inline-card-style-controls">
				<div className="NToc__inline-card-style-grid">
					<div className="NToc__inline-card-style-item">
						<label>Background Color</label>
						<div className="NToc__inline-card-color-input-group">
							<input
								type="color"
								value={
									(currentStyle.backgroundColor as string) ||
									"#ffffff"
								}
								onChange={(e) =>
									updateStyle(
										target,
										"backgroundColor",
										e.target.value
									)
								}
							/>
							<input
								type="text"
								value={
									(currentStyle.backgroundColor as string) ||
									""
								}
								onChange={(e) =>
									updateStyle(
										target,
										"backgroundColor",
										e.target.value
									)
								}
								placeholder="#ffffff"
							/>
						</div>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Text Color</label>
						<div className="NToc__inline-card-color-input-group">
							<input
								type="color"
								value={
									(currentStyle.color as string) || "#000000"
								}
								onChange={(e) =>
									updateStyle(target, "color", e.target.value)
								}
							/>
							<input
								type="text"
								value={(currentStyle.color as string) || ""}
								onChange={(e) =>
									updateStyle(target, "color", e.target.value)
								}
								placeholder="#000000"
							/>
						</div>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Font Size</label>
						<input
							type="text"
							value={(currentStyle.fontSize as string) || ""}
							onChange={(e) =>
								updateStyle(target, "fontSize", e.target.value)
							}
							placeholder="14px, 1rem, etc."
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Font Weight</label>
						<select
							value={(currentStyle.fontWeight as string) || ""}
							onChange={(e) =>
								updateStyle(
									target,
									"fontWeight",
									e.target.value
								)
							}
						>
							<option value="">Default</option>
							<option value="normal">Normal</option>
							<option value="bold">Bold</option>
							<option value="lighter">Lighter</option>
							<option value="bolder">Bolder</option>
							<option value="100">100</option>
							<option value="200">200</option>
							<option value="300">300</option>
							<option value="400">400</option>
							<option value="500">500</option>
							<option value="600">600</option>
							<option value="700">700</option>
							<option value="800">800</option>
							<option value="900">900</option>
						</select>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Padding</label>
						<input
							type="text"
							value={(currentStyle.padding as string) || ""}
							onChange={(e) =>
								updateStyle(target, "padding", e.target.value)
							}
							placeholder="8px, 1rem 2rem, etc."
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Margin</label>
						<input
							type="text"
							value={(currentStyle.margin as string) || ""}
							onChange={(e) =>
								updateStyle(target, "margin", e.target.value)
							}
							placeholder="8px, 1rem 2rem, etc."
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Border</label>
						<input
							type="text"
							value={(currentStyle.border as string) || ""}
							onChange={(e) =>
								updateStyle(target, "border", e.target.value)
							}
							placeholder="1px solid #ccc"
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Border Radius</label>
						<input
							type="text"
							value={(currentStyle.borderRadius as string) || ""}
							onChange={(e) =>
								updateStyle(
									target,
									"borderRadius",
									e.target.value
								)
							}
							placeholder="4px, 50%, etc."
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Box Shadow</label>
						<input
							type="text"
							value={(currentStyle.boxShadow as string) || ""}
							onChange={(e) =>
								updateStyle(target, "boxShadow", e.target.value)
							}
							placeholder="0 2px 4px rgba(0,0,0,0.1)"
						/>
					</div>

					<div className="NToc__inline-card-style-item">
						<label>Text Align</label>
						<select
							value={(currentStyle.textAlign as string) || ""}
							onChange={(e) =>
								updateStyle(target, "textAlign", e.target.value)
							}
						>
							<option value="">Default</option>
							<option value="left">Left</option>
							<option value="center">Center</option>
							<option value="right">Right</option>
							<option value="justify">Justify</option>
						</select>
					</div>
				</div>
			</div>
		);
	};

	const renderAdvancedControls = (target: StyleTarget) => {
		const currentStyle = getCurrentStyle(target);
		const customProperties = Object.entries(currentStyle).filter(
			([key]) =>
				![
					"backgroundColor",
					"color",
					"fontSize",
					"fontWeight",
					"padding",
					"margin",
					"border",
					"borderRadius",
					"boxShadow",
					"textAlign",
				].includes(key)
		);

		return (
			<div className="NToc__inline-card-advanced-controls">
				<h4>Custom Properties</h4>

				<div className="NToc__inline-card-custom-property-list">
					{customProperties.map(([property, value]) => (
						<div
							key={property}
							className="NToc__inline-card-custom-property-item"
						>
							<span className="NToc__inline-card-property-name">
								{property}
							</span>
							<span className="NToc__inline-card-property-value">
								{value as string}
							</span>
							<button
								type="button"
								className="NToc__inline-card-remove-property"
								onClick={() =>
									removeStyleProperty(target, property)
								}
							>
								×
							</button>
						</div>
					))}
				</div>

				<div className="NToc__inline-card-add-custom-property">
					<input
						type="text"
						placeholder="Property name (e.g., display)"
						value={customProperty}
						onChange={(e) => setCustomProperty(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Property value (e.g., flex)"
						value={customValue}
						onChange={(e) => setCustomValue(e.target.value)}
					/>
					<button
						type="button"
						onClick={addCustomProperty}
						disabled={!customProperty.trim() || !customValue.trim()}
					>
						Add
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className="NToc__inline-card-style-settings">
			<div className="NToc__inline-card-style-target-selector">
				<div className="NToc__inline-card-style-target-tabs">
					<button
						type="button"
						className={`NToc__inline-card-style-target-tab ${
							activeStyleTarget === "containerStyle"
								? "active"
								: ""
						}`}
						onClick={() => setActiveStyleTarget("containerStyle")}
					>
						Container
					</button>
					<button
						type="button"
						className={`NToc__inline-card-style-target-tab ${
							activeStyleTarget === "titleStyle" ? "active" : ""
						}`}
						onClick={() => setActiveStyleTarget("titleStyle")}
					>
						Title
					</button>
					<button
						type="button"
						className={`NToc__inline-card-style-target-tab ${
							activeStyleTarget === "contentStyle" ? "active" : ""
						}`}
						onClick={() => setActiveStyleTarget("contentStyle")}
					>
						Content
					</button>
				</div>
			</div>

			<div className="NToc__inline-card-style-content">
				<h3>
					Style {activeStyleTarget.replace("Style", "").toUpperCase()}
				</h3>

				{renderCommonStyleControls(activeStyleTarget)}

				<div className="NToc__inline-card-advanced-toggle">
					<button
						type="button"
						className="NToc__inline-card-toggle-advanced"
						onClick={() => setShowAdvanced(!showAdvanced)}
					>
						{showAdvanced ? "Hide" : "Show"} Advanced Settings
					</button>
				</div>

				{showAdvanced && renderAdvancedControls(activeStyleTarget)}
			</div>
		</div>
	);
};
