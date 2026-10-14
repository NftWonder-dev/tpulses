import { Fragment } from "react";

// Collection › Category › Sub-Pack, so products with the same name can be told apart.
export default function ProductPath({ product }) {
  const parts = [
    { label: product.collectionName, className: "text-cyan-400" },
    { label: product.categoryName, className: "text-[#f472b6]" },
    { label: product.subPackName, className: "text-slate-400" },
  ].filter((part) => part.label);

  if (parts.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-1.5 font-space-mono text-[11px] font-bold uppercase tracking-[0.14em]">
      {parts.map((part, i) => (
        <Fragment key={part.label + i}>
          {i > 0 && (
            <span aria-hidden="true" className="text-[#475569]">
              ›
            </span>
          )}
          <span className={part.className}>{part.label}</span>
        </Fragment>
      ))}
    </div>
  );
}
