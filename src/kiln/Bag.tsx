"use client"

import React, { useId, type CSSProperties } from "react"
import { KilnPattern } from "./Brand"

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
  /** Receta en una línea, p. ej. «V60 · 15 g · 250 ml · 94 °C» (dorso) */
  recipe?: string
  /** Fecha de tueste ya formateada (dorso) */
  roastedOn?: string
}

const widths = {
  xs: 54,
  sm: 108,
  md: 215,
  lg: 310,
  xl: 390,
}

const INK = "#050505"
const SOFT = "#7a7a7a"
const GEO = "Jost, system-ui, sans-serif"
const SERIF = "Newsreader, Georgia, serif"

// Nombre en una o dos líneas equilibradas
function splitName(name: string) {
  const words = name.split(" ")
  if (name.length <= 16 || words.length < 2) return [name]
  let best = 1
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length)
    if (diff < bestDiff) {
      bestDiff = diff
      best = i
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")]
}

const shortOrigin = (origin: string) => origin.split("·").pop()?.trim() ?? origin

/* Cuerpo de la bolsa: blanco con un sombreado lateral muy leve */
function BagBody({ gradient, x0, x1 }: { gradient: string; x0: number; x1: number }) {
  const crimps = []
  for (let x = x0 + 6; x < x1 - 4; x += 4) crimps.push(x)
  return (
    <>
      <path d={`M${x0 + 4} 34 L${x1 - 4} 34 L${x1} 340 L${x0} 340 Z`} fill={`url(#${gradient})`} stroke="rgba(0,0,0,.08)" strokeWidth="0.6" />
      <rect x={x0 + 4} y="12" width={x1 - x0 - 8} height="22" fill="#f4f4f2" stroke="rgba(0,0,0,.08)" strokeWidth="0.6" />
      <path d={crimps.map((x) => `M${x} 15V31`).join("")} stroke="rgba(0,0,0,.07)" strokeWidth="0.6" />
      <path d={`M${x0 + 18} 326H${x1 - 18}`} stroke="rgba(0,0,0,.05)" strokeWidth="0.6" />
    </>
  )
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
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const w = widths[size]
  const h = Math.round(w * 1.46)
  const view = lot.view ?? "front"
  const weight = lot.weight ?? "250 g"
  const gradient = `${uid}-body`

  const lines = splitName(lot.name)
  const longest = Math.max(...lines.map((l) => l.length))
  const nameSize = Math.max(10, Math.min(18, 176 / (longest * 0.46)))
  const nameLastY = 298
  const nameFirstY = nameLastY - (lines.length - 1) * nameSize * 1.08

  const front = (
    <>
      <BagBody gradient={gradient} x0={14} x1={226} />
      <KilnPattern x={34} y={62} width={172} height={188} color={INK} opacity={1} />
      <text fill={INK} fontFamily={SERIF} fontWeight={400} fontSize={nameSize.toFixed(2)}>
        {lines.map((line, i) => (
          <tspan key={line} x="34" y={(nameFirstY + i * nameSize * 1.08).toFixed(2)}>
            {line}
          </tspan>
        ))}
      </text>
      <text x="34" y="316" fill={INK} fillOpacity=".6" fontFamily={GEO} fontSize="8.5">
        {weight}
      </text>
      <text x="206" y="316" textAnchor="end" fill={INK} fontFamily={GEO} fontSize="12">
        kiln
      </text>
    </>
  )

  const side = (
    <>
      <BagBody gradient={gradient} x0={78} x1={162} />
      <path d="M120 40V336" stroke="rgba(0,0,0,.05)" strokeWidth="0.6" />
      <text transform="translate(150 316) rotate(-90)" fill={INK} fontFamily={GEO} fontSize="12">
        kiln
      </text>
    </>
  )

  /* Dorso: etiqueta trasera de café de especialidad, tinta negra sobre blanco */
  const fit = (text: string | undefined, max: number) => {
    if (!text) return "—"
    return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
  }
  const rows: [string, string][] = [
    ["Productor", fit(lot.producer, 34)],
    ["Región", fit(lot.region ?? shortOrigin(lot.origin), 34)],
    ["Variedad", fit(lot.variety, 34)],
    ["Proceso", fit(lot.process, 34)],
    ["Altitud", lot.altitude ?? "—"],
    ["Tueste", fit(lot.roast, 34)],
    ["Tostado el", lot.roastedOn ?? "—"],
  ]
  const notes = (lot.notes ?? []).join(" · ")
  const backNameSize = Math.max(10, Math.min(15, 180 / (lot.name.length * 0.46)))
  const back = (
    <>
      <BagBody gradient={gradient} x0={14} x1={226} />
      <g fontFamily={GEO}>
        <text x="30" y="60" fill={INK} fontSize="12">
          kiln
        </text>
        <text x="210" y="60" textAnchor="end" fill={INK} fontSize="7.5">
          {`Lote ${lot.no ?? "—"}`}
        </text>
        <path d="M30 67H210" stroke={INK} strokeOpacity=".35" strokeWidth="0.5" />
      </g>
      <text x="30" y="92" fill={INK} fontFamily={SERIF} fontSize={backNameSize.toFixed(2)}>
        {lot.name}
      </text>
      <text x="30" y="105" fill={SOFT} fontFamily={GEO} fontSize="7">
        {fit(lot.producer, 46)}
      </text>
      <g fontFamily={GEO}>
        {rows.map(([label, value], i) => {
          const y = 128 + i * 16
          return (
            <g key={label}>
              <text x="30" y={y} fill={SOFT} fontSize="6.6">
                {label}
              </text>
              <text x="82" y={y} fill={INK} fontSize="7">
                {value}
              </text>
              <path d={`M30 ${y + 5.5}H210`} stroke={INK} strokeOpacity=".12" strokeWidth="0.5" />
            </g>
          )
        })}
        <text x="30" y="248" fill={INK} fontSize={notes.length > 44 ? "6.4" : "7.2"}>
          {notes || "—"}
        </text>
        <text x="30" y="261" fill={SOFT} fontSize="6.8">
          {lot.recipe ?? "—"}
        </text>
      </g>
      {/* Tira del patrón de marca a modo de código de barras */}
      <KilnPattern x={30} y={276} width={180} height={24} color={INK} opacity={1} />
      <g fontFamily={GEO}>
        <text x="30" y="318" fill={INK} fontSize="8.5">
          {weight}
        </text>
        <text x="210" y="318" textAnchor="end" fill={SOFT} fontSize="6.8">
          Tostado en Barcelona
        </text>
      </g>
    </>
  )

  return (
    <div
      className={`kiln-bag-wrap ${size} ${className}`}
      style={{ width: `${w}px`, height: `${h}px`, ...style }}
      role="img"
      aria-label={`Bolsa de café ${lot.name}, origen ${lot.origin}`}
    >
      <svg viewBox="0 0 240 350" width="100%" height="100%" className="kiln-bag-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ebebe9" />
            <stop offset=".08" stopColor="#fafaf9" />
            <stop offset=".5" stopColor="#ffffff" />
            <stop offset=".92" stopColor="#f6f6f4" />
            <stop offset="1" stopColor="#e8e8e6" />
          </linearGradient>
        </defs>
        {view === "side" ? side : view === "back" ? back : front}
      </svg>
    </div>
  )
}
