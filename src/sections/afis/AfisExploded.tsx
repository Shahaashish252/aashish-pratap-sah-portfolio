import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Maximize2 } from 'lucide-react'
import { afisFlow, afisLayers } from '../../config/afis'
import { openLightbox } from '../../components/Lightbox'
import { P } from './iso'
import { LAYER_ART } from './layers'

const N = afisLayers.length
/** Scroll segments: intro, one per layer, final full diagram. */
const SEGMENTS = N + 2
const SEGMENT_VH = 0.55
const LABEL_X = 330
const DIAGRAM_IMAGE = '/work/afis-exploded.webp'
const pad = (n: number) => String(n).padStart(2, '0')

const smooth = (t: number) => {
  const c = Math.min(1, Math.max(0, t))
  return c * c * (3 - 2 * c)
}

/** Removal index (0 = first off the robot) for each drawn layer. */
const removalIndex = (id: string) => afisLayers.findIndex((l) => l.id === id)

/**
 * AFIS opened up like a phone tear-down: the section pins and, step by step,
 * each layer of the robot lifts off from the top down, gets a numbered
 * callout, and is explained in the side panel. The last step leaves the
 * complete labelled exploded diagram on screen.
 */
export function AfisExploded() {
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<SVGGElement>(null)
  const layerRefs = useRef<(SVGGElement | null)[]>([])
  const calloutRefs = useRef<(SVGGElement | null)[]>([])
  const gaugeRef = useRef<HTMLSpanElement>(null)
  // -1 = intro, 0..N-1 = layer being explained, N = full diagram
  const [step, setStep] = useState(-1)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const apply = (p: number) => {
      const s = p * SEGMENTS
      let total = 0
      LAYER_ART.forEach((L, i) => {
        const j = removalIndex(L.id)
        const still = L.move.every((v) => v === 0)
        const lift = still ? 0 : smooth(s - 1 - j)
        total += lift
        const [mx, my, mz] = L.move
        const sx = (mx - my) * 0.866 * lift
        const sy = ((mx + my) * 0.5 - mz) * lift
        layerRefs.current[i]?.setAttribute('transform', `translate(${sx} ${sy})`)
        const c = calloutRefs.current[i]
        if (c) {
          // The label column stays put; only the leader's start follows the part.
          c.setAttribute('transform', `translate(0 ${sy})`)
          const [ax] = P(...L.anchor)
          c.querySelector('line')?.setAttribute('x1', String(ax + sx))
          c.querySelector('circle')?.setAttribute('cx', String(ax + sx))
          const shown = still ? smooth((s - 1 - j) * 2) : smooth((lift - 0.55) * 3)
          c.style.opacity = String(shown)
        }
      })
      // Frame the small assembled robot larger, then zoom out as it opens.
      const e = total / (N - 1)
      const k = 1 - e
      sceneRef.current?.setAttribute('transform', `translate(0 ${-k * 200}) translate(60 20) scale(${1 + k * 0.35}) translate(-60 -20)`)
      setStep(s < 1 ? -1 : Math.min(N, Math.floor(s - 1)))
      if (gaugeRef.current) gaugeRef.current.style.transform = `scaleX(${p})`
    }
    apply(0)
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${window.innerHeight * SEGMENT_VH * SEGMENTS}`,
        pin: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress),
      })
    }, section)
    return () => ctx.revert()
  }, [])

  const activeId = step >= 0 && step < N ? afisLayers[step].id : null
  const layer = activeId ? afisLayers[step] : null

  return (
    <section
      ref={sectionRef}
      id="afis-inside"
      aria-labelledby="afis-inside-title"
      className="afx relative h-svh overflow-hidden border-y border-line bg-ink-2"
      data-step={step}
    >
      <div aria-hidden className="afx-beam" />

      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col gap-3 px-5 pb-5 pt-20 md:grid md:grid-cols-12 md:grid-rows-[auto_1fr] md:gap-x-10 md:px-10 md:pb-10 md:pt-24">
        {/* heading */}
        <header className="md:col-span-4 md:row-start-1 md:self-end">
          <p className="eyebrow flex items-center gap-3 text-mute">
            <span className="tabular-nums text-gold">01</span> AFIS <span className="h-px w-6 bg-mute/50" /> Inside the robot
          </p>
          <h3 id="afis-inside-title" className="mt-3 font-display text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[0.98]">
            Take it apart, <span className="italic text-bone/75">layer by layer.</span>
          </h3>
          <div className="mt-4 flex items-center gap-3" aria-hidden>
            <span className="relative h-px w-full max-w-48 bg-line">
              <span ref={gaugeRef} className="absolute inset-0 origin-left scale-x-0 bg-gold/80" />
            </span>
            <span className="eyebrow tabular-nums text-mute">
              {step < 0 ? '00' : pad(Math.min(step + 1, N))} / {pad(N)}
            </span>
          </div>
        </header>

        {/* diagram */}
        <div className="relative min-h-0 flex-1 md:col-span-8 md:col-start-5 md:row-span-2 md:row-start-1">
          <svg
            className="afx-svg absolute inset-0 h-full w-full"
            viewBox="-520 -650 1040 850"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Exploded diagram of the AFIS robot showing its eight layers"
          >
            <defs>
              <linearGradient id="afx-water" x1="0" x2="1">
                <stop offset="0" stopColor="#7fb8e8" stopOpacity="0.85" />
                <stop offset="0.45" stopColor="#d6ecff" stopOpacity="0.8" />
                <stop offset="1" stopColor="#5b93c7" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <g ref={sceneRef}>
              {/* ground shadow */}
              <ellipse cx={P(110, 70, 0)[0]} cy={P(110, 70, 0)[1] + 8} rx={200} ry={60} fill="#000" opacity={0.35} />
              {LAYER_ART.map((L, i) => (
                <g
                  key={L.id}
                  ref={(el) => {
                    layerRefs.current[i] = el
                  }}
                  className={`afx-layer ${activeId === L.id ? 'is-active' : ''} ${activeId && activeId !== L.id ? 'is-dim' : ''}`}
                >
                  {L.art}
                </g>
              ))}
              {LAYER_ART.map((L, i) => {
                const meta = afisLayers[removalIndex(L.id)]
                const n = pad(removalIndex(L.id) + 1)
                const [ax, ay] = P(...L.anchor)
                const lx = L.side === 'l' ? -LABEL_X : LABEL_X
                const tx = L.side === 'l' ? lx - 22 : lx + 22
                const anchor = L.side === 'l' ? 'end' : 'start'
                return (
                  <g
                    key={L.id}
                    ref={(el) => {
                      calloutRefs.current[i] = el
                    }}
                    className={`afx-callout ${activeId === L.id ? 'is-active' : ''}`}
                    style={{ opacity: 0 }}
                  >
                    <line x1={ax} y1={ay} x2={lx} y2={ay} className="afx-leader" />
                    <circle cx={ax} cy={ay} r={3.5} className="afx-dot" />
                    <circle cx={lx} cy={ay} r={13} className="afx-badge" />
                    <text x={lx} y={ay + 4} textAnchor="middle" className="afx-num">
                      {n}
                    </text>
                    <g className="afx-label-text">
                      <text x={tx} y={ay - 1} textAnchor={anchor} className="afx-t1">
                        {meta.title}
                      </text>
                      <text x={tx} y={ay + 15} textAnchor={anchor} className="afx-t2">
                        {meta.short}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>

        {/* explanation */}
        <div className="afx-panel md:col-span-4 md:row-start-2 md:self-start md:pt-6" aria-live="polite">
          <div key={step} className="animate-[certin_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            {step < 0 && (
              <>
                <p className="text-[0.9375rem] leading-relaxed text-bone/75">
                  AFIS drives to a plant, reads the soil and waters or fertilises it on its own. Scroll to open the robot from the camera on top down to the
                  wheels, and see what each part does.
                </p>
                <p className="eyebrow mt-5 text-mute">Scroll to open ↓</p>
              </>
            )}

            {layer && (
              <>
                <p className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-gold/60 font-sans text-xs tabular-nums text-gold">
                    {pad(step + 1)}
                  </span>
                  <span className="eyebrow text-mute">{layer.short}</span>
                </p>
                <h4 className="mt-3 font-display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none">{layer.title}</h4>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-bone/75 max-md:line-clamp-3">{layer.role}</p>
                <ul className="mt-5 hidden border-t border-line md:block">
                  {layer.parts.map((part) => (
                    <li key={part.name} className="border-b border-line py-2.5">
                      <span className="block text-sm text-bone">{part.name}</span>
                      <span className="block text-xs text-mute">{part.detail}</span>
                    </li>
                  ))}
                </ul>
                <ul className="mt-3 flex flex-wrap gap-1.5 md:hidden">
                  {layer.parts.map((part) => (
                    <li key={part.name} className="rounded-full border border-line px-2.5 py-0.5 text-[0.6875rem] text-bone/75">
                      {part.name}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {step >= N && (
              <>
                <h4 className="font-display text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none">
                  All together, <span className="italic text-bone/75">it works like this.</span>
                </h4>
                <ol className="mt-4 hidden flex-col gap-2 md:flex">
                  {afisFlow.map((f, i) => (
                    <li key={f} className="flex gap-3 text-sm leading-snug text-bone/75">
                      <span className="tabular-nums text-gold">{pad(i + 1)}</span>
                      {f}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-sm text-bone/70 md:hidden">Camera finds the plant → car drives there → arm probes the soil → Arduino reads it → pump waters or fertilises.</p>
              </>
            )}

            <button
              type="button"
              onClick={() => openLightbox({ src: DIAGRAM_IMAGE, alt: 'AFIS exploded diagram with all components labelled', caption: 'AFIS — exploded diagram' })}
              className="mt-5 inline-flex items-center gap-2 border border-line px-4 py-2 text-sm text-bone/85 transition-colors hover:border-bone hover:bg-bone hover:text-ink"
            >
              <Maximize2 className="size-3.5" strokeWidth={1.5} /> View full diagram
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
