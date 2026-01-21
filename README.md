# Ivan Cruz - Frontend Portfolio

![Status](https://img.shields.io/badge/Status-Active-success)
![Astro](https://img.shields.io/badge/Astro-5.0-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-blue)

Portfolio personal moderno y de alto rendimiento construido con **Astro**, **React**, y **Tailwind CSS**. Diseñado para mostrar proyectos, habilidades y ofrecer servicios de desarrollo web e infraestructura cloud.

## 🚀 Características

- **Stack Moderno**: Astro 5 + React para interactividad selectiva.
- **Estilos**: Tailwind CSS v4 + DaisyUI para componentes elegantes.
- **i18n**: Soporte completo para Inglés y Español con detección automática.
- **Performance**: Optimización de imágenes (Cloudflare Images) y carga diferida.
- **SEO**: Meta etiquetas dinámicas, sitemap XML y estructura semántica.
- **Contacto**: Backend serverless integrado (Function) usando Resend.
- **Animaciones**: Efectos "fade-in" suaves al hacer scroll.

## 🛠️ Tecnologías

- **Frontend Core**: [Astro](https://astro.build/)
- **UI Components**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Icons**: [Iconify](https://iconify.design/) & Lucide React
- **Deployment**: Optimizado para Cloudflare Pages
- **Forms**: API Route propia + [Resend](https://resend.com/) para emails

## 📦 Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Ivandv19/portafolio-web-serv-front.git
   ```

2. Instala las dependencias:
   ```bash
   pnpm install
   ```

3. Configurar variables de entorno:
   Crea un archivo `.env` en la raíz (si vas a probar el formulario localmente):
   ```
   RESEND_API_KEY=tu_api_key_aqui
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

## 🏗️ Build para Producción

Para generar los archivos estáticos para despliegue:

```bash
pnpm build
```

El resultado estará en la carpeta `dist/`.

## 🌐 Estructura del Proyecto

```text
/src
├── components/   # Componentes UI (Hero, Projects, etc.)
├── layouts/      # Layout base (Head, Navbar, Footer)
├── pages/        # Rutas y páginas (index.astro, 404.astro)
├── i18n/         # Textos y traducciones
├── data/         # Datos de proyectos
└── styles/       # CSS global y configuración de Tailwind
/functions        # Serverless functions para Cloudflare
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
