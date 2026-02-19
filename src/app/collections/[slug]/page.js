import { client } from "@/lib/sanity";
import { COLLECTION_BY_SLUG_QUERY } from "@/lib/queries";
import CategoryCard from "@/components/ui/CategoryCard";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60;

async function getCollection(slug) {
  return await client.fetch(COLLECTION_BY_SLUG_QUERY, { slug });
}

export default async function CollectionPage({ params }) {
  const collection = await getCollection(params.slug);

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-cyan-400 font-space-mono text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </Link>

        {/* Collection Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            {collection.emoji && (
              <span className="text-6xl">{collection.emoji}</span>
            )}
            <h1 className="font-space-grotesk text-6xl font-bold">
              {collection.name} Collection
            </h1>
          </div>
          {collection.description && (
            <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {/* Categories Grid - Only show if categories exist */}
        {collection.categories && collection.categories.length > 0 && (
          <div className="mb-16">
            <h2 className="font-space-grotesk text-3xl font-bold mb-8">
              Categories
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.categories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Products - Only show if NO categories exist */}
        {(!collection.categories || collection.categories.length === 0) && (
          <div>
            <h2 className="font-space-grotesk text-3xl font-bold mb-8">
              Products
            </h2>

            {collection.products && collection.products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">
                  No products yet in this collection. Add some in Sanity Studio!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
