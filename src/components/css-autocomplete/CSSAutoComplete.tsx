import {
	filterCSSProperties,
	getAllCSSProperties,
	getCSSPropertySuggestions,
} from "@src/utils/cssProperties";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import "./CSSAutoComplete.css";

export interface CSSAutoCompleteProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	type?: "property" | "value";
	property?: string; // 当type为'value'时，需要指定对应的CSS属性
}

export const CSSAutoComplete: FC<CSSAutoCompleteProps> = ({
	value,
	onChange,
	placeholder = "Enter CSS property",
	className = "",
	type = "property",
	property = "",
}) => {
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [allProperties] = useState<string[]>(() => getAllCSSProperties());

	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (type === "property") {
			const filtered = filterCSSProperties(value, allProperties);
			setSuggestions(filtered);
		} else if (type === "value" && property) {
			const valueSuggestions = getCSSPropertySuggestions(property);
			setSuggestions(valueSuggestions);
		}
	}, [value, allProperties, type, property]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		onChange(newValue);
		setShowSuggestions(true);
		setSelectedIndex(-1);
	};

	const handleInputFocus = () => {
		setShowSuggestions(true);
	};

	const handleInputBlur = () => {
		// 延迟隐藏建议列表，以便处理点击建议项
		setTimeout(() => {
			setShowSuggestions(false);
			setSelectedIndex(-1);
		}, 150);
	};

	const handleSuggestionClick = (suggestion: string) => {
		onChange(suggestion);
		setShowSuggestions(false);
		setSelectedIndex(-1);
		inputRef.current?.focus();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (!showSuggestions || suggestions.length === 0) return;

		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : 0
				);
				break;
			case "ArrowUp":
				e.preventDefault();
				setSelectedIndex((prev) =>
					prev > 0 ? prev - 1 : suggestions.length - 1
				);
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0) {
					handleSuggestionClick(suggestions[selectedIndex]);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
			case "Tab":
				if (selectedIndex >= 0) {
					e.preventDefault();
					handleSuggestionClick(suggestions[selectedIndex]);
				}
				break;
		}
	};

	useEffect(() => {
		if (selectedIndex >= 0 && suggestionsRef.current) {
			const selectedElement = suggestionsRef.current.children[
				selectedIndex
			] as HTMLElement;
			if (selectedElement) {
				selectedElement.scrollIntoView({
					block: "nearest",
					behavior: "smooth",
				});
			}
		}
	}, [selectedIndex]);

	return (
		<div className={`css-autocomplete ${className}`}>
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={handleInputChange}
				onFocus={handleInputFocus}
				onBlur={handleInputBlur}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="css-autocomplete-input"
				autoComplete="off"
			/>

			{showSuggestions && suggestions.length > 0 && (
				<div
					ref={suggestionsRef}
					className="css-autocomplete-suggestions"
				>
					{suggestions.map((suggestion, index) => (
						<div
							key={suggestion}
							className={`css-autocomplete-suggestion ${
								index === selectedIndex ? "selected" : ""
							}`}
							onClick={() => handleSuggestionClick(suggestion)}
							onMouseEnter={() => setSelectedIndex(index)}
						>
							<span className="suggestion-text">
								{suggestion}
							</span>
							{type === "property" && (
								<span className="suggestion-type">
									property
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};
