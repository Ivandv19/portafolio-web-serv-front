// Resend
import { Resend } from "resend";
import type { IEmailService } from "./email.service";

// Implementación con Resend SDK
export class ResendEmailService implements IEmailService {
	private resend: Resend | null;
	private fromEmail: string;
	private toEmail: string;

	constructor(apiKey: string, fromEmail: string, toEmail: string) {
		this.resend = apiKey ? new Resend(apiKey) : null;
		this.fromEmail = fromEmail;
		this.toEmail = toEmail;
	}

	// Envía el correo de lead usando la API de Resend
	async sendContactEmail({ nombre, email, servicio, mensaje }: {
		nombre: string;
		email: string;
		servicio: string;
		mensaje: string;
	}): Promise<{ success: boolean; id?: string; error?: string }> {
		// Servicio no configurado
		if (!this.resend) {
			return { success: false, error: "Servicio de correo no configurado" };
		}

		const { data, error } = await this.resend.emails.send({
			from: this.fromEmail,
			to: this.toEmail,
			replyTo: email,
			subject: `Nuevo Lead: ${nombre} - ${servicio}`,
			html: this.buildTemplate(nombre, email, servicio, mensaje),
		});

		if (error) return { success: false, error: "Error al enviar el correo" };
		return { success: true, id: data?.id };
	}

	// Plantilla HTML para el correo de notificación
	private buildTemplate(nombre: string, email: string, servicio: string, mensaje: string): string {
		return `
			<!DOCTYPE html>
			<html>
				<head>
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background: #1a1a1a; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
						.content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; }
						.field { margin-bottom: 20px; }
						.label { font-weight: bold; color: #4b5563; margin-bottom: 5px; }
						.value { background: white; padding: 10px; border-radius: 4px; border-left: 3px solid #000; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h2 style="margin: 0;">Nuevo Mensaje de Contacto</h2>
						</div>
						<div class="content">
							<div class="field">
								<div class="label">Nombre:</div>
								<div class="value">${nombre}</div>
							</div>
							<div class="field">
								<div class="label">Email:</div>
								<div class="value"><a href="mailto:${email}">${email}</a></div>
							</div>
							<div class="field">
								<div class="label">Interes:</div>
								<div class="value">${servicio}</div>
							</div>
							<div class="field">
								<div class="label">Mensaje:</div>
								<div class="value">${mensaje.replace(/\n/g, "<br>")}</div>
							</div>
						</div>
					</div>
				</body>
			</html>
		`;
	}
}
