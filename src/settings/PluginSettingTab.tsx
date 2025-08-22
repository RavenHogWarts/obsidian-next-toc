import { ObsidianAppContext } from "@src/context/ObsidianAppContext";
import { SettingsStoreContext } from "@src/context/SettingsStoreContext";
import NTocPlugin from "@src/main";
import { PluginSettingTab as ObPluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";

export class PluginSettingTab extends ObPluginSettingTab {
	plugin: NTocPlugin;
	root: Root;

	constructor(plugin: NTocPlugin) {
		super(plugin.app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		this.root = createRoot(containerEl);
		this.root.render(
			<StrictMode>
				<ObsidianAppContext.Provider value={this.plugin.app}>
					<SettingsStoreContext.Provider
						value={this.plugin.settingsStore}
					></SettingsStoreContext.Provider>
				</ObsidianAppContext.Provider>
			</StrictMode>
		);
	}

	hide() {
		this.root.unmount();
		this.containerEl.empty();
	}
}
