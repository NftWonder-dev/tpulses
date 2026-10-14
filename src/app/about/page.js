import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { aboutHero, profilesSection, aboutCta, team } from "@/content/team";

export const metadata = {
  title: "About Us | Trim Pulses",
  description:
    "Meet António Pinheiro da Silva and Paulo Lourenço, the two Lisbon sound engineers behind Trim Pulses' musically tuned impulse responses.",
};

// Full class names so Tailwind picks them up.
const accentText = {
  cyan: "text-cyan-400",
  magenta: "text-magenta-400",
};

const eyebrow =
  "font-space-mono text-cyan-400 text-xs uppercase tracking-widest mb-4";
const label =
  "font-space-mono text-[11px] text-slate-500 uppercase tracking-widest";

function Timeline({ entries, accent }) {
  return (
    <dl className="grid grid-cols-[110px_minmax(0,1fr)] md:grid-cols-[150px_minmax(0,1fr)] gap-x-6 gap-y-6">
      {entries.map((entry, i) => (
        <Fragment key={i}>
          <dt
            className={`font-space-mono text-xs leading-6 ${accentText[accent]}`}
          >
            {entry.years}
          </dt>
          <dd className="min-w-0">
            <p className="font-bold text-white leading-6">{entry.title}</p>
            <p className="text-slate-400 text-sm leading-relaxed mt-1">
              {entry.description}
            </p>
          </dd>
        </Fragment>
      ))}
    </dl>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <p className={eyebrow}>{aboutHero.eyebrow}</p>
          <h1 className="font-space-grotesk text-5xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            {aboutHero.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              {aboutHero.titleHighlight}
            </span>
          </h1>
          <p className="text-slate-400 text-xl text-pretty">{aboutHero.subtitle}</p>
        </section>

        {/* Team cards */}
        <section
          aria-label="The team"
          className="grid md:grid-cols-2 gap-8 mb-24"
        >
          {team.map((member) => (
            <article
              key={member.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-white/[0.03] border-b border-white/5">
                {member.photo ? (
                  <Image
                    src={member.photo.src}
                    alt={member.photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center font-space-mono text-xs text-slate-600 uppercase tracking-widest">
                    [PHOTO]
                  </div>
                )}
              </div>
              <div className="p-8 flex-1">
                <h2 className="font-space-grotesk text-2xl md:text-3xl font-bold text-white mb-2">
                  {member.name}
                </h2>
                <p
                  className={`font-space-mono text-xs tracking-widest mb-6 ${accentText[member.accent]}`}
                >
                  {member.role}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {member.shortBio}
                </p>
              </div>
            </article>
          ))}
        </section>

        {/* Full profiles */}
        <section aria-labelledby="profiles-heading" className="mb-24">
          <div className="mb-10">
            <p className={eyebrow}>{profilesSection.eyebrow}</p>
            <h2
              id="profiles-heading"
              className="font-space-grotesk text-3xl md:text-4xl font-bold"
            >
              {profilesSection.title}
            </h2>
          </div>

          <div className="flex flex-col gap-10">
            {team.map((member) => (
              <div
                key={member.id}
                className="border-t border-[#222634] pt-12 flex flex-wrap gap-8 md:gap-14"
              >
                <div className="flex-[1_1_260px] max-w-[320px] min-w-0 flex flex-col gap-2.5">
                  <h3 className="font-space-grotesk text-[28px] leading-tight font-bold text-white">
                    {member.name}
                  </h3>
                  <p
                    className={`font-space-mono text-[11px] leading-[1.8] tracking-[0.14em] ${accentText[member.accent]}`}
                  >
                    {member.profileSubtitle}
                  </p>
                </div>

                <div className="flex-[999_1_560px] min-w-0 flex flex-col gap-7">
                  <p className={label}>Career</p>
                  <Timeline entries={member.career} accent={member.accent} />

                  {member.credits && (
                    <>
                      <p className={`${label} mt-2`}>Selected credits</p>
                      <p className="text-slate-300 leading-relaxed">
                        {member.credits}
                      </p>
                    </>
                  )}

                  {member.education && (
                    <>
                      <p className={`${label} mt-2`}>Education</p>
                      <Timeline
                        entries={member.education}
                        accent={member.accent}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[820px] mx-auto text-center p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-xl">
          <h2 className="font-space-grotesk text-2xl md:text-3xl font-bold mb-4">
            {aboutCta.title}
          </h2>
          <p className="text-slate-400 mb-6">{aboutCta.text}</p>
          <Link
            href={aboutCta.href}
            className="inline-block bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-full font-bold uppercase text-sm transition-all"
          >
            {aboutCta.buttonLabel}
          </Link>
        </section>
      </div>
    </div>
  );
}
