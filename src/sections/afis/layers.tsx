import type { ReactNode } from 'react'
import type { AfisLayer } from '../../config/afis'
import { Box, Cyl, Disk, OnTop, Wheel, Wire } from './iso'


export interface LayerArt {
  id: AfisLayer['id']
  /** How far (world dx, dy, dz) this layer travels when fully opened — zeros stay on the ground. */
  move: [number, number, number]
  /** Where the leader line touches the part (world coords, assembled). */
  anchor: [number, number, number]
  side: 'l' | 'r'
  art: ReactNode
}

const chassis = (
  <g>
    <Wheel cx={41} cz={18} y0={-12} y1={-4} r={24} />
    <Wheel cx={179} cz={18} y0={-12} y1={-4} r={24} />
    <Box x={20} y={6} z={4} w={42} d={28} h={14} c="#f5c518" />
    <Box x={158} y={6} z={4} w={42} d={28} h={14} c="#f5c518" />
    <Box x={20} y={106} z={4} w={42} d={28} h={14} c="#f5c518" />
    <Box x={158} y={106} z={4} w={42} d={28} h={14} c="#f5c518" />
    <Box x={0} y={0} z={16} w={220} d={140} h={10} c="#b98a55" />
    <Wheel cx={41} cz={18} y0={142} y1={154} r={24} />
    <Wheel cx={179} cz={18} y0={142} y1={154} r={24} />
  </g>
)

const power = (
  <g>
    <Box x={30} y={22} z={26} w={92} d={62} h={6} c="#1f3fae" />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <Box x={34} y={26 + i * 19} z={32} w={80} d={16} h={12} c="#2f6bff" />
        <Box x={114} y={30 + i * 19} z={33} w={6} d={8} h={9} c="#c9c9c9" />
      </g>
    ))}
    <Wire path={[[120, 40, 36], [120, 96, 30], [60, 100, 29]]} color="#e11d48" />
    <Wire path={[[120, 70, 36], [118, 104, 30], [64, 108, 29]]} color="#111" />
    <Box x={38} y={96} z={26} w={30} d={20} h={3} c="#1d4ed8" />
    <Box x={32} y={101} z={29} w={8} d={10} h={5} c="#cfcfcf" />
    <Box x={50} y={102} z={29} w={8} d={8} h={2} c="#141414" />
    <Box x={82} y={98} z={26} w={16} d={14} h={9} c="#141414" />
    <Box x={85} y={101} z={35} w={10} d={8} h={3} c="#d62828" />
  </g>
)

const drive = (
  <g>
    <Box x={138} y={22} z={26} w={54} d={52} h={3} c="#c1121f" />
    <Box x={150} y={28} z={29} w={26} d={10} h={24} c="#1f1f1f" />
    {[0, 1, 2, 3].map((i) => (
      <Box key={i} x={151 + i * 6.5} y={27} z={53} w={3} d={12} h={3} c="#2b2b2b" />
    ))}
    <Box x={140} y={60} z={29} w={14} d={10} h={9} c="#1e5aff" />
    <Box x={176} y={60} z={29} w={14} d={10} h={9} c="#1e5aff" />
    <Box x={134} y={88} z={26} w={62} d={28} h={3} c="#262626" />
    <Box x={150} y={93} z={29} w={24} d={18} h={4} c="#bdbdbd" />
    <Box x={194} y={97} z={29} w={8} d={10} h={4} c="#cfcfcf" />
    <Box x={140} y={96} z={29} w={4} d={4} h={2} c="#38bdf8" />
    <Wire path={[[160, 88, 30], [160, 76, 32], [160, 70, 38]]} color="#f59e0b" />
    <Wire path={[[168, 88, 30], [170, 76, 32], [183, 70, 38]]} color="#22c55e" />
  </g>
)

const brain = (
  <g>
    <Box x={8} y={8} z={52} w={204} d={124} h={3} c="#e8e2d6" opacity={0.92} />
    <Box x={26} y={24} z={55} w={74} d={54} h={3} c="#0e7cc2" />
    <Box x={20} y={30} z={58} w={14} d={14} h={10} c="#c9c9c9" />
    <Box x={20} y={60} z={58} w={14} d={10} h={10} c="#141414" />
    <Box x={56} y={44} z={58} w={34} d={8} h={4} c="#141414" />
    <Box x={40} y={24} z={58} w={56} d={4} h={6} c="#141414" />
    <Box x={40} y={74} z={58} w={56} d={4} h={6} c="#141414" />
    <Box x={112} y={26} z={55} w={30} d={26} h={3} c="#1d4ed8" />
    <Box x={116} y={30} z={58} w={18} d={16} h={14} c="#2563eb" />
    <Cyl cx={165} cy={42} z={55} r={9} h={9} side="#161616" top="#2a2a2a" />
    <Box x={34} y={92} z={55} w={90} d={30} h={6} c="#f4f4f0" />
    <OnTop x={38} y={96} z={61}>
      {Array.from({ length: 14 }, (_, i) =>
        [0, 1, 3, 4].map((j) => <rect key={`${i}-${j}`} x={i * 6} y={j * 5} width={1.6} height={1.6} fill="#9a9a9a" />),
      )}
      <rect x={0} y={11} width={82} height={1.2} fill="#cfcfcf" />
    </OnTop>
    <Wire path={[[60, 78, 64], [64, 88, 66], [70, 96, 62]]} color="#ef4444" />
    <Wire path={[[80, 78, 64], [86, 88, 67], [92, 100, 62]]} color="#22c55e" />
    <Wire path={[[96, 40, 64], [106, 40, 66], [116, 38, 60]]} color="#facc15" />
  </g>
)

const tank = (
  <g>
    <Cyl cx={145} cy={118} z={55} r={7} h={14} side="#1b1b1b" top="#333" />
    <Cyl cx={175} cy={100} z={55} r={18} h={34} side="url(#afx-water)" top="#bfe3ff" opacity={0.95} />
    <Cyl cx={175} cy={100} z={89} r={6} h={3} side="#dcdcdc" top="#f1f1f1" />
    <Wire path={[[145, 118, 69], [150, 135, 74], [200, 142, 80], [240, 128, 88], [262, 116, 94]]} color="#cfe8ff" width={3} opacity={0.9} />
  </g>
)

const shell = (
  <g>
    <Box x={0} y={0} z={26} w={220} d={140} h={66} c="#262626" top="#e2672d" />
    <OnTop x={128} y={30} z={92}>
      <rect x={0} y={0} width={78} height={40} rx={3} fill="#1d2a6b" />
      <text x={39} y={24} textAnchor="middle" fill="#fff" fontFamily="Inter Tight, sans-serif" fontWeight={700} fontSize={16} letterSpacing={2}>
        AFIS
      </text>
      <text x={39} y={34} textAnchor="middle" fill="#cbd5ff" fontFamily="Inter Tight, sans-serif" fontSize={4.6}>
        ADVANCED FERTILIZER IRRIGATION
      </text>
    </OnTop>
    <Box x={36} y={38} z={92} w={76} d={38} h={3} c="#15803d" />
    <Box x={40} y={42} z={95} w={68} d={30} h={2} c="#141414" />
    <OnTop x={44} y={46} z={97}>
      <rect x={0} y={0} width={60} height={22} fill="#9be15d" />
      <text x={3} y={9} fill="#1f3d0c" fontFamily="ui-monospace, monospace" fontSize={7}>
        MOIST 42% OK
      </text>
      <text x={3} y={18} fill="#1f3d0c" fontFamily="ui-monospace, monospace" fontSize={7}>
        N18 P12 K20
      </text>
    </OnTop>
  </g>
)

const arm = (
  <g>
    <Box x={128} y={98} z={92} w={44} d={22} h={3} c="#1a1a1a" />
    <Box x={132} y={101} z={95} w={16} d={16} h={3} c="#c0c0c0" />
    <Box x={180} y={100} z={92} w={22} d={22} h={16} c="#1f5fe0" />
    <Box x={186} y={106} z={108} w={10} d={10} h={3} c="#f1f1f1" />
    <Box x={186} y={106} z={111} w={10} d={10} h={40} c="#1a1a1a" />
    <Box x={182} y={102} z={150} w={18} d={18} h={12} c="#1f5fe0" />
    <Box x={198} y={106} z={154} w={72} d={10} h={8} c="#1a1a1a" />
    <Box x={262} y={102} z={146} w={18} d={18} h={14} c="#1f5fe0" />
    <Box x={266} y={106} z={108} w={10} d={10} h={38} c="#1a1a1a" />
    <Box x={264} y={108} z={52} w={3} d={6} h={44} c="#caa24a" />
    <Box x={271} y={108} z={52} w={3} d={6} h={44} c="#caa24a" />
    <Box x={260} y={100} z={96} w={22} d={22} h={12} c="#1f5fe0" />
    <Box x={282} y={108} z={100} w={6} d={4} h={4} c="#444" />
    {[0, 1, 2].map((i) => (
      <Box key={i} x={287 + i * 5} y={109} z={50} w={2.5} d={2.5} h={42} c="#d9d9d9" />
    ))}
    <Box x={284} y={102} z={90} w={16} d={16} h={16} c="#141414" />
  </g>
)

const cam = (
  <g>
    <Box x={16} y={14} z={92} w={6} d={6} h={60} c="#1a1a1a" />
    <Box x={8} y={14} z={152} w={28} d={6} h={34} c="#161616" />
    {[20, 22, 24].map((y) => (
      <Disk key={y} cx={22} y={y} cz={170} r={7} fill="#0b0b0b" />
    ))}
    <Disk cx={22} y={26} cz={170} r={7} fill="#111" stroke="#3a3a3a" sw={1} />
    <Disk cx={22} y={26} cz={170} r={4} fill="#1e3a8a" />
    <Disk cx={21} y={26} cz={172} r={1.4} fill="#c7d2fe" />
    <Box x={29} y={20} z={157} w={4} d={1} h={4} c="#fffbe6" />
  </g>
)

/** Bottom-to-top drawing order (painter's algorithm). */
export const LAYER_ART: LayerArt[] = [
  { id: 'chassis', move: [0, 0, 0], anchor: [179, 154, 18], side: 'r', art: chassis },
  { id: 'power', move: [0, 0, 60], anchor: [76, 55, 44], side: 'l', art: power },
  { id: 'drive', move: [0, 0, 60], anchor: [163, 33, 53], side: 'r', art: drive },
  { id: 'brain', move: [0, 0, 150], anchor: [63, 51, 59], side: 'l', art: brain },
  { id: 'tank', move: [0, -170, 175], anchor: [175, 100, 89], side: 'r', art: tank },
  { id: 'shell', move: [-160, 0, 260], anchor: [74, 57, 97], side: 'l', art: shell },
  { id: 'arm', move: [0, -150, 330], anchor: [234, 111, 162], side: 'r', art: arm },
  { id: 'cam', move: [-90, 0, 380], anchor: [22, 26, 172], side: 'l', art: cam },
]
