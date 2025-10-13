import { CSSPropertyEditor } from "@src/components/css-autocomplete";
import { Tab, TabItem } from "@src/components/tab/Tab";
import { t } from "@src/i18n/i18n";
import { CardConfig } from "@src/types/cards";
import { Plus } from "lucide-react";
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
							<h4>{t("cards.styles.currentProperties")}</h4>
							<div className="NToc__inline-card-property-list">
								{styleEntries.map(([property, value]) => (
									<CSSPropertyEditor
										key={property}
										property={property}
										value={value as string}
										onPropertyChange={(newProperty) => {
											if (newProperty !== property) {
												// 如果属性名改变，需要删除旧属性，添加新属性
												const currentStyle =
													cardConfig[target] || {};
												const updatedStyle = {
													...currentStyle,
												};
												delete updatedStyle[
													property as keyof typeof updatedStyle
												];
												updatedStyle[
													newProperty as keyof typeof updatedStyle
												] = value as any;

												onChange({
													...cardConfig,
													[target]:
														Object.keys(
															updatedStyle
														).length > 0
															? updatedStyle
															: undefined,
												});
											}
										}}
										onValueChange={(newValue) =>
											updateStyle(
												target,
												property,
												newValue
											)
										}
										onRemove={() =>
											removeStyleProperty(
												target,
												property
											)
										}
									/>
								))}
							</div>
						</>
					) : (
						<p className="NToc__inline-card-no-properties">
							{t("cards.styles.noneCustomProperty")}
							{target.replace("Style", "").toLowerCase()}.
						</p>
					)}
				</div>

				<div className="NToc__inline-card-add-property">
					<h4>{t("cards.styles.addNewProperty")}</h4>
					<div className="NToc__inline-card-add-property-form">
						<CSSPropertyEditor
							property={customProperty}
							value={customValue}
							onPropertyChange={setCustomProperty}
							onValueChange={setCustomValue}
							onRemove={() => {
								setCustomProperty("");
								setCustomValue("");
							}}
						/>
						<button
							type="button"
							onClick={() => addCustomProperty(target)}
							disabled={
								!customProperty.trim() || !customValue.trim()
							}
							className="NToc__inline-card-add-property-btn"
						>
							<Plus size={16} />
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
