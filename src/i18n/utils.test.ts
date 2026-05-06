import { describe, it, expect } from 'vitest'
import { useTranslations } from './utils'
import type { TranslationKey } from '../types'

describe('useTranslations', () => {
  it('should return a translation function', () => {
    const t = useTranslations('es')
    expect(typeof t).toBe('function')
  })

  it('should translate a known key in Spanish', () => {
    const t = useTranslations('es')
    const key: TranslationKey = 'nav.home'
    expect(t(key)).toBe('Inicio')
  })

  it('should translate a known key in English', () => {
    const t = useTranslations('en')
    const key: TranslationKey = 'nav.home'
    expect(t(key)).toBe('Home')
  })
})
