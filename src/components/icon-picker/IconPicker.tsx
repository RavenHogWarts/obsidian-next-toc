import {
	App,
	FuzzyMatch,
	FuzzySuggestModal,
	getIconIds,
	IconName,
	setIcon,
} from "obsidian";
import * as React from "react";
import "./IconPicker.css";

interface IconPickerProps {
	app: App;
	value: string;
	onChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
	app,
	value,
	onChange,
}) => {
	const [selectedIcon, setSelectedIcon] = React.useState<string>(value);
	const buttonRef = React.useRef<HTMLDivElement>(null);

	const handleClick = () => {
		const modal = new IconSelector(app, (icon) => {
			setSelectedIcon(icon);
			onChange(icon);
		});
		modal.open();
	};

	React.useEffect(() => {
		if (buttonRef.current) {
			setIcon(buttonRef.current, selectedIcon);
		}
	}, [selectedIcon]);

	// 监听外部 value 变化，同步更新 selectedIcon 状态
	React.useEffect(() => {
		setSelectedIcon(value);
	}, [value]);

	return (
		<div
			className="NToc__icon-picker"
			ref={buttonRef}
			onClick={handleClick}
		></div>
	);
};

class IconSelector extends FuzzySuggestModal<IconName> {
	private callback: (icon: string) => void;

	constructor(app: App, callback: (icon: string) => void) {
		super(app);
		this.callback = callback;
		this.setInstructions([
			{ command: "↑↓", purpose: "Navigate" },
			{ command: "↵", purpose: "Select" },
			{ command: "esc", purpose: "Dismiss" },
		]);
	}

	getItems(): IconName[] {
		return getIconIds().map((id) => id.replace("lucide-", ""));
	}

	getItemText(icon: IconName): string {
		return icon;
	}

	renderSuggestion(item: FuzzyMatch<IconName>, el: HTMLElement) {
		super.renderSuggestion(item, el);
		el.addClass("NToc__icon-suggestion");
		setIcon(el, item.item);
		el.createSpan({ text: item.item });
	}

	onChooseItem(item: IconName, evt: MouseEvent | KeyboardEvent): void {
		this.callback(item);
	}
}
