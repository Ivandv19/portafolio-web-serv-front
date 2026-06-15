// Tipos
import type { Env } from "../types/env";
// Servicios
import type { IEmailService } from "./email/email.service";
import { ResendEmailService } from "./email/resend.service";
import type { IVerificationService } from "./verification/verification.service";
import { TurnstileVerificationService } from "./verification/turnstile.service";
// Validadores
import { parseContactData, isHoneypot } from "../validators/contact.validator";

// Orquestador de la solicitud de contacto (valida, verifica y envía)
export class ContactService {
	// Construye el servicio con sus dependencias inyectadas desde el entorno
	static create(env: Env): ContactService {
		return new ContactService(
			new ResendEmailService(env.RESEND_API_KEY, env.FROM_EMAIL, env.TO_EMAIL),
			new TurnstileVerificationService(env.TURNSTILE_SECRET_KEY),
		);
	}

	constructor(
		private emailService: IEmailService,
		private verificationService: IVerificationService,
	) {}

	// Procesa la solicitud completa: honeypot → validación → Turnstile → email
	async handleRequest(body: unknown, ip?: string): Promise<{
		status: number;
		body: Record<string, unknown>;
	}> {
		// 1. Rechaza si el honeypot está lleno (bot detection)
		if (isHoneypot(body as Record<string, unknown>)) {
			return { status: 200, body: { success: true, message: "Enviado" } };
		}

		// 2. Valida los datos del formulario
		const result = parseContactData(body);
		if (!result.success) {
			return {
				status: 400,
				body: {
					success: false,
					error: "Datos inválidos",
					details: result.error.issues,
				},
			};
		}

		const { nombre, email, servicio, mensaje } = result.data;
		const turnstileToken = result.data["cf-turnstile-response"];

		// 3. Verifica el token de Turnstile (Cloudflare CAPTCHA)
		const isValid = await this.verificationService.verify(turnstileToken, ip);

		// 3a. Token inválido — deniega el acceso
		if (!isValid) {
			return {
				status: 403,
				body: { success: false, error: "Falló la verificación de seguridad (Captcha)" },
			};
		}

		// 4. Envía el correo de notificación
		const emailResult = await this.emailService.sendContactEmail({
			nombre, email, servicio, mensaje,
		});

		// 4a. Error al enviar — responde con el error del servicio
		if (!emailResult.success) {
			return { status: 500, body: { success: false, error: emailResult.error } };
		}

		return {
			status: 200,
			body: { success: true, message: "Correo enviado correctamente", id: emailResult.id },
		};
	}
}
