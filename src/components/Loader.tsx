import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../config/site'

interface LoaderProps {
  /** 0 → 1 load progress of critical hero assets. */
  progress: number
  /** True when critical assets are ready. */
  done: boolean
  /** Fired once the exit animation has finished. */
  onExited: () => void
}

const MIN_DURATION = 1400
const EASE = [0.76, 0, 0.24, 1] as const

export function Loader({ progress, done, onExited }: LoaderProps) {
  const [visible, setVisible] = useState(true)
  const [shown, setShown] = useState(0)
  const start = useRef(performance.now())

  // Ease the displayed number toward real progress so it never jumps.
  useEffect(() => {
    if (!visible) return
    let raf = 0
    const tick = () => {
      setShown((s) => {
        const target = done ? 1 : Math.min(progress, 0.98)
        const next = s + (target - s) * 0.08
        return Math.abs(target - next) < 0.001 ? target : next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, done, visible])

  useEffect(() => {
    if (!done || shown < 1) return
    const wait = Math.max(0, MIN_DURATION - (performance.now() - start.current))
    const t = setTimeout(() => setVisible(false), wait + 200)
    return () => clearTimeout(t)
  }, [done, shown])

  return (
    <AnimatePresence onExitComplete={onExited}>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.p
            className="font-display text-7xl tracking-[0.04em] md:text-9xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {site.logo}
          </motion.p>

          <motion.div
            className="mt-8 flex w-56 flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-baseline justify-between text-mute">
              <span className="eyebrow">Loading experience…</span>
              <span className="eyebrow tabular-nums">{Math.round(shown * 100)}%</span>
            </div>
            <span className="relative h-px w-full bg-line">
              <span
                className="absolute inset-0 origin-left bg-bone"
                style={{ transform: `scaleX(${shown})` }}
              />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
