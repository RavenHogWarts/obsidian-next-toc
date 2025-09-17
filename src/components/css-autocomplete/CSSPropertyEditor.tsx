import { FC, useState } from "react";
import { CSSAutoComplete } from "./CSSAutoComplete";
import "./CSSPropertyEditor.css";

export interface CSSPropertyEditorProps {
	property: string;
	value: string;
	onPropertyChange: (property: string) => void;
	onValueChange: (value: string) => void;
	onRemove: () => void;
	className?: string;
}

export const CSSPropertyEditor: FC<CSSPropertyEditorProps> = ({
	property,
	value,
	onPropertyChange,
	onValueChange,
	onRemove,
	className = "",
}) => {
	const [isPropertyFocused, setIsPropertyFocused] = useState(false);
	const [isValueFocused, setIsValueFocused] = useState(false);

	return (
		<div className={`css-property-editor ${className}`}>
			<div className="css-property-editor-property">
				<CSSAutoComplete
					value={property}
					onChange={onPropertyChange}
					placeholder="CSS property"
					type="property"
					className={`css-property-input ${
						isPropertyFocused ? "focused" : ""
					}`}
				/>
			</div>

			<div className="css-property-editor-separator">:</div>

			<div className="css-property-editor-value">
				<CSSAutoComplete
					value={value}
					onChange={onValueChange}
					placeholder="CSS value"
					type="value"
					property={property}
					className={`css-value-input ${
						isValueFocused ? "focused" : ""
					}`}
				/>
			</div>

			<button
				type="button"
				className="css-property-editor-remove"
				onClick={onRemove}
				title="Remove property"
				aria-label="Remove CSS property"
			>
				×
			</button>
		</div>
	);
};
