import { App } from "obsidian";
import { createContext } from "react";

export const ObsidianAppContext = createContext<App | undefined>(undefined);
