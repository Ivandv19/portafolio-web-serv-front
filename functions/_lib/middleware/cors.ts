// Hono
import { cors } from "hono/cors";

// Middleware CORS para dominios permitidos (local + producción)
export const corsMiddleware = cors({
	origin: ["http://localhost:4321", "https://web-portfolio-f.mgdc.site"],
	credentials: true,
});
