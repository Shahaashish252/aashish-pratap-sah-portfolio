// Content for the AFIS exploded-view diagram. Layers are listed in the
// order they come off the robot while scrolling (top of the robot first).

export interface AfisPart {
  name: string
  detail: string
}

export interface AfisLayer {
  id: 'cam' | 'arm' | 'shell' | 'tank' | 'brain' | 'drive' | 'power' | 'chassis'
  title: string
  short: string
  role: string
  parts: AfisPart[]
}

export const afisLayers: AfisLayer[] = [
  {
    id: 'cam',
    title: 'Vision',
    short: 'ESP32-CAM',
    role: 'Looks at the plants, compares each photo with a stored set of healthy, dry and nutrient-poor plants, and picks the one that needs help.',
    parts: [
      { name: 'ESP32-CAM module', detail: 'OV2640 camera + Wi-Fi on one small board' },
      { name: 'Camera mast', detail: 'Lifts the lens above the body for a clear view' },
      { name: 'TTL programmer', detail: 'Used to flash the code onto the ESP32-CAM' },
    ],
  },
  {
    id: 'arm',
    title: 'Robotic Arm',
    short: 'ESP32 + 4 servos',
    role: 'Swings out over the plant, digs into the soil and holds the probes at root depth so the readings are accurate.',
    parts: [
      { name: 'ESP32 controller', detail: 'Drives all four servos' },
      { name: '4 × servo motor', detail: 'Base, shoulder, elbow and wrist joints' },
      { name: 'Soil-moisture sensor', detail: 'Measures how wet the soil is' },
      { name: 'NPK sensor', detail: 'Reads Nitrogen, Phosphorus and Potassium levels' },
    ],
  },
  {
    id: 'shell',
    title: 'Body & Display',
    short: '16×2 LCD + I2C',
    role: 'The ply-board body protects the electronics; the LCD on top shows live moisture and N-P-K readings in the field.',
    parts: [
      { name: '16×2 LCD', detail: 'Green alphanumeric display for live readings' },
      { name: 'I2C module', detail: 'Connects the LCD with just two wires' },
      { name: 'Ply-board body', detail: 'Cut and glued by hand, black paper finish' },
    ],
  },
  {
    id: 'tank',
    title: 'Irrigation',
    short: 'Tank · pump · pipe',
    role: 'When the soil is dry the pump pushes water from the tank through the pipe straight to the root zone; the same line dispenses fertilizer.',
    parts: [
      { name: 'Water tank', detail: 'Stores water / liquid fertilizer on board' },
      { name: 'Mini water pump', detail: 'Switched on by the relay' },
      { name: '2N2222 transistor', detail: 'Handles the pump’s higher current' },
      { name: 'Water pipe', detail: 'Carries water to the plant’s roots' },
    ],
  },
  {
    id: 'brain',
    title: 'Sensing Brain',
    short: 'Arduino Uno',
    role: 'Reads the moisture and NPK sensors, updates the LCD, and switches the pump through the relay when the soil needs water.',
    parts: [
      { name: 'Arduino Uno', detail: 'Main controller for sensing and irrigation' },
      { name: 'Single-channel relay', detail: 'Acts as the pump’s on/off switch' },
      { name: 'Buzzer', detail: 'Alerts on low battery or system errors' },
      { name: 'Breadboard + jumpers', detail: 'Prototyping connections between boards' },
    ],
  },
  {
    id: 'drive',
    title: 'Mobility Control',
    short: 'ESP8266 + L298N',
    role: 'The ESP8266 takes movement commands over Wi-Fi and the L298N driver sets the speed and direction of all four motors.',
    parts: [
      { name: 'ESP8266 (NodeMCU)', detail: 'Wi-Fi controller for the car' },
      { name: 'L298N motor driver', detail: 'Dual H-bridge for the BO motors' },
    ],
  },
  {
    id: 'power',
    title: 'Power',
    short: 'Li-ion pack',
    role: 'Rechargeable Li-ion cells power every board and motor; the charging module keeps the pack safe while it charges.',
    parts: [
      { name: 'Li-ion batteries + holder', detail: 'Main power for the whole robot' },
      { name: 'TP4056 charging module', detail: 'Safe charging for the Li-ion cells' },
      { name: 'Power switch', detail: 'Turns the whole system on and off' },
    ],
  },
  {
    id: 'chassis',
    title: 'Chassis',
    short: 'Motors & wheels',
    role: 'A ply-board base on four geared motors lets AFIS roll across the field from plant to plant.',
    parts: [
      { name: '4 × BO gear motor', detail: 'Yellow geared DC motors' },
      { name: '4 × BO wheel', detail: 'Rubber-tyred wheels' },
      { name: 'Ply-board base', detail: 'Holds every layer above it' },
    ],
  },
]

export const afisFlow = [
  'Switch on — the Li-ion pack powers every board.',
  'ESP32-CAM scans the plants and flags ones that look dry or under-fed.',
  'ESP8266 + L298N drive the car to that plant.',
  'The ESP32 arm lowers the moisture & NPK probes into the root zone.',
  'Arduino Uno reads the soil and shows it on the LCD.',
  'Dry soil → relay starts the pump. Low NPK → fertilizer is dispensed.',
  'The buzzer warns about low battery or errors.',
]
