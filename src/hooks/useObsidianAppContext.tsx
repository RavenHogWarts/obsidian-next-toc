import { ObsidianAppContext } from "@src/context/ObsidianAppContext";
import { App } from "obsidian";
import { useContext } from "react";

export const useObsidianApp = (): App => {
	const app = useContext(ObsidianAppContext);
	if (!app) {
		throw new Error(
			"useObsidianApp must be used within a ObsidianAppContext"
		);
	}
	return app;
};
