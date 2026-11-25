import React from "react"

/* ==========================================================================
   Identidad provisional de Kiln
   ========================================================================== */

/** Logotipo provisional: la palabra "kiln" en minúsculas (se sustituirá por el definitivo). */
export function KilnWordmark({ className = "" }: { className?: string }) {
  return <span className={`k-wordmark ${className}`}>kiln</span>
}

/* Patrón de marca: segmentos horizontales sobre una retícula invisible de
   16 × 22, como el registro de calor de un tueste. Se genera una sola vez con
   un pseudoaleatorio de semilla fija (7), así que es idéntico en cada render. */
const COLS = 16
const ROWS = 22
const CELL = 10
const DOUBLE_GAP = 3

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PATTERN_PATH = (() => {
  const rand = mulberry32(7)
  const parts: string[] = []
  for (let row = 0; row < ROWS; row++) {
    const y = row * CELL + CELL / 2
    const segments = 1 + Math.floor(rand() * 4) // 1–4 segmentos por fila
    const isDouble = rand() < 0.22 // algunas filas dobles muy juntas
    let col = Math.floor(rand() * 4)
    for (let i = 0; i < segments && col < COLS; i++) {
      const end = Math.min(COLS, col + 1 + Math.floor(rand() * 3)) // 1–3 columnas
      parts.push(`M${col * CELL} ${y}H${end * CELL}`)
      if (isDouble) parts.push(`M${col * CELL} ${y + DOUBLE_GAP}H${end * CELL}`)
      col = end + 1 + Math.floor(rand() * 4) // hueco irregular
    }
  }
  return parts.join("")
})()

export function KilnPattern({
  color = "#ffffff",
  opacity = 1,
  className,
  x,
  y,
  width,
  height,
  preserveAspectRatio = "none",
}: {
  color?: string
  opacity?: number
  className?: string
  x?: number
  y?: number
  width?: number | string
  height?: number | string
  preserveAspectRatio?: string
}) {
  return (
    <svg
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={PATTERN_PATH}
        fill="none"
        stroke={color}
        strokeOpacity={opacity}
        strokeWidth={1}
        strokeLinecap="butt"
        vectorEffect="non-scaling-stroke"
        shapeRendering="crispEdges"
      />
    </svg>
  )
}
