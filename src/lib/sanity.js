import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'ji82q30h', // Your project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Disable CDN for fresh data during development
})

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(client)

// Helper function to get image URL from Sanity
export function urlFor(source) {
  return builder.image(source)
}

// Card image URLs. The cards and the hover preload (PreloadLink) must build
// the exact same URL, otherwise the browser can't reuse the preloaded image.
export function categoryCardImageUrl(image) {
  return cardImageUrl(image, 1200)
}

export function productCardImageUrl(image) {
  return cardImageUrl(image, 600)
}

// PNG sources are served lossless (often over 1 MB), so let the CDN convert
// them to WebP/AVIF. JPEGs are left alone: converting them visibly degraded
// the small (640px) sources.
function cardImageUrl(image, width) {
  const url = urlFor(image).width(width).quality(90)
  const isPng = image?.asset?._ref?.endsWith('-png')
  return (isPng ? url.auto('format') : url).url()
}
