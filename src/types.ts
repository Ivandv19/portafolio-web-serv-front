export type TranslationKey = keyof typeof import("../i18n/ui").ui.es;

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

export interface ContactFormData {
  nombre: string;
  email: string;
  servicio: string;
  mensaje: string;
  fax_number?: string;
  "cf-turnstile-response"?: string;
}

export interface CloudflareImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "avif" | "jpeg" | "png";
  fit?: "scale-down" | "cover" | "contain" | "crop";
}
