import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Maximize2 } from 'lucide-react'
import { certificates, type CertificateKind } from '../config/site'
import { openLightbox } from '../components/Lightbox'
import { scrollToTarget } from '../lib/smoothScroll'
import { SectionLabel } from './SectionLabel'

/** Scroll distance per certificate, in viewport heights. */
const STEP_VH = 0.6
const N = certificates.length
const pad = (n: number) => String(n).padStart(2, '0')

const KIND_STYLE: Record<CertificateKind, string> = {
  Achievement: 'border-gold/60 bg-gold/10 text-gold',
  Participation: 'border-bone/30 text-bone/80',
  Course: 'border-line text-mute',
}

/**
 * Frame-by-frame advance: each certificate holds in the gate for most of its
 * scroll step, then the film pulls quickly to the next one — like a projector.
 */
function framePosition(f: number) {
  const i = Math.floor(f)
  const t = Math.min(1, Math.max(0, (f - i - 0.3) / 0.4))
  return i + t * t * (3 - 2 * t)
}

const open = (i: number) => {
  const c = certificates[i]
  openLightbox({ src: c.src, alt: c.title, caption: `${c.title} · ${c.issuer} · ${c.date}` })
}

/**
 * Certificates run vertically through a lit projector gate. The section pins
 * and the film pulls up one certificate per scroll step, awards first.
 */
export function Certificates() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const strip = stripRef.current!
    const pitch = () => {
      const frames = strip.querySelectorAll<HTMLElement>('.cert-v-frame')
      return frames.length > 1 ? frames[1].offsetTop - frames[0].offsetTop : 0
    }
    const ctx = gsap.context(() => {
      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * STEP_VH * (N - 1)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const f = self.progress * (N - 1)
          strip.style.transform = `translate3d(0, ${-pitch() * framePosition(f)}px, 0)`
          setActive(Math.min(N - 1, Math.round(f)))
          if (gaugeRef.current) gaugeRef.current.style.transform = `scaleY(${self.progress})`
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const jump = (i: number) => {
    const st = triggerRef.current
    if (st) scrollToTarget(st.start + ((st.end - st.start) * i) / (N - 1) + 2)
  }

  const cert = certificates[active]

  return (
    <section
      id="certificates"
      ref={sectionRef}
      aria-label="Certificates"
      className="relative z-10 h-svh overflow-hidden border-t border-line bg-ink-2"
    >
      {/* projector light behind the gate */}
      <div aria-hidden className="cert-beam" />

      {/* the vertical film */}
      <div className="cert-v-view" aria-hidden={false}>
        <div ref={stripRef} className="cert-v-strip film-rails-v">
          {certificates.map((c, i) => (
            <div key={c.id} className={`cert-v-frame ${i === active ? 'is-active' : ''}`}>
              <button
                type="button"
                className="cert-v-media"
                onClick={() => open(i)}
                aria-label={`View certificate: ${c.title}`}
                tabIndex={i === active ? 0 : -1}
              >
                <img className="vframe-bg" src={c.src} alt="" aria-hidden loading={i < 3 ? 'eager' : 'lazy'} />
                <img className="cert-v-img" src={c.src} alt={c.title} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
              </button>
              <span className="vframe-edge" aria-hidden>
                {c.kind.toUpperCase()}&nbsp;&nbsp;▸&nbsp;&nbsp;{pad(i + 1)}
              </span>
              <span className="vframe-num" aria-hidden>
                {i + 1}A
              </span>
            </div>
          ))}
        </div>
        <div className="cert-gate" aria-hidden>
          <i /> <i /> <i /> <i />
        </div>
      </div>

      {/* copy + details */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-6 pt-24 md:px-10 md:pb-10 md:pt-28">
        <div className="md:w-[40%]">
          <SectionLabel index="03" label="Certificates & Awards" />
          <h2 className="-mt-4 font-display text-[clamp(2rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.02em] md:mt-0">
            Proof on <span className="italic text-bone/80">paper.</span>
          </h2>
        </div>

        <div className="cert-details pointer-events-auto mt-auto md:my-auto md:w-[40%]" aria-live="polite">
          <div key={active} className="animate-[certin_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow tabular-nums text-bone">
                {pad(active + 1)} <span className="text-mute">/ {pad(N)}</span>
              </span>
              <span className={`eyebrow rounded-full border px-3 py-1 ${KIND_STYLE[cert.kind]}`}>{cert.kind}</span>
              <span className="eyebrow text-mute">{cert.date}</span>
            </div>
            <h3 className="mt-4 font-display text-[clamp(1.5rem,2.6vw,2.6rem)] leading-[1.05]">{cert.title}</h3>
            <p className="mt-2 text-sm text-bone/60">{cert.issuer}</p>
            {cert.note && <p className="mt-3 hidden max-w-md text-[0.9375rem] leading-relaxed text-bone/70 md:block">{cert.note}</p>}
            <button
              type="button"
              onClick={() => open(active)}
              className="mt-5 inline-flex items-center gap-2 border border-line px-4 py-2 text-sm text-bone/85 transition-colors hover:border-bone hover:bg-bone hover:text-ink"
            >
              <Maximize2 className="size-3.5" strokeWidth={1.5} /> View full size
            </button>
          </div>
        </div>

        {/* index of every certificate, click to jump */}
        <div className="pointer-events-auto hidden gap-5 md:flex md:w-[40%] [@media(max-height:820px)]:!hidden">
          <span aria-hidden className="relative w-px shrink-0 bg-line">
            <span ref={gaugeRef} className="absolute inset-0 origin-top scale-y-0 bg-gold/80" />
          </span>
          <ol className="flex flex-1 flex-col" aria-label="All certificates">
            {certificates.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => jump(i)}
                  className={`flex w-full items-baseline gap-3 py-[3px] text-left text-[0.8125rem] transition-colors ${
                    i === active ? 'text-bone' : 'text-mute hover:text-bone/80'
                  }`}
                >
                  <span className={`tabular-nums text-[0.6875rem] ${i === active ? 'text-gold' : ''}`}>{pad(i + 1)}</span>
                  <span className="truncate">{c.title}</span>
                  {c.kind === 'Achievement' && <span className="size-1.5 shrink-0 self-center rounded-full bg-gold" aria-label="award" />}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
