import { ArrowUp, ArrowUpRight, AtSign, MessageCircle } from 'lucide-react'
import { Instagram } from '../components/icons/Instagram'
import { site } from '../config/site'
import { scrollToTarget } from '../lib/smoothScroll'
import { SectionLabel } from './SectionLabel'

const channels = [
  { ...site.social.whatsapp, icon: MessageCircle, primary: true },
  { ...site.social.instagram, icon: Instagram, primary: false },
  { label: 'Email', display: site.email, href: `mailto:${site.email}`, icon: AtSign, primary: false },
]

export function Contact() {
  return (
    <section id="contact" className="relative z-10 border-t border-line bg-ink px-5 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="05" label="Contact" />
        <h2 data-reveal className="font-display text-[clamp(3rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.03em]">
          Let's build
          <br />
          <span className="italic text-bone/80">something that moves.</span>
        </h2>
        <p data-reveal className="mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-bone/70">
          Got a project, a competition team, an internship or just an idea? Message me — WhatsApp is the fastest way to reach me.
        </p>

        <ul className="mt-16 grid gap-px border border-line bg-line md:grid-cols-3">
          {channels.map(({ label, display, href, icon: Icon, primary }) => (
            <li key={label} data-reveal className="bg-ink">
              <a
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className={`group flex h-full items-center justify-between gap-6 p-8 transition-colors duration-500 md:p-10 ${
                  primary ? 'bg-bone text-ink hover:bg-gold' : 'hover:bg-ink-2'
                }`}
              >
                <span className="flex flex-col gap-3">
                  <span className={`eyebrow flex items-center gap-2 ${primary ? 'text-ink/60' : 'text-mute'}`}>
                    <Icon className="size-4" strokeWidth={1.5} /> {label}
                  </span>
                  <span className="font-display text-2xl md:text-3xl">{display}</span>
                </span>
                <ArrowUpRight className="size-6 shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.25} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mx-auto mt-28 flex max-w-[1600px] flex-col gap-6 border-t border-line py-8 text-sm text-mute md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>
        <button type="button" onClick={() => scrollToTarget(0)} className="inline-flex items-center gap-2 self-start hover:text-bone md:self-auto">
          Back to top <ArrowUp className="size-4" strokeWidth={1.5} />
        </button>
      </footer>
    </section>
  )
}
