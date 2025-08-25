import SettingsStore from "@src/settings/SettingsStore";
import { NTocPluginSettings } from "@src/types/types";
import { useSyncExternalStore } from "react";

export default function usePluginSettings(
	settingsStore: SettingsStore
): NTocPluginSettings {
	const settings = useSyncExternalStore(
		settingsStore.store.subscribe,
		settingsStore.store.getSnapshot
	);
	return settings;
}
