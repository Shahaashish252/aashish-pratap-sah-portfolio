import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type Ref } from 'react'
import { VintageCamera } from './VintageCamera'

export interface CameraPrintsHandle {
  /** 0 → 1: first print peeking out of the camera → last print landed on the pile. */
  setProgress(p: number): void
}

interface CameraPrintsProps {
  photos: readonly string[]
  ref?: Ref<CameraPrintsHandle>
  onLoadProgress?: (p: number) => void
  onLoaded?: () => void
}

/** How far the first print is already out when the page opens (0–1 of its flight). */
const PEEK = 0.12
/** Resting tilt of each print on the pile, degrees. */
const TILTS = [-5, 4, -2.5, 6, -6, 2, -3.5, 3]
/** Small offsets so the pile looks hand-dropped, as a share of print width. */
const NUDGE = [
  [0, 0], [0.05, -0.03], [-0.04, 0.02], [0.03, 0.04],
  [-0.05, -0.02], [0.02, 0.03], [-0.02, -0.04], [0.01, 0.01],
]

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/**
 * A small vintage camera in the top-left corner ejects colour prints as the
 * page scrolls. Each print leaves the camera's slot tiny and grows as it
 * travels, landing full-size on a loose pile; the next one lands on top.
 * Scroll drives everything directly, so scrolling back returns the prints.
 */
export function CameraPrints({ photos, ref, onLoadProgress, onLoaded }: CameraPrintsProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<SVGSVGElement>(null)
  const knurlRef = useRef<SVGGElement>(null)
  const printRefs = useRef<(HTMLDivElement | null)[]>([])
  const layout = useRef({ ax: 0, ay: 0, bx: 0, by: 0, cx: 0, cy: 0, s0: 0.1, w: 0 })
  const progress = useRef(0)
  const n = photos.length

  const apply = () => {
    const L = layout.current
    if (!L.w) return
    // Global position along the sequence: print i flies while s ∈ [i, i + 1].
    const s = PEEK + progress.current * (n - PEEK)
    printRefs.current.forEach((el, i) => {
      if (!el) return
      const u = Math.min(1, Math.max(0, s - i))
      if (u <= 0) {
        el.style.visibility = 'hidden'
        return
      }
      const e = easeInOut(u)
      // Quadratic Bézier from the slot (A) via C to the pile (B).
      const k = 1 - e
      const [nx, ny] = NUDGE[i % NUDGE.length]
      const bx = L.bx + nx * L.w
      const by = L.by + ny * L.w
      const x = k * k * L.ax + 2 * k * e * L.cx + e * e * bx
      const y = k * k * L.ay + 2 * k * e * L.cy + e * e * by
      const scale = L.s0 + (1 - L.s0) * e
      const rot = TILTS[i % TILTS.length] * e
      el.style.visibility = 'visible'
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`
      // Prints still inside the camera are shadowed by it.
      el.style.filter = u < 0.08 ? 'brightness(0.55)' : ''
    })
    // Turn the camera's knurled knobs as prints wind out.
    const shift = -(s * 9) % 3
    knurlRef.current?.querySelectorAll('[data-knurl]').forEach((k) => k.setAttribute('transform', `translate(${shift} 0)`))
  }

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      progress.current = Math.min(1, Math.max(0, p))
      apply()
    },
  }))

  useLayoutEffect(() => {
    const root = rootRef.current!
    const measure = () => {
      const W = root.clientWidth
      const H = root.clientHeight
      const cam = cameraRef.current!.getBoundingClientRect()
      const box = root.getBoundingClientRect()
      const mobile = W < 768
      // Full-size print height, then width from the 3:4 photo + border.
      const printH = mobile ? Math.min(H * 0.4, W * 0.9) : Math.min(H * 0.56, W * 0.4)
      const printW = printH * 0.8
      root.style.setProperty('--print-w', `${printW}px`)
      // Slot = right edge of the camera body, vertically centred on it.
      const ax = cam.right - box.left - cam.width * 0.06
      const ay = cam.top - box.top + cam.height * 0.56
      const bx = mobile ? W * 0.52 : W * 0.6
      const by = mobile ? H * 0.47 : H * 0.47
      layout.current = {
        ax,
        ay,
        bx,
        by,
        // Control point pulls the flight into a gentle arc.
        cx: ax + (bx - ax) * 0.55,
        cy: ay - H * 0.06,
        s0: (cam.height * 0.62) / (printH * 1.07),
        w: printW,
      }
      apply()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [n])

  // Preload every photo (they are small) so nothing pops in mid-flight.
  const cb = useRef({ onLoadProgress, onLoaded })
  cb.current = { onLoadProgress, onLoaded }
  useEffect(() => {
    let done = 0
    let cancelled = false
    Promise.all(
      photos.map((src) => {
        const img = new Image()
        img.src = src
        return img
          .decode()
          .catch(() => {})
          .finally(() => {
            if (!cancelled) cb.current.onLoadProgress?.(++done / photos.length)
          })
      }),
    ).then(() => !cancelled && cb.current.onLoaded?.())
    return () => {
      cancelled = true
    }
  }, [photos])

  return (
    <div ref={rootRef} className="prints" aria-hidden>
      {photos.map((src, i) => (
        <div
          key={src}
          ref={(el) => {
            printRefs.current[i] = el
          }}
          className="print"
          style={{ zIndex: i + 1, visibility: 'hidden' }}
        >
          <img src={src} alt="" draggable={false} decoding="async" fetchPriority={i < 2 ? 'high' : 'auto'} />
          <span className="print-caption">
            No. {String(i + 1).padStart(2, '0')}
          </span>
        </div>
      ))}
      <VintageCamera ref={cameraRef} className="prints-camera" knurlRef={knurlRef} />
    </div>
  )
}
