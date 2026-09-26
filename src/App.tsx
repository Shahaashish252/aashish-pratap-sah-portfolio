import { useCallback, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbox } from './components/Lightbox'
import { Loader } from './components/Loader'
import { Navbar } from './components/Navbar'
import { Hero } from './hero/Hero'
import { About } from './sections/About'
import { Certificates } from './sections/Certificates'
import { Contact } from './sections/Contact'
import { Marquee } from './sections/Marquee'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'
import { createSmoothScroll, getLenis, prefersReducedMotion } from './lib/smoothScroll'

export default function App() {
  const [loadProgress, setLoadProgress] = useState(0)
  const [assetsReady, setAssetsReady] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const destroy = createSmoothScroll(prefersReducedMotion())
    getLenis()?.stop()
    return destroy
  }, [])

  useEffect(() => {
    if (!entered) return
    getLenis()?.start()
    ScrollTrigger.refresh()
  }, [entered])

  // Soft rise-in for anything marked data-reveal as it enters the viewport.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set('[data-reveal]', { autoAlpha: 0, y: 36 })
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 88%',
        once: true,
        onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07 }),
      })
    })
    return () => ctx.revert()
  }, [])

  const onLoaded = useCallback(() => {
    // Fonts affect layout of pinned sections — wait for them too.
    document.fonts.ready.then(() => setAssetsReady(true))
  }, [])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Loader progress={loadProgress} done={assetsReady} onExited={() => setEntered(true)} />
      <Navbar visible={entered} />
      <main id="main">
        <Hero ready={entered} onLoadProgress={setLoadProgress} onLoaded={onLoaded} />
        <About />
        <Marquee />
        <Projects />
        <Certificates />
        <Skills />
        <Contact />
      </main>
      <Lightbox />
    </>
  )
}
