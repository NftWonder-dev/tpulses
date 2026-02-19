import { client } from '@/lib/sanity'
import { PRODUCT_BY_SLUG_QUERY } from '@/lib/queries'
import AddToCartButton from '@/components/AddToCartButton'
import { urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 60;

async function getProduct(slug) {
  return await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug })
}

// Custom components for Portable Text styling
const portableTextComponents = {
  block: {
    normal: ({children}) => (
      <p className="text-slate-400 text-lg leading-relaxed mb-6 text-justify">
        {children}
      </p>
    ),
    h2: ({children}) => (
      <h2 className="text-white text-2xl font-space-grotesk font-bold mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="text-white text-xl font-space-grotesk font-bold mt-6 mb-3">
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({children}) => (
      <strong className="text-white font-bold">{children}</strong>
    ),
    em: ({children}) => (
      <em className="text-cyan-400 italic">{children}</em>
    ),
    code: ({children}) => (
      <code className="bg-white/5 px-2 py-1 rounded text-cyan-400 font-space-mono text-sm">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-slate-400 text-lg">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-400 text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}) => (
      <li className="ml-4">{children}</li>
    ),
    number: ({children}) => (
      <li className="ml-4">{children}</li>
    ),
  },
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug)

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href={product.category ? `/categories/${product.category.slug.current}` : (product.collection ? `/collections/${product.collection.slug.current}` : '/collections')}
          className="inline-flex items-center gap-2 text-cyan-400 font-space-mono text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {product.category?.name || product.collection?.name || 'Collections'}
        </Link>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Product Info */}
          <div>
            {product.category && (
              <div className="mb-4">
                <span className="font-space-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                  {product.category.name}
                </span>
              </div>
            )}

            <h1 className="font-space-grotesk text-6xl font-bold mb-6 leading-tight">
              {product.name}
            </h1>

            {product.productCode && (
              <div className="mb-6">
                <span className="font-space-mono text-sm text-slate-500 uppercase">
                  Code: {product.productCode}
                </span>
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex items-center gap-8 py-8 border-y border-white/5 mb-8">
              <div>
                <span className="block text-[10px] text-slate-500 font-space-mono uppercase mb-1">
                  Price
                </span>
                <span className="text-2xl font-bold text-white font-space-mono">
                  ${product.price}
                </span>
              </div>
              <AddToCartButton product={product} />
            </div>

            {/* Rich Text Description */}
            {product.description && (
              <div className="max-w-xl prose-invert">
                <PortableText 
                  value={product.description}
                  components={portableTextComponents}
                />
              </div>
            )}

            {!product.description && (
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl mb-8">
                No description available.
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xs font-space-mono text-slate-500 uppercase tracking-widest mb-3">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Media & Specs */}
          <div className="space-y-6">
            {/* Video/Image */}
            <div className="aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative group">
              {product.youtubeVideoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
                  title={product.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-slate-600 font-space-mono text-sm">
                    No preview available
                  </span>
                </div>
              )}
            </div>

            {/* Technical Profile */}
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
              <h4 className="text-xs font-space-mono text-cyan-400 uppercase tracking-widest mb-4">
                Technical Profile
              </h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-space-mono">
                {product.percentage && (
                  <div className="text-slate-500">
                    Percentage: <span className="text-white">{product.percentage}</span>
                  </div>
                )}
                {product.fileSize && (
                  <div className="text-slate-500">
                    File Size: <span className="text-white">{product.fileSize}</span>
                  </div>
                )}
                {product.fileFormat && (
                  <div className="text-slate-500">
                    Format: <span className="text-white">{product.fileFormat}</span>
                  </div>
                )}
                <div className="text-slate-500">
                  Sample Rate: <span className="text-white">48kHz</span>
                </div>
                <div className="text-slate-500">
                  Phase: <span className="text-white">Linear</span>
                </div>
              </div>
            </div>

            {/* Product Image */}
            {(product.previewImages?.[0] || product.image) && (
              <div className="rounded-xl border border-white/10 overflow-hidden bg-slate-900">
                <img
                  src={product.previewImages?.[0] 
                    ? urlFor(product.previewImages[0]).width(800).url() 
                    : product.image
                  }
                  alt={product.name}
                  className="w-full h-auto object-contain"
                />
              </div>
            )}

            {/* Download Info */}
            {product.fileUrl && (
              <div className="p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                <p className="text-sm text-cyan-400 mb-2">
                  This product includes instant download access.
                </p>
                <p className="text-xs text-slate-500">
                  Compatible with all major DAWs and convolution reverb plugins.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
