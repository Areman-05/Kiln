"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  BAG_SIZES,
  CAFE_MENU,
  COFFEE_LOTS,
  GRIND_OPTIONS,
  PHOTOS,
  SUBSCRIPTION_PLANS,
  lotPhoto,
  type BagSizeOption,
  type CoffeeLot,
  type GrindOption,
} from "./data"

export type ViewName =
  | "home"
  | "shop"
  | "product"
  | "subscriptions"
  | "studio"
  | "visit"
  | "wholesale"
  | "brew"
  | "checkout"
  | "news"
  | "origin"
  | "objects"
  | "object"
  | "account"

export type SubTab = "personal" | "gift" | "office"

export type CartItem = {
  key: string
  lotId: string
  name: string
  origin: string
  tone: CoffeeLot["tone"]
  no: string
  size: BagSizeOption
  grind: GrindOption
  purchaseMode: " puntual" | "suscripcion"
  cadenceWeeks?: number
  unitPrice: number
  qty: number
  // Objetos y regalos: sin tamaño ni molienda; `origin` guarda el material o el detalle
  kind?: "object" | "gift"
  image?: string
}

export type ActiveSubscription = {
  id: string
  planName: string
  size: BagSizeOption
  grind: GrindOption
  bagsPerShipment: number
  cadenceWeeks: number
  roastPreference: string
  status: "Activa" | "Pausada"
  nextDeliveryDate: string
  skippedDates: string[]
  pricePerShipment: number
}

export const formatEur = (val: number) =>
  val.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

/* Gráfico Radar Sensorial SCA en SVG */
export function SensoryRadar({
  sensory,
  compareSensory,
}: {
  sensory: CoffeeLot["sensory"]
  compareSensory?: CoffeeLot["sensory"]
}) {
  const axes: { key: keyof CoffeeLot["sensory"]; label: string }[] = [
    { key: "acidity", label: "Acidez" },
    { key: "sweetness", label: "Dulzor" },
    { key: "body", label: "Cuerpo" },
    { key: "floral", label: "Aroma Floral" },
    { key: "clarity", label: "Claridad" },
  ]
  const cx = 125
  const cy = 120
  const maxR = 78

  const getPoints = (s: CoffeeLot["sensory"]) =>
    axes
      .map((a, idx) => {
        const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2
        const r = ((s[a.key] || 5) / 10) * maxR
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      })
      .join(" ")

  return (
    <svg viewBox="0 0 250 240" width="100%" height="230" aria-label="Gráfico sensorial SCA">
      {/* Anillos concéntricos */}
      {[0.25, 0.5, 0.75, 1].map((step) => (
        <polygon
          key={step}
          points={axes
            .map((_, idx) => {
              const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2
              const r = maxR * step
              return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`
            })
            .join(" ")}
          fill="none"
          stroke="rgba(26, 25, 22, 0.12)"
          strokeWidth="0.8"
        />
      ))}
      {/* Ejes radiales y etiquetas */}
      {axes.map((a, idx) => {
        const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2
        const x2 = cx + maxR * Math.cos(angle)
        const y2 = cy + maxR * Math.sin(angle)
        const lx = cx + (maxR + 24) * Math.cos(angle)
        const ly = cy + (maxR + 18) * Math.sin(angle)
        return (
          <g key={a.key}>
            <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="rgba(26, 25, 22, 0.14)" strokeWidth="0.8" />
            <text
              x={lx}
              y={ly + 3}
              textAnchor="middle"
              fill="#544e45"
              fontFamily="Jost, system-ui, sans-serif"
              fontSize="8"
            >
              {a.label.toUpperCase()} ({sensory[a.key]}/10)
            </text>
          </g>
        )
      })}
      {/* Polígono secundario en caso de comparación */}
      {compareSensory && (
        <polygon
          points={getPoints(compareSensory)}
          fill="rgba(86, 93, 73, 0.18)"
          stroke="#565d49"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      )}
      {/* Polígono principal */}
      <polygon
        points={getPoints(sensory)}
        fill="rgba(168, 76, 50, 0.2)"
        stroke="#a84c32"
        strokeWidth="1.8"
      />
      {axes.map((a, idx) => {
        const angle = (Math.PI * 2 * idx) / axes.length - Math.PI / 2
        const r = (sensory[a.key] / 10) * maxR
        return (
          <circle
            key={a.key}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r="3"
            fill="#a84c32"
          />
        )
      })}
    </svg>
  )
}

/* Curva de Tueste Loring S15 Falcon en SVG */
export function RoastCurveChart({ lot }: { lot: CoffeeLot }) {
  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--line-subtle)",
        borderRadius: "var(--radius-xs)",
        padding: "1.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <span className="k-eyebrow">TELEMETRÍA DE TUESTE · {lot.roasterMachine}</span>
        <span className="font-mono" style={{ fontSize: "0.72rem", color: "var(--accent-rust)" }}>
          DTR {lot.developmentTimeRatio} · Final {lot.endTempCelsius}
        </span>
      </div>
      <svg viewBox="0 0 420 135" width="100%" height="125" aria-label="Curva de temperatura y Rate of Rise">
        {/* Retícula */}
        {[25, 55, 85, 115].map((y) => (
          <line key={y} x1="25" y1={y} x2="405" y2={y} stroke="rgba(26,25,22,0.08)" strokeWidth="0.7" />
        ))}
        {/* Curva Temperatura del Grano (BT) */}
        <path
          d="M 28 32 Q 72 108 118 96 Q 210 70 325 36 L 392 22"
          fill="none"
          stroke="#1a1916"
          strokeWidth="2"
        />
        {/* Curva Rate of Rise (RoR ΔT/30s) */}
        <path
          d="M 75 28 Q 160 44 250 74 Q 330 96 392 108"
          fill="none"
          stroke="#a84c32"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Hitos: Punto de giro, Amarilleo, Primer Crack, Descarga */}
        <circle cx="92" cy="96" r="3" fill="#1a1916" />
        <text x="92" y="112" textAnchor="middle" fontFamily="Jost, system-ui, sans-serif" fontSize="7" fill="#544e45">
          TP 1:22 (88°C)
        </text>
        <circle cx="205" cy="72" r="3" fill="#b89150" />
        <text x="205" y="63" textAnchor="middle" fontFamily="Jost, system-ui, sans-serif" fontSize="7" fill="#544e45">
          Maillard 4:15
        </text>
        <circle cx="325" cy="36" r="3.5" fill="#a84c32" />
        <text x="318" y="26" textAnchor="middle" fontFamily="Jost, system-ui, sans-serif" fontSize="7.2" fill="#a84c32">
          1er Crack 7:48 (196°C)
        </text>
        <circle cx="392" cy="22" r="3.5" fill="#1a1916" />
        <text x="378" y="13" textAnchor="end" fontFamily="Jost, system-ui, sans-serif" fontSize="7.2" fill="#1a1916">
          Descarga {lot.endTempCelsius}
        </text>
      </svg>
    </div>
  )
}

/* Tarjeta reutilizable de Lote */
export function LotCard({
  lot,
  onSelectLot,
}: {
  lot: CoffeeLot
  onSelectLot: (lot: CoffeeLot) => void
  onQuickAdd: (lot: CoffeeLot, size: BagSizeOption, grind: GrindOption) => void
  isCompared: boolean
  onToggleCompare: (lotId: string) => void
}) {
    return (
    <article className="k-lot-card" data-lot-id={lot.id}>
      <button type="button" className="k-lot-stage" onClick={() => onSelectLot(lot)} aria-label={`Ver ${lot.name}`}>
        <span className="k-lot-chips">
          <span className="k-lot-chip">{lot.roast}</span>
        </span>
        <img className="k-lot-photo" src={lotPhoto(lot)} alt={`Paisaje de origen: ${lot.region}, ${lot.country}`} loading="lazy" />
        <span className="k-lot-view" aria-hidden="true">Ver producto</span>
      </button>

      <div className="k-lot-body">
        <div className="k-lot-headline">
          <button type="button" className="k-lot-title" onClick={() => onSelectLot(lot)}>
            {lot.name}
          </button>
          <span className="k-lot-price">{formatEur(lot.price250)}</span>
        </div>
        <span className="k-lot-meta-line">{lot.origin}</span>
      </div>
    </article>
  )
}

/* Calculadora Interactiva de Extracción & Temporizador de Vertido */
export function InteractiveBrewStudio({
  initialLot,
  onSelectLot,
}: {
  initialLot?: CoffeeLot
  onSelectLot?: (lot: CoffeeLot) => void
}) {
  const [method, setMethod] = useState<"v60" | "espresso" | "aeropress" | "chemex" | "french">("v60")
  const [dose, setDose] = useState<number>(initialLot?.recipe.doseG ?? 15)
  const [ratio, setRatio] = useState<number>(16.5)
  const [timerSec, setTimerSec] = useState<number>(0)
  const [running, setRunning] = useState<boolean>(false)

  const presets: Record<
    "v60" | "espresso" | "aeropress" | "chemex" | "french",
    {
      name: string
      defaultDose: number
      defaultRatio: number
      tempC: number
      grind: string
      microns: string
      targetSec: number
      stages: { start: number; end: number; title: string; waterPct: number; tip: string }[]
    }
  > = {
    v60: {
      name: "Hario V60 02",
      defaultDose: 15,
      defaultRatio: 16.6,
      tempC: 94,
      grind: "Media-fina (22 clics Comandante)",
      microns: "680 μm",
      targetSec: 155,
      stages: [
        { start: 0, end: 40, title: "1. Floración (Bloom)", waterPct: 0.18, tip: "Vierte el triple del peso en café en espiral suave y gira el cono para liberar CO₂." },
        { start: 40, end: 85, title: "2. Extracción de Ácidos y Aromas", waterPct: 0.6, tip: "Vierte en círculos concéntricos desde el centro sin tocar las paredes de papel." },
        { start: 85, end: 155, title: "3. Cuerpo, Dulzor y Drenaje", waterPct: 1, tip: "Completa el volumen con un flujo central laminar hasta drenar con cama plana." },
      ],
    },
    espresso: {
      name: "Espresso Moderno (58 mm)",
      defaultDose: 18.5,
      defaultRatio: 2.2,
      tempC: 93,
      grind: "Fina calibrada (280 μm)",
      microns: "280 μm",
      targetSec: 29,
      stages: [
        { start: 0, end: 7, title: "1. Preinfusión a baja presión (2 bar)", waterPct: 0.15, tip: "Humedece la pastilla de forma uniforme evitando canalizaciones." },
        { start: 7, end: 21, title: "2. Extracción principal (9 bar)", waterPct: 0.75, tip: "Flujo viscoso color avellana atigrado." },
        { start: 21, end: 29, title: "3. Declive suave y corte", waterPct: 1, tip: "Corta en báscula exactamente al alcanzar el peso objetivo." },
      ],
    },
    aeropress: {
      name: "AeroPress Estándar",
      defaultDose: 15,
      defaultRatio: 15.3,
      tempC: 92,
      grind: "Media (19 clics Comandante)",
      microns: "600 μm",
      targetSec: 120,
      stages: [
        { start: 0, end: 25, title: "1. Vertido total e inserción de émbolo", waterPct: 1, tip: "Vierte toda el agua y coloca el émbolo 1 cm para sellar al vacío." },
        { start: 25, end: 85, title: "2. Inmersión estática", waterPct: 1, tip: "Al minuto 1:15 gira suavemente la cámara para precipitar la costra." },
        { start: 85, end: 120, title: "3. Presión suave y constante", waterPct: 1, tip: "Presiona sólo con el peso de los antebrazos hasta oír el silbido." },
      ],
    },
    chemex: {
      name: "Chemex 6 Tazas",
      defaultDose: 26,
      defaultRatio: 16.0,
      tempC: 94,
      grind: "Media-gruesa (26 clics Comandante)",
      microns: "780 μm",
      targetSec: 210,
      stages: [
        { start: 0, end: 45, title: "1. Preinfusión amplia", waterPct: 0.18, tip: "Asegúrate de que el pliegue triple quede hacia el pico vertedor." },
        { start: 45, end: 130, title: "2. Pulso central sostenido", waterPct: 0.68, tip: "Mantén el cono lleno a dos tercios para aprovechar el filtro grueso." },
        { start: 130, end: 210, title: "3. Lavado final y retiro", waterPct: 1, tip: "Retira el filtro en cuanto pase el último goteo." },
      ],
    },
    french: {
      name: "Prensa Francesa (Método Hoffmann)",
      defaultDose: 20,
      defaultRatio: 16.0,
      tempC: 95,
      grind: "Media-gruesa uniforme",
      microns: "850 μm",
      targetSec: 240,
      stages: [
        { start: 0, end: 60, title: "1. Infusión inicial sin tapa", waterPct: 1, tip: "Vierte toda el agua sobre el café y deja formar la costra superior." },
        { start: 60, end: 180, title: "2. Romper costra y espumar", waterPct: 1, tip: "Remueve suavemente la superficie y retira la espuma con dos cucharas." },
        { start: 180, end: 240, title: "3. Reposo y vertido limpio", waterPct: 1, tip: "Sitúa el filtro justo a ras del líquido sin bajarlo al fondo y sirve." },
      ],
    },
  }

  const currentPreset = presets[method]
  const totalWater = Math.round(dose * ratio)

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setTimerSec((s) => {
        if (s >= currentPreset.targetSec) {
          setRunning(false)
          return currentPreset.targetSec
        }
        return s + 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [running, currentPreset.targetSec])

  const selectMethod = (m: typeof method) => {
    setMethod(m)
    setDose(presets[m].defaultDose)
    setRatio(presets[m].defaultRatio)
    setRunning(false)
    setTimerSec(0)
  }

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return (
    <div className="k-brew-studio">
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
        {(Object.keys(presets) as (typeof method)[]).map((m) => (
          <button
            key={m}
            type="button"
            className={`k-filter-pill ${method === m ? "active" : ""}`}
            onClick={() => selectMethod(m)}
          >
            {presets[m].name}
          </button>
        ))}
      </div>

      <div className="k-brew-grid">
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.75rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span className="k-eyebrow">Dosis de café</span>
                <strong className="font-mono">{dose.toFixed(1)} g</strong>
              </div>
              <input
                type="range"
                min={method === "espresso" ? 14 : 10}
                max={method === "espresso" ? 22 : 45}
                step={0.5}
                value={dose}
                onChange={(e) => setDose(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--ink-primary)" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                <span className="k-eyebrow">RATIO DE EXTRACCIÓN</span>
                <strong className="font-mono">1 : {ratio.toFixed(1)}</strong>
              </div>
              <input
                type="range"
                min={method === "espresso" ? 1.5 : 13}
                max={method === "espresso" ? 3.2 : 18.5}
                step={0.1}
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "var(--ink-primary)" }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
              padding: "1.25rem",
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-xs)",
              marginBottom: "1.75rem",
            }}
          >
            <div>
              <span className="k-eyebrow">Agua total</span>
              <div className="font-serif" style={{ fontSize: "1.75rem" }}>
                {totalWater} {method === "espresso" ? "g" : "ml"}
              </div>
            </div>
            <div>
              <span className="k-eyebrow">TEMPERATURA</span>
              <div className="font-serif" style={{ fontSize: "1.75rem" }}>
                {currentPreset.tempC} °C
              </div>
            </div>
            <div>
              <span className="k-eyebrow">GRANULOMETRÍA</span>
              <div className="font-serif" style={{ fontSize: "1.35rem" }}>
                {currentPreset.microns}
              </div>
            </div>
            <div>
              <span className="k-eyebrow">Tiempo objetivo</span>
              <div className="font-serif" style={{ fontSize: "1.75rem" }}>
                {formatClock(currentPreset.targetSec)}
              </div>
            </div>
          </div>

          {/* Etapas paso a paso con pesos dinámicos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {currentPreset.stages.map((st, idx) => {
              const isCurrent = running && timerSec >= st.start && timerSec < st.end
              const isDone = timerSec >= st.end && timerSec > 0
              return (
                <div
                  key={idx}
                  style={{
                    padding: "1rem 1.2rem",
                    border: `1px solid ${isCurrent ? "var(--accent-rust)" : "var(--line-subtle)"}`,
                    background: isCurrent ? "rgba(168, 76, 50, 0.06)" : "var(--bg-primary)",
                    borderRadius: "var(--radius-xs)",
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <strong style={{ fontSize: "0.88rem" }}>
                      {st.title} {isDone ? "✓" : ""}
                    </strong>
                    <span className="font-mono" style={{ fontSize: "0.74rem", color: "var(--accent-rust)" }}>
                      {formatClock(st.start)} – {formatClock(st.end)} · Hasta {Math.round(totalWater * st.waterPct)} {method === "espresso" ? "g" : "ml"}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--ink-secondary)" }}>{st.tip}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cronómetro Barista Interactivo */}
        <div
          style={{
            background: "var(--bg-dark)",
            color: "var(--ink-light)",
            padding: "2.25rem",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "340px",
          }}
        >
          <div>
            <span className="k-eyebrow" style={{ color: "#c8a46e" }}>
              Cronómetro de vertido
            </span>
            <p style={{ fontSize: "0.84rem", color: "var(--ink-light-sub)", marginTop: "0.35rem" }}>
              Molienda recomendada: {currentPreset.grind}. Agua filtrada recomendada: 55 – 75 ppm GH, 25 ppm KH.
            </p>
          </div>

          <div style={{ textAlign: "center", margin: "2rem 0" }}>
            <div
              className="font-mono"
              style={{
                fontSize: "4.2rem",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: running ? "#ffffff" : "#ded8cc",
              }}
            >
              {formatClock(timerSec)}
            </div>
            <div
              style={{
                height: "4px",
                background: "rgba(255,255,255,0.12)",
                borderRadius: "999px",
                marginTop: "1.2rem",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (timerSec / currentPreset.targetSec) * 100)}%`,
                  background: "#c8a46e",
                  transition: "width 0.35s linear",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              className="k-btn-light"
              style={{ flex: 1 }}
              onClick={() => setRunning((r) => !r)}
            >
              {running ? "Pausar Vertido" : timerSec > 0 ? "Reanudar" : "Iniciar Extracción"}
            </button>
            <button
              type="button"
              className="k-btn-outline-light"
              onClick={() => {
                setRunning(false)
                setTimerSec(0)
              }}
            >
              Reiniciar
            </button>
          </div>

          {onSelectLot && initialLot && (
            <button
              type="button"
              onClick={() => onSelectLot(initialLot)}
              style={{
                marginTop: "1rem",
                fontSize: "0.75rem",
                color: "#c8a46e",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              Ver ficha técnica de {initialLot.name} →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
