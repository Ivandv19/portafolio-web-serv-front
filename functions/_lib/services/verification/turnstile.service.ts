import type { IVerificationService } from "./verification.service";

// Implementación con Cloudflare Turnstile
export class TurnstileVerificationService implements IVerificationService {
	constructor(private secretKey: string) {}

	// Verifica el token contra la API de Cloudflare Turnstile
	async verify(token: string, ip?: string): Promise<boolean> {
		const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
		const formData = new FormData();
		formData.append("secret", this.secretKey);
		formData.append("response", token);
		if (ip) formData.append("remoteip", ip);

		const response = await fetch(verifyUrl, {
			method: "POST",
			body: formData,
		});

		const data: { success: boolean } = await response.json();
		return data.success;
	}
}
