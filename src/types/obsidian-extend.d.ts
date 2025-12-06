import "obsidian";

declare module "obsidian" {
	interface Setting {
		setVisibility(visible: boolean): this;
	}

	interface ColorComponent {
		colorPickerEl: HTMLInputElement;
	}

	interface ProgressBarComponent {
		progressBar: HTMLDivElement;
		lineEl: HTMLDivElement;
		setVisibility(visible: boolean): this;
	}

	interface SearchComponent {
		containerEl: HTMLElement;
		setClass(cls: string): this;
	}
}
