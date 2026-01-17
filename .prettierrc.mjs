// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  // Plugins para soportar archivos .astro
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  // Preferencias de estilo
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
};
