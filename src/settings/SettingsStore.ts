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

	get app() {
		return this.#plugin.app;
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

	/**
	 * 通过路径更新特定设置值
	 * @param path 设置路径，如 "toc.show" 或 "tool.returnToCursor.enabled"
	 * @param value 新的设置值
	 */
	async updateSettingByPath<T>(path: string, value: T) {
		// 创建设置的深拷贝
		const newSettings = JSON.parse(JSON.stringify(this.#plugin.settings));
		const pathParts = path.split(".");
		let current: unknown = newSettings;

		// 遍历路径，找到父对象
		for (let i = 0; i < pathParts.length - 1; i++) {
			const part = pathParts[i];
			if (
				typeof current === "object" &&
				current !== null &&
				part in current
			) {
				current = (current as Record<string, unknown>)[part];
			} else {
				throw new Error(`Invalid setting path: ${path}`);
			}
		}

		// 设置最终值
		const finalPart = pathParts[pathParts.length - 1];
		if (
			typeof current === "object" &&
			current !== null &&
			finalPart in current
		) {
			(current as Record<string, unknown>)[finalPart] = value;
		} else {
			throw new Error(`Invalid setting path: ${path}`);
		}

		// 使用 updateSettings 方法更新设置
		await this.updateSettings(newSettings);
	}
}
