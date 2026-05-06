import type { CloudflareImageOptions } from "../types";

export const getCloudflareImage = (
	url: string,
	options: CloudflareImageOptions | number = {},
): string => {
	if (!url || typeof url !== "string" || url.trim() === "") {
		return "";
	}

	const config = typeof options === "number" ? { width: options } : options;

	if (import.meta.env.DEV) {
		return url;
	}

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

	if (url.includes(myDomain)) {
		try {
			const urlObj = new URL(url);
			return `${cdnPrefix}${urlObj.pathname}`;
		} catch (_e: unknown) {
			console.error("URL inválida en getCloudflareImage", url);
			return url;
		}
	}

	const allowedExternalDomains = [
		"avatars.githubusercontent.com",
		"i.pravatar.cc",
	];

	if (allowedExternalDomains.some(domain => url.includes(domain))) {
		return `${cdnPrefix}/${url}`;
	}

	return url;
};
