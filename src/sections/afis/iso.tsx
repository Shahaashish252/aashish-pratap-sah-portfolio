/**
 * Tiny isometric toolkit for the AFIS exploded view.
 * World axes: x → right-back, y → left-back, z → up. Faces visible to the
 * viewer are the top (+z), the right face (+x) and the left face (+y).
 */
import type { ReactNode } from 'react'

const C = 0.866
const S = 0.5

export const P = (x: number, y: number, z: number): [number, number] => [(x - y) * C, (x + y) * S - z]

const pts = (list: [number, number, number][]) =>
  list
    .map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(1)).join(','))
    .join(' ')

export function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((c) => Math.round(f < 1 ? c * f : c + (255 - c) * (f - 1)))
  return `rgb(${ch.join(',')})`
}

interface BoxProps {
  x: number
  y: number
  z: number
  w: number
  d: number
  h: number
  c: string
  top?: string
  opacity?: number
}

/** Axis-aligned box with lit top, mid right face and shaded left face. */
export function Box({ x, y, z, w, d, h, c, top, opacity }: BoxProps) {
  return (
    <g opacity={opacity}>
      <polygon points={pts([[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]])} fill={shade(c, 0.62)} />
      <polygon points={pts([[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]])} fill={shade(c, 0.82)} />
      <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top ?? shade(c, 1.12)} />
    </g>
  )
}

/** Vertical cylinder standing on (cx, cy, z). */
export function Cyl({ cx, cy, z, r, h, side, top, opacity }: { cx: number; cy: number; z: number; r: number; h: number; side: string; top: string; opacity?: number }) {
  const [X, Y0] = P(cx, cy, z)
  const Y1 = Y0 - h
  const rx = r * 1.2247
  const ry = r * 0.7071
  return (
    <g opacity={opacity}>
      <path d={`M${X - rx},${Y1} L${X - rx},${Y0} A${rx},${ry} 0 0 0 ${X + rx},${Y0} L${X + rx},${Y1} Z`} fill={side} />
      <ellipse cx={X} cy={Y1} rx={rx} ry={ry} fill={top} />
    </g>
  )
}

/** Flat disk standing in the x-z plane (faces ±y) — wheels, lenses. */
export function Disk({ cx, y, cz, r, fill, stroke, sw }: { cx: number; y: number; cz: number; r: number; fill: string; stroke?: string; sw?: number }) {
  const list: [number, number, number][] = []
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2
    list.push([cx + r * Math.cos(t), y, cz + r * Math.sin(t)])
  }
  return <polygon points={pts(list)} fill={fill} stroke={stroke} strokeWidth={sw} />
}

/** Content drawn flat on a horizontal plane at height z, origin at (x, y). */
export function OnTop({ x, y, z, children }: { x: number; y: number; z: number; children: ReactNode }) {
  const [X, Y] = P(x, y, z)
  return <g transform={`matrix(${C},${S},${-C},${S},${X},${Y})`}>{children}</g>
}

/** Polyline through world points (wires, pipes). */
export function Wire({ path, color, width = 1.6, opacity }: { path: [number, number, number][]; color: string; width?: number; opacity?: number }) {
  return <polyline points={pts(path)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
}

export function Wheel({ cx, cz, y0, y1, r }: { cx: number; cz: number; y0: number; y1: number; r: number }) {
  const bands = []
  for (let y = y0; y < y1; y += 2) bands.push(<Disk key={y} cx={cx} y={y} cz={cz} r={r} fill="#161616" />)
  return (
    <g>
      {bands}
      <Disk cx={cx} y={y1} cz={cz} r={r} fill="#262626" stroke="#0d0d0d" sw={1} />
      <Disk cx={cx} y={y1} cz={cz} r={r * 0.6} fill="#f2c230" />
      <Disk cx={cx} y={y1} cz={cz} r={r * 0.22} fill="#b8901c" />
    </g>
  )
}
