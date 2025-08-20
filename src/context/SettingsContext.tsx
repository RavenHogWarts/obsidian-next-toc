import SettingsStore from "@src/settings/SettingsStore";
import { createContext } from "react";

export const SettingsContext = createContext<SettingsStore | undefined>(undefined); 