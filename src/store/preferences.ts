// Store (Zustand)
import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
// Slices
import { createThemeSlice } from "./slices/theme.slice";
import { createLangSlice } from "./slices/lang.slice";
import type { ThemeSlice } from "./slices/theme.slice";
import type { LangSlice } from "./slices/lang.slice";

// Estado combinado del store de preferencias (tema + idioma)
export type PreferencesState = ThemeSlice & LangSlice;

// Store persistido de preferencias de usuario en localStorage
export const preferencesStore = createStore<PreferencesState>()(
	persist(
		(set, get) => ({
			...createThemeSlice(set, get),
			...createLangSlice(set),
		}),
		{
			name: "preferences",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
