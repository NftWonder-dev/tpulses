// app/specifications/page.js - Updated with actual folder structure
import Link from "next/link";

export default function SpecificationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="font-space-grotesk text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {" "}
              Technical <span className="text-gradient">Specifications</span>
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              Understanding the structure and organization of your impulse
              response files. Professional-grade products designed for Musical
              use.
            </p>
          </div>
        </div>
      </section>

      {/* Folder Structure Guide */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-space-grotesk text-4xl font-bold mb-16 text-center">
            Product Folder Structure
          </h2>

          {/* Sample Rate Organization */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="font-space-grotesk text-3xl font-bold mb-6">
                Sample Rate Organization
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Each collection is organized into three sample rate folders,
                ensuring compatibility with any project workflow:
              </p>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">44.1 kHz 24-bit</strong> -
                    Industry standard for music production and CD-quality audio
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">48 kHz 24-bit</strong> -
                    Professional standard for film, video, and broadcast
                    production
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">96 kHz 24-bit</strong> -
                    High-resolution audio for maximum sonic detail and
                    flexibility
                  </span>
                </li>
              </ul>
            </div>

            <img
              src="https://i.imgur.com/cvxnKik.png"
              alt="Sample Rate Folders"
              className="w-full rounded-lg"
            />
          </div>

          {/* Tone Folders */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <img
              src="https://i.imgur.com/mTOhE8s.png"
              alt="Twelve Semitone Folders"
              className="w-full rounded-lg"
            />

            <div className="order-1 lg:order-2">
              <h3 className="font-space-grotesk text-3xl font-bold mb-6">
                Twelve Semitone Folders
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Within each sample rate folder, you'll find all 12 chromatic
                semitones from A to G#/Ab, ensuring perfect harmonic alignment
                with any musical key:
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  "A",
                  "A#/Bb",
                  "B",
                  "C",
                  "C#/Db",
                  "D",
                  "D#/Eb",
                  "E",
                  "F",
                  "F#/Gb",
                  "G",
                  "G#/Ab",
                ].map((tone) => (
                  <div
                    key={tone}
                    className="glass-card p-1 rounded-xl text-center"
                  >
                    <h3 className="font-space-grotesk text-2xl font-bold text-slatle-400">
                      {tone}
                    </h3>
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Each tone folder contains modal variations and algorithmic
                processing options for maximum creative flexibility.
              </p>
            </div>
          </div>

          {/* Modal Variations */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="font-space-grotesk text-3xl font-bold mb-6">
                Modal Variations
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Each semitone folder includes multiple modal variations,
                providing rich harmonic options for diverse musical contexts:
              </p>
              <div className="space-y-4">
                <ul className="space-y-4 text-slate-400">
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>
                      <strong className="text-white">MAJOR</strong> -
                      Traditional major mode with bright, consonant harmonic
                      character. Perfect for uplifting and positive musical
                      contexts.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>
                      <strong className="text-white">MINOR</strong> -
                      Traditional minor mode with dark, consonant harmonic
                      character. Ideal for introspective and melancholic musical
                      contexts.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>
                      <strong className="text-white">DIM (Diminished)</strong> -
                      Diminished tonality offering tension and instability.
                      Ideal for dramatic transitions and experimental
                      soundscapes.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>
                      <strong className="text-white">SUS2 & SUS4</strong> -
                      Suspended chords creating harmonic ambiguity and openness.
                      Excellent for ambient, atmospheric, and modern production
                      styles.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <img
              src="https://i.imgur.com/BSE08Jh.png"
              alt="Modal Variations"
              className="w-full rounded-lg"
            />
          </div>

          {/* Algorithmic Variations */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <img
              src="https://i.imgur.com/ReiEZ8J.png"
              alt="Algorithmic Variations"
              className="w-full rounded-lg"
            />

            <div className="order-1 lg:order-2">
              <h3 className="font-space-grotesk text-3xl font-bold mb-6">
                Algorithmic Variations
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Within each modal folder, you'll find multiple algorithmically
                processed variations offering diverse sonic characteristics:
              </p>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">CLEAR</strong> - Unprocessed
                    standard impulse response with natural decay characteristics
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">WIDE</strong> - Enhanced
                    stereo width for immersive spatial imaging
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">GREY</strong> - Spectrally
                    processed variation with altered frequency response
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">REVERSE</strong> -
                    Time-reversed decay for creative reverse reverb effects
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>
                    <strong className="text-white">DIRECT</strong> - Pure direct
                    signal path for precise, articulate sound placement
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* File Naming Lexicon */}
      <section className="py-20 px-6 bg-white/[0.02] overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-space-grotesk text-4xl font-bold mb-8 text-center">
            File Naming Convention
          </h2>
          <p className="text-slate-400 text-lg text-center mb-12">
            Complete reference guide for all abbreviations and processing types
            used in file naming
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="glass-card p-4 md:p-6 rounded-xl overflow-hidden">
              <div className="space-y-3 text-xs md:text-sm">
                {[
                  ["AS", "All Stereo"],
                  ["AST", "Astroid Curve"],
                  ["AST I", "Astroid Curve Slower Decay"],
                  ["AST II", "Astroid Curve Faster Decay"],
                  ["AST III", "Astroid Curve Progressively Faster"],
                  ["AST IV", "Astroid Curve Progressively Slower"],
                  ["AWCS", "Artic Wind & Cave Stream"],
                  ["CF", "Center Fall"],
                  ["CMP", "Compressed"],
                  ["Doct", "One Octave Down"],
                  ["Dyn", "Dynamic"],
                  ["EXP", "Expanded"],
                  ["F6 FA8R", "Multi Dynamic Effect"],
                  ["F6 SAMR", "Multi Dynamic Effect"],
                  ["FS", "Frequency Shift"],
                  ["Fx", "Effect"],
                  ["G30", "Logarithmic Base 30 Gold Curve"],
                  ["GR", "Granular"],
                  ["HP", "High Pass"],
                  ["IGold", "Logarithmic Base 10 Inverse Gold"],
                  ["IKoch", "Logarithmic Base 10 Inverse Koch"],
                  ["ISilver", "Logarithmic Base 10 Inverse Silver"],
                  ["KAP", "Kappa Curve (Gutschoven)"],
                  ["Koch", "Logarithmic Base 10 Koch Curve"],
                ].map(([code, desc]) => (
                  <div
                    key={code}
                    className="flex justify-between gap-2 border-b border-white/5 pb-2"
                  >
                    <span className="font-space-mono text-cyan-400 shrink-0">
                      {code}
                    </span>
                    <span className="text-slate-400 text-right break-words">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="glass-card p-4 md:p-6 rounded-xl overflow-hidden">
              <div className="space-y-3 text-xs md:text-sm">
                {[
                  ["MF", "Medium Fall"],
                  ["MS", "Mid-Side Processed"],
                  ["Oct", "Octave Up"],
                  ["PAN", "Panoramic Effect"],
                  ["PH-FS", "Phaser and Frequency Shifter"],
                  ["PHR", "Phase Reverse"],
                  ["PNL", "Pink Noise Linear"],
                  ["SC (0.33)", "Semi-Cubical Curve 0.333333"],
                  ["SC (0.44)", "Semi-Cubical Curve 0.444444"],
                  ["SMOO", "Smoothened Generators"],
                  ["SP F6 FA8R", "Multi Dynamic SpecialEffect"],
                  ["SQF", "Square Fall"],
                  ["STW", "Stereo Wide"],
                  ["Uno", "Logarithmic Base 10 Unity Curve"],
                  ["WA", "Witch of Agnesi Curve"],
                  ["WA I", "Witch of Agnesi slower decay"],
                  ["WA II", "Witch of Agnesi faster decay"],
                  ["WA III", "Witch of Agnesi progressively slower"],
                  ["WA IV", "Witch of Agnesi progressively faster"],
                  ["WANep", "Witch of Agnesi Euler Coefficient"],
                  ["WAPI", "Witch of Agnesi Pi Coefficient"],
                  ["Wide", "Stereo Spread"],
                  ["WN", "White Noise"],
                  ["WND", "White Noise Delay Processed"],
                ].map(([code, desc]) => (
                  <div
                    key={code}
                    className="flex justify-between gap-2 border-b border-white/5 pb-2"
                  >
                    <span className="font-space-mono text-cyan-400 shrink-0">
                      {code}
                    </span>
                    <span className="text-slate-400 text-right break-words">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Integration Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-space-grotesk text-5xl font-bold mb-6">
              Professional Integration
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto">
              Compatible with all convolution reverb plugins across all DAWs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Logic Pro", feature: "Space Designer" },
              { name: "Pro Tools", feature: "ReVibe" },
              { name: "Ableton Live", feature: "Convolution Reverb" },
              { name: "FL Studio", feature: "Convolver" },
              { name: "Reaper", feature: "ReaVerb" },
              { name: "Studio One", feature: "Open AIR" },
              { name: "Cubase", feature: "REVerence" },
              { name: "Waves IR", feature: "All Plugins" },
            ].map((daw) => (
              <div
                key={daw.name}
                className="glass-card p-6 rounded-xl text-center"
              >
                <h3 className="font-space-grotesk text-xl font-bold mb-2">
                  {daw.name}
                </h3>
                <p className="text-slate-500 text-sm">{daw.feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Collections CTA */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-space-grotesk text-5xl font-bold mb-6">
            Explore Our Collections
          </h2>
          <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto">
            Discover our range of musically-tuned impulse response collections,
            each meticulously crafted for professional audio production
          </p>

          <Link
            href="/collections"
            className="inline-block bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all text-lg"
          >
            View All Collections
          </Link>
        </div>
      </section>
    </div>
  );
}
