import { skills } from '../config/site'
import { SectionLabel } from './SectionLabel'

export function Skills() {
  return (
    <section id="skills" className="relative z-10 border-t border-line bg-ink px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="04" label="Skills" />
        <h2 data-reveal className="max-w-4xl font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] tracking-[-0.02em]">
          From breadboard <span className="italic text-bone/80">to working build.</span>
        </h2>
        <div className="mt-20 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
          {skills.map((g, i) => (
            <div key={g.group} data-reveal className="bg-ink p-8 md:p-10">
              <p className="eyebrow mb-8 flex gap-3 text-mute">
                <span className="tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                {g.group}
              </p>
              <ul className="flex flex-col gap-3">
                {g.items.map((s) => (
                  <li key={s} className="font-display text-2xl leading-tight text-bone/85 md:text-[1.7rem]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
