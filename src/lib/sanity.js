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
