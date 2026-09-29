import { Award } from 'lucide-react'
import { certificates, projects } from '../config/site'
import { FilmStrip } from '../components/FilmStrip'
import { openLightbox } from '../components/Lightbox'
import { SectionLabel } from './SectionLabel'

export function Projects() {
  return (
    <section id="work" className="relative z-10 bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="02" label="Selected Projects" />
        <h2 data-reveal className="max-w-4xl font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] tracking-[-0.02em]">
          Things I've built, <span className="italic text-bone/80">frame by frame.</span>
        </h2>
      </div>

      <div className="mt-20 flex flex-col gap-32 md:gap-44">
        {projects.map((p, i) => {
          const cert = p.award && certificates.find((c) => c.id === p.award!.certificate)
          return (
            <article
              key={p.id}
              aria-labelledby={`project-${p.id}`}
              className="mx-auto grid w-full max-w-[1600px] gap-12 md:grid-cols-12 md:gap-x-16"
            >
                <header className={`md:sticky md:top-28 md:col-span-5 md:self-start ${i % 2 ? 'md:col-start-8' : ''}`}>
                  <p data-reveal className="eyebrow mb-4 flex gap-4 text-mute">
                    <span className="tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <span>{p.year}</span>
                  </p>
                  <h3 id={`project-${p.id}`} data-reveal className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-none">
                    {p.title}
                  </h3>
                  <p data-reveal className="mt-3 font-display text-2xl italic text-bone/60">
                    {p.subtitle}
                  </p>
                  {p.award && (
                    <button
                      type="button"
                      data-reveal
                      onClick={() => cert && openLightbox({ src: cert.src, alt: cert.title, caption: `${cert.title} · ${cert.issuer}` })}
                      className="mt-8 inline-flex items-start gap-3 border border-gold/40 bg-gold/5 px-4 py-3 text-left text-sm text-bone/85 transition-colors hover:border-gold hover:bg-gold/10"
                    >
                      <Award className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.5} />
                      <span>
                        {p.award.label}
                        <span className="mt-1 block text-xs text-mute">View certificate →</span>
                      </span>
                    </button>
                  )}
                  <p data-reveal className="mt-8 text-[1.0625rem] leading-relaxed text-bone/75">
                    {p.description}
                  </p>
                  <ul className="mt-8 flex flex-col border-t border-line">
                    {p.highlights.map((h) => (
                      <li key={h} data-reveal className="flex gap-4 border-b border-line py-2.5 text-[0.875rem] text-bone/70">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <ul data-reveal className="mt-8 flex flex-wrap gap-2" aria-label="Built with">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-full border border-line px-3 py-1 text-xs text-bone/70">
                        {s}
                      </li>
                    ))}
                  </ul>
                </header>

                <div className={`md:col-span-7 ${i % 2 ? 'md:col-start-1 md:row-start-1' : 'md:col-start-6'}`}>
                  <FilmStrip frames={p.frames} label={p.title} />
                </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
