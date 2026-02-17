import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/lib/sanity";

export default function CollectionCard({ collection }) {
  console.log("Collection data:", collection);
  const {
    name,
    slug,
    emoji,
    description,
    image,
    categoryCount = 0,
  } = collection;

  return (
    <Link href={`/collections/${slug.current}`}>
      <div className="glass-card rounded-xl group cursor-pointer relative overflow-hidden min-h-[400px] flex flex-col justify-end">
        {/* Faded Background Image - Top to Bottom */}
        {image && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-bg via-deep-bg/80 to-transparent"></div>
            <img
              src={urlFor(image).width(600).url()}
              alt={name}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
              style={{
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 80%)",
              }}
            />
          </div>
        )}

        {/* Content - More padding at bottom */}
        <div className="relative z-10 p-8 pb-12">
          <div className="flex items-center gap-3 mb-2">
            {emoji && <span className="text-2xl">{emoji}</span>}
            <span className="font-space-mono text-[10px] text-cyan-400 uppercase tracking-widest">
              {categoryCount} Categories
            </span>
          </div>
          <h3 className="font-space-grotesk text-3xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
