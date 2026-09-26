import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { getLenis } from '../lib/smoothScroll'

interface LightboxItem {
  src: string
  alt: string
  caption?: string
  video?: string
}

const EVENT = 'lightbox:open'

/** Open the shared lightbox from anywhere. */
export function openLightbox(item: LightboxItem) {
  window.dispatchEvent(new CustomEvent<LightboxItem>(EVENT, { detail: item }))
}

export function Lightbox() {
  const ref = useRef<HTMLDialogElement>(null)
  const [item, setItem] = useState<LightboxItem | null>(null)

  useEffect(() => {
    const onOpen = (e: Event) => {
      setItem((e as CustomEvent<LightboxItem>).detail)
      ref.current?.showModal()
      getLenis()?.stop()
    }
    window.addEventListener(EVENT, onOpen)
    return () => window.removeEventListener(EVENT, onOpen)
  }, [])

  const close = () => ref.current?.close()

  return (
    <dialog
      ref={ref}
      onClose={() => {
        getLenis()?.start()
        setItem(null)
      }}
      onClick={(e) => e.target === e.currentTarget && close()}
      className="lightbox"
      aria-label={item?.alt ?? 'Image viewer'}
    >
      {item && (
        <figure className="flex max-h-full flex-col items-center gap-4">
          {item.video ? (
            <video src={item.video} poster={item.src} controls autoPlay muted loop playsInline className="max-h-[80svh] max-w-full rounded" />
          ) : (
            <img src={item.src} alt={item.alt} className="max-h-[80svh] max-w-full rounded object-contain" />
          )}
          {item.caption && <figcaption className="eyebrow text-center text-bone/70">{item.caption}</figcaption>}
        </figure>
      )}
      <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full border border-line p-2 text-bone/80 hover:bg-bone hover:text-ink">
        <X className="size-5" strokeWidth={1.5} />
      </button>
    </dialog>
  )
}
