import useSettingsStore from "@src/hooks/useSettingsStore";
import { NTocPluginSettings } from "@src/types/types";
import { useSyncExternalStore } from "react";

export default function useSettings(): NTocPluginSettings {
	const settingsStore = useSettingsStore();
	const settings = useSyncExternalStore(
		settingsStore.store.subscribe,
		settingsStore.store.getSnapshot
	);
	return settings;
}
