import NTocPlugin from "@src/main";
import { DEFAULT_SETTINGS, NTocPluginSettings } from "@src/types/types";

export default class SettingsStore {
	#plugin: NTocPlugin;
	#subscribers = new Set<() => void>();
	#store = {
		subscribe: (callback: () => void) => {
			this.#subscribers.add(callback);
			return () => this.#subscribers.delete(callback);
		},
		getSnapshot: (): NTocPluginSettings => this.#plugin.settings,
	};

	constructor(plugin: NTocPlugin) {
		this.#plugin = plugin;
	}

	get settings() {
		return this.#plugin.settings;
	}

	get store() {
		return Object.assign({}, this.#store);
	}

	get plugin() {
		return this.#plugin;
	}

	#notifyStoreSubscribers() {
		this.#subscribers.forEach((callback) => callback());
	}

	async loadSettings() {
		this.#plugin.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.#plugin.loadData()
		);
		this.#plugin.saveSettings();
		this.#notifyStoreSubscribers();
	}

	async updateSettings(settings: NTocPluginSettings) {
		this.#plugin.settings = Object.assign({}, settings);
		await this.#plugin.saveSettings();
		this.#notifyStoreSubscribers();
	}
}
