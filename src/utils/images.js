export const getCloudflareImage = (url, options = {}) => {
	if (!url || typeof url !== "string" || url.trim() === "") {
		return "";
	}

	// Manejar compatibilidad hacia atrás si solo se pasa un número (width)
	const config = typeof options === "number" ? { width: options } : options;

	// En desarrollo, devolver la imagen original para evitar errores 403/9401 si no se tiene acceso
	// o si el dominio no permite hotlink desde localhost.
	if (import.meta.env.DEV) {
		return url;
	}

	const width = config.width || null;
	const height = config.height || null;
	const quality = config.quality || 80;
	const format = config.format || "auto";
	const fit = config.fit || "scale-down"; // cover, contain, crop, scale-down

	const paramsParts = [];
	if (width) paramsParts.push(`width=${width}`);
	if (height) paramsParts.push(`height=${height}`);
	paramsParts.push(`quality=${quality}`);
	paramsParts.push(`format=${format}`);
	paramsParts.push(`fit=${fit}`);

	const paramsString = paramsParts.join(",");
	const myDomain = "portafolio-web-front.mgdc.site";
	
	// Prefijo base para la transformación
	const cdnPrefix = `https://${myDomain}/cdn-cgi/image/${paramsString}`;

	// 1. Imágenes alojadas en el mismo dominio (Assets locales/públicos)
	if (url.includes(myDomain)) {
		// Reemplazar el origen por el prefijo de transformación
		// Estrategia: Obtener el path relativo y adjuntarlo
		try {
			const urlObj = new URL(url);
			return `${cdnPrefix}${urlObj.pathname}`;
		} catch (e) {
			console.error("URL inválida en getCloudflareImage", url);
			return url;
		}
	}

	// 2. Imágenes externas permitidas (GitHub, Pravatar, etc.)
	// Cloudflare puede redimensionar imágenes externas si se permite en la configuración o se usa la sintaxis de URL completa
	const allowedExternalDomains = [
		"avatars.githubusercontent.com",
		"i.pravatar.cc",
		// Agregar otros dominios externos si es necesario
	];

	if (allowedExternalDomains.some(domain => url.includes(domain))) {
		return `${cdnPrefix}/${url}`;
	}

	// Fallback para imágenes que no coinciden (devuelve la original)
	return url;
};
