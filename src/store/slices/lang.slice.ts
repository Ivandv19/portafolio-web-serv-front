// Idiomas soportados
export type Lang = "es" | "en";

// Slice de idioma para Zustand
export interface LangSlice {
	lang: Lang;
	setLang: (lang: Lang) => void;
}

// Crea el slice de idioma con estado inicial y acción
export const createLangSlice = (set: (partial: Partial<LangSlice>) => void): LangSlice => ({
	lang: "es",
	setLang: (lang) => set({ lang }),
});
