// Interfaz del servicio de verificación CAPTCHA
// Verifica un token de Turnstile con Cloudflare
export interface IVerificationService {
	verify(token: string, ip?: string): Promise<boolean>;
}
