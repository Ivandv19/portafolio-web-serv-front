import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
import { Resend } from "resend";
import { z } from "zod";
import { emailTemplateHtml } from "./email-template";

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
	FROM_EMAIL: string;
	TO_EMAIL: string;
};

const app = new Hono<{ Bindings: Env }>().basePath("/api");

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
			const messages = result.error.issues.map(i => i.message).join(", ");
			return c.json(
				{
					success: false,
					error: messages,
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

		const verifyData: { success: boolean } = await verifyResponse.json();
		
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
			from: c.env.FROM_EMAIL,
			to: c.env.TO_EMAIL,
			replyTo: email,
			subject: `Nuevo Lead: ${nombre} - ${servicio}`,
			html: emailTemplateHtml(nombre, email, servicio, mensaje),
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
