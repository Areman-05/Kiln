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

const minAltitude = (altitude?: string) => (altitude ? `${altitude.split("–")[0].replace(/m\s*$/i, "").trim()} m` : "—")
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
      <defs>
        <clipPath id={`${uid}-side`}>
          <rect x="84" y="62" width="58" height="188" />
        </clipPath>
      </defs>
      <BagBody gradient={gradient} x0={78} x1={162} />
      <path d="M120 40V336" stroke="rgba(0,0,0,.05)" strokeWidth="0.6" />
      <g clipPath={`url(#${uid}-side)`}>
        <KilnPattern x={40} y={62} width={172} height={188} color={INK} opacity={1} />
      </g>
      <text transform="translate(150 316) rotate(-90)" fill={INK} fontFamily={GEO} fontSize="12">
        kiln
      </text>
    </>
  )

  const rows: [string, string][] = [
    ["Origen", shortOrigin(lot.origin)],
    ["Proceso", lot.process ?? "—"],
    ["Altitud", minAltitude(lot.altitude)],
    ["Tueste", lot.roast ?? "—"],
  ]
  const back = (
    <>
      <BagBody gradient={gradient} x0={14} x1={226} />
      <text x="34" y="72" fill={INK} fontFamily={GEO} fontSize="12">
        kiln
      </text>
      <g fontFamily={GEO}>
        {rows.map(([label, value], i) => {
          const y = 112 + i * 24
          return (
            <g key={label}>
              <path d={`M34 ${y + 8}H206`} stroke="rgba(0,0,0,.1)" strokeWidth="0.6" />
              <text x="34" y={y} fill={SOFT} fontSize="7.5">
                {label}
              </text>
              <text x="92" y={y} fill={INK} fontSize="8.5">
                {value}
              </text>
            </g>
          )
        })}
      </g>
      <text x="34" y="298" fill={INK} fontFamily={SERIF} fontSize="12">
        {lot.name}
      </text>
      <text x="34" y="316" fill={INK} fillOpacity=".6" fontFamily={GEO} fontSize="8.5">
        {weight}
      </text>
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
