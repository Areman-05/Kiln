"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { TextSelect } from "./Checkout"
import { COFFEE_LOTS, type CoffeeLot } from "./data"

/* ==========================================================================
   Preparar: métodos, recetas ajustadas a cada café y modo receta
   ========================================================================== */
export type MethodId = "v60" | "chemex" | "aeropress" | "prensa" | "espresso" | "italiana"

type MethodStep = { share: number | null; seconds: number; text: string }
type MethodDef = {
  id: MethodId
  name: string
  photo: string
  difficulty: "Fácil" | "Media" | "Exigente"
  intro: string
  dose: number
  ratio: number
  unit: "ml" | "g"
  temp: number
  grind: string
  equipment: string
  steps: MethodStep[]
}

export const METHODS: MethodDef[] = [
  {
    id: "v60",
    name: "V60",
    photo: "/kiln/brew/v60.jpg",
    difficulty: "Media",
    intro: "Un cono, un papel y un vertido paciente. La taza más limpia y la que mejor deja oír al café.",
    dose: 15,
    ratio: 16.7,
    unit: "ml",
    temp: 94,
    grind: "Media-fina, como sal fina",
    equipment: "Hario V60 02, filtro de papel, hervidor de cuello de cisne, báscula",
    steps: [
      { share: 0.18, seconds: 40, text: "Vierte en espiral para que el café florezca y suelte el gas." },
      { share: 0.6, seconds: 40, text: "Vertido continuo desde el centro hacia fuera, sin tocar el papel." },
      { share: 1, seconds: 35, text: "Completa con un vertido suave y deja de verter." },
      { share: null, seconds: 40, text: "Deja que drene hasta que la cama quede plana." },
    ],
  },
  {
    id: "chemex",
    name: "Chemex",
    photo: "/kiln/brew/chemex.jpg",
    difficulty: "Media",
    intro: "Papel grueso y una jarra para compartir. Más cuerpo que la V60, igual de nítida.",
    dose: 30,
    ratio: 16.7,
    unit: "ml",
    temp: 94,
    grind: "Media-gruesa, como sal marina",
    equipment: "Chemex de 6 tazas, filtro Chemex, hervidor, báscula",
    steps: [
      { share: 0.12, seconds: 45, text: "Moja todo el café y deja que florezca." },
      { share: 0.5, seconds: 60, text: "Vierte en círculos lentos hasta la mitad del agua." },
      { share: 1, seconds: 60, text: "Completa el agua manteniendo el nivel estable." },
      { share: null, seconds: 105, text: "Deja que drene. Retira el filtro y mueve la jarra." },
    ],
  },
  {
    id: "aeropress",
    name: "AeroPress",
    photo: "/kiln/brew/aeropress.jpg",
    difficulty: "Fácil",
    intro: "Inmersión corta y un poco de presión. Difícil que salga mal, fácil de llevar a cualquier sitio.",
    dose: 15,
    ratio: 14.7,
    unit: "ml",
    temp: 90,
    grind: "Media, como arena",
    equipment: "AeroPress, filtro de papel, taza resistente, báscula",
    steps: [
      { share: 0.25, seconds: 20, text: "Moja todo el café y remueve tres veces." },
      { share: 1, seconds: 15, text: "Completa con el resto del agua y coloca el émbolo." },
      { share: null, seconds: 55, text: "Deja infusionar sin mover nada." },
      { share: null, seconds: 30, text: "Presiona despacio hasta oír el siseo." },
    ],
  },
  {
    id: "prensa",
    name: "Prensa francesa",
    photo: "/kiln/brew/prensa.jpg",
    difficulty: "Fácil",
    intro: "Todo el café, toda el agua y cuatro minutos. Cuerpo redondo y textura densa.",
    dose: 30,
    ratio: 16.7,
    unit: "ml",
    temp: 95,
    grind: "Gruesa, como pan rallado",
    equipment: "Prensa francesa de 1 litro, hervidor, báscula, cuchara",
    steps: [
      { share: 1, seconds: 15, text: "Vierte toda el agua de una vez sobre el café." },
      { share: null, seconds: 205, text: "Deja infusionar sin tocar." },
      { share: null, seconds: 10, text: "Rompe la costra y retira la espuma con una cuchara." },
      { share: null, seconds: 10, text: "Baja el filtro justo hasta la superficie y sirve." },
    ],
  },
  {
    id: "espresso",
    name: "Espresso",
    photo: "/kiln/brew/espresso.jpg",
    difficulty: "Exigente",
    intro: "Nueve bares, treinta segundos. Cada gramo y cada segundo cuentan.",
    dose: 18,
    ratio: 2.2,
    unit: "g",
    temp: 93,
    grind: "Fina, como harina gruesa",
    equipment: "Máquina de espresso, molino de espresso, báscula con temporizador",
    steps: [
      { share: 0.1, seconds: 6, text: "Preinfusión: deja que la pastilla se moje por completo." },
      { share: 1, seconds: 24, text: "Extracción continua. Corta al llegar al peso." },
    ],
  },
  {
    id: "italiana",
    name: "Italiana",
    photo: "/kiln/brew/italiana.jpg",
    difficulty: "Fácil",
    intro: "La cafetera de casa. Con agua caliente y fuego medio, sin amargor.",
    dose: 20,
    ratio: 10,
    unit: "ml",
    temp: 70,
    grind: "Media-fina, algo más gruesa que espresso",
    equipment: "Cafetera italiana de 4 tazas, hervidor",
    steps: [
      { share: 1, seconds: 20, text: "Llena la base con agua caliente hasta la válvula." },
      { share: null, seconds: 20, text: "Llena el filtro sin apretar y cierra la cafetera." },
      { share: null, seconds: 180, text: "Fuego medio con la tapa abierta hasta que empiece a salir." },
      { share: null, seconds: 60, text: "Retira del fuego en cuanto aclare y enfría la base." },
    ],
  },
]

export type RecipeStep = { start: number; seconds: number; target: number | null; text: string }
export type Recipe = {
  method: MethodDef
  lot: CoffeeLot
  dose: number
  water: number
  unit: "ml" | "g"
  temp: number
  grind: string
  totalSeconds: number
  steps: RecipeStep[]
}

export const BREW_COFFEES = COFFEE_LOTS.filter((lot) => lot.category !== "Formatos")

// Método que mejor encaja con la receta del café
export const methodForLot = (lot: CoffeeLot): MethodId => {
  const m = lot.recipe.method.toLowerCase()
  if (m.startsWith("espresso")) return "espresso"
  if (m.includes("aeropress")) return "aeropress"
  if (m.includes("chemex")) return "chemex"
  if (m.includes("prensa")) return "prensa"
  return "v60"
}

const toSeconds = (value: string) => {
  const [m, s] = value.trim().split(":").map(Number)
  return (m || 0) * 60 + (s || 0)
}

// «0:40 – 1:20» → 40 s; «150 ml» → 150
const parseLotSteps = (lot: CoffeeLot): Omit<RecipeStep, "start">[] =>
  lot.recipe.steps.map((step) => {
    const [from, to] = step.time.split(/[–-]/)
    return {
      seconds: Math.max(1, toSeconds(to ?? from) - toSeconds(from)),
      target: parseFloat(step.water) || null,
      text: step.note,
    }
  })

const roundTo = (n: number, step: number) => Math.round(n / step) * step

export function buildRecipe(methodId: MethodId, lot: CoffeeLot): Recipe {
  const method = METHODS.find((m) => m.id === methodId) ?? METHODS[0]
  let dose = method.dose
  let water: number
  let temp = method.temp
  let grind = method.grind
  let raw: Omit<RecipeStep, "start">[]

  if (methodForLot(lot) === method.id && lot.recipe.steps.length > 0) {
    // El método del café: su propia receta, tal y como la publicamos en la ficha
    dose = lot.recipe.doseG
    water = lot.recipe.waterMl
    temp = lot.recipe.tempC
    grind = lot.recipe.grindClicks
    raw = parseLotSteps(lot)
  } else {
    // Otro método: proporción y temperatura según el tueste
    const filterRoast = lot.roast === "Filtro"
    const espressoRoast = lot.roast === "Espresso"
    const ratio =
      method.id === "espresso"
        ? filterRoast ? 2.5 : espressoRoast ? 2 : method.ratio
        : method.ratio + (filterRoast ? 0.3 : espressoRoast ? -0.7 : 0)
    water = method.unit === "g" ? Math.round(dose * ratio) : roundTo(dose * ratio, 5)
    if (method.id !== "italiana") temp = method.temp + (filterRoast ? 1 : espressoRoast ? -2 : 0)
    raw = method.steps.map((s) => ({
      seconds: s.seconds,
      target: s.share === null ? null : s.share === 1 ? water : method.unit === "g" ? Math.round(water * s.share) : roundTo(water * s.share, 5),
      text: s.text,
    }))
  }

  let start = 0
  const steps = raw.map((s) => {
    const step = { ...s, start }
    start += s.seconds
    return step
  })
  return { method, lot, dose, water, unit: method.unit, temp, grind, totalSeconds: start, steps }
}

export const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}
const shortClock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
const durationLabel = (seconds: number) => (seconds < 60 ? `${seconds} s` : `${Math.round(seconds / 60)} min`)
const amount = (n: number, unit: string) => `${n.toLocaleString("es-ES")} ${unit}`
// Cantidad acumulada en cada paso: la última que se ha alcanzado
const targetAt = (recipe: Recipe, index: number) => {
  for (let i = index; i >= 0; i--) {
    const t = recipe.steps[i].target
    if (t !== null) return t
  }
  return null
}

/* ==========================================================================
   PÁGINA PREPARAR: índice de métodos y ficha de cada uno
   ========================================================================== */
export function PrepareView({ defaultLotId, onOpenLot }: { defaultLotId: string; onOpenLot: (lot: CoffeeLot) => void }) {
  const [methodId, setMethodId] = useState<MethodId | null>(null)
  const [lotId, setLotId] = useState<string>(BREW_COFFEES.some((l) => l.id === defaultLotId) ? defaultLotId : BREW_COFFEES[0].id)
  const [cooking, setCooking] = useState<boolean>(false)

  const lot = BREW_COFFEES.find((l) => l.id === lotId) ?? BREW_COFFEES[0]
  // Duración de cada método con el café elegido
  const recipes = useMemo(() => Object.fromEntries(METHODS.map((m) => [m.id, buildRecipe(m.id, lot)])) as Record<MethodId, Recipe>, [lot])

  const open = (id: MethodId | null) => {
    setMethodId(id)
    window.scrollTo({ top: 0 })
  }

  if (!methodId) {
    return (
      <section className="k-brew">
        <header className="k-subs-intro">
          <h1 className="k-view-title">Preparar</h1>
          <p className="k-prose k-lede">Cada café tiene su receta. Aquí la seguimos paso a paso, con el tiempo y el agua justos.</p>
        </header>
        <ul className="k-brew-methods">
          {METHODS.map((m) => (
            <li key={m.id}>
              <button type="button" className="k-brew-method" onClick={() => open(m.id)}>
                <span className="k-brew-photo">
                  <img src={m.photo} alt="" />
                </span>
                <span className="k-brew-method-name">{m.name}</span>
                <span className="k-brew-method-meta">
                  {durationLabel(recipes[m.id].totalSeconds)} · {m.difficulty}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  const recipe = recipes[methodId]
  const { method } = recipe
  return (
    <section className="k-brew k-brew-detail">
      <button type="button" className="k-text-link k-brew-back" onClick={() => open(null)}>
        — Todos los métodos
      </button>
      <div className="k-brew-layout">
        <div className="k-brew-figure">
          <img src={method.photo} alt={`${method.name} preparando café`} />
        </div>
        <div className="k-brew-body">
          <h1 className="k-view-title">{method.name}</h1>
          <p className="k-prose k-lede">{method.intro}</p>

          <div className="k-brew-coffee">
            <span className="k-co-label">Café</span>
            <TextSelect label="Café para la receta" value={lot.id} options={BREW_COFFEES.map((l) => ({ value: l.id, label: l.name }))} onChange={setLotId} />
            <small>{lot.notes.join(" · ")}</small>
          </div>

          <dl className="k-pairs k-brew-table">
            <div>
              <dt>Café</dt>
              <dd>{amount(recipe.dose, "g")}</dd>
            </div>
            <div>
              <dt>{recipe.unit === "g" ? "En taza" : "Agua"}</dt>
              <dd>{amount(recipe.water, recipe.unit)}</dd>
            </div>
            <div>
              <dt>Temperatura</dt>
              <dd>{recipe.temp} °C</dd>
            </div>
            <div>
              <dt>Molienda</dt>
              <dd>{recipe.grind}</dd>
            </div>
            <div>
              <dt>Tiempo total</dt>
              <dd>{shortClock(recipe.totalSeconds)}</dd>
            </div>
            <div>
              <dt>Equipo</dt>
              <dd>{method.equipment}</dd>
            </div>
          </dl>

          <ol className="k-brew-steps" aria-label="Pasos">
            {recipe.steps.map((step, i) => {
              const target = targetAt(recipe, i)
              return (
                <li key={i}>
                  <span className="k-brew-step-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="k-brew-step-time">
                    {shortClock(step.start)} – {shortClock(step.start + step.seconds)}
                  </span>
                  <span className="k-brew-step-amount">{target === null ? "—" : amount(target, recipe.unit)}</span>
                  <p>{step.text}</p>
                </li>
              )
            })}
          </ol>

          <button type="button" className="k-btn-solid k-brew-start" onClick={() => setCooking(true)}>
            Empezar
          </button>
        </div>
      </div>

      {cooking && (
        <RecipeMode
          recipe={recipe}
          onClose={() => setCooking(false)}
          onBackToCoffee={() => {
            setCooking(false)
            onOpenLot(lot)
          }}
        />
      )}
    </section>
  )
}

/* ==========================================================================
   MODO RECETA: pantalla completa, un paso cada vez
   ========================================================================== */
export function RecipeMode({ recipe, onClose, onBackToCoffee }: { recipe: Recipe; onClose: () => void; onBackToCoffee: () => void }) {
  const [elapsed, setElapsed] = useState<number>(0) // ms desde el inicio de la receta
  const [running, setRunning] = useState<boolean>(true)
  const rootRef = useRef<HTMLDivElement>(null)
  const total = recipe.totalSeconds * 1000
  const done = elapsed >= total
  const index = done ? recipe.steps.length - 1 : Math.max(0, recipe.steps.findIndex((s) => elapsed < (s.start + s.seconds) * 1000))
  const step = recipe.steps[index]
  const stepProgress = done ? 1 : Math.min(1, (elapsed - step.start * 1000) / (step.seconds * 1000))
  const target = targetAt(recipe, index)

  // Reloj: cuenta por diferencia de tiempo real para no derivar
  useEffect(() => {
    if (!running || done) return
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      setElapsed((e) => Math.min(total, e + (now - last)))
      last = now
    }, 100)
    return () => window.clearInterval(id)
  }, [running, done, total])

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(recipe.steps.length - 1, i))
    setElapsed(recipe.steps[next].start * 1000)
  }
  const next = () => (index >= recipe.steps.length - 1 ? setElapsed(total) : goTo(index + 1))
  const prev = () => {
    if (done) {
      goTo(recipe.steps.length - 1)
      setRunning(true)
      return
    }
    // Como un reproductor: primero vuelve al inicio del paso
    if (elapsed - step.start * 1000 > 2000 || index === 0) goTo(index)
    else goTo(index - 1)
  }

  // Teclado: espacio pausa, flechas cambian de paso, Escape cierra
  const keys = useRef({ next, prev, onClose, toggle: () => setRunning((r) => !r) })
  keys.current = { next, prev, onClose, toggle: () => setRunning((r) => !r) }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") keys.current.onClose()
      else if (e.key === " " || e.code === "Space") keys.current.toggle()
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") keys.current.next()
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") keys.current.prev()
      else return
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [])

  // Foco dentro, scroll bloqueado y foco devuelto al cerrar
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    rootRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.({ preventScroll: true })
    }
  }, [])

  const host = typeof document !== "undefined" ? document.querySelector(".kiln-shell") ?? document.body : null
  if (!host) return null

  return createPortal(
    <div ref={rootRef} className="k-recipe" role="dialog" aria-modal="true" aria-label={`Receta: ${recipe.method.name} con ${recipe.lot.name}`} tabIndex={-1}>
      <header className="k-recipe-top">
        <span>{done ? "Receta terminada" : `Paso ${String(index + 1).padStart(2, "0")} de ${String(recipe.steps.length).padStart(2, "0")}`}</span>
        <span className="k-recipe-title">
          {recipe.method.name} · {recipe.lot.name}
        </span>
        <button type="button" className="k-recipe-close" onClick={onClose}>
          Cerrar ✕
        </button>
      </header>

      {done ? (
        <div className="k-recipe-main is-done" aria-live="polite">
          <p className="k-recipe-text">Listo. Disfrútalo.</p>
          <p className="k-recipe-summary">
            {amount(recipe.dose, "g")} · {amount(recipe.water, recipe.unit)} · {clock(recipe.totalSeconds)}
          </p>
          <button type="button" className="k-text-link" onClick={onBackToCoffee}>
            — Volver al café
          </button>
        </div>
      ) : (
        <div className="k-recipe-main" key={index}>
          <p className="k-recipe-text" aria-live="polite">
            {step.text}
          </p>
          <p className="k-recipe-target">{target === null ? "—" : amount(target, recipe.unit)}</p>
        </div>
      )}

      <footer className="k-recipe-foot">
        <div className="k-recipe-clock">
          <span className="k-recipe-time" role="timer" aria-label={`Tiempo ${clock(elapsed / 1000)}`}>
            {clock(elapsed / 1000)}
          </span>
          {!done && <small>{running ? `Siguiente a las ${shortClock(step.start + step.seconds)}` : "En pausa"}</small>}
        </div>
        <div className="k-recipe-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${stepProgress})` }} />
        </div>
        <nav className="k-recipe-controls" aria-label="Controles de la receta">
          <button type="button" className="k-text-link" onClick={prev} disabled={index === 0 && elapsed < 2000}>
            — Paso anterior
          </button>
          {!done && (
            <button type="button" className="k-text-link" onClick={() => setRunning((r) => !r)}>
              {running ? "— Pausa" : "— Seguir"}
            </button>
          )}
          {!done && (
            <button type="button" className="k-text-link" onClick={next}>
              — Siguiente
            </button>
          )}
        </nav>
      </footer>
    </div>,
    host
  )
}
