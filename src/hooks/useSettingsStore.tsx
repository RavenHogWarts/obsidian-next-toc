import { SettingsContext } from "@src/context/SettingsContext";
import SettingsStore from "@src/settings/SettingsStore";
import { useContext } from "react";

export default function useSettingsStore(): SettingsStore {
	const store = useContext(SettingsContext);
	if (!store) {
		throw new Error(
			"useSettingsStore must be used within a SettingsProvider"
		);
	}
	return store;
}
