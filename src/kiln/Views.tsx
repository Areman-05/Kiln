"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Bag } from "./Bag"
import { RecipeMode, buildRecipe, methodForLot } from "./Brew"
import {
  BAG_SIZES,
  COFFEE_LOTS,
  OBJECTS,
  PHOTOS,
  PRODUCERS,
  producerForLot,
  type Producer,
  type BagSizeOption,
  type CoffeeLot,
  type GrindOption,
} from "./data"
import { LotCard, formatEur, type SubTab, type ViewName } from "./Components"

/* ==========================================================================
   1. VISTA HOME (Editorial, Fotográfica, Rica en Valor Real)
   ========================================================================== */
export function HomeView({
  onNavigate,
  onOpenSeason,
  onOpenSubTab,
}: {
  onNavigate: (v: ViewName) => void
  onOpenSeason: () => void
  onOpenSubTab: (tab: SubTab) => void
}) {
  const tiles: { label: string; image: string; alt: string; onClick: () => void }[] = [
    { label: "Comprar café", image: PHOTOS.homeShop, alt: "Granos de café tostado", onClick: () => onNavigate("shop") },
    {
      label: "Suscripciones",
      image: PHOTOS.homeSubscriptions,
      alt: "Superficie de un café vista desde arriba",
      onClick: () => {
        onOpenSubTab("personal")
        onNavigate("subscriptions")
      },
    },
    { label: "Origen", image: PRODUCERS[0].photo, alt: `Paisaje de ${PRODUCERS[0].region}, ${PRODUCERS[0].country}`, onClick: () => onNavigate("origin") },
    { label: "Objetos", image: OBJECTS[0].photos[0], alt: OBJECTS[0].name, onClick: () => onNavigate("objects") },
  ]

  return (
    <div className="k-home-v2">
      <button type="button" className="k-media-link k-home-v2-hero" onClick={onOpenSeason}>
        <img src={PHOTOS.homeSeason} alt="Sombras de hojas de palmera sobre un muro" />
        <span className="k-media-label">
          <small>Temporada</small>
          <span className="k-media-title">Nueva colección</span>
        </span>
      </button>

      <div className="k-home-v2-grid">
        {tiles.map((tile) => (
          <button key={tile.label} type="button" className="k-media-link" onClick={tile.onClick}>
            <img src={tile.image} alt={tile.alt} loading="lazy" />
            <span className="k-media-label"><span className="k-media-title">{tile.label}</span></span>
          </button>
        ))}
      </div>
    </div>
  )
}

type SortKey = "no" | "price-asc" | "price-desc" | "score"
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "no", label: "Colección" },
  { value: "score", label: "Puntuación" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
]

/* Barras fijas inferiores: se montan en <body> para que el desenfoque del
   menú lateral (filter en <main>) no altere su posición fija. */
function BodyPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body)
}

type FilterKey = "uso" | "sabor" | "proceso" | "origen" | "coleccion" | "precio"
type FilterGroup = { key: FilterKey; label: string; options: { value: string; test: (lot: CoffeeLot) => boolean }[] }

const unique = <T,>(values: T[]) => Array.from(new Set(values))

/* Grupos de filtro: cada opción es una regla sobre los datos reales del café */
const FILTER_GROUPS: FilterGroup[] = [
  {
    key: "uso",
    label: "Uso",
    options: ["Filtro", "Espresso", "Omnitueste"].map((value) => ({ value, test: (l: CoffeeLot) => l.roast === value })),
  },
  {
    key: "sabor",
    label: "Sabor",
    options: [
      { value: "Floral", test: (l) => l.sensory.floral >= 8 },
      { value: "Frutal", test: (l) => l.sensory.sweetness >= 8 && l.sensory.acidity >= 7 },
      { value: "Intenso", test: (l) => l.sensory.body >= 8 },
    ],
  },
  {
    key: "proceso",
    label: "Proceso",
    options: ["Lavado", "Natural", "Honey / Semilavado", "Maceración carbónica", "Ensamblaje"].map((value) => ({
      value,
      test: (l: CoffeeLot) => l.process === value,
    })),
  },
  {
    key: "origen",
    label: "Origen",
    options: unique(COFFEE_LOTS.map((l) => l.country)).map((value) => ({ value, test: (l: CoffeeLot) => l.country === value })),
  },
  {
    key: "coleccion",
    label: "Colección",
    options: ["Cosecha Estacional", "Microlote", "Reserva Competición", "Casa & Espresso", "Formatos"].map((value) => ({
      value,
      test: (l: CoffeeLot) => l.category === value,
    })),
  },
  {
    key: "precio",
    label: "Precio",
    options: [
      { value: "Hasta 17 €", test: (l) => l.price250 < 17 },
      { value: "17 – 22 €", test: (l) => l.price250 >= 17 && l.price250 <= 22 },
      { value: "Más de 22 €", test: (l) => l.price250 > 22 },
    ],
  },
]

const EMPTY_FILTERS: Record<FilterKey, string> = { uso: "", sabor: "", proceso: "", origen: "", coleccion: "", precio: "" }

const initialFilters = (category: string): Record<FilterKey, string> => {
  const group = FILTER_GROUPS.find((g) => g.options.some((o) => o.value === category))
  return group ? { ...EMPTY_FILTERS, [group.key]: category } : EMPTY_FILTERS
}

export function ShopView({
  initialCategory = "Todos",
  onSelectLot,
  onQuickAdd,
  comparedIds,
  onToggleCompare,
  producer = null,
  onClearProducer,
  picks = null,
  onClearPicks,
}: {
  producer?: Producer | null
  onClearProducer?: () => void
  picks?: string[] | null
  onClearPicks?: () => void
  initialCategory?: string
  onSelectLot: (lot: CoffeeLot) => void
  onQuickAdd: (lot: CoffeeLot, size: BagSizeOption, grind: GrindOption) => void
  comparedIds: string[]
  onToggleCompare: (id: string) => void
  onOpenMatcher: () => void
}) {
  const [filters, setFilters] = useState<Record<FilterKey, string>>(() => initialFilters(initialCategory))
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortKey>("no")
  const [panel, setPanel] = useState<"filter" | "sort" | null>(null)
  const dockRef = useRef<HTMLDivElement>(null)

  // Cierre de paneles con clic fuera o Escape
  useEffect(() => {
    if (!panel) return
    const onDown = (e: PointerEvent) => {
      if (dockRef.current && !dockRef.current.contains(e.target as Node)) setPanel(null)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null)
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [panel])

  const matches = (lot: CoffeeLot, skip?: FilterKey) => {
    for (const group of FILTER_GROUPS) {
      const selected = filters[group.key]
      if (!selected || group.key === skip) continue
      const option = group.options.find((o) => o.value === selected)
      if (option && !option.test(lot)) return false
    }
    if (producer && !producer.lotIds.includes(lot.id)) return false
    if (picks && !picks.includes(lot.id)) return false
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      const hay = `${lot.name} ${lot.origin} ${lot.country} ${lot.variety} ${lot.notes.join(" ")} ${lot.producer} ${lot.process} ${lot.roast}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  }

  const filteredLots = COFFEE_LOTS.filter((l) => matches(l)).sort((a, b) => {
    if (sortBy === "price-asc") return a.price250 - b.price250
    if (sortBy === "price-desc") return b.price250 - a.price250
    if (sortBy === "score") return parseFloat(b.score) - parseFloat(a.score)
    return a.no.localeCompare(b.no)
  })

  // Recuento por opción teniendo en cuenta el resto de filtros activos
  const countFor = (group: FilterGroup, test: (lot: CoffeeLot) => boolean) =>
    COFFEE_LOTS.filter((l) => matches(l, group.key) && test(l)).length

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery.trim() ? 1 : 0)
  const toggleFilter = (key: FilterKey, value: string) => setFilters((f) => ({ ...f, [key]: f[key] === value ? "" : value }))
  const resetFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearchQuery("")
  }
  const togglePanel = (next: "filter" | "sort") => setPanel((current) => (current === next ? null : next))

  return (
    <section className="k-section-sm k-shop-view">
      <div className="k-container">
        <header className="k-shop-head">
          <h1>Todos los cafés</h1>
          {producer && (
            <p className="k-shop-note">
              Cafés de {producer.name}
              <button type="button" className="k-text-link" onClick={onClearProducer}>
                — Ver todos
              </button>
            </p>
          )}
          {picks && (
            <p className="k-shop-note">
              Cafés para ti, según tu perfil de sabor
              <button type="button" className="k-text-link" onClick={onClearPicks}>
                — Ver todos
              </button>
            </p>
          )}
        </header>

        {/* Estado vacío con recuperación (Heurística de Nielsen #9) */}
        {filteredLots.length === 0 ? (
          <div className="k-shop-empty">
            <h3 className="k-title-md">Sin resultados</h3>
            <p>Ningún café coincide con estos filtros.</p>
            <button type="button" className="k-btn-primary" onClick={resetFilters}>
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="k-catalog-grid">
            {filteredLots.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                onSelectLot={onSelectLot}
                onQuickAdd={onQuickAdd}
                isCompared={comparedIds.includes(lot.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        )}
      </div>

      <BodyPortal>
        <div className="k-dock" ref={dockRef}>
          {panel === "filter" && (
            <div id="k-dock-filter" className="k-dock-panel" role="dialog" aria-label="Filtrar">
              {FILTER_GROUPS.map((group) => (
                <div key={group.key} className="k-dock-group" role="group" aria-labelledby={`k-dock-${group.key}`}>
                  <span id={`k-dock-${group.key}`}>{group.label}</span>
                  <div>
                    <button type="button" aria-pressed={!filters[group.key]} onClick={() => setFilters((f) => ({ ...f, [group.key]: "" }))}>
                      Todos
                    </button>
                    {group.options.map((option) => {
                      const count = countFor(group, option.test)
                      const selected = filters[group.key] === option.value
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          disabled={count === 0 && !selected}
                          onClick={() => toggleFilter(group.key, option.value)}
                        >
                          {option.value}
                          <sup>{count}</sup>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="k-dock-tools">
                <label>
                  <span>Buscar</span>
                  <input
                    type="search"
                    placeholder="Nombre, nota, variedad"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </label>
                <span className="k-dock-results" aria-live="polite">
                  {filteredLots.length} {filteredLots.length === 1 ? "café" : "cafés"}
                </span>
                <button type="button" className="k-dock-reset" onClick={resetFilters} disabled={activeFilterCount === 0}>
                  Limpiar
                </button>
              </div>
            </div>
          )}

          {panel === "sort" && (
            <div id="k-dock-sort" className="k-dock-panel is-sort" role="listbox" aria-label="Ordenar">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={sortBy === option.value}
                  onClick={() => {
                    setSortBy(option.value)
                    setPanel(null)
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <div className="k-dock-bar">
            <button type="button" aria-expanded={panel === "filter"} aria-controls="k-dock-filter" onClick={() => togglePanel("filter")}>
              Filtrar
              {activeFilterCount > 0 && <span className="k-dock-count">[ {activeFilterCount} ]</span>}
            </button>
            <button type="button" aria-expanded={panel === "sort"} aria-controls="k-dock-sort" onClick={() => togglePanel("sort")}>
              Ordenar
              {sortBy !== "no" && <span className="k-dock-count">[ 1 ]</span>}
            </button>
          </div>
        </div>
      </BodyPortal>
    </section>
  )
}

/* ==========================================================================
   3. VISTA DETALLE DE PRODUCTO (galería de bolsa + ficha técnica y compra)
   ========================================================================== */

/* Novedades: los 6 primeros lotes de Cosecha Estacional, 2 por fila */
const NEW_ARRIVALS = COFFEE_LOTS.filter((lot) => lot.category === "Cosecha Estacional").slice(0, 6)

export function NewArrivalsView({ onSelectLot }: { onSelectLot: (lot: CoffeeLot) => void }) {
  return (
    <section className="k-section-sm k-shop-view k-news-view">
      <div className="k-container">
        <header className="k-shop-head">
          <h1>Novedades</h1>
        </header>
        <div className="k-catalog-grid is-editorial">
          {NEW_ARRIVALS.map((lot) => (
            <LotCard key={lot.id} lot={lot} onSelectLot={onSelectLot} onQuickAdd={() => {}} isCompared={false} onToggleCompare={() => {}} />
          ))}
        </div>
      </div>
    </section>
  )
}

const GROUND_OPTIONS: { id: GrindOption; label: string }[] = [
  { id: "Filtro / V60", label: "Filtro" },
  { id: "Espresso", label: "Espresso" },
  { id: "Italiana (Moka)", label: "Italiana" },
  { id: "Aeropress", label: "Aeropress" },
  { id: "Prensa francesa", label: "Prensa francesa" },
]

const BAG_VIEWS = [
  ["front", "Frente"],
  ["side", "Lateral"],
  ["back", "Dorso"],
] as const

type BagView = (typeof BAG_VIEWS)[number][0]

// «Hario V60 02 (Papel blanqueado japonés)» → «V60»: el método en una palabra para la etiqueta
const shortMethod = (method: string) => {
  const known = ["V60", "Kalita", "Aeropress", "Chemex", "Origami", "Switch", "Espresso"]
  return known.find((m) => method.includes(m)) ?? method.replace(/\s*\(.*\)/, "").split(" / ")[0]
}

// Tueste semanal de los lunes: fecha del último lunes, para la etiqueta trasera
const lastRoastDay = () => {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
}

// "2.150 – 2.280 m" → "2.150 m"
const minAltitude = (altitude: string) => `${altitude.split("–")[0].replace(/m\s*$/i, "").trim()} m`

const joinUnits = (parts: string[]) =>
  parts.map((part, i) => (
    <React.Fragment key={part}>
      {i > 0 && " · "}
      <span className="k-nowrap">{part}</span>
    </React.Fragment>
  ))

export function ProductDetailView({
  lot,
  onBack,
  onAddToCart,
  onSelectLot,
  isMember,
  onMeetProducer,
}: {
  onMeetProducer: (producer: Producer) => void
  lot: CoffeeLot
  onBack: () => void
  onAddToCart: (lot: CoffeeLot, size: BagSizeOption, grind: GrindOption) => void
  onSelectLot: (lot: CoffeeLot) => void
  isMember: boolean
}) {
  const [size, setSize] = useState<BagSizeOption>("250g")
  const [grind, setGrind] = useState<GrindOption>("En grano")
  const [bagView, setBagView] = useState<BagView>("front")
  const producer = producerForLot(lot)
  const [viewDir, setViewDir] = useState<"next" | "prev">("next")
  const [added, setAdded] = useState<boolean>(false)
  const [openInfo, setOpenInfo] = useState<Record<"story" | "brew", boolean>>({ story: false, brew: false })
  const [cooking, setCooking] = useState<boolean>(false)
  const addedTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(addedTimer.current), [])

  const viewIndex = BAG_VIEWS.findIndex(([v]) => v === bagView)
  const goToView = (index: number, dir: "next" | "prev") => {
    setViewDir(dir)
    setBagView(BAG_VIEWS[(index + BAG_VIEWS.length) % BAG_VIEWS.length][0])
  }

  const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
  const rawPrice = Math.round(lot.price250 * sizeObj.multiplier * 100) / 100
  // Los suscriptores ven y pagan directamente el precio con su 12% de descuento
  const unitPrice = isMember ? Math.round(rawPrice * 0.88 * 100) / 100 : rawPrice
  const ground = grind !== "En grano"
  const bagLot = {
    name: lot.name,
    no: lot.no,
    origin: lot.origin,
    producer: lot.producer,
    region: lot.region,
    altitude: lot.altitude,
    process: lot.process,
    roast: lot.roast,
    variety: lot.variety,
    notes: lot.notes,
    tone: lot.tone,
    weight: sizeObj.label,
    recipe: `${shortMethod(lot.recipe.method)} · ${lot.recipe.doseG} g · ${lot.recipe.waterMl} ml · ${lot.recipe.tempC} °C`,
    roastedOn: lastRoastDay(),
  }

  // El botón confirma por sí mismo durante 1,5 s: sin avisos ni saltos de maquetación
  const handleAdd = () => {
    onAddToCart(lot, size, grind)
    setAdded(true)
    window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setAdded(false), 1500)
  }
  const addLabel = added ? "Añadido ✓" : `Añadir — ${formatEur(unitPrice)}`

  const relatedLots = [
    ...COFFEE_LOTS.filter((item) => item.id !== lot.id && item.roast === lot.roast),
    ...COFFEE_LOTS.filter((item) => item.id !== lot.id && item.roast !== lot.roast),
  ].slice(0, 3)

  const infoBlocks: { id: "story" | "brew"; label: string; body: React.ReactNode }[] = [
    { id: "story", label: "Historia del café", body: <p className="k-prose">{lot.story}</p> },
    {
      id: "brew",
      label: "Cómo prepararlo",
      body: (
        <>
          <p className="k-pdp2-recipe">
            {lot.recipe.method} · {lot.recipe.doseG} g · {lot.recipe.waterMl} ml · {lot.recipe.tempC} °C · {lot.recipe.totalTime} min
          </p>
          {lot.recipe.steps.length > 0 && (
            <ol className="k-pdp2-steps">
              {lot.recipe.steps.map((step) => (
                <li key={`${step.time}-${step.water}`}>
                  <span>{step.time}</span>
                  <span>{step.water}</span>
                  <span>{step.note}</span>
                </li>
              ))}
            </ol>
          )}
        </>
      ),
    },
  ]

  return (
    <section className="k-pdp2">
      <div className="k-pdp2-layout">
        <div className="k-pdp2-media">
          <button type="button" className="k-pdp2-back" onClick={onBack}>
            — Volver
          </button>
          <div className="k-pdp2-frame">
            <button type="button" className="k-pdp2-arrow is-prev" aria-label="Vista anterior" onClick={() => goToView(viewIndex - 1, "prev")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
            </button>
            <div key={bagView} className={`k-pdp2-bag is-${viewDir}`}>
              <Bag lot={{ ...bagLot, view: bagView }} size="xl" />
            </div>
            <button type="button" className="k-pdp2-arrow is-next" aria-label="Vista siguiente" onClick={() => goToView(viewIndex + 1, "next")}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
            </button>
          </div>
        </div>

        <div className="k-pdp2-panel">
          <div className="k-pdp2-title">
            <h1>{lot.name}</h1>
            <p className="k-pdp2-cost">
              {formatEur(unitPrice)}
              <small>{isMember ? `${sizeObj.label} · −12%` : sizeObj.label}</small>
            </p>
          </div>

          <div className="k-pdp2-spec">
            {/* Cada dato es una unidad que no se parte; solo se salta línea entre separadores */}
            <p>{joinUnits([lot.country, lot.process, minAltitude(lot.altitude)])}</p>
            <p className="is-soft">{joinUnits(lot.notes)}</p>
            {producer && (
              <button type="button" className="k-text-link" onClick={() => onMeetProducer(producer)}>
                — Conoce al productor
              </button>
            )}
          </div>

          <div className="k-pdp2-options">
            <div className="k-pdp2-option" role="group" aria-labelledby="k-pdp2-size">
              <span id="k-pdp2-size">Tamaño</span>
              <div>
                {BAG_SIZES.map((s) => (
                  <button key={s.id} type="button" aria-pressed={size === s.id} onClick={() => setSize(s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="k-pdp2-option" role="group" aria-labelledby="k-pdp2-grind">
              <span id="k-pdp2-grind">Café</span>
              <div>
                <button type="button" aria-pressed={!ground} onClick={() => setGrind("En grano")}>
                  En grano
                </button>
                <button type="button" aria-pressed={ground} onClick={() => !ground && setGrind(lot.roast === "Espresso" ? "Espresso" : "Filtro / V60")}>
                  Molido
                </button>
              </div>
            </div>

            {ground && (
              <div className="k-pdp2-option is-method" role="group" aria-labelledby="k-pdp2-method">
                <span id="k-pdp2-method">Método</span>
                <div>
                  {GROUND_OPTIONS.map((g) => (
                    <button key={g.id} type="button" aria-pressed={grind === g.id} onClick={() => setGrind(g.id)}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="button" className={`k-pdp2-cta ${added ? "is-added" : ""}`} onClick={handleAdd} aria-live="polite">
            {addLabel}
          </button>
          <p className="k-pdp2-note">Tostado esta semana · Envío 24 h gratis desde 38 €</p>

          <div className="k-pdp2-info">
            {infoBlocks.map((block) => {
              const open = openInfo[block.id]
              return (
                <div key={block.id} className={`k-pdp2-acc ${open ? "is-open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`k-pdp2-${block.id}`}
                    onClick={() => setOpenInfo((s) => ({ ...s, [block.id]: !s[block.id] }))}
                  >
                    {block.label}
                    <i aria-hidden="true">{open ? "−" : "+"}</i>
                  </button>
                  {block.id === "brew" && (
                    <span className="k-pdp2-acc-extra">
                      <button type="button" className="k-text-link" onClick={() => setCooking(true)}>
                        — Prepararlo ahora
                      </button>
                    </span>
                  )}
                  <div id={`k-pdp2-${block.id}`} className="k-pdp2-acc-body" aria-hidden={!open}>
                    <div>{block.body}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {cooking && (
        <RecipeMode recipe={buildRecipe(methodForLot(lot), lot)} onClose={() => setCooking(false)} onBackToCoffee={() => setCooking(false)} />
      )}

      <div className="k-shop-view k-pdp2-related">
        <h2>Otros cafés</h2>
        <div className="k-catalog-grid">
          {relatedLots.map((r) => (
            <LotCard
              key={r.id}
              lot={r}
              onSelectLot={onSelectLot}
              onQuickAdd={(l, s, g) => onAddToCart(l, s, g)}
              isCompared={false}
              onToggleCompare={() => {}}
            />
          ))}
        </div>
      </div>

      <BodyPortal>
        <div className="k-pdp2-mobilebar">
          <button type="button" className={added ? "is-added" : ""} onClick={handleAdd}>
            {addLabel}
          </button>
        </div>
      </BodyPortal>
    </section>
  )
}
