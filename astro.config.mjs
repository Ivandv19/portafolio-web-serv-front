// @ts-check

// Astro
import { defineConfig } from "astro/config";
// Integraciones
import sitemap from "@astrojs/sitemap";
// Plugins de Vite
import tailwindcss from "@tailwindcss/vite";

// Configuración de Astro — sitio estático multilingüe
export default defineConfig({
	site: "https://web-portfolio.mgdc.site",
	prefetch: true,
	output: "static",

	// Integraciones
	integrations: [sitemap()],

	// Plugins de Vite
	vite: {
		plugins: [tailwindcss()],
	},

	// i18n — español por defecto, inglés como alternativa
	i18n: {
		defaultLocale: "es",
		locales: ["es", "en"],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
