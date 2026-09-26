import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play } from 'lucide-react'
import type { Frame } from '../config/site'
import { openLightbox } from './Lightbox'

/**
 * A horizontal 35mm strip of photos that advances frame by frame as its
 * section scrolls through the viewport. Each frame opens in the lightbox.
 */
export function FilmStrip({ frames, label }: { frames: Frame[]; label: string }) {
  const viewRef = useRef<HTMLDivElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const view = viewRef.current!
    const strip = stripRef.current!
    const overflow = () => Math.max(0, strip.scrollWidth - view.clientWidth)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        strip,
        { x: () => (overflow() ? view.clientWidth * 0.12 : 0) },
        {
          x: () => -overflow(),
          ease: 'none',
          scrollTrigger: { trigger: view, start: 'top 90%', end: 'bottom 10%', scrub: 0.6, invalidateOnRefresh: true },
        },
      )
    }, view)
    // Frame widths depend on image aspect ratios — re-measure once they load.
    const imgs = [...strip.querySelectorAll('img')]
    const refresh = () => ScrollTrigger.refresh()
    imgs.forEach((img) => img.complete || img.addEventListener('load', refresh, { once: true }))
    return () => ctx.revert()
  }, [frames])

  return (
    <div ref={viewRef} className="filmstrip-view" role="group" aria-label={`${label} — photos`}>
      <div ref={stripRef} className="filmstrip film-rails">
        {frames.map((f, i) => (
          <button
            key={f.src}
            type="button"
            className="filmstrip-frame group"
            onClick={() => openLightbox({ src: f.src, alt: f.alt, caption: f.caption, video: f.video })}
            aria-label={`Open photo: ${f.caption}`}
          >
            {f.video ? (
              <video src={f.video} poster={f.src} muted loop autoPlay playsInline preload="metadata" aria-label={f.alt} />
            ) : (
              <img src={f.src} alt={f.alt} loading="lazy" decoding="async" />
            )}
            {f.video && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.2em] text-bone backdrop-blur">
                <Play className="size-3" fill="currentColor" /> Demo
              </span>
            )}
            <span className="filmstrip-caption">
              <span className="tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span> {f.caption}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
