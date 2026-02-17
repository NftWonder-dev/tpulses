import { client } from "@/lib/sanity";
import { CATEGORY_BY_SLUG_QUERY } from "@/lib/queries";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60; // ⬅️ Add this line

async function getCategory(slug) {
  return await client.fetch(CATEGORY_BY_SLUG_QUERY, { slug });
}

export default async function CategoryPage({ params }) {
  const category = await getCategory(params.slug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href={
            category.collection
              ? `/collections/${category.collection.slug.current}`
              : "/collections"
          }
          className="inline-flex items-center gap-2 text-cyan-400 font-space-mono text-xs uppercase tracking-widest mb-12 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {category.collection?.name || "Collections"}
        </Link>

        {/* Category Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="font-space-grotesk text-6xl font-bold">
              {category.name} Category
            </h1>
          </div>
          {category.description && (
            <p className="text-slate-400 text-xl max-w-3xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Sub-packs if they exist */}
        {category.subpacks && category.subpacks.length > 0 && (
          <div className="mb-16">
            <h2 className="font-space-grotesk text-3xl font-bold mb-8">
              Sub-Packs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subpacks.map((subpack) => (
                <Link
                  key={subpack._id}
                  href={`/subpacks/${subpack.slug.current}`}
                  className="glass-card p-8 rounded-xl group cursor-pointer"
                >
                  <h3 className="font-space-grotesk text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {subpack.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {subpack.description || "Explore this sub-pack"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-space-mono text-[10px] text-slate-500 uppercase">
                      {subpack.productCount || 0} Products
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products - Only show if no subpacks exist */}
        {(!category.subpacks || category.subpacks.length === 0) && (
          <div>
            <h2 className="font-space-grotesk text-3xl font-bold mb-8">
              Products
            </h2>

            {category.products && category.products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500">
                  No products yet in this category.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
