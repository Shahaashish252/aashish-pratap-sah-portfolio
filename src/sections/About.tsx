import { about } from '../config/site'
import { openLightbox } from '../components/Lightbox'
import { SectionLabel } from './SectionLabel'

export function About() {
  return (
    <section id="about" className="relative z-10 border-t border-line bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <SectionLabel index="01" label="About" />
          <h2 className="font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] tracking-[-0.02em]">
            {about.statement.map((line, i) => (
              <span key={line} data-reveal className={`block ${i === about.statement.length - 1 ? 'italic text-bone/80' : ''}`}>
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-12 grid max-w-2xl gap-6 text-[1.0625rem] leading-relaxed text-bone/70">
            {about.body.map((p) => (
              <p key={p.slice(0, 20)} data-reveal>
                {p}
              </p>
            ))}
          </div>
          <ul className="mt-12 max-w-2xl border-t border-line" aria-label="Education">
            {about.education.map((e) => (
              <li key={e.place} data-reveal className="grid gap-1 border-b border-line py-5 md:grid-cols-[10rem_1fr] md:gap-6">
                <span className="eyebrow pt-1.5 text-gold">{e.when}</span>
                <span>
                  <span className="block font-display text-2xl">{e.place}</span>
                  <span className="text-sm text-bone/60">{e.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure data-reveal className="md:col-span-5 md:pt-24">
          <button
            type="button"
            onClick={() => openLightbox({ src: about.photo.src, alt: about.photo.caption, caption: about.photo.caption })}
            className="print-still group block w-full rotate-[2deg] transition-transform duration-700 ease-out-expo hover:rotate-0"
            aria-label={`Open photo: ${about.photo.caption}`}
          >
            <img src={about.photo.src} alt={about.photo.caption} loading="lazy" className="aspect-[4/3] w-full object-cover" />
            <span className="block pt-4 text-center font-display text-lg italic text-[#5b5249]">{about.photo.caption}</span>
          </button>
        </figure>
      </div>

      <dl className="mx-auto mt-24 grid max-w-[1600px] grid-cols-2 border-t border-line md:grid-cols-4">
        {about.stats.map((s) => (
          <div key={s.label} data-reveal className="flex flex-col-reverse gap-2 border-b border-line py-8 pr-4 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
            <dt className="eyebrow text-mute">{s.label}</dt>
            <dd className="font-display text-6xl md:text-7xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
