export default function FAQPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="font-space-grotesk text-6xl font-bold mb-6">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">Questions</span>
          </h1>
          <p className="text-slate-400 text-xl">
            Everything you need to know about our musically-tuned impulse responses
          </p>
        </div>

        {/* General Concepts Section */}
        <section className="mb-16">
          <h2 className="font-space-grotesk text-3xl font-bold mb-8 text-cyan-400">
            General Concepts
          </h2>

          <div className="space-y-8">
            {/* Question 1 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What makes these Impulse Responses different from traditional room captures?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Traditional IRs are recordings of physical spaces. These IRs are{" "}
                <span className="font-bold text-white">mathematically sculpted from the ground up</span>. 
                Instead of natural reverb, they use geometric and logarithmic equations (like the Astroid 
                or Golden Ratio curves) to define how sound decays, ensuring a level of precision and 
                "musicality" that physical rooms cannot provide.
              </p>
            </div>

            {/* Question 2 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                Why are the IRs organized by musical notes (A to Bb)?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                To ensure total tonal harmony with your mix. Each impulse is tuned to a specific root note 
                and is available in <span className="font-bold text-white">Major and Minor folders</span>. 
                By choosing the IR that matches the key of your song, you avoid the dissonant "mud" often 
                caused by untuned reverb tails.
              </p>
            </div>

            {/* Question 3 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What is "Fundamental Frequency Attenuation" (FFA)?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                This is our <span className="font-bold text-white">"Anti-Masking" secret</span>. During 
                the creation of the IR, we mathematically decrease the amplitude of the root note's 
                fundamental frequency. This creates a "sonic hole" that allows your dry instrument or 
                vocal to sit perfectly in the center of the mix while the reverb blooms around the harmonics.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Specifications Section */}
        <section className="mb-16">
          <h2 className="font-space-grotesk text-3xl font-bold mb-8 text-magenta-400">
            Technical Specifications
          </h2>

          <div className="space-y-8">
            {/* Question 4 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What is the "9-Octave Extension"?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Most reverb impulses only focus on a narrow frequency band. Our IRs are generated across 
                a <span className="font-bold text-white">full 9-octave range</span>. This ensures that 
                whether you are processing a deep sub-bass or a high-frequency synth lead, the harmonic 
                support remains consistent and full-spectrum.
              </p>
            </div>

            {/* Question 5 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What does "M/S Processing" mean in the file names?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Files labeled <span className="font-bold text-white">MS</span> have been built using 
                Mid-Side processing. This means the "Mid" (center) and "Side" (width) of the reverb 
                have independent decay behaviors, allowing you to keep a focused phantom center while 
                the reverb tail expands into the stereo field.
              </p>
            </div>

            {/* Question 6 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What is the "ISO Principle"?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                The ISO collection is a specialized set where the{" "}
                <span className="font-bold text-white">frequency area of each decay band is constant</span>. 
                This prevents any specific frequency from building up over time, resulting in an incredibly 
                transparent and balanced decay, even at long settings.
              </p>
            </div>
          </div>
        </section>

        {/* Usage & Compatibility Section */}
        <section className="mb-16">
          <h2 className="font-space-grotesk text-3xl font-bold mb-8 text-cyan-400">
            Usage & Compatibility
          </h2>

          <div className="space-y-8">
            {/* Question 7 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What sample rates are supported?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                All collections include dedicated folders for{" "}
                <span className="font-bold text-white">44.1 kHz, 48 kHz, and 96 kHz</span> (all at 24-bit depth), 
                ensuring compatibility with any professional DAW project.
              </p>
            </div>

            {/* Question 8 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                What do the codes like "WN," "FT," and "AST" mean?
              </h3>
              <p className="text-slate-300 leading-relaxed mb-4">
                These represent the "ingredients" of your impulse:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li>
                  <span className="font-bold text-white">WN / WPN:</span> White Noise or White and Pink Noise generators.
                </li>
                <li>
                  <span className="font-bold text-white">FT / HW:</span> Fountain water or Wind sounds used as organic texture generators.
                </li>
                <li>
                  <span className="font-bold text-white">AST / G30 / WA:</span> The mathematical Fall Curve used (Astroid, Gold 30, or Witch of Agnesi).
                </li>
              </ul>
            </div>

            {/* Question 9 */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-space-grotesk text-xl font-bold text-white mb-3">
                Can I use these IRs for something other than vocals?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Absolutely. While they are excellent for "strong vocals," they are designed as{" "}
                <span className="font-bold text-white">general-purpose impulses</span> for instruments, 
                drums, or any electronic musical source that requires a professional, tuned space.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="text-center mt-20 p-8 bg-white/[0.02] border border-white/5 rounded-xl">
          <h3 className="font-space-grotesk text-2xl font-bold mb-4">
            Still have questions?
          </h3>
          <p className="text-slate-400 mb-6">
            Feel free to reach out to us for more information about our impulse responses.
          </p>
          <a
            href="/collections"
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all"
          >
            Explore Collections
          </a>
        </div>
      </div>
    </div>
  )
}
