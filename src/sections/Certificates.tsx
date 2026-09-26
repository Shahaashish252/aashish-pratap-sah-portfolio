import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Maximize2 } from 'lucide-react'
import { certificates, type CertificateKind } from '../config/site'
import { openLightbox } from '../components/Lightbox'
import { SectionLabel } from './SectionLabel'

/** Scroll distance per certificate, in viewport heights. */
const STEP_VH = 0.6
const N = certificates.length
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Frame-by-frame advance: each certificate holds in the gate for most of its
 * scroll step, then the film pulls quickly to the next one — like a projector.
 */
function framePosition(f: number) {
  const i = Math.floor(f)
  const t = Math.min(1, Math.max(0, (f - i - 0.3) / 0.4))
  return i + t * t * (3 - 2 * t)
}

const KIND_STYLE: Record<CertificateKind, string> = {
  Achievement: 'border-gold/60 bg-gold/10 text-gold',
  Participation: 'border-bone/30 text-bone/80',
  Course: 'border-line text-mute',
}

/**
 * Certificates projected one frame at a time: the section pins and the film
 * advances a full frame per scroll step (snapping), awards first.
 */
export function Certificates() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const gaugeRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const strip = stripRef.current!
    const ctx = gsap.context(() => {
      const pitch = () => {
        const frames = strip.children
        return frames.length > 1 ? (frames[1] as HTMLElement).offsetLeft - (frames[0] as HTMLElement).offsetLeft : 0
      }
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * STEP_VH * (N - 1)}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const f = self.progress * (N - 1)
          strip.style.transform = `translate3d(${-pitch() * framePosition(f)}px, 0, 0)`
          setActive(Math.min(N - 1, Math.round(f)))
          if (gaugeRef.current) gaugeRef.current.style.transform = `scaleX(${self.progress})`
        },
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const cert = certificates[active]

  return (
    <section
      id="certificates"
      ref={sectionRef}
      aria-label="Certificates"
      className="relative z-10 flex h-svh flex-col justify-center overflow-hidden border-t border-line bg-ink-2 px-5 pb-8 pt-24 md:px-10 md:pt-28"
    >
      <div className="mx-auto grid w-full max-w-[1600px] items-end gap-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionLabel index="03" label="Certificates & Awards" />
          <h2 className="font-display text-[clamp(2.2rem,4.6vw,4.5rem)] leading-[0.98] tracking-[-0.02em]">
            Proof on <span className="italic text-bone/80">paper.</span>
          </h2>
        </div>
        <div className="flex items-center gap-4 md:col-span-4 md:col-start-9 md:justify-end" aria-hidden>
          <span className="eyebrow tabular-nums text-bone">{pad(active + 1)}</span>
          <span className="relative h-px w-full max-w-40 bg-line">
            <span ref={gaugeRef} className="absolute inset-0 origin-left scale-x-0 bg-bone/70" />
          </span>
          <span className="eyebrow tabular-nums text-mute">{pad(N)}</span>
        </div>
      </div>

      {/* the film */}
      <div className="cert-view mt-6 md:mt-10">
        <div ref={stripRef} className="cert-strip film-rails">
          {certificates.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`cert-frame ${i === active ? 'is-active' : ''}`}
              onClick={() => openLightbox({ src: c.src, alt: c.title, caption: `${c.title} · ${c.issuer} · ${c.date}` })}
              aria-label={`View certificate: ${c.title}`}
              tabIndex={i === active ? 0 : -1}
            >
              <img src={c.src} alt={c.title} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
              <span className="cert-edge">
                {c.kind.toUpperCase()}&nbsp;&nbsp;▸&nbsp;&nbsp;{pad(i + 1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* details for the frame in the gate */}
      <div className="mx-auto mt-6 grid w-full max-w-[1600px] gap-3 md:mt-8 md:grid-cols-12" aria-live="polite">
        <div className="flex flex-wrap items-center gap-3 md:col-span-3">
          <span className={`eyebrow rounded-full border px-3 py-1 ${KIND_STYLE[cert.kind]}`}>{cert.kind}</span>
          <span className="eyebrow text-mute">{cert.date}</span>
        </div>
        <div className="md:col-span-7">
          <h3 className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-tight">{cert.title}</h3>
          <p className="mt-1 text-sm text-bone/60">
            {cert.issuer}
            {cert.note && <span className="hidden md:inline"> — {cert.note}</span>}
          </p>
        </div>
        <div className="md:col-span-2 md:text-right">
          <button
            type="button"
            onClick={() => openLightbox({ src: cert.src, alt: cert.title, caption: `${cert.title} · ${cert.issuer} · ${cert.date}` })}
            className="inline-flex items-center gap-2 text-sm text-bone/80 underline-offset-4 hover:text-bone hover:underline"
          >
            <Maximize2 className="size-3.5" strokeWidth={1.5} /> Full size
          </button>
        </div>
      </div>
    </section>
  )
}
