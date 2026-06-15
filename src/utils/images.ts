// Tipos
import type { CloudflareImageOptions } from "../types";

// Genera URL optimizada con Cloudflare Image Resizing
export const getCloudflareImage = (
	url: string,
	options: CloudflareImageOptions | number = {},
): string => {
	// 1. Retorna vacío si la URL no es válida
	if (!url || typeof url !== "string" || url.trim() === "") {
		return "";
	}

	const config = typeof options === "number" ? { width: options } : options;

	// 2. En desarrollo devuelve la URL original sin transformar
	if (import.meta.env.DEV) {
		return url;
	}

	// 3. Construye los parámetros de transformación
	const width = config.width || null;
	const height = config.height || null;
	const quality = config.quality || 80;
	const format = config.format || "auto";
	const fit = config.fit || "scale-down";

	const paramsParts: string[] = [];
	if (width) paramsParts.push(`width=${width}`);
	if (height) paramsParts.push(`height=${height}`);
	paramsParts.push(`quality=${quality}`);
	paramsParts.push(`format=${format}`);
	paramsParts.push(`fit=${fit}`);

	const paramsString = paramsParts.join(",");
	const myDomain = "portafolio-web-front.mgdc.site";

	const cdnPrefix = `https://${myDomain}/cdn-cgi/image/${paramsString}`;

	// 4. Si la URL es del dominio local, aplica CDN directo
	if (url.includes(myDomain)) {
		try {
			const urlObj = new URL(url);
			return `${cdnPrefix}${urlObj.pathname}`;
		} catch (_e: unknown) {
			console.error("[IMAGES] URL inválida:", url);
			return url;
		}
	}

	// 5. Dominios externos permitidos para CDN
	const allowedExternalDomains = [
		"avatars.githubusercontent.com",
		"i.pravatar.cc",
	];

	// 5a. Aplica CDN si el dominio está en la lista blanca
	if (allowedExternalDomains.some(domain => url.includes(domain))) {
		return `${cdnPrefix}/${url}`;
	}

	// 6. Si no aplica CDN, devuelve la URL original
	return url;
};
