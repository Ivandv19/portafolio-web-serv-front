// i18n
import { ui, defaultLang } from './ui';

// Retorna una función de traducción para el idioma especificado
export function useTranslations(lang: keyof typeof ui = defaultLang) {
	// Función que traduce una clave al idioma activo (fallback al default)
	return function t(key: keyof typeof ui[typeof defaultLang]) {
		return ui[lang]?.[key] || ui[defaultLang][key];
	}
}
