import { client } from "@/lib/sanity";
import { COLLECTIONS_QUERY, FEATURED_PRODUCTS_QUERY } from "@/lib/queries";
import CollectionCard from "@/components/ui/CollectionCard";
import { ArrowRight, Cpu, Headphones, Music2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // ⬅️ Add this line

async function getHomeData() {
  const collections = await client.fetch(COLLECTIONS_QUERY);
  return { collections };
}

export default async function HomePage() {
  const { collections } = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/IMAGEM_PRINCIPAL.jpeg"
            className="w-full h-full object-cover opacity-30 mix-blend-screen scale-110 blur-sm"
            alt="Waveform Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-deep-bg/0 via-deep-bg/60 to-deep-bg"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Musically Tuned Impulse Responses
            </div>

            <h1 className="font-space-grotesk text-7xl md:text-8xl font-bold leading-[0.9] mb-8 tracking-tighter">
              Turn Reverb
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-fuchsia-900/10">
                Into Music
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-md leading-relaxed mb-10 font-light">
              Beyond acoustic space. Discover Impulse Responses tuned to
              harmonic frequencies, ensuring your ambience resonates in perfect
              key.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/collections"
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all flex items-center gap-3"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-[10px] font-space-mono text-slate-500 uppercase flex flex-col">
                <span>Current Phase: 02.2026 update</span>
                <span>Resonance Matrix: Active</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="aspect-square rounded-full border border-white/5 flex items-center justify-center p-12">
              <div className="aspect-square w-full rounded-full border border-white/10 flex items-center justify-center p-12 animate-spin-slow">
                <div className="aspect-square w-full rounded-full border border-cyan-500/20 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_#00f3ff]"></div>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-space-mono text-[10px] text-cyan-500/50 flex flex-col gap-1 items-center">
              <span>λ = v / f</span>
              <span className="text-2xl font-bold text-white tracking-widest">
                Φ 1.618
              </span>
              <span>GOLDEN RATIO</span>
            </div>
          </div>
        </div>
      </header>

      {/* Theory Section */}
      <section id="about" className="py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            <div>
              <h3 className="font-space-mono text-magenta-500 text-xs uppercase tracking-widest mb-4">
                The Theory
              </h3>
              <h2 className="font-space-grotesk text-4xl font-bold leading-tight">
                Harmonic Control
              </h2>
            </div>
            <div className="lg:col-span-2 text-slate-400 space-y-6 text-lg leading-relaxed">
              <p>
                These are frequency designed impulse responses, tuned to every
                single tone of music individually.
              </p>
              <p>
                By controlling the decay time of each frequency band separately,
                we create a reverb that is not just a sonic space, but a true
                musical tool.
              </p>
              <p>
                Special numbers (Golden number, Silver number, Pi and Euler)
                have been widely used on producing these{" "}
                <span className="text-white font-medium">
                  Musical Impulse Reverbs.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section id="categories" className="py-24 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-space-grotesk text-5xl font-bold mb-4">
              Algorithms | Sources
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <CollectionCard key={collection._id} collection={collection} />
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section id="technical" className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="font-space-grotesk text-4xl font-bold mb-8">
                Professional Integration
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      DAW Compatibility
                    </h4>
                    <p className="text-sm text-slate-400">
                      Ableton Hybrid Reverb, Logic Space Designer, FL Studio,
                      Altiverb, and all standard convolution plugins.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Sonic Fidelity
                    </h4>
                    <p className="text-sm text-slate-400">
                      Available in 44.1 kHz,48kHz and 96kHz / 24-bit WAV formats
                      for maximum dynamic headroom.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <Music2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">
                      Musicaly Pristine
                    </h4>
                    <p className="text-sm text-slate-400">
                      All IRs are filtered and tuned to musical scales for full
                      clarity control and musical expression.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-deep-bg border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-0 transition-opacity"></div>
              <img
                src="/images/Pro Use 1.jpeg"
                alt="Matrix"
                className="w-full opacity-80"
              />
            </div>
          </div>
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              Ready to Experience the Difference?
            </div>
            <h2 className="font-space-grotesk text-5xl font-bold mb-6">
              Explore Our Collections
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Each collection represents a different approach to harmonic
              sequence control of sources, from natural acoustic elements to
              algorithmic noise profiles. All IRs are harmonically tuned to
              ensure your reverb is not just heard, but felt as a musical
              extension of your sound.
            </p>
            <a
              href="/collections"
              className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all"
            >
              Browse Collections
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
