import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null

export function createSmoothScroll(reducedMotion: boolean) {
  const instance = new Lenis({
    lerp: 0.085,
    smoothWheel: !reducedMotion,
    wheelMultiplier: 0.9,
  })
  instance.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => instance.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  lenis = instance

  return () => {
    gsap.ticker.remove(tick)
    instance.destroy()
    if (lenis === instance) lenis = null
  }
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number) {
  if (typeof target === 'string' && !document.querySelector(target)) return
  if (lenis) lenis.scrollTo(target, { duration: 1.6 })
  else if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView()
}

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
