// eslint.config.mjs
import eslintPluginAstro from 'eslint-plugin-astro';
export default [
  // Configuraciones recomendadas para Astro
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Aquí puedes añadir reglas personalizadas
      'astro/no-set-html-directives': 'error',
    },
  },
];
