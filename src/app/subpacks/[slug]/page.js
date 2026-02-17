import { client } from "@/lib/sanity";
import { SUBPACK_BY_SLUG_QUERY } from "@/lib/queries";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 60; // ⬅️ Add this line

async function getSubpack(slug) {
  return await client.fetch(SUBPACK_BY_SLUG_QUERY, { slug });
}

export default async function SubpackPage({ params }) {
  const subpack = await getSubpack(params.slug);

  if (!subpack) {
    return <div>Sub-pack not found</div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href={
            subpack.category
              ? `/categories/${subpack.category.slug.current}`
              : "/collections"
          }
          className="inline-flex items-center gap-2 text-cyan-400 font-space-mono text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {subpack.category?.name || "Category"}
        </Link>

        {/* Subpack Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-2">
            {subpack.category?.collection && (
              <span className="font-space-mono text-xs text-cyan-400 uppercase tracking-widest">
                {subpack.category.collection.name} → {subpack.category.name}
              </span>
            )}
          </div>
          <h1 className="font-space-grotesk text-6xl font-bold mb-6">
            {subpack.name}
          </h1>
          {subpack.description && (
            <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
              {subpack.description}
            </p>
          )}
        </div>

        {/* Products */}
        <div>
          <h2 className="font-space-grotesk text-3xl font-bold mb-8">
            Products
          </h2>

          {subpack.products && subpack.products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subpack.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500">
                No products yet in this sub-pack.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
