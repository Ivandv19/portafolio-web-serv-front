// Claves de traducción del i18n
export type TranslationKey = keyof typeof import("../i18n/ui").ui.es;

// Proyecto del portafolio
export interface Project {
	titulo: string;
	desc: {
		es: string;
		en: string;
	};
	img: string;
	tags: string[];
	live: string;
	repo: string;
}

// Datos del formulario de contacto
export interface ContactFormData {
	nombre: string;
	email: string;
	servicio: string;
	mensaje: string;
	fax_number?: string;
	"cf-turnstile-response"?: string;
}

// Opciones de transformación de imágenes con Cloudflare
export interface CloudflareImageOptions {
	width?: number;
	height?: number;
	quality?: number;
	format?: "auto" | "webp" | "avif" | "jpeg" | "png";
	fit?: "scale-down" | "cover" | "contain" | "crop";
}
