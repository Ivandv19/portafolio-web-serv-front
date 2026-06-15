// Zod
import { z } from "zod";

// Schema de formulario de contacto (honeypot incluido)
const contactSchema = z.object({
	nombre: z.string().min(2, "Nombre muy corto").max(100, "Nombre muy largo"),
	email: z.string().email("Email inválido"),
	servicio: z.string().min(2, "Servicio no especificado").max(100, "Servicio muy largo"),
	mensaje: z.string().min(10, "Mensaje muy corto").max(1000, "Mensaje muy largo"),
	fax_number: z.string().optional(), // Honeypot anti-bots
});

// Schema extendido con token de Turnstile
const contactWithTurnstileSchema = contactSchema.extend({
	"cf-turnstile-response": z.string().min(1, "Verificación de humano requerida"),
});

export type ContactData = z.infer<typeof contactSchema>;
export type ContactWithTurnstile = z.infer<typeof contactWithTurnstileSchema>;

// Valida y parsea los datos del formulario contra el schema completo
export function parseContactData(body: unknown) {
	return contactWithTurnstileSchema.safeParse(body);
}

// Verifica si el honeypot fue llenado (indica bot)
export function isHoneypot(body: Record<string, unknown>): boolean {
	return Boolean(body.fax_number);
}
