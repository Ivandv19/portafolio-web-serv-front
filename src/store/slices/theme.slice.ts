// Tipos de tema (claro/oscuro)
export type Theme = "nord" | "business";

// Slice de tema para Zustand
export interface ThemeSlice {
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}

// Crea el slice de tema con estado inicial y acciones
export const createThemeSlice = (
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

// Aplica el tema visual al elemento <html>
export function applyTheme(theme: Theme) {
	const root = document.documentElement;
	root.setAttribute("data-theme", theme);
	root.classList.toggle("dark", theme === "business");
}

// Detecta el tema del sistema operativo
export function getSystemTheme(): Theme {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "business"
		: "nord";
}

// Inicializa el tema desde localStorage o preferencia del sistema
export function initTheme() {
	const { state } = JSON.parse(localStorage.getItem("preferences") || "{}");
	const theme = state?.theme || getSystemTheme();
	setTimeout(() => applyTheme(theme), 0);
}
