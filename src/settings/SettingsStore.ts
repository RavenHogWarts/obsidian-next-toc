import NTocPlugin from "@src/main";
import {
	createMarkdownRenderService,
	MarkdownRenderService,
} from "@src/services/MarkdownRenderService";
import { DEFAULT_SETTINGS, IPluginSettings } from "@src/types/types";
import { Component } from "obsidian";

export default class SettingsStore {
	#plugin: NTocPlugin;
	#subscribers = new Set<() => void>();
	#store = {
		subscribe: (callback: () => void) => {
			this.#subscribers.add(callback);
			return () => this.#subscribers.delete(callback);
		},
		getSnapshot: (): IPluginSettings => this.#plugin.settings,
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

	get app() {
		return this.#plugin.app;
	}

	/**
	 * 创建 Markdown 渲染服务
	 * @param component - 组件实例，用于管理渲染生命周期
	 * @returns MarkdownRenderService 实例
	 */
	createMarkdownRenderService(component: Component): MarkdownRenderService {
		return createMarkdownRenderService(this.app, component);
	}

	#notifyStoreSubscribers() {
		this.#subscribers.forEach((callback) => callback());
	}

	#mergeWithDefaults<T>(saved: unknown, defaults: T): T {
		if (
			defaults !== null &&
			typeof defaults === "object" &&
			!Array.isArray(defaults)
		) {
			const result: Record<string, unknown> = {};
			const defaultRecord = defaults as unknown as Record<
				string,
				unknown
			>;
			const savedRecord = (saved ?? {}) as Record<string, unknown>;

			// 遍历默认配置的键
			for (const key of Object.keys(defaultRecord)) {
				// 防止原型污染：跳过危险属性
				if (
					key === "__proto__" ||
					key === "constructor" ||
					key === "prototype"
				) {
					continue;
				}

				const defaultValue = defaultRecord[key];
				const savedValue = savedRecord[key];

				// 如果默认值是空对象，且 saved 中有该字段且是对象，直接使用 saved 的值
				if (
					typeof defaultValue === "object" &&
					defaultValue !== null &&
					!Array.isArray(defaultValue) &&
					Object.keys(defaultValue).length === 0 &&
					typeof savedValue === "object" &&
					savedValue !== null
				) {
					result[key] = savedValue;
				} else {
					result[key] = this.#mergeWithDefaults(
						savedValue,
						defaultValue,
					);
				}
			}

			return result as unknown as T;
		}

		const isArrayDefault = Array.isArray(defaults);
		const isArraySaved = Array.isArray(saved);
		if (
			saved === undefined ||
			(typeof defaults !== typeof saved && !isArrayDefault) ||
			(isArrayDefault && !isArraySaved)
		) {
			return defaults;
		}
		return saved as T;
	}

	async loadSettings() {
		const saved = await this.#plugin.loadData();
		// 与默认配置深度对齐：只保留定义内字段并填充缺省
		this.#plugin.settings = this.#mergeWithDefaults(
			saved ?? {},
			DEFAULT_SETTINGS,
		);
		await this.#plugin.saveSettings();
		this.#notifyStoreSubscribers();
	}

	async updateSettings(settings: IPluginSettings) {
		this.#plugin.settings = Object.assign({}, settings);
		await this.#plugin.saveSettings();
		this.#notifyStoreSubscribers();
	}

	/**
	 * 通过路径更新特定设置值
	 * @param path 设置路径
	 * @param value 新的设置值
	 */
	async updateSettingByPath<T>(path: string, value: T) {
		// 创建设置的深拷贝
		const newSettings = JSON.parse(JSON.stringify(this.#plugin.settings));
		const pathParts = path.split(".");

		// 防止原型污染：验证路径中不包含危险属性
		for (const part of pathParts) {
			if (
				part === "__proto__" ||
				part === "constructor" ||
				part === "prototype"
			) {
				throw new Error(
					`Invalid setting path: ${path} - contains dangerous property`,
				);
			}
		}

		let current: unknown = newSettings;

		// 遍历路径，找到父对象，如果不存在则创建
		for (let i = 0; i < pathParts.length - 1; i++) {
			const part = pathParts[i];
			if (typeof current === "object" && current !== null) {
				const currentRecord = current as Record<string, unknown>;
				// 如果路径不存在，创建一个空对象
				if (
					!Object.prototype.hasOwnProperty.call(currentRecord, part)
				) {
					currentRecord[part] = {};
				}
				current = currentRecord[part];
			} else {
				throw new Error(`Invalid setting path: ${path}`);
			}
		}

		// 设置最终值
		const finalPart = pathParts[pathParts.length - 1];
		if (typeof current === "object" && current !== null) {
			(current as Record<string, unknown>)[finalPart] = value;
		} else {
			throw new Error(`Invalid setting path: ${path}`);
		}

		// 使用 updateSettings 方法更新设置
		await this.updateSettings(newSettings);
	}

	/**
	 * 通过路径删除特定设置值
	 * @param path 设置路径
	 */
	async deleteSettingByPath(path: string) {
		// 创建设置的深拷贝
		const newSettings = JSON.parse(JSON.stringify(this.#plugin.settings));
		const pathParts = path.split(".");

		// 防止原型污染：验证路径中不包含危险属性
		for (const part of pathParts) {
			if (
				part === "__proto__" ||
				part === "constructor" ||
				part === "prototype"
			) {
				throw new Error(
					`Invalid setting path: ${path} - contains dangerous property`,
				);
			}
		}

		let current: unknown = newSettings;

		// 遍历路径，找到父对象
		for (let i = 0; i < pathParts.length - 1; i++) {
			const part = pathParts[i];
			if (
				typeof current === "object" &&
				current !== null &&
				Object.prototype.hasOwnProperty.call(current, part)
			) {
				current = (current as Record<string, unknown>)[part];
			} else {
				// 路径不存在，无需删除，直接返回
				return;
			}
		}

		// 删除最终属性
		const finalPart = pathParts[pathParts.length - 1];
		if (
			typeof current === "object" &&
			current !== null &&
			Object.prototype.hasOwnProperty.call(current, finalPart)
		) {
			delete (current as Record<string, unknown>)[finalPart];
			// 使用 updateSettings 方法更新设置
			await this.updateSettings(newSettings);
		}
		// 如果路径不存在，无需删除，直接返回
	}
}
