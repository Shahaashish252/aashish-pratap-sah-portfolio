// Single source of truth for editable site content.

const WHATSAPP_NUMBER = '9779865015265' // Nepal (+977) 98650 15265
const WHATSAPP_TEXT = "Hi Aashish! I saw your portfolio and I'd like to talk."

export const site = {
  name: 'Aashish Pratap Sah',
  logo: 'AASHISH',
  email: 'shahaashish252@gmail.com',
  location: 'Kathmandu, Nepal',
  college: 'Himalaya College of Engineering',
  social: {
    whatsapp: {
      label: 'WhatsApp',
      display: '+977 98650 15265',
      href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`,
    },
    instagram: {
      label: 'Instagram',
      display: '@aashish.pratap.sah',
      href: 'https://www.instagram.com/aashish.pratap.sah/',
    },
  },
  nav: [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#work' },
    { label: 'Certificates', href: '#certificates' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ],
  hero: {
    eyebrow: 'Robotics · IoT · AI Maker',
    headline: ['Building machines', 'that see, sense', '& respond.'],
    supporting:
      'Civil Engineering student in Kathmandu who builds robots, IoT systems and computer-vision gadgets with Arduino, ESP32 and Python.',
    primaryCta: { label: 'View My Projects', href: '#work' },
    secondaryCta: { label: "Let's Talk", href: '#contact' },
    /** Prints ejected by the hero camera (900×1200 WebP in /public/hero/reel). */
    reel: Array.from({ length: 8 }, (_, i) => `/hero/reel/frame-${String(i + 1).padStart(2, '0')}.webp`),
  },
} as const

export const about = {
  statement: ['I turn ideas into', 'things you can', 'plug in and see work.'],
  body: [
    "I'm Aashish Pratap Sah, a Civil Engineering student at Himalaya College of Engineering in Kathmandu who loves making hardware think. I build with microcontrollers, sensors and a bit of computer vision — from a gesture-controlled smart home to a robot that tests soil and waters crops on its own.",
    "During my time at Xavier International College I took my projects to science exhibitions across Kathmandu, including the Chief of the Army Staff Grand Science Exhibition, the Southwestern Science Exhibition and Xavier's Arduino Robusta, where I won the award for Top Creativity.",
  ],
  education: [
    { place: 'Himalaya College of Engineering', detail: 'Civil Engineering', when: 'Currently studying' },
    { place: 'Xavier International College', detail: 'Kalopul, Kathmandu — robotics & coding clubs', when: 'Previously' },
  ],
  photo: { src: '/work/coas-exhibition.webp', caption: 'Presenting at the COAS Grand Science Exhibition' },
  stats: [
    { value: '3', label: 'Achievement awards' },
    { value: '11', label: 'Certificates earned' },
    { value: '7', label: 'Exhibitions & events' },
    { value: '3', label: 'Featured builds' },
  ],
}

export const marquee = [
  'Arduino',
  'ESP32-CAM',
  'Python',
  'OpenCV',
  'MediaPipe',
  'Robotics',
  'IoT',
  'Sensors',
  'Computer Vision',
  'Electronics',
]

export interface Frame {
  src: string
  alt: string
  caption: string
  /** Optional looping clip shown in place of the still. */
  video?: string
}

export interface Project {
  id: string
  title: string
  subtitle: string
  year: string
  description: string
  highlights: string[]
  stack: string[]
  award?: { label: string; certificate: string }
  frames: Frame[]
}

export const projects: Project[] = [
  {
    id: 'afis',
    title: 'AFIS',
    subtitle: 'Advanced Fertilizer Irrigation System',
    year: '2025',
    description:
      'A smart-farming robot that drives to a plant, reads the soil and decides what it needs. An ESP32-CAM spots plants that need attention, a 4-servo arm pushes moisture and NPK sensors into the root zone, and the system waters or fertilises automatically.',
    highlights: [
      'ESP32-CAM image check flags dry or nutrient-poor plants',
      'Robotic arm (4 servos) places soil-moisture & NPK sensors',
      'Auto-irrigation via relay-driven pump; live readings on a 16×2 LCD',
      'Wireless car platform on ESP8266 + L298N to cover the field',
    ],
    stack: ['ESP32-CAM', 'ESP8266', 'Arduino Uno', 'NPK sensor', 'Servo arm', 'L298N', 'Relay + pump'],
    award: { label: 'Showcased at Xavier Level Up Expo 2025', certificate: 'level-up-expo' },
    frames: [
      { src: '/work/afis-robot-expo.webp', alt: 'AFIS robot car driving on the expo floor', caption: 'On the expo floor' },
      { src: '/work/afis-arm-closeup.webp', alt: 'Close-up of the AFIS robotic arm over a plant pot', caption: 'Arm over the plant' },
      { src: '/work/afis-team.webp', alt: 'Aashish and team beside the AFIS robot at Xavier Level Up Expo', caption: 'Team at Level Up Expo' },
      { src: '/work/afis-prototype.webp', alt: 'Early AFIS prototype chassis with batteries and motor drivers', caption: 'First prototype' },
      { src: '/work/afis-featured.webp', alt: 'Xavier college website article featuring the Level Up Expo', caption: 'Featured by Xavier' },
    ],
  },
  {
    id: 'gesture',
    title: 'Gesture Control',
    subtitle: 'Smart Home with Hand Gestures',
    year: '2025',
    description:
      'Raise a finger, switch a light. A webcam tracks my hand with MediaPipe, Python turns each finger into a 1 or 0, and an Arduino lights five LEDs to match — the prototype for a touch-free smart-home controller.',
    highlights: [
      'Real-time hand tracking with OpenCV + MediaPipe',
      'Finger states sent as a 5-bit pattern over serial',
      'Arduino maps each finger to its own LED / appliance',
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Arduino Uno', 'Serial'],
    award: { label: 'Certificate of Achievement — 13th Southwestern Science Exhibition', certificate: 'southwestern-achievement' },
    frames: [
      { src: '/work/gesture-1.webp', alt: 'Laptop tracking a hand while LEDs respond', caption: 'Live demo', video: '/work/gesture-demo.mp4' },
      { src: '/work/gesture-2.webp', alt: 'Hand tracking window with finger pattern overlay', caption: 'Finger pattern' },
      { src: '/work/gesture-3.webp', alt: 'LEDs on the breadboard lit by gesture', caption: 'LEDs respond' },
    ],
  },
  {
    id: 'joystick',
    title: 'Joystick Play',
    subtitle: 'Hardware Game Controller',
    year: '2025',
    description:
      'A physical joystick for browser games. The Arduino reads the stick, sends UP / DOWN / LEFT / RIGHT over serial, and a Python script presses the matching keys — enough to play Chrome’s Dino game and 2048 without touching the keyboard.',
    highlights: [
      'Analog joystick read on A0/A1 with dead-zone threshold',
      'Directions streamed over serial at 9600 baud',
      'PyAutoGUI turns them into real key presses',
    ],
    stack: ['Arduino Uno', 'Python', 'PySerial', 'PyAutoGUI'],
    frames: [{ src: '/work/joystick-setup.webp', alt: 'Laptop running a game controlled by an Arduino joystick', caption: 'Playing with the stick' }],
  },
]

export type CertificateKind = 'Achievement' | 'Participation' | 'Course'

export interface Certificate {
  id: string
  title: string
  issuer: string
  date: string
  kind: CertificateKind
  note?: string
  src: string
}

/** Ordered by priority: awards first, then events, then online courses. */
export const certificates: Certificate[] = [
  { id: 'robusta-3-top-creativity', kind: 'Achievement', title: 'Top Creativity — Arduino Robusta 3.0', issuer: 'Xavier Science & Robotics Club', date: 'Dec 2024', note: 'Awarded for securing Top Creativity at the inter-college Arduino competition.', src: '/certs/robusta-3-top-creativity.webp' },
  { id: 'southwestern-achievement', kind: 'Achievement', title: 'Certificate of Achievement — 13th Southwestern Science Exhibition', issuer: 'Southwestern State College', date: 'Feb 2025', note: 'For the project “Gesture Control Smart Home System” in the inter-college competition.', src: '/certs/southwestern-achievement.webp' },
  { id: 'coas-scholastic', kind: 'Achievement', title: 'Scholastic Appreciation — COAS Grand Science Exhibition (5th)', issuer: 'Ripumardini Sainik Mahavidyalaya', date: 'Falgun 2081 (Feb 2025)', note: 'Certificate of honour from the Chief of the Army Staff Grand Science Exhibition.', src: '/certs/coas-scholastic.webp' },
  { id: 'level-up-expo', kind: 'Participation', title: 'Xavier Level Up Expo 2025', issuer: 'Xavier International College', date: 'Feb 2025', note: 'Exhibited AFIS at the college expo celebrating science, business and IT.', src: '/certs/level-up-expo.webp' },
  { id: 'xfest-3', kind: 'Participation', title: 'X-Fest 3.0 — Project Demonstration 2025', issuer: 'Kathmandu Model Secondary School', date: 'Feb 2025', src: '/certs/xfest-3.webp' },
  { id: 'robusta-2', kind: 'Participation', title: 'Xavier Arduino Robusta 2.0', issuer: 'Xavier Science & Robotics Club', date: 'Feb 2024', src: '/certs/robusta-2.webp' },
  { id: 'cyber-security', kind: 'Participation', title: 'Workshop on Cyber Security & Safeguarding the Digital World', issuer: 'Xavier Computer & Coding Club', date: 'Dec 2023', src: '/certs/cyber-security.webp' },
  { id: 'wolfram-circuits', kind: 'Course', title: 'Electric Circuits — Level 1', issuer: 'Wolfram U', date: 'Oct 2025', src: '/certs/wolfram-circuits.webp' },
  { id: 'logic-gates', kind: 'Course', title: 'Logic Gate Expression Techniques', issuer: 'MindLuster', date: 'Oct 2025', src: '/certs/logic-gates.webp' },
  { id: 'cisco-hardware', kind: 'Course', title: 'Computer Hardware Basics', issuer: 'Cisco Networking Academy', date: 'Sep 2025', src: '/certs/cisco-hardware.webp' },
  { id: 'gemini', kind: 'Course', title: 'Introduction to Google Gemini', issuer: 'Simplilearn SkillUp', date: 'Sep 2025', src: '/certs/gemini.webp' },
]

export const skills = [
  {
    group: 'Hardware & Electronics',
    items: ['Arduino Uno', 'ESP32 / ESP32-CAM', 'ESP8266', 'Servo & BO motors', 'L298N motor driver', 'Relays & pumps', 'Soil-moisture & NPK sensors', 'I2C LCD displays'],
  },
  {
    group: 'Code & Vision',
    items: ['Python', 'Arduino C/C++', 'OpenCV', 'MediaPipe', 'PySerial', 'PyAutoGUI'],
  },
  {
    group: 'Foundations',
    items: ['Robotics', 'IoT systems', 'Electric circuits', 'Logic gates', 'Computer hardware', 'Cyber-security basics', 'Generative AI (Gemini)'],
  },
]
