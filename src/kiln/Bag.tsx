import type { CSSProperties } from "react"

export type BagLot = {
  name: string
  no?: string
  origin: string
  region?: string
  producer?: string
  altitude?: string
  variety?: string
  process?: string
  roast?: string
  notes?: string[]
  tone?: string
  score?: string
  format?: "bag" | "box" | "capsules" | "bottle"
  weight?: string
  view?: "front" | "side" | "back"
}

/* Paletas táctiles: papel algodón de 320g y laminado mate cerámico compostable
   Inspirado en Tim Wendelboe, Sey Coffee, April Copenhagen & Assembly London.
   Cero pegatinas blancas tipo wireframe: serigrafía directa y foil metálico. */
const palettes: Record<
  string,
  {
    body: string
    bodyGradient: [string, string, string, string]
    sideShade: string
    crease: string
    ink: string
    subInk: string
    foil: string
    foilLight: string
    panelFill: string
    panelStroke: string
    sealColor: string
  }
> = {
  ivory: {
    body: "#ede7dc",
    bodyGradient: ["#f6f2e9", "#ede7dc", "#e3dccf", "#d5cdbe"],
    sideShade: "rgba(38, 33, 26, 0.08)",
    crease: "rgba(45, 39, 31, 0.14)",
    ink: "#1c1a17",
    subInk: "#5e574d",
    foil: "#9f7842",
    foilLight: "#c8a46e",
    panelFill: "rgba(28, 26, 23, 0.03)",
    panelStroke: "rgba(28, 26, 23, 0.14)",
    sealColor: "#b55639",
  },
  noir: {
    body: "#1e1d1b",
    bodyGradient: ["#2b2926", "#1f1e1b", "#181715", "#11100e"],
    sideShade: "rgba(0, 0, 0, 0.28)",
    crease: "rgba(255, 250, 240, 0.08)",
    ink: "#f3efe6",
    subInk: "#9e978b",
    foil: "#c9a35e",
    foilLight: "#e3c588",
    panelFill: "rgba(255, 255, 255, 0.03)",
    panelStroke: "rgba(243, 239, 230, 0.14)",
    sealColor: "#c9a35e",
  },
  stone: {
    body: "#d2cabe",
    bodyGradient: ["#dfdad0", "#d2cabe", "#c4bcb0", "#b5ac9f"],
    sideShade: "rgba(35, 31, 26, 0.09)",
    crease: "rgba(36, 33, 28, 0.15)",
    ink: "#1e1c19",
    subInk: "#554f46",
    foil: "#7d5d3b",
    foilLight: "#a4825c",
    panelFill: "rgba(30, 28, 25, 0.035)",
    panelStroke: "rgba(30, 28, 25, 0.15)",
    sealColor: "#626955",
  },
  oxblood: {
    body: "#562922",
    bodyGradient: ["#69342b", "#562922", "#47201a", "#381813"],
    sideShade: "rgba(0, 0, 0, 0.24)",
    crease: "rgba(250, 235, 225, 0.1)",
    ink: "#f7eee7",
    subInk: "#cfb7ad",
    foil: "#dfb099",
    foilLight: "#f2cfc0",
    panelFill: "rgba(255, 245, 240, 0.04)",
    panelStroke: "rgba(247, 238, 231, 0.16)",
    sealColor: "#dfb099",
  },
  olive: {
    body: "#545948",
    bodyGradient: ["#636956", "#545948", "#464b3b", "#393d30"],
    sideShade: "rgba(0, 0, 0, 0.2)",
    crease: "rgba(245, 243, 235, 0.1)",
    ink: "#f4f2eb",
    subInk: "#c2c5b8",
    foil: "#d4c39b",
    foilLight: "#e8dbb9",
    panelFill: "rgba(255, 255, 250, 0.04)",
    panelStroke: "rgba(244, 242, 235, 0.16)",
    sealColor: "#d4c39b",
  },
  smoke: {
    body: "#a89887",
    bodyGradient: ["#b8a999", "#a89887", "#998978", "#897968"],
    sideShade: "rgba(30, 25, 20, 0.12)",
    crease: "rgba(35, 30, 24, 0.16)",
    ink: "#1b1916",
    subInk: "#4d453d",
    foil: "#6e4c2e",
    foilLight: "#946c49",
    panelFill: "rgba(27, 25, 22, 0.045)",
    panelStroke: "rgba(27, 25, 22, 0.16)",
    sealColor: "#8c3f2b",
  },
  terracotta: {
    body: "#9e533c",
    bodyGradient: ["#b06048", "#9e533c", "#8c4630", "#783925"],
    sideShade: "rgba(25, 10, 5, 0.2)",
    crease: "rgba(255, 242, 234, 0.12)",
    ink: "#fbf3ed",
    subInk: "#e3c8bc",
    foil: "#f0cfa0",
    foilLight: "#fae2be",
    panelFill: "rgba(255, 245, 238, 0.05)",
    panelStroke: "rgba(251, 243, 237, 0.18)",
    sealColor: "#f0cfa0",
  },
  sand: {
    body: "#e1d5c3",
    bodyGradient: ["#ece2d2", "#e1d5c3", "#d4c7b3", "#c4b6a1"],
    sideShade: "rgba(42, 35, 26, 0.09)",
    crease: "rgba(42, 35, 26, 0.15)",
    ink: "#211e1a",
    subInk: "#61584d",
    foil: "#8f683d",
    foilLight: "#b58d5d",
    panelFill: "rgba(33, 30, 26, 0.035)",
    panelStroke: "rgba(33, 30, 26, 0.15)",
    sealColor: "#9e533c",
  },
}

const widths = {
  xs: 54,
  sm: 108,
  md: 215,
  lg: 310,
  xl: 390,
}

export function Bag({
  lot,
  size = "md",
  className = "",
  style,
}: {
  lot: BagLot
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  style?: CSSProperties
}) {
  const accentByTone: Record<string, string> = { ivory: "#9fc890", noir: "#aaa5e3", stone: "#d9b88f", oxblood: "#e3a69c", olive: "#a9c879", smoke: "#9fb7d5", terracotta: "#e9a782", sand: "#e5c96d" }
  const accent = accentByTone[lot.tone ?? "ivory"] ?? accentByTone.ivory
  const p = { ...palettes.ivory, body: "#ffffff", bodyGradient: ["#ffffff", "#fbfbfa", "#f2f2f0", "#e6e6e3"] as [string, string, string, string], sideShade: "rgba(0, 0, 0, 0.055)", crease: "rgba(0, 0, 0, 0.12)", ink: "#050505", subInk: "#555555", sealColor: "#050505" }
  const w = widths[size]
  const h = Math.round(w * 1.46)
  const cleanId = (lot.name || "lot")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
  const id = `bag-${cleanId}-${size}`

  const displayName = lot.name.toUpperCase()
  // Nombre en Syncopate (muy ancha): partir en dos líneas si es largo y ajustar el cuerpo al ancho útil
  const words = displayName.split(" ")
  let nameLines = [displayName]
  if (displayName.length > 14 && words.length > 1) {
    let best = 1
    let bestDiff = Infinity
    for (let i = 1; i < words.length; i++) {
      const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length)
      if (diff < bestDiff) {
        bestDiff = diff
        best = i
      }
    }
    nameLines = [words.slice(0, best).join(" "), words.slice(best).join(" ")]
  }
  const longest = Math.max(...nameLines.map((l) => l.length))
  const nameSize = Math.max(6.5, Math.min(13, 136 / (longest * 1.06)))
  const weight = (lot.weight ?? "250 G").toUpperCase()
  const view = lot.view ?? "front"

  return (
    <div
      className={`kiln-bag-wrap ${size} ${className}`}
      style={{
        width: `${w}px`,
        height: `${h}px`,
        ...style,
      }}
      role="img"
      aria-label={`Envase de café ${lot.name}, origen ${lot.origin}`}
    >
      {view === "side" ? (
        <svg viewBox="0 0 240 350" width="100%" height="100%" className="kiln-bag-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={`${id}-side`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e4e4e1" />
              <stop offset="35%" stopColor="#ffffff" />
              <stop offset="75%" stopColor="#f3f3f1" />
              <stop offset="100%" stopColor="#d9d9d5" />
            </linearGradient>
          </defs>
          <path d="M 84 18 L 156 18 L 160 336 L 80 336 Z" fill={`url(#${id}-side)`} />
          <path d="M 120 30 L 120 316" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
          <path d="M 80 336 L 120 316 L 160 336 Z" fill="#000" opacity="0.05" />
          <rect x="82" y="12" width="76" height="11" rx="1.5" fill="#f6f6f4" />
          <rect x="84" y="72" width="7" height="96" fill={accent} />
          <g transform="translate(108 52)" fill={p.ink}>
            <rect x="0" y="0" width="3" height="24" />
            <circle cx="10" cy="6" r="4.6" />
            <circle cx="20" cy="6" r="4.6" />
            <circle cx="10" cy="18" r="4.6" />
            <circle cx="20" cy="18" r="4.6" />
          </g>
          <text
            transform="translate(128 300) rotate(-90)"
            fill={p.ink}
            fontFamily="'Syncopate', 'DM Sans', sans-serif"
            fontSize="17"
            letterSpacing="6"
          >
            KILN
          </text>
          <text transform="translate(96 300) rotate(-90)" fill={p.subInk} fontFamily="'DM Sans', sans-serif" fontSize="6" letterSpacing="2">
            {(lot.roast ?? "").toUpperCase()}
          </text>
        </svg>
      ) : (
      <svg
        viewBox="0 0 240 350"
        width="100%"
        height="100%"
        className="kiln-bag-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sombra elíptica realista sobre mesa de piedra */}
          <radialGradient id={`${id}-ground`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14120f" stopOpacity="0.34" />
            <stop offset="48%" stopColor="#14120f" stopOpacity="0.16" />
            <stop offset="82%" stopColor="#14120f" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#14120f" stopOpacity="0" />
          </radialGradient>

          {/* Volumen cilíndrico / box-pouch de fondo plano */}
          <linearGradient id={`${id}-pouch`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p.bodyGradient[3]} />
            <stop offset="9%" stopColor={p.bodyGradient[1]} />
            <stop offset="28%" stopColor={p.bodyGradient[0]} />
            <stop offset="66%" stopColor={p.bodyGradient[1]} />
            <stop offset="91%" stopColor={p.bodyGradient[2]} />
            <stop offset="100%" stopColor={p.bodyGradient[3]} />
          </linearGradient>

          {/* Luz cenital suave de estudio fotográfico */}
          <linearGradient id={`${id}-studio-light`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="15%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="78%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
          </linearGradient>

          {/* Estampación metálica en caliente (Hot Foil) */}
          <linearGradient id={`${id}-foil`} x1="0%" y1="0%" x2="100%" y2="25%">
            <stop offset="0%" stopColor={p.foil} />
            <stop offset="45%" stopColor={p.foilLight} />
            <stop offset="100%" stopColor={p.foil} />
          </linearGradient>

          {/* Silueta block-bottom bag estilo Sey / Tim Wendelboe */}
          <clipPath id={`${id}-clip`}>
            <path d="M 27 18 L 213 18 Q 217 18 218 23 L 222 329 Q 222 336 214 336 L 26 336 Q 18 336 18 329 L 22 23 Q 23 18 27 18 Z" />
          </clipPath>
        </defs>

        {/* Sombra de contacto en base */}
        <ellipse cx="120" cy="340" rx="102" ry="7.5" fill={`url(#${id}-ground)`} />
        <ellipse cx="120" cy="338" rx="84" ry="3.5" fill="#12100d" opacity="0.22" />

        {/* Cuerpo táctil de la bolsa */}
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="16" y="16" width="208" height="324" fill={`url(#${id}-pouch)`} />

          {/* Fuelles laterales arquitectónicos (Box-Pouch Gussets) */}
          <path d="M 18 18 L 41 18 L 44 336 L 18 336 Z" fill={p.sideShade} />
          <path d="M 199 18 L 222 18 L 222 336 L 196 336 Z" fill={p.sideShade} />

          {/* Aristas verticales de plegado */}
          <line x1="41" y1="18" x2="44" y2="336" stroke={p.crease} strokeWidth="0.9" />
          <line x1="42.2" y1="18" x2="45.2" y2="336" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="0.6" />

          <line x1="199" y1="18" x2="196" y2="336" stroke={p.crease} strokeWidth="0.9" />
          <line x1="197.8" y1="18" x2="194.8" y2="336" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="0.6" />

          {/* Pliegue inferior de base plana */}
          <path
            d="M 18 336 L 44 316 L 196 316 L 222 336 Z"
            fill="#000000"
            opacity="0.05"
          />
          <line x1="44" y1="316" x2="196" y2="316" stroke={p.crease} strokeWidth="0.7" />

          {/* Banda cromática lateral de origen (sello editorial en el canto izquierdo) */}
          <rect x="18" y="72" width="11" height="96" fill={accent} />

          {/* Baño de luz vertical */}
          <rect x="16" y="16" width="208" height="324" fill={`url(#${id}-studio-light)`} />
        </g>

        {/* Termosellado superior y zipper de cierre hermético */}
        <g>
          <rect x="24" y="12" width="192" height="11" rx="1.5" fill={p.bodyGradient[1]} />
          {Array.from({ length: 34 }, (_, i) => (
            <line
              key={i}
              x1={27 + i * 5.5}
              y1="13"
              x2={27 + i * 5.5}
              y2="22"
              stroke={p.ink}
              strokeOpacity="0.11"
              strokeWidth="0.75"
            />
          ))}
          {/* Muescas de rasgado de precisión */}
          <path d="M 22 28 L 27 26.2 L 27 29.8 Z" fill={p.ink} opacity="0.45" />
          <path d="M 218 28 L 213 26.2 L 213 29.8 Z" fill={p.ink} opacity="0.45" />

          {/* Línea de zipper interno */}
          <line x1="25" y1="28" x2="215" y2="28" stroke={p.crease} strokeWidth="0.9" strokeDasharray="2 1.5" />
          <line x1="25" y1="29.2" x2="215" y2="29.2" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="0.6" />
        </g>

        {/* Logo protagonista */}
        {view === "front" && (
        <g>
          <g transform="translate(57 72)" fill={p.ink}>
            <rect x="0" y="0" width="13" height="178" />
            <circle cx="55" cy="42" r="35" />
            <circle cx="128" cy="42" r="35" />
            <circle cx="55" cy="136" r="35" />
            <circle cx="128" cy="136" r="35" />
          </g>
          {nameLines.map((line, i) => (
            <text
              key={line}
              x="52"
              y={nameLines.length === 1 ? 290 : 280 + i * (nameSize + 3)}
              fill={p.ink}
              fontFamily="'Syncopate', 'DM Sans', sans-serif"
              fontSize={nameSize.toFixed(1)}
              fontWeight="400"
              letterSpacing="-0.2"
            >
              {line}
            </text>
          ))}
          <text x="188" y="308" textAnchor="end" fill={p.ink} fontFamily="'DM Sans', sans-serif" fontSize="7" fontWeight="500" letterSpacing="1.2">
            {weight}
          </text>
        </g>
        )}
        {view === "back" && (
          <g fontFamily="'DM Sans', sans-serif" fill={p.ink}>
            <rect x="52" y="64" width="136" height="214" fill="#ffffff" stroke={p.ink} strokeWidth="0.8" />
            <g transform="translate(62 76)">
              <rect x="0" y="0" width="2.4" height="18" />
              <circle cx="8" cy="4.4" r="3.6" />
              <circle cx="15.6" cy="4.4" r="3.6" />
              <circle cx="8" cy="13.6" r="3.6" />
              <circle cx="15.6" cy="13.6" r="3.6" />
            </g>
            <text x="62" y="114" fontFamily="'Syncopate', 'DM Sans', sans-serif" fontSize={Math.min(9, 112 / (displayName.length * 1.06)).toFixed(1)}>
              {displayName}
            </text>
            <line x1="62" y1="122" x2="178" y2="122" stroke={p.ink} strokeWidth="0.5" />
            {[
              ["ORIGEN", lot.origin],
              ["PROCESO", lot.process ?? ""],
              ["VARIEDAD", lot.variety ?? ""],
              ["TUESTE", lot.roast ?? ""],
              ["NOTAS", (lot.notes ?? []).join(", ")],
            ].map(([label, value], i) => (
              <g key={label} transform={`translate(62 ${136 + i * 19})`}>
                <text fontSize="4.4" letterSpacing="1.1" fill={p.subInk}>{label}</text>
                <text y="8" fontSize={value.length > 34 ? "4.6" : "5.4"}>{value.length > 44 ? `${value.slice(0, 43)}…` : value}</text>
              </g>
            ))}
            <line x1="62" y1="234" x2="178" y2="234" stroke={p.ink} strokeWidth="0.5" />
            <text x="62" y="244" fontSize="4.4" fill={p.subInk}>Café de especialidad · 100% arábica</text>
            <text x="62" y="252" fontSize="4.4" fill={p.subInk}>Mejor en los 3 meses tras el tueste.</text>
            <text x="62" y="260" fontSize="4.4" fill={p.subInk}>Conservar en lugar fresco y seco.</text>
            <g transform="translate(140 240)">
              {[0, 2, 3, 5, 8, 9, 11, 14, 15, 17, 20, 22, 23, 26, 28, 30, 31, 34].map((x) => (
                <rect key={x} x={x} y="0" width={x % 3 === 0 ? 1.4 : 0.8} height="22" />
              ))}
            </g>
          </g>
        )}
      </svg>
      )}
    </div>
  )
}
