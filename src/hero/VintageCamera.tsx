import type { Ref } from 'react'

interface VintageCameraProps {
  ref?: Ref<SVGSVGElement>
  className?: string
  /** Knurled bands on the knobs; shifted with scroll so they appear to turn. */
  knurlRef?: Ref<SVGGElement>
}

/**
 * Front view of a classic 35mm rangefinder, drawn as vector so it stays crisp
 * at hero size. The film exit slot sits on the right-hand edge.
 */
export function VintageCamera({ ref, className, knurlRef }: VintageCameraProps) {
  return (
    <svg ref={ref} className={className} viewBox="0 0 324 200" fill="none" aria-hidden>
      <defs>
        <linearGradient id="cam-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1eee8" />
          <stop offset="0.35" stopColor="#bdb9b1" />
          <stop offset="0.55" stopColor="#8e8a83" />
          <stop offset="0.8" stopColor="#d6d3cc" />
          <stop offset="1" stopColor="#77736c" />
        </linearGradient>
        <linearGradient id="cam-chrome-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a867f" />
          <stop offset="0.3" stopColor="#ece9e3" />
          <stop offset="0.6" stopColor="#a9a59e" />
          <stop offset="1" stopColor="#6f6b65" />
        </linearGradient>
        <radialGradient id="cam-glass" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#3a4658" />
          <stop offset="0.45" stopColor="#141b26" />
          <stop offset="1" stopColor="#05070a" />
        </radialGradient>
        <radialGradient id="cam-coating" cx="0.3" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#c9a2ff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#6fb8c9" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cam-window" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5d6a74" />
          <stop offset="0.5" stopColor="#1c232a" />
          <stop offset="1" stopColor="#39434b" />
        </linearGradient>
        <pattern id="cam-leather" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#191715" />
          <circle cx="1" cy="1" r="0.7" fill="#24211e" />
          <circle cx="3" cy="3" r="0.6" fill="#100f0d" />
        </pattern>
        <pattern id="cam-knurl" width="3" height="10" patternUnits="userSpaceOnUse">
          <rect width="3" height="10" fill="url(#cam-chrome)" />
          <rect width="1" height="10" fill="#5e5a54" opacity="0.8" />
        </pattern>
        <clipPath id="cam-rewind"><rect x="34" y="10" width="44" height="16" rx="3" /></clipPath>
        <clipPath id="cam-dial"><rect x="220" y="12" width="46" height="14" rx="3" /></clipPath>
      </defs>

      {/* knobs on the top plate */}
      <g ref={knurlRef}>
        <g clipPath="url(#cam-rewind)">
          <rect data-knurl x="24" y="10" width="64" height="16" fill="url(#cam-knurl)" />
        </g>
        <g clipPath="url(#cam-dial)">
          <rect data-knurl x="210" y="12" width="66" height="14" fill="url(#cam-knurl)" />
        </g>
      </g>
      <rect x="34" y="10" width="44" height="16" rx="3" stroke="#4d4944" strokeWidth="0.6" />
      <rect x="220" y="12" width="46" height="14" rx="3" stroke="#4d4944" strokeWidth="0.6" />
      {/* shutter button + advance lever */}
      <rect x="276" y="12" width="16" height="16" rx="2" fill="url(#cam-chrome-h)" />
      <rect x="279" y="6" width="10" height="7" rx="3" fill="url(#cam-chrome-h)" stroke="#5a5650" strokeWidth="0.5" />
      <path d="M250 13 L296 4 L298 8 L254 17 Z" fill="url(#cam-chrome-h)" stroke="#5a5650" strokeWidth="0.5" />

      {/* body */}
      <rect x="4" y="24" width="316" height="170" rx="16" fill="url(#cam-leather)" />
      {/* top plate */}
      <path d="M20 24 H304 A16 16 0 0 1 320 40 V64 H4 V40 A16 16 0 0 1 20 24 Z" fill="url(#cam-chrome)" />
      <path d="M4 64 H320" stroke="#3b3834" strokeWidth="1" />
      {/* bottom plate */}
      <path d="M4 178 H320 V180 A14 14 0 0 1 306 194 H18 A14 14 0 0 1 4 180 Z" fill="url(#cam-chrome)" />
      <path d="M4 178 H320" stroke="#2e2b28" strokeWidth="1" />

      {/* viewfinder, frame-line illumination and rangefinder windows */}
      <rect x="24" y="34" width="40" height="22" rx="3" fill="url(#cam-window)" stroke="#55514b" strokeWidth="1" />
      <path d="M28 38 L44 38 L30 52 Z" fill="#fff" opacity="0.12" />
      <rect x="196" y="37" width="20" height="16" rx="2" fill="#e8e3d6" opacity="0.85" stroke="#6d6963" strokeWidth="0.8" />
      <rect x="258" y="35" width="32" height="20" rx="3" fill="url(#cam-window)" stroke="#55514b" strokeWidth="1" />
      <path d="M262 39 L274 39 L263 50 Z" fill="#fff" opacity="0.12" />
      {/* engraving */}
      <text x="130" y="49" textAnchor="middle" fill="#46423d" fontSize="8.5" letterSpacing="3.2" fontFamily="Inter Tight, sans-serif" fontWeight="600">
        AASHISH
      </text>
      <text x="130" y="58" textAnchor="middle" fill="#5d5953" fontSize="4.4" letterSpacing="2" fontFamily="Inter Tight, sans-serif">
        CREATIVE · 35
      </text>

      {/* strap lugs */}
      <rect x="0" y="70" width="6" height="14" rx="2" fill="url(#cam-chrome-h)" />
      <rect x="318" y="70" width="6" height="14" rx="2" fill="url(#cam-chrome-h)" />

      {/* self-timer lever */}
      <path d="M90 150 L104 138 L108 142 L95 154 Z" fill="url(#cam-chrome-h)" stroke="#4a4640" strokeWidth="0.5" />

      {/* lens */}
      <g transform="translate(162 118)">
        <circle r="64" fill="#0d0c0b" opacity="0.55" />
        <circle r="60" fill="url(#cam-chrome)" />
        <circle r="54" fill="#141312" />
        <circle r="53" stroke="#3a3733" strokeWidth="5" strokeDasharray="1.4 2.2" />
        <circle r="47" fill="url(#cam-chrome-h)" />
        <circle r="43" fill="#1a1917" />
        {/* focus scale ticks */}
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1="0" y1="-45.5" x2="0" y2={i % 3 ? -44 : -42.5} stroke="#c9c5bd" strokeWidth="0.6" transform={`rotate(${i * 15 - 90})`} />
        ))}
        <circle r="36" fill="#0b0b0a" />
        <circle r="31" fill="url(#cam-glass)" />
        <circle r="31" fill="url(#cam-coating)" />
        <circle r="17" fill="#07090c" opacity="0.7" />
        <ellipse cx="-11" cy="-12" rx="9" ry="5" fill="#fff" opacity="0.22" transform="rotate(-35 -11 -12)" />
        <circle cx="10" cy="12" r="2.4" fill="#fff" opacity="0.18" />
        <path d="M-26 8 A27 27 0 0 0 4 26" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.5" />
        <text y="-38.5" textAnchor="middle" fill="#8f8b84" fontSize="3.6" letterSpacing="1" fontFamily="Inter Tight, sans-serif">
          1:2 · 50mm
        </text>
      </g>

      {/* film exit slot on the right edge */}
      <rect x="312" y="34" width="10" height="148" rx="2" fill="#050505" />
      <rect x="311" y="34" width="2" height="148" fill="#2c2926" />

      {/* subtle edge highlight */}
      <rect x="4.5" y="24.5" width="315" height="169" rx="15.5" stroke="#fff" strokeOpacity="0.06" />
    </svg>
  )
}
