import { SettingsStoreContext } from "@src/context/SettingsStoreContext";
import NTocPlugin from "@src/main";
import { PluginSettingTab as ObPluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { NTocSettings } from "./NTocSettings";

export class PluginSettingTab extends ObPluginSettingTab {
	plugin: NTocPlugin;
	root: Root;
	icon: string = "table-of-contents";

	constructor(plugin: NTocPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		this.root = createRoot(containerEl);
		this.root.render(
			<StrictMode>
				<SettingsStoreContext.Provider
					value={this.plugin.settingsStore}
				>
					<NTocSettings />
				</SettingsStoreContext.Provider>
			</StrictMode>
		);
	}

	hide() {
		this.root.unmount();
		this.containerEl.empty();
	}
}
