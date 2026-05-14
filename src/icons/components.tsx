import {
  createGlassIcon,
  type GlassIconNode,
  type GlassIconProps,
} from "./createGlassIcon";

export type {
  GlassIcon as GlassIconComponent,
  GlassIconNode,
  GlassIconProps,
} from "./createGlassIcon";

const check: GlassIconNode[] = [["path", { d: "m5 12 4 4L19 6" }]];
const x: GlassIconNode[] = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }],
];
const circle: GlassIconNode[] = [["circle", { cx: 12, cy: 12, r: 9 }]];
const square: GlassIconNode[] = [
  ["rect", { x: 5, y: 5, width: 14, height: 14, rx: 2 }],
];
const dotCircle: GlassIconNode[] = [
  ...circle,
  ["circle", { cx: 12, cy: 12, r: 2, fill: "currentColor", stroke: "none" }],
];
const alertCircle: GlassIconNode[] = [
  ...circle,
  ["path", { d: "M12 7v6" }],
  ["path", { d: "M12 17h.01" }],
];
const alertTriangle: GlassIconNode[] = [
  ["path", { d: "M12 3 22 20H2L12 3Z" }],
  ["path", { d: "M12 9v5" }],
  ["path", { d: "M12 17h.01" }],
];
const chevronRight: GlassIconNode[] = [["path", { d: "m9 18 6-6-6-6" }]];
const chevronLeft: GlassIconNode[] = [["path", { d: "m15 18-6-6 6-6" }]];
const chevronDown: GlassIconNode[] = [["path", { d: "m6 9 6 6 6-6" }]];
const chevronUp: GlassIconNode[] = [["path", { d: "m18 15-6-6-6 6" }]];
const arrowRight: GlassIconNode[] = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "m13 6 6 6-6 6" }],
];
const arrowUp: GlassIconNode[] = [
  ["path", { d: "M12 19V5" }],
  ["path", { d: "m6 11 6-6 6 6" }],
];
const arrowDown: GlassIconNode[] = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "m6 13 6 6 6-6" }],
];
const plus: GlassIconNode[] = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "M5 12h14" }],
];
const minus: GlassIconNode[] = [["path", { d: "M5 12h14" }]];
const search: GlassIconNode[] = [
  ["circle", { cx: 11, cy: 11, r: 7 }],
  ["path", { d: "m20 20-4.2-4.2" }],
];
const calendar: GlassIconNode[] = [
  ["rect", { x: 3, y: 4, width: 18, height: 17, rx: 2 }],
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M3 10h18" }],
];
const clock: GlassIconNode[] = [...circle, ["path", { d: "M12 7v5l3 2" }]];
const user: GlassIconNode[] = [
  ["circle", { cx: 12, cy: 8, r: 4 }],
  ["path", { d: "M5 21a7 7 0 0 1 14 0" }],
];
const users: GlassIconNode[] = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: 9, cy: 7, r: 4 }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }],
];
const file: GlassIconNode[] = [
  ["path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" }],
  ["path", { d: "M14 2v6h6" }],
];
const folder: GlassIconNode[] = [
  [
    "path",
    {
      d: "M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z",
    },
  ],
];
const image: GlassIconNode[] = [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["circle", { cx: 8, cy: 10, r: 1.5 }],
  ["path", { d: "m21 16-5-5L5 19" }],
];
const video: GlassIconNode[] = [
  ["rect", { x: 3, y: 6, width: 13, height: 12, rx: 2 }],
  ["path", { d: "m16 10 5-3v10l-5-3Z" }],
];
const mail: GlassIconNode[] = [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "m3 7 9 6 9-6" }],
];
const home: GlassIconNode[] = [
  ["path", { d: "m3 11 9-8 9 8" }],
  ["path", { d: "M5 10v10h14V10" }],
  ["path", { d: "M10 20v-6h4v6" }],
];
const settings: GlassIconNode[] = [
  ["circle", { cx: 12, cy: 12, r: 3 }],
  ["path", { d: "M12 2v3" }],
  ["path", { d: "M12 19v3" }],
  ["path", { d: "M2 12h3" }],
  ["path", { d: "M19 12h3" }],
  ["path", { d: "m4.9 4.9 2.1 2.1" }],
  ["path", { d: "m17 17 2.1 2.1" }],
  ["path", { d: "m19.1 4.9-2.1 2.1" }],
  ["path", { d: "m7 17-2.1 2.1" }],
];
const star: GlassIconNode[] = [
  [
    "path",
    {
      d: "m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6.1 20l1.1-6.5L2.5 8.9 9 8Z",
    },
  ],
];
const heart: GlassIconNode[] = [
  [
    "path",
    {
      d: "M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
    },
  ],
];
const bell: GlassIconNode[] = [
  ["path", { d: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" }],
  ["path", { d: "M10 21h4" }],
];
const chartBars: GlassIconNode[] = [
  ["path", { d: "M4 19V9" }],
  ["path", { d: "M12 19V5" }],
  ["path", { d: "M20 19v-7" }],
];
const lineChart: GlassIconNode[] = [
  ["path", { d: "M3 19h18" }],
  ["path", { d: "m5 15 4-4 4 3 6-8" }],
];
const activity: GlassIconNode[] = [["path", { d: "M3 12h4l3-8 4 16 3-8h4" }]];
const trendingUp: GlassIconNode[] = [
  ["path", { d: "m3 17 6-6 4 4 8-8" }],
  ["path", { d: "M14 7h7v7" }],
];
const trendingDown: GlassIconNode[] = [
  ["path", { d: "m3 7 6 6 4-4 8 8" }],
  ["path", { d: "M14 17h7v-7" }],
];
const target: GlassIconNode[] = [
  ...circle,
  ["circle", { cx: 12, cy: 12, r: 5 }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
];
const zap: GlassIconNode[] = [["path", { d: "M13 2 4 14h7l-1 8 10-13h-7Z" }]];
const palette: GlassIconNode[] = [
  [
    "path",
    {
      d: "M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h1a8 8 0 0 0-1-9Z",
    },
  ],
  [
    "circle",
    { cx: 7.5, cy: 10.5, r: 0.7, fill: "currentColor", stroke: "none" },
  ],
  ["circle", { cx: 10, cy: 7.5, r: 0.7, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 14, cy: 7.5, r: 0.7, fill: "currentColor", stroke: "none" }],
];
const eye: GlassIconNode[] = [
  ["path", { d: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" }],
  ["circle", { cx: 12, cy: 12, r: 3 }],
];
const eyeOff: GlassIconNode[] = [
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M10.6 10.6a2 2 0 0 0 2.8 2.8" }],
  ["path", { d: "M6.4 6.4C3.7 8.2 2 12 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2" }],
  ["path", { d: "M14 5.2c4.9 1 8 6.8 8 6.8a17.5 17.5 0 0 1-2.2 3.1" }],
];
const lock: GlassIconNode[] = [
  ["rect", { x: 5, y: 11, width: 14, height: 10, rx: 2 }],
  ["path", { d: "M8 11V7a4 4 0 0 1 8 0v4" }],
];
const unlock: GlassIconNode[] = [
  ["rect", { x: 5, y: 11, width: 14, height: 10, rx: 2 }],
  ["path", { d: "M8 11V7a4 4 0 0 1 7.5-2" }],
];
const upload: GlassIconNode[] = [
  ["path", { d: "M12 16V4" }],
  ["path", { d: "m6 10 6-6 6 6" }],
  ["path", { d: "M4 20h16" }],
];
const download: GlassIconNode[] = [
  ["path", { d: "M12 4v12" }],
  ["path", { d: "m6 10 6 6 6-6" }],
  ["path", { d: "M4 20h16" }],
];
const cloud: GlassIconNode[] = [
  [
    "path",
    { d: "M17.5 19H7a5 5 0 0 1-.5-10 7 7 0 0 1 13.4 2.2A4 4 0 0 1 17.5 19Z" },
  ],
];
const code: GlassIconNode[] = [
  ["path", { d: "m8 16-4-4 4-4" }],
  ["path", { d: "m16 8 4 4-4 4" }],
  ["path", { d: "m14 4-4 16" }],
];
const database: GlassIconNode[] = [
  ["ellipse", { cx: 12, cy: 5, rx: 8, ry: 3 }],
  ["path", { d: "M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" }],
  ["path", { d: "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" }],
];
const copy: GlassIconNode[] = [
  ["rect", { x: 9, y: 9, width: 12, height: 12, rx: 2 }],
  ["path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }],
];
const trash: GlassIconNode[] = [
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M8 6V4h8v2" }],
  ["path", { d: "M19 6 18 21H6L5 6" }],
  ["path", { d: "M10 11v6" }],
  ["path", { d: "M14 11v6" }],
];
const refresh: GlassIconNode[] = [
  ["path", { d: "M21 12a9 9 0 0 1-15 6.7L3 16" }],
  ["path", { d: "M3 12a9 9 0 0 1 15-6.7L21 8" }],
  ["path", { d: "M3 21v-5h5" }],
  ["path", { d: "M21 3v5h-5" }],
];
const rotateCcw: GlassIconNode[] = [
  ["path", { d: "M3 12a9 9 0 1 0 3-6.7L3 8" }],
  ["path", { d: "M3 3v5h5" }],
];
const rotateCw: GlassIconNode[] = [
  ["path", { d: "M21 12a9 9 0 1 1-3-6.7L21 8" }],
  ["path", { d: "M21 3v5h-5" }],
];
const play: GlassIconNode[] = [["path", { d: "m8 5 12 7-12 7Z" }]];
const pause: GlassIconNode[] = [
  ["path", { d: "M8 5v14" }],
  ["path", { d: "M16 5v14" }],
];
const mic: GlassIconNode[] = [
  ["rect", { x: 9, y: 2, width: 6, height: 12, rx: 3 }],
  ["path", { d: "M5 10a7 7 0 0 0 14 0" }],
  ["path", { d: "M12 17v5" }],
  ["path", { d: "M8 22h8" }],
];
const micOff: GlassIconNode[] = [...mic, ["path", { d: "m2 2 20 20" }]];
const message: GlassIconNode[] = [
  ["path", { d: "M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-5A8 8 0 1 1 21 12Z" }],
];
const moreHorizontal: GlassIconNode[] = [
  ["circle", { cx: 6, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 18, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
];
const moreVertical: GlassIconNode[] = [
  ["circle", { cx: 12, cy: 6, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 12, r: 1, fill: "currentColor", stroke: "none" }],
  ["circle", { cx: 12, cy: 18, r: 1, fill: "currentColor", stroke: "none" }],
];
const menu: GlassIconNode[] = [
  ["path", { d: "M4 6h16" }],
  ["path", { d: "M4 12h16" }],
  ["path", { d: "M4 18h16" }],
];
const mapPin: GlassIconNode[] = [
  ["path", { d: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" }],
  ["circle", { cx: 12, cy: 10, r: 3 }],
];
const shield: GlassIconNode[] = [
  ["path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" }],
];
const sparkles: GlassIconNode[] = [
  ["path", { d: "m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" }],
  ["path", { d: "m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z" }],
];
const sun: GlassIconNode[] = [
  ["circle", { cx: 12, cy: 12, r: 4 }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "m4.9 4.9 1.4 1.4" }],
  ["path", { d: "m17.7 17.7 1.4 1.4" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "m4.9 19.1 1.4-1.4" }],
  ["path", { d: "m17.7 6.3 1.4-1.4" }],
];
const moon: GlassIconNode[] = [
  ["path", { d: "M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z" }],
];
const volume: GlassIconNode[] = [
  ["path", { d: "M11 5 6 9H3v6h3l5 4Z" }],
  ["path", { d: "M15 9a5 5 0 0 1 0 6" }],
];
const volume2: GlassIconNode[] = [
  ...volume,
  ["path", { d: "M18 6a9 9 0 0 1 0 12" }],
];
const maximize: GlassIconNode[] = [
  ["path", { d: "M8 3H3v5" }],
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M21 16v5h-5" }],
  ["path", { d: "M3 16v5h5" }],
];
const minimize: GlassIconNode[] = [
  ["path", { d: "M8 3v5H3" }],
  ["path", { d: "M16 3v5h5" }],
  ["path", { d: "M21 16h-5v5" }],
  ["path", { d: "M3 16h5v5" }],
];
const send: GlassIconNode[] = [
  ["path", { d: "M22 2 11 13" }],
  ["path", { d: "m22 2-7 20-4-9-9-4Z" }],
];
const paperclip: GlassIconNode[] = [
  [
    "path",
    {
      d: "m21 12-8.5 8.5a6 6 0 0 1-8.5-8.5L13 3a4 4 0 0 1 5.7 5.7l-9 9a2 2 0 0 1-2.8-2.8L15 6.8",
    },
  ],
];
const bold: GlassIconNode[] = [
  ["path", { d: "M7 5h6a4 4 0 0 1 0 8H7Z" }],
  ["path", { d: "M7 13h7a4 4 0 0 1 0 8H7Z" }],
  ["path", { d: "M7 5v16" }],
];
const italic: GlassIconNode[] = [
  ["path", { d: "M11 5h6" }],
  ["path", { d: "M7 19h6" }],
  ["path", { d: "m14 5-4 14" }],
];
const underline: GlassIconNode[] = [
  ["path", { d: "M7 5v6a5 5 0 0 0 10 0V5" }],
  ["path", { d: "M5 21h14" }],
];
const grid: GlassIconNode[] = [
  ["rect", { x: 3, y: 3, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 14, y: 3, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 3, y: 14, width: 7, height: 7, rx: 1 }],
  ["rect", { x: 14, y: 14, width: 7, height: 7, rx: 1 }],
];
const list: GlassIconNode[] = [
  ["path", { d: "M8 6h13" }],
  ["path", { d: "M8 12h13" }],
  ["path", { d: "M8 18h13" }],
  ["path", { d: "M3 6h.01" }],
  ["path", { d: "M3 12h.01" }],
  ["path", { d: "M3 18h.01" }],
];

export const Accessibility = createGlassIcon("Accessibility", [
  ...circle,
  ["path", { d: "M12 7v10" }],
  ["path", { d: "M8 10h8" }],
  ["path", { d: "m9 21 3-6 3 6" }],
]);
export const Activity = createGlassIcon("Activity", activity);
export const AlertCircle = createGlassIcon("AlertCircle", alertCircle);
export const AlertTriangle = createGlassIcon("AlertTriangle", alertTriangle);
export const Archive = createGlassIcon("Archive", [
  ["path", { d: "M3 5h18v4H3Z" }],
  ["path", { d: "M5 9v10h14V9" }],
  ["path", { d: "M10 13h4" }],
]);
export const ArrowRight = createGlassIcon("ArrowRight", arrowRight);
export const ArrowUp = createGlassIcon("ArrowUp", arrowUp);
export const ArrowDown = createGlassIcon("ArrowDown", arrowDown);
export const BarChart3 = createGlassIcon("BarChart3", chartBars);
export const Bell = createGlassIcon("Bell", bell);
export const Bold = createGlassIcon("Bold", bold);
export const BookOpen = createGlassIcon("BookOpen", [
  ["path", { d: "M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3Z" }],
  ["path", { d: "M4 5v17" }],
]);
export const Brain = createGlassIcon("Brain", [
  [
    "path",
    {
      d: "M8 6a4 4 0 0 1 8 0 4 4 0 0 1 2 7 4 4 0 0 1-4 6h-4a4 4 0 0 1-4-6 4 4 0 0 1 2-7Z",
    },
  ],
  ["path", { d: "M12 4v16" }],
]);
export const Building2 = createGlassIcon("Building2", [
  ["rect", { x: 4, y: 3, width: 16, height: 18, rx: 2 }],
  ["path", { d: "M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01" }],
]);
export const Calendar = createGlassIcon("Calendar", calendar);
export const Camera = createGlassIcon("Camera", [
  [
    "path",
    {
      d: "M5 7h3l2-3h4l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z",
    },
  ],
  ["circle", { cx: 12, cy: 13, r: 4 }],
]);
export const Check = createGlassIcon("Check", check);
export const CheckCheck = createGlassIcon("CheckCheck", [
  ["path", { d: "m3 12 3 3 6-6" }],
  ["path", { d: "m11 12 3 3 7-8" }],
]);
export const CheckCircle = createGlassIcon("CheckCircle", [
  ...circle,
  ...check,
]);
export const CheckCircle2 = CheckCircle;
export const ChevronDown = createGlassIcon("ChevronDown", chevronDown);
export const ChevronLeft = createGlassIcon("ChevronLeft", chevronLeft);
export const ChevronRight = createGlassIcon("ChevronRight", chevronRight);
export const ChevronUp = createGlassIcon("ChevronUp", chevronUp);
export const ChevronsLeft = createGlassIcon("ChevronsLeft", [
  ["path", { d: "m11 17-5-5 5-5" }],
  ["path", { d: "m18 17-5-5 5-5" }],
]);
export const ChevronsRight = createGlassIcon("ChevronsRight", [
  ["path", { d: "m6 17 5-5-5-5" }],
  ["path", { d: "m13 17 5-5-5-5" }],
]);
export const Circle = createGlassIcon("Circle", circle);
export const ClipboardPaste = createGlassIcon("ClipboardPaste", [
  ["path", { d: "M9 3h6l1 2h3v16H5V5h3Z" }],
  ["path", { d: "M9 13h6" }],
  ["path", { d: "m12 10 3 3-3 3" }],
]);
export const Clock = createGlassIcon("Clock", clock);
export const Cloud = createGlassIcon("Cloud", cloud);
export const CloudUpload = createGlassIcon("CloudUpload", [
  ...cloud,
  ["path", { d: "M12 16V9" }],
  ["path", { d: "m8 13 4-4 4 4" }],
]);
export const Code = createGlassIcon("Code", code);
export const Code2 = Code;
export const Columns3 = createGlassIcon("Columns3", [
  ["rect", { x: 3, y: 4, width: 18, height: 16, rx: 2 }],
  ["path", { d: "M9 4v16" }],
  ["path", { d: "M15 4v16" }],
]);
export const Contrast = createGlassIcon("Contrast", [
  ...circle,
  [
    "path",
    { d: "M12 3a9 9 0 0 0 0 18Z", fill: "currentColor", stroke: "none" },
  ],
]);
export const Copy = createGlassIcon("Copy", copy);
export const Cpu = createGlassIcon("Cpu", [
  ["rect", { x: 8, y: 8, width: 8, height: 8, rx: 1 }],
  [
    "path",
    { d: "M4 10h4M4 14h4M16 10h4M16 14h4M10 4v4M14 4v4M10 16v4M14 16v4" },
  ],
]);
export const CreditCard = createGlassIcon("CreditCard", [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "M3 10h18" }],
]);
export const Crown = createGlassIcon("Crown", [
  ["path", { d: "m3 7 5 4 4-7 4 7 5-4-2 12H5Z" }],
]);
export const Database = createGlassIcon("Database", database);
export const Diamond = createGlassIcon("Diamond", [
  ["path", { d: "m12 2 9 10-9 10L3 12Z" }],
]);
export const DollarSign = createGlassIcon("DollarSign", [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" }],
]);
export const Download = createGlassIcon("Download", download);
export const Droplets = createGlassIcon("Droplets", [
  ["path", { d: "M7 3s5 5 5 9a5 5 0 0 1-10 0c0-4 5-9 5-9Z" }],
  ["path", { d: "M17 8s4 4 4 7a4 4 0 0 1-8 0c0-3 4-7 4-7Z" }],
]);
export const Edit = createGlassIcon("Edit", [
  ["path", { d: "M12 20h9" }],
  ["path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" }],
]);
export const Eye = createGlassIcon("Eye", eye);
export const EyeOff = createGlassIcon("EyeOff", eyeOff);
export const File = createGlassIcon("File", file);
export const FileCheck2 = createGlassIcon("FileCheck2", [...file, ...check]);
export const FilePenLine = createGlassIcon("FilePenLine", [
  ...file,
  ["path", { d: "m9 16 6-6 2 2-6 6H9Z" }],
]);
export const FileText = createGlassIcon("FileText", [
  ...file,
  ["path", { d: "M8 12h8" }],
  ["path", { d: "M8 16h6" }],
]);
export const Filter = createGlassIcon("Filter", [
  ["path", { d: "M4 5h16l-6 7v6l-4 2v-8Z" }],
]);
export const Flame = createGlassIcon("Flame", [
  [
    "path",
    { d: "M12 22a7 7 0 0 0 7-7c0-5-4-7-5-12-3 3-8 6-8 12a6 6 0 0 0 6 7Z" },
  ],
]);
export const Flower = createGlassIcon("Flower", [
  ["circle", { cx: 12, cy: 12, r: 2 }],
  [
    "path",
    {
      d: "M12 2c2 3 2 5 0 8-2-3-2-5 0-8ZM12 22c-2-3-2-5 0-8 2 3 2 5 0 8ZM2 12c3-2 5-2 8 0-3 2-5 2-8 0ZM22 12c-3 2-5 2-8 0 3-2 5-2 8 0Z",
    },
  ],
]);
export const Folder = createGlassIcon("Folder", folder);
export const FolderKanban = Folder;
export const FolderOpen = createGlassIcon("FolderOpen", [
  ...folder,
  ["path", { d: "M3 18 6 10h15l-3 8" }],
]);
export const FolderSearch = createGlassIcon("FolderSearch", [
  ...folder,
  ...search,
]);
export const Gauge = createGlassIcon("Gauge", [
  ["path", { d: "M4 14a8 8 0 0 1 16 0" }],
  ["path", { d: "M12 14l4-4" }],
  ["path", { d: "M6 20h12" }],
]);
export const Gift = createGlassIcon("Gift", [
  ["rect", { x: 3, y: 8, width: 18, height: 13, rx: 2 }],
  ["path", { d: "M12 8v13" }],
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M7.5 8A2.5 2.5 0 1 1 12 6a2.5 2.5 0 1 1 4.5 2" }],
]);
export const Globe = createGlassIcon("Globe", [
  ...circle,
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" }],
]);
export const Grid = createGlassIcon("Grid", grid);
export const Grid3X3 = createGlassIcon("Grid3X3", [
  ["path", { d: "M3 3h18v18H3Z" }],
  ["path", { d: "M3 9h18M3 15h18M9 3v18M15 3v18" }],
]);
export const GripVertical = createGlassIcon("GripVertical", [
  ["path", { d: "M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" }],
]);
export const Hand = createGlassIcon("Hand", [
  ["path", { d: "M8 13V5a2 2 0 0 1 4 0v6" }],
  ["path", { d: "M12 11V4a2 2 0 0 1 4 0v8" }],
  ["path", { d: "M16 12V8a2 2 0 0 1 4 0v5a7 7 0 0 1-14 0v-2a2 2 0 0 1 2-2Z" }],
]);
export const HardDrive = createGlassIcon("HardDrive", [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M7 18h.01M11 18h.01" }],
]);
export const Hash = createGlassIcon("Hash", [
  ["path", { d: "M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" }],
]);
export const Heart = createGlassIcon("Heart", heart);
export const HelpCircle = createGlassIcon("HelpCircle", [
  ...circle,
  ["path", { d: "M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" }],
  ["path", { d: "M12 17h.01" }],
]);
export const Hexagon = createGlassIcon("Hexagon", [
  ["path", { d: "M21 16V8l-9-5-9 5v8l9 5Z" }],
]);
export const History = createGlassIcon("History", [
  ["path", { d: "M3 12a9 9 0 1 0 3-6.7L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M12 7v5l3 2" }],
]);
export const Home = createGlassIcon("Home", home);
export const Image = createGlassIcon("Image", image);
export const Info = createGlassIcon("Info", [
  ...circle,
  ["path", { d: "M12 11v5" }],
  ["path", { d: "M12 8h.01" }],
]);
export const Italic = createGlassIcon("Italic", italic);
export const Keyboard = createGlassIcon("Keyboard", [
  ["rect", { x: 3, y: 5, width: 18, height: 14, rx: 2 }],
  ["path", { d: "M7 9h.01M11 9h.01M15 9h.01M17 13H7" }],
]);
export const Layers = createGlassIcon("Layers", [
  ["path", { d: "m12 2 10 5-10 5L2 7Z" }],
  ["path", { d: "m2 12 10 5 10-5" }],
  ["path", { d: "m2 17 10 5 10-5" }],
]);
export const LayoutDashboard = createGlassIcon("LayoutDashboard", [
  ["rect", { x: 3, y: 3, width: 7, height: 9, rx: 1 }],
  ["rect", { x: 14, y: 3, width: 7, height: 5, rx: 1 }],
  ["rect", { x: 14, y: 12, width: 7, height: 9, rx: 1 }],
  ["rect", { x: 3, y: 16, width: 7, height: 5, rx: 1 }],
]);
export const Leaf = createGlassIcon("Leaf", [
  ["path", { d: "M20 3c-8 1-14 7-15 15 8-1 14-7 15-15Z" }],
  ["path", { d: "M5 18 14 9" }],
]);
export const LineChart = createGlassIcon("LineChart", lineChart);
export const Link = createGlassIcon("Link", [
  ["path", { d: "M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" }],
  ["path", { d: "M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" }],
]);
export const List = createGlassIcon("List", list);
export const Loader2 = createGlassIcon("Loader2", [
  ["path", { d: "M21 12a9 9 0 1 1-6.2-8.6" }],
]);
export const Lock = createGlassIcon("Lock", lock);
export const Mail = createGlassIcon("Mail", mail);
export const MapPin = createGlassIcon("MapPin", mapPin);
export const Maximize = createGlassIcon("Maximize", maximize);
export const Maximize2 = Maximize;
export const Menu = createGlassIcon("Menu", menu);
export const MessageCircle = createGlassIcon("MessageCircle", message);
export const MessageSquare = createGlassIcon("MessageSquare", message);
export const MessageSquareText = createGlassIcon("MessageSquareText", [
  ...message,
  ["path", { d: "M8 10h8M8 14h5" }],
]);
export const Mic = createGlassIcon("Mic", mic);
export const MicOff = createGlassIcon("MicOff", micOff);
export const Minimize = createGlassIcon("Minimize", minimize);
export const Minimize2 = Minimize;
export const Minus = createGlassIcon("Minus", minus);
export const Monitor = createGlassIcon("Monitor", [
  ["rect", { x: 3, y: 4, width: 18, height: 13, rx: 2 }],
  ["path", { d: "M8 21h8M12 17v4" }],
]);
export const Moon = createGlassIcon("Moon", moon);
export const MoreHorizontal = createGlassIcon("MoreHorizontal", moreHorizontal);
export const MoreVertical = createGlassIcon("MoreVertical", moreVertical);
export const MousePointer2 = createGlassIcon("MousePointer2", [
  ["path", { d: "m4 3 7 18 2-8 8-2Z" }],
]);
export const Move = createGlassIcon("Move", [
  ["path", { d: "M12 2v20M2 12h20" }],
  ["path", { d: "m15 5-3-3-3 3M15 19l-3 3-3-3M5 9l-3 3 3 3M19 9l3 3-3 3" }],
]);
export const Music = createGlassIcon("Music", [
  ["path", { d: "M9 18V5l12-2v13" }],
  ["circle", { cx: 6, cy: 18, r: 3 }],
  ["circle", { cx: 18, cy: 16, r: 3 }],
]);
export const Palette = createGlassIcon("Palette", palette);
export const PanelsTopLeft = createGlassIcon("PanelsTopLeft", [
  ["rect", { x: 3, y: 3, width: 18, height: 18, rx: 2 }],
  ["path", { d: "M3 9h18M9 9v12" }],
]);
export const Paperclip = createGlassIcon("Paperclip", paperclip);
export const Pause = createGlassIcon("Pause", pause);
export const Phone = createGlassIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1A19.5 19.5 0 0 1 3.2 10.8 19.8 19.8 0 0 1 .1 2.2 2 2 0 0 1 2.1 0h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L5.7 7.8a16 16 0 0 0 6.5 6.5l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 1.7 2Z",
      transform: "translate(1 1) scale(.92)",
    },
  ],
]);
export const PieChart = createGlassIcon("PieChart", [
  ["path", { d: "M12 2v10h10A10 10 0 1 1 12 2Z" }],
  ["path", { d: "M14 2.2A10 10 0 0 1 21.8 10H14Z" }],
]);
export const Play = createGlassIcon("Play", play);
export const Plus = createGlassIcon("Plus", plus);
export const Redo = createGlassIcon("Redo", [
  ["path", { d: "M21 7v6h-6" }],
  ["path", { d: "M3 17a9 9 0 0 1 15-6.7L21 13" }],
]);
export const RefreshCw = createGlassIcon("RefreshCw", refresh);
export const Reply = createGlassIcon("Reply", [
  ["path", { d: "m9 17-6-5 6-5v4h5a7 7 0 0 1 7 7v1" }],
]);
export const RotateCcw = createGlassIcon("RotateCcw", rotateCcw);
export const RotateCw = createGlassIcon("RotateCw", rotateCw);
export const Save = createGlassIcon("Save", [
  ["path", { d: "M5 3h12l2 2v16H5Z" }],
  ["path", { d: "M8 3v6h8V3" }],
  ["path", { d: "M8 21v-7h8v7" }],
]);
export const Search = createGlassIcon("Search", search);
export const Send = createGlassIcon("Send", send);
export const Server = createGlassIcon("Server", [
  ["rect", { x: 4, y: 3, width: 16, height: 8, rx: 2 }],
  ["rect", { x: 4, y: 13, width: 16, height: 8, rx: 2 }],
  ["path", { d: "M8 7h.01M8 17h.01" }],
]);
export const Settings = createGlassIcon("Settings", settings);
export const Share = createGlassIcon("Share", [
  ["path", { d: "M4 12v7h16v-7" }],
  ["path", { d: "M12 3v12" }],
  ["path", { d: "m7 8 5-5 5 5" }],
]);
export const Share2 = createGlassIcon("Share2", [
  ["circle", { cx: 18, cy: 5, r: 3 }],
  ["circle", { cx: 6, cy: 12, r: 3 }],
  ["circle", { cx: 18, cy: 19, r: 3 }],
  ["path", { d: "m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" }],
]);
export const Shield = createGlassIcon("Shield", shield);
export const ShieldCheck = createGlassIcon("ShieldCheck", [
  ...shield,
  ...check,
]);
export const Shuffle = createGlassIcon("Shuffle", [
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M4 20 21 3" }],
  ["path", { d: "M21 16v5h-5" }],
  ["path", { d: "m15 15 6 6" }],
  ["path", { d: "M4 4l5 5" }],
]);
export const SkipBack = createGlassIcon("SkipBack", [
  ["path", { d: "M19 20 9 12l10-8Z" }],
  ["path", { d: "M5 19V5" }],
]);
export const SkipForward = createGlassIcon("SkipForward", [
  ["path", { d: "m5 4 10 8-10 8Z" }],
  ["path", { d: "M19 5v14" }],
]);
export const SlidersHorizontal = createGlassIcon("SlidersHorizontal", [
  ["path", { d: "M3 6h18M3 12h18M3 18h18" }],
  ["circle", { cx: 8, cy: 6, r: 2 }],
  ["circle", { cx: 16, cy: 12, r: 2 }],
  ["circle", { cx: 10, cy: 18, r: 2 }],
]);
export const Smile = createGlassIcon("Smile", [
  ...circle,
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
  ["path", { d: "M9 9h.01M15 9h.01" }],
]);
export const Snowflake = createGlassIcon("Snowflake", [
  ["path", { d: "M12 2v20M4 6l16 12M20 6 4 18" }],
]);
export const SortAsc = createGlassIcon("SortAsc", [
  ["path", { d: "M11 5h10M11 12h7M11 19h4" }],
  ["path", { d: "M4 17V7" }],
  ["path", { d: "m2 9 2-2 2 2" }],
]);
export const SortDesc = createGlassIcon("SortDesc", [
  ["path", { d: "M11 5h4M11 12h7M11 19h10" }],
  ["path", { d: "M4 7v10" }],
  ["path", { d: "m2 15 2 2 2-2" }],
]);
export const Sparkles = createGlassIcon("Sparkles", sparkles);
export const Square = createGlassIcon("Square", square);
export const Star = createGlassIcon("Star", star);
export const Sun = createGlassIcon("Sun", sun);
export const Tag = createGlassIcon("Tag", [
  ["path", { d: "M20 13 11 22 2 13V4h9Z" }],
  ["path", { d: "M7 8h.01" }],
]);
export const Target = createGlassIcon("Target", target);
export const TestTube = createGlassIcon("TestTube", [
  ["path", { d: "M10 2v7L4 19a3 3 0 0 0 2.6 4h10.8A3 3 0 0 0 20 19L14 9V2" }],
  ["path", { d: "M8 2h8" }],
  ["path", { d: "M7 15h10" }],
]);
export const ThumbsUp = createGlassIcon("ThumbsUp", [
  ["path", { d: "M7 10v11H3V10Z" }],
  [
    "path",
    {
      d: "M7 10 12 2l1 2a5 5 0 0 1-.4 4H20a2 2 0 0 1 2 2l-2 9a3 3 0 0 1-3 2H7",
    },
  ],
]);
export const Trash2 = createGlassIcon("Trash2", trash);
export const TrendingDown = createGlassIcon("TrendingDown", trendingDown);
export const TrendingUp = createGlassIcon("TrendingUp", trendingUp);
export const Triangle = createGlassIcon("Triangle", [
  ["path", { d: "M12 3 22 21H2Z" }],
]);
export const Trophy = createGlassIcon("Trophy", [
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M7 4h10v5a5 5 0 0 1-10 0Z" }],
  ["path", { d: "M7 6H3a4 4 0 0 0 4 4M17 6h4a4 4 0 0 1-4 4" }],
]);
export const Underline = createGlassIcon("Underline", underline);
export const Undo = createGlassIcon("Undo", [
  ["path", { d: "M3 7v6h6" }],
  ["path", { d: "M21 17a9 9 0 0 0-15-6.7L3 13" }],
]);
export const Undo2 = Undo;
export const Unlock = createGlassIcon("Unlock", unlock);
export const Upload = createGlassIcon("Upload", upload);
export const User = createGlassIcon("User", user);
export const UserRound = User;
export const Users = createGlassIcon("Users", users);
export const Video = createGlassIcon("Video", video);
export const Volume1 = createGlassIcon("Volume1", volume);
export const Volume2 = createGlassIcon("Volume2", volume2);
export const VolumeX = createGlassIcon("VolumeX", [...volume, ...x]);
export const Waves = createGlassIcon("Waves", [
  ["path", { d: "M2 8c3-3 5 3 8 0s5 3 8 0 4 1 4 1" }],
  ["path", { d: "M2 14c3-3 5 3 8 0s5 3 8 0 4 1 4 1" }],
]);
export const Wifi = createGlassIcon("Wifi", [
  ["path", { d: "M5 13a10 10 0 0 1 14 0" }],
  ["path", { d: "M8.5 16.5a5 5 0 0 1 7 0" }],
  ["path", { d: "M12 20h.01" }],
]);
export const Wind = createGlassIcon("Wind", [
  ["path", { d: "M3 8h11a3 3 0 1 0-3-3" }],
  ["path", { d: "M3 12h17" }],
  ["path", { d: "M3 16h12a3 3 0 1 1-3 3" }],
]);
export const X = createGlassIcon("X", x);
export const XCircle = createGlassIcon("XCircle", [...circle, ...x]);
export const Zap = createGlassIcon("Zap", zap);
export const ZoomIn = createGlassIcon("ZoomIn", [...search, ...plus]);
export const ZoomOut = createGlassIcon("ZoomOut", [...search, ...minus]);

const glassIconRegistry = {
  activity: Activity,
  alert: AlertCircle,
  archive: Archive,
  calendar: Calendar,
  check: Check,
  close: X,
  command: Search,
  data: Database,
  filter: Filter,
  home: Home,
  loading: Loader2,
  menu: Menu,
  notification: Bell,
  search: Search,
  settings: Settings,
  spark: Sparkles,
  user: User,
  users: Users,
  warning: AlertTriangle,
} as const;

export interface NamedGlassIconProps extends GlassIconProps {
  name: keyof typeof glassIconRegistry | string;
}

export const GlassIcon = ({ name, ...props }: NamedGlassIconProps) => {
  const Icon =
    glassIconRegistry[name as keyof typeof glassIconRegistry] ?? Circle;
  return <Icon {...props} />;
};

export const ActivityIcon = Activity;
export const AlertCircleIcon = AlertCircle;
export const AlertTriangleIcon = AlertTriangle;
export const ArrowDownIcon = ArrowDown;
export const ArrowRightIcon = ArrowRight;
export const ArrowUpIcon = ArrowUp;
export const BellIcon = Bell;
export const CalendarIcon = Calendar;
export const CheckIcon = Check;
export const ChevronDownIcon = ChevronDown;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const ChevronUpIcon = ChevronUp;
export const ClockIcon = Clock;
export const CloseIcon = X;
export const CommandIcon = Search;
export const CopyIcon = Copy;
export const DashboardIcon = LayoutDashboard;
export const DatabaseIcon = Database;
export const DownloadIcon = Download;
export const ErrorIcon = AlertCircle;
export const FileIcon = File;
export const FilterIcon = Filter;
export const FolderIcon = Folder;
export const GridIcon = Grid;
export const HomeIcon = Home;
export const ImageIcon = Image;
export const InfoIcon = Info;
export const ListIcon = List;
export const LoaderIcon = Loader2;
export const MediaIcon = Play;
export const MenuIcon = Menu;
export const MicIcon = Mic;
export const MoreHorizontalIcon = MoreHorizontal;
export const MoreVerticalIcon = MoreVertical;
export const NotificationIcon = Bell;
export const PaletteIcon = Palette;
export const PlayIcon = Play;
export const PlusIcon = Plus;
export const RefreshIcon = RefreshCw;
export const SaveIcon = Save;
export const SearchIcon = Search;
export const SendIcon = Send;
export const SettingsIcon = Settings;
export const SparkIcon = Sparkles;
export const SuccessIcon = CheckCircle;
export const UserIcon = User;
export const UsersIcon = Users;
export const VideoIcon = Video;
export const WarningIcon = AlertTriangle;
export const XIcon = X;
export const ZapIcon = Zap;
