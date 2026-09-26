import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { site } from '../config/site'
import { scrollToTarget } from '../lib/smoothScroll'
import { CameraPrints, type CameraPrintsHandle } from './CameraPrints'

/** Scroll distance for the whole reel, in viewport heights. */
const REEL_VH = { desktop: 3.5, mobile: 3 }
const FRAMES = site.hero.reel
const pad = (n: number) => String(n).padStart(2, '0')

interface HeroProps {
  /** True once the loader has left; triggers the intro reveal. */
  ready: boolean
  onLoadProgress: (p: number) => void
  onLoaded: () => void
}

export function Hero({ ready, onLoadProgress, onLoaded }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reelRef = useRef<CameraPrintsHandle>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const gaugeRef = useRef<HTMLSpanElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  // ---- scroll → reel position ----
  useLayoutEffect(() => {
    const section = sectionRef.current!
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add({ mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' }, (c) => {
        const vh = c.conditions?.mobile ? REEL_VH.mobile : REEL_VH.desktop
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * vh}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress
            reelRef.current?.setProgress(p)
            if (counterRef.current) counterRef.current.textContent = pad(Math.min(FRAMES.length, Math.ceil(0.12 + p * (FRAMES.length - 0.12))))
            if (gaugeRef.current) gaugeRef.current.style.transform = `scaleX(${p})`
            if (indicatorRef.current) {
              const fade = Math.max(0, 1 - p * 25) // gone within the first few percent of the reel
              indicatorRef.current.style.opacity = String(fade)
              indicatorRef.current.style.visibility = fade === 0 ? 'hidden' : ''
            }
          },
        })

        // Hand-off: once the revolution completes, the hero dims as it scrolls away.
        gsap.to('[data-hero-content]', {
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            start: () => window.innerHeight * vh,
            end: () => window.innerHeight * (vh + 1),
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    }, section)
    return () => ctx.revert()
  }, [])

  // ---- intro reveal ----
  useLayoutEffect(() => {
    const section = sectionRef.current!
    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set('[data-reveal-line]', { yPercent: 110 })
        gsap.set('[data-reveal-fade]', { autoAlpha: 0, y: 16 })
        gsap.set('[data-reveal-visual]', { autoAlpha: 0 })
        return
      }
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set('[data-reveal-line], [data-reveal-fade], [data-reveal-visual]', { clearProps: 'all' })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .to('[data-reveal-visual]', { autoAlpha: 1, duration: 1.4, ease: 'power2.out' })
        .to('[data-reveal-line]', { yPercent: 0, duration: 1.1, stagger: 0.09 }, 0.25)
        .to('[data-reveal-fade]', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6)
    }, section)
    return () => ctx.revert()
  }, [ready])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  const { hero } = site

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative h-svh w-full overflow-hidden bg-ink"
    >
      {/* Projector light behind the reel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 38% 55% at 50% 48%, rgb(236 232 225 / 0.09), transparent 70%), radial-gradient(ellipse 80% 60% at 50% 110%, rgb(201 164 92 / 0.06), transparent 70%)',
        }}
      />

      <div data-hero-content className="absolute inset-0">
        <div data-reveal-visual className="absolute inset-0">
          <CameraPrints ref={reelRef} photos={FRAMES} onLoadProgress={onLoadProgress} onLoaded={onLoaded} />
        </div>
      </div>
      <p className="sr-only">A small vintage camera prints colour photographs of Aashish, one after another, as you scroll.</p>

      {/* Mobile legibility scrim — sits below the face, over the torso only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-ink via-ink/70 to-transparent md:hidden"
      />

      {/* ---------- typography ---------- */}
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pb-10 md:pt-32">
        <div data-reveal-fade className="flex items-center gap-3 text-mute">
          <span className="h-px w-8 bg-mute/60" />
          <p className="eyebrow">{hero.eyebrow}</p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="font-display text-[clamp(2.6rem,11vw,3.6rem)] leading-[0.95] tracking-[-0.02em] mix-blend-difference md:text-[clamp(3.5rem,5.4vw,6.25rem)]">
            {hero.headline.map((line, i) => (
              <span key={line} className="line-mask">
                <span data-reveal-line className={i === hero.headline.length - 1 ? 'block italic' : 'block'}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="flex max-w-[20rem] flex-col gap-6 md:max-w-[17rem] md:items-start md:pb-2">
            <p data-reveal-fade className="hidden text-[0.9375rem] leading-relaxed text-bone/70 md:block">
              {hero.supporting}
            </p>
            <div data-reveal-fade className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={hero.primaryCta.href}
                onClick={go(hero.primaryCta.href)}
                className="group inline-flex items-center gap-2 border border-bone/80 bg-bone px-5 py-3 text-sm font-medium text-ink transition-colors duration-500 hover:bg-transparent hover:text-bone"
              >
                {hero.primaryCta.label}
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
              </a>
              <a
                href={hero.secondaryCta.href}
                onClick={go(hero.secondaryCta.href)}
                className="group relative text-sm text-bone/85 transition-colors hover:text-bone"
              >
                {hero.secondaryCta.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-bone transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Frame counter — top right, above the film, desktop only */}
      <div aria-hidden className="absolute right-10 top-28 z-10 hidden items-center gap-4 md:flex">
        <span className="eyebrow text-mute/60">Photo</span>
        <span className="eyebrow tabular-nums text-mute">
          <span ref={counterRef}>01</span>
        </span>
        <span className="relative h-px w-24 bg-line">
          <span ref={gaugeRef} className="absolute inset-0 origin-left scale-x-0 bg-bone/70" />
        </span>
        <span className="eyebrow text-mute/60">{pad(FRAMES.length)}</span>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-mute md:flex"
      >
        <span data-reveal-fade className="eyebrow">Scroll to explore</span>
        <span data-reveal-fade className="relative h-10 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-bone/80" />
        </span>
        <ArrowDown data-reveal-fade className="size-3.5" strokeWidth={1.5} />
      </div>
    </section>
  )
}
