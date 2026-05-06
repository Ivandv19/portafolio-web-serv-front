import { describe, it, expect, vi } from 'vitest'
import type { CloudflareImageOptions } from '../types'

const mockEnv = vi.hoisted(() => ({ DEV: true }))

vi.mock('./images', () => ({
  getCloudflareImage: vi.fn((url: string, options?: CloudflareImageOptions | number) => {
    if (mockEnv.DEV) {
      if (!url || typeof url !== "string" || url.trim() === "") {
        return ""
      }
      return url
    }

    if (!url || typeof url !== "string" || url.trim() === "") {
      return ""
    }

    const config = typeof options === "number" ? { width: options } : (options ?? {})

    const width = config.width || null
    const height = config.height || null
    const quality = config.quality ?? 80
    const format = config.format ?? "auto"
    const fit = config.fit ?? "scale-down"

    const paramsParts: string[] = []
    if (width) paramsParts.push(`width=${width}`)
    if (height) paramsParts.push(`height=${height}`)
    paramsParts.push(`quality=${quality}`)
    paramsParts.push(`format=${format}`)
    paramsParts.push(`fit=${fit}`)

    const paramsString = paramsParts.join(",")
    const myDomain = "portafolio-web-front.mgdc.site"
    const cdnPrefix = `https://${myDomain}/cdn-cgi/image/${paramsString}`

    if (url.includes(myDomain)) {
      try {
        const urlObj = new URL(url)
        return `${cdnPrefix}${urlObj.pathname}`
      } catch {
        return url
      }
    }

    const allowedExternalDomains = ["avatars.githubusercontent.com", "i.pravatar.cc"]

    if (allowedExternalDomains.some(domain => url.includes(domain))) {
      return `${cdnPrefix}/${url}`
    }

    return url
  }),
}))

describe('getCloudflareImage', () => {
  it('should return empty string for invalid input', async () => {
    const { getCloudflareImage } = await import('./images')
    expect(getCloudflareImage(null as unknown as string)).toBe("")
    expect(getCloudflareImage("   ")).toBe("")
    expect(getCloudflareImage(123 as unknown as string)).toBe("")
  })

  it('should return the original URL in DEV mode', async () => {
    const { getCloudflareImage } = await import('./images')
    const url = "https://example.com/image.jpg"
    expect(getCloudflareImage(url)).toBe(url)
  })
})

describe('getCloudflareImage in production', () => {
  beforeEach(() => {
    mockEnv.DEV = false
  })

  afterEach(() => {
    mockEnv.DEV = true
  })

  it('should transform internal domain images with Cloudflare CDN prefix', async () => {
    const { getCloudflareImage } = await import('./images')
    const url = "https://portafolio-web-front.mgdc.site/images/photo.jpg"
    const result = getCloudflareImage(url)
    expect(result).toContain("/cdn-cgi/image/")
    expect(result).toContain("quality=80")
    expect(result).toContain("format=auto")
    expect(result).toContain("fit=scale-down")
    expect(result).toMatch(/\/images\/photo\.jpg$/)
  })

  it('should transform allowed external domain images with full URL', async () => {
    const { getCloudflareImage } = await import('./images')
    const url = "https://avatars.githubusercontent.com/u/12345"
    const result = getCloudflareImage(url)
    expect(result).toContain("/cdn-cgi/image/")
    expect(result).toContain(url)
  })

  it('should return original URL for non-allowed external domains', async () => {
    const { getCloudflareImage } = await import('./images')
    const url = "https://other-domain.com/image.jpg"
    expect(getCloudflareImage(url)).toBe(url)
  })

  it('should return empty string for invalid input', async () => {
    const { getCloudflareImage } = await import('./images')
    expect(getCloudflareImage(null as unknown as string)).toBe("")
    expect(getCloudflareImage("   ")).toBe("")
    expect(getCloudflareImage(123 as unknown as string)).toBe("")
  })
})
