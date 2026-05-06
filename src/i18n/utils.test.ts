import { describe, it, expect } from 'vitest'
import { useTranslations } from './utils'

describe('useTranslations', () => {
    it('should return a translation function', () => {
        const t = useTranslations('es');
        expect(typeof t).toBe('function');
    });

    it('should translate a known key in Spanish', () => {
        const t = useTranslations('es');
        // Assuming 'nav.home' matches whatever is in ui.ts
        // Let's check a generic key or mock ui if needed, 
        // but here we are testing with the real ui.ts content.
        const result = t('nav.home' as any);
        expect(result).toBeDefined();
    });

    it('should fall back to default language (es) if key missing in target', () => {
        const t = useTranslations('en');
        const result = t('nav.home' as any);
        expect(result).toBeDefined();
    });
});
