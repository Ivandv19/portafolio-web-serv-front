// Hono
import { Hono } from "hono";
import { handle } from "hono/cloudflare-pages";
// Tipos
import type { Env } from "../_lib/types/env";
// Servicios
import { ContactService } from "../_lib";
// Middleware
import { corsMiddleware } from "../_lib/middleware/cors";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

// CORS global para dominios permitidos
app.use("/*", corsMiddleware);

// POST /api/send-email — Envía formulario de contacto
app.post("/send-email", async (c) => {
	try {
		// 1. Parsea el cuerpo de la petición
		const body = await c.req.json();
		const ip = c.req.header("CF-Connecting-IP");
		// 2. Construye el servicio con sus dependencias y procesa la solicitud
		const { status, body: responseBody } = await ContactService.create(c.env).handleRequest(body, ip);
		// 3. Devuelve la respuesta
		return c.json(responseBody, status);
	} catch (error) {
		console.error("[CONTACTO] Error interno:", error);
		return c.json({ success: false, error: "Error interno del servidor" }, 500);
	}
});

// GET /api/health — Health check
app.get("/health", (c) => {
	return c.json({ status: "ok", marca_tiempo: new Date().toISOString() });
});

// Manejador para Cloudflare Pages
export const onRequest = handle(app);
