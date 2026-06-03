import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "nord" | "business";
export type Lang = "es" | "en";

/* ---------- Theme Slice ---------- */
export interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const createThemeSlice = (
  set: (partial: Partial<ThemeSlice>) => void,
  get: () => ThemeSlice,
): ThemeSlice => ({
  theme: "nord",
  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
  },
  toggleTheme: () => {
    const { theme, setTheme } = get();
    setTheme(theme === "nord" ? "business" : "nord");
  },
});

/* ---------- Lang Slice ---------- */
export interface LangSlice {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const createLangSlice = (set: (partial: Partial<LangSlice>) => void): LangSlice => ({
  lang: "es",
  setLang: (lang) => set({ lang }),
});

/* ---------- Combined Store ---------- */
export type PreferencesState = ThemeSlice & LangSlice;

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

/* ---------- Helpers ---------- */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.toggle("dark", theme === "business");
}

export function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "business"
    : "nord";
}

export function initTheme() {
  const { state } = JSON.parse(localStorage.getItem("preferences") || "{}");
  const theme = state?.theme || getSystemTheme();
  preferencesStore.getState().setTheme(theme);
}
