import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

export default function CategoryCard({ category }) {
  const { name, slug, description, image, productCount = 0 } = category;

  return (
    <Link href={`/categories/${slug.current}`}>
      <div className="glass-card p-8 rounded-xl group cursor-pointer relative overflow-hidden">
        {/* Faded Background Image */}
        {image && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-bg via-deep-bg/80 to-transparent"></div>
            <img
              src={urlFor(image).width(600).url()}
              alt={name}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
              style={{
                maskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
                WebkitMaskImage:
                  "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          <h3 className="font-space-grotesk text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
            {name}
          </h3>
          <p className="text-slate-400 text-xs mb-4 line-clamp-2">
            {description ||
              "General Information about this category, its contents and more."}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-space-mono text-[10px] text-slate-500 uppercase">
              {productCount || 0} Products
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
