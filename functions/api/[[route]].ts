import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/cloudflare-pages";
import { Resend } from "resend";
import { z } from "zod";

// Schema de validación
const contactSchema = z.object({
	nombre: z.string().min(2, "Nombre muy corto").max(100, "Nombre muy largo"),
	email: z.string().email("Email inválido"),
	servicio: z.string().min(2, "Servicio no especificado").max(100, "Servicio muy largo"),
	mensaje: z.string().min(10, "Mensaje muy corto").max(1000, "Mensaje muy largo"),
	fax_number: z.string().optional(), // Honeypot
});

type Env = {
	RESEND_API_KEY: string;
	TURNSTILE_SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// CORS
app.use(
	"/*",
	cors({
		origin: ["http://localhost:4321", "https://web-portfolio-f.mgdc.site"],
		credentials: true,
	})
);

// Endpoint de contacto
app.post("/send-email", async (c) => {
	try {
		const body = await c.req.json();
		
		// Verificar Honeypot
		if (body.fax_number) {
			return c.json({ success: true, message: "Enviado" });
		}

		const result = contactSchema.extend({
			"cf-turnstile-response": z.string().min(1, "Verificación de humano requerida"),
		}).safeParse(body);

		if (!result.success) {
			return c.json(
				{
					success: false,
					error: "Datos inválidos",
					details: result.error.issues,
				},
				400
			);
		}

		const { nombre, email, servicio, mensaje } = result.data;
		const turnstileToken = result.data["cf-turnstile-response"];

		// Verificar Turnstile
		const secretKey = c.env.TURNSTILE_SECRET_KEY;
		const ip = c.req.header("CF-Connecting-IP");
		
		const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
		
		const formData = new FormData();
		formData.append("secret", secretKey);
		formData.append("response", turnstileToken);
		if (ip) formData.append("remoteip", ip);

		const verifyResponse = await fetch(verifyUrl, {
			method: "POST",
			body: formData,
		});

		const verifyData: any = await verifyResponse.json();
		
		if (!verifyData.success) {
			return c.json(
				{
					success: false,
					error: "Falló la verificación de seguridad (Captcha)",
				},
				403
			);
		}

		if (!c.env.RESEND_API_KEY) {
			return c.json({ success: false, error: "Configuración del servidor incompleta" }, 500);
		}

		// Inicializar Resend
		const resend = new Resend(c.env.RESEND_API_KEY);

		// Enviar email
		const { data, error } = await resend.emails.send({
			from: "Portafolio <onboarding@resend.dev>",
			to: "ivangtx19@gmail.com",
			replyTo: email,
			subject: `Nuevo Lead: ${nombre} - ${servicio}`,
			html: `
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
								<h2 style="margin: 0;">🚀 Nuevo Mensaje de Contacto</h2>
							</div>
							<div class="content">
								<div class="field">
									<div class="label">👤 Nombre:</div>
									<div class="value">${nombre}</div>
								</div>
								<div class="field">
									<div class="label">📧 Email:</div>
									<div class="value"><a href="mailto:${email}">${email}</a></div>
								</div>
								<div class="field">
									<div class="label">🎯 Interés:</div>
									<div class="value">${servicio}</div>
								</div>
								<div class="field">
									<div class="label">💬 Mensaje:</div>
									<div class="value">${mensaje.replace(/\n/g, "<br>")}</div>
								</div>
							</div>
						</div>
					</body>
				</html>
			`,
		});

		if (error) {
			console.error("Resend error:", error);
			return c.json({ success: false, error: "Error al enviar el correo" }, 500);
		}

		return c.json({
			success: true,
			message: "Correo enviado correctamente",
			id: data?.id,
		});
	} catch (error) {
		console.error("Server error:", error);
		return c.json({ success: false, error: "Error interno del servidor" }, 500);
	}
});

// Health check
app.get("/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Export manejador para Cloudflare Pages
export const onRequest = handle(app);
