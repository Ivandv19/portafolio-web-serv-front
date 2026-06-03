export function emailTemplateHtml(nombre: string, email: string, servicio: string, mensaje: string) {
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
</html>`;
}
