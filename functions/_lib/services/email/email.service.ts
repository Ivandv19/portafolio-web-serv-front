// Interfaz del servicio de correo
// Envía un correo de notificación de contacto
export interface IEmailService {
	sendContactEmail(params: {
		nombre: string;
		email: string;
		servicio: string;
		mensaje: string;
	}): Promise<{ success: boolean; id?: string; error?: string }>;
}
