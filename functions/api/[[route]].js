// functions/api/[[route]].js
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";

const app = new Hono().basePath("/api");

// Ruta POST para el envío de correos
app.post("/send-email", async (c) => {
	try {
		const body = await c.req.json();

		if (body.fax_number) {
			return c.json({ success: true, message: "Enviado" });
		}
		const { nombre, email, servicio, mensaje } = body;

		if (!nombre || !email || !mensaje) {
			return c.json({ error: "Faltan datos obligatorios" }, 400);
		}

    // Validación Turnstile
    const token = body['cf-turnstile-response'];
    const ip = c.req.header('CF-Connecting-IP');

    const formData = new FormData();
    formData.append('secret', c.env.TURNSTILE_SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', ip);

    const turnstileResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const outcome = await turnstileResult.json();

    if (!outcome.success) {
      return c.json({ error: "Falló la verificación de seguridad (Captcha)" }, 403);
    }

		const resendRes = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
			},
			body: JSON.stringify({
				from: "Portafolio <onboarding@resend.dev>",
				to: ["ivangtx19@gmail.com"],
				subject: `Nuevo Lead: ${nombre} - ${servicio}`,
				html: `
          <h3>Nuevo mensaje de contacto 🚀</h3>
          <p><strong>De:</strong> ${nombre} (${email})</p>
          <p><strong>Interés:</strong> ${servicio}</p>
          <hr/>
          <p>${mensaje}</p>
        `,
			}),
		});

		const data = await resendRes.json();

		if (resendRes.ok) {
			return c.json({ success: true, message: "Correo enviado" });
		} else {
			console.error("Error Resend:", data);
			return c.json({ error: "Error al enviar el correo" }, 500);
		}
	} catch (err) {
		return c.json({ error: err.message }, 500);
	}
});

// Exportamos el manejador para que Cloudflare Pages lo entienda
export const onRequest = handle(app);
