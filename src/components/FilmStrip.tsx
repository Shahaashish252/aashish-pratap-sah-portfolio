import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'
import type { Frame } from '../config/site'
import { prefersReducedMotion } from '../lib/smoothScroll'
import { openLightbox } from './Lightbox'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * A vertical 35mm strip of photos. As the page scrolls, each frame wipes in
 * and "lights up" while it passes the middle of the screen; the others wait
 * dimmed on the film. Each frame opens in the lightbox.
 */
export function FilmStrip({ frames, label }: { frames: Frame[]; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current!
    const items = [...root.querySelectorAll<HTMLElement>('.vframe')]
    if (prefersReducedMotion()) {
      items.forEach((el) => el.classList.add('is-lit'))
      return
    }
    const ctx = gsap.context(() => {
      items.forEach((el) => {
        gsap.fromTo(
          el.querySelector('.vframe-media'),
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        )
        gsap.fromTo(
          el.querySelector('.vframe-fg'),
          { scale: 1.1 },
          { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } },
        )
        ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-lit' })
      })
    }, root)
    // Frame heights depend on image sizes — re-measure once they load.
    const refresh = () => ScrollTrigger.refresh()
    root.querySelectorAll('img').forEach((img) => img.complete || img.addEventListener('load', refresh, { once: true }))
    return () => ctx.revert()
  }, [frames])

  const code = label.toUpperCase()

  return (
    <div ref={rootRef} className="film-rails-v" role="group" aria-label={`${label} — photos`}>
      <div className="vstrip">
        <p className="vstrip-leader" aria-hidden>
          ▸ {code} · {pad(frames.length)} {frames.length === 1 ? 'FRAME' : 'FRAMES'}
        </p>
        {frames.map((f, i) => (
          <figure key={f.src} className="vframe">
            <button
              type="button"
              className="vframe-media"
              onClick={() => openLightbox({ src: f.src, alt: f.alt, caption: f.caption, video: f.video })}
              aria-label={`Open ${f.video ? 'video' : 'photo'}: ${f.caption}`}
            >
              <img className="vframe-bg" src={f.src} alt="" aria-hidden loading="lazy" />
              {f.video ? (
                <video className="vframe-fg" src={f.video} poster={f.src} muted loop autoPlay playsInline preload="metadata" aria-label={f.alt} />
              ) : (
                <img className="vframe-fg" src={f.src} alt={f.alt} loading="lazy" decoding="async" />
              )}
              {f.video && (
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.2em] text-bone backdrop-blur">
                  <Play className="size-3" fill="currentColor" /> Demo
                </span>
              )}
              <figcaption className="vframe-caption">
                <span className="tabular-nums text-gold">{pad(i + 1)}</span> {f.caption}
              </figcaption>
            </button>
            <span className="vframe-edge" aria-hidden>
              {code}&nbsp;&nbsp;▸&nbsp;&nbsp;{pad(i + 1)}
            </span>
            <span className="vframe-num" aria-hidden>
              {i + 1}A
            </span>
          </figure>
        ))}
      </div>
    </div>
  )
}
