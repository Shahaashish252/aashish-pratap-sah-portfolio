import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { site } from '../config/site'
import { getLenis, scrollToTarget } from '../lib/smoothScroll'

const EASE = [0.76, 0, 0.24, 1] as const

export function Navbar({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Freeze page scroll behind the fullscreen menu.
  useEffect(() => {
    const lenis = getLenis()
    if (open) lenis?.stop()
    else lenis?.start()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // Let the menu start closing before scrolling.
    setTimeout(() => scrollToTarget(href), open ? 350 : 0)
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : -24, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: visible ? 0.5 : 0 }}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !open
            ? 'border-line bg-ink/55 backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:h-20 md:px-10"
        >
          <a href="#top" onClick={go('#top')} className="font-display text-2xl tracking-[0.06em]" aria-label={`${site.name} — home`}>
            {site.logo}
            <span className="text-gold">.</span>
          </a>

          <div className="hidden items-center gap-10 md:flex">
            <ul className="flex items-center gap-8">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={go(item.href)}
                    className="group relative text-[0.8125rem] text-bone/70 transition-colors duration-300 hover:text-bone"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-bone transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={go('#contact')}
              className="group inline-flex items-center gap-2 border border-line px-4 py-2 text-[0.8125rem] transition-colors duration-500 hover:border-bone hover:bg-bone hover:text-ink"
            >
              Let's Talk
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-[60] -mr-2 p-2 md:hidden"
          >
            {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ul className="flex flex-col gap-2">
              {site.nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={item.href}
                    onClick={go(item.href)}
                    className="flex items-baseline justify-between py-3 font-display text-5xl"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}
                  >
                    {item.label}
                    <span className="eyebrow text-mute">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.a
              href="#contact"
              onClick={go('#contact')}
              className="inline-flex items-center justify-between border border-bone bg-bone px-5 py-4 text-sm font-medium text-ink"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              Let's Talk
              <ArrowUpRight className="size-4" strokeWidth={1.5} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
