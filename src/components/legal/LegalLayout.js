import { LAST_UPDATED } from "@/lib/legal";

// Shared layout for /privacy and /terms, matching the rest of the site.
// sections: [{ title: "…", content: <>…JSX…</> }]
export default function LegalLayout({ label, title, intro, sections }) {
  return (
    <main className="min-h-screen pt-32 pb-24">
      <section className="border-b border-white/5 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-space-mono text-cyan-400 text-xs uppercase tracking-widest mb-4">
            {label}
          </h3>
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {title}
          </h1>
          <p className="font-space-mono text-xs uppercase tracking-widest text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {intro && (
            <p className="text-slate-300 text-lg leading-relaxed mb-12">{intro}</p>
          )}

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={section.title}>
                <h2 className="font-space-grotesk text-2xl font-bold mb-4">
                  <span className="text-cyan-400 font-space-mono text-base mr-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <div className="text-slate-400 leading-relaxed space-y-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-white [&_a]:text-cyan-400 hover:[&_a]:text-cyan-300">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
