import { marquee } from '../config/site'

export function Marquee() {
  const row = (
    <div className="marquee-row" aria-hidden>
      {marquee.map((w) => (
        <span key={w} className="flex items-center gap-10 pr-10">
          <span className="font-display text-[clamp(2.5rem,6vw,5.5rem)] italic">{w}</span>
          <span className="size-2 rounded-full bg-gold" />
        </span>
      ))}
    </div>
  )
  return (
    <section aria-label="What I work with" className="relative z-10 overflow-hidden border-y border-line bg-ink-2 py-8">
      <p className="sr-only">{marquee.join(', ')}</p>
      <div className="marquee">
        {row}
        {row}
      </div>
    </section>
  )
}
