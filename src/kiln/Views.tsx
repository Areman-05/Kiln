"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Bag } from "./Bag"
import {
  BAG_SIZES,
  CAFE_MENU,
  COFFEE_LOTS,
  GRIND_OPTIONS,
  PHOTOS,
  SUBSCRIPTION_PLANS,
  type BagSizeOption,
  type CoffeeLot,
  type GrindOption,
} from "./data"
import {
  InteractiveBrewStudio,
  LotCard,
  RoastCurveChart,
  SensoryRadar,
  formatEur,
  type ActiveSubscription,
  type SubTab,
  type ViewName,
} from "./Components"

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
    { label: "Sobre nosotros", image: PHOTOS.homeAbout, alt: "Superficie de bloques de hormigón", onClick: () => onNavigate("studio") },
    {
      label: "Regalos",
      image: PHOTOS.homeGifts,
      alt: "Formas abstractas en blanco y negro",
      onClick: () => {
        onOpenSubTab("gift")
        onNavigate("subscriptions")
      },
    },
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

const ROAST_OPTIONS = ["Todos", "Cosecha Estacional", "Filtro", "Omnitueste", "Espresso", "Reserva Competición", "Formatos"]
const PROCESS_OPTIONS = ["Todos", "Lavado", "Natural", "Maceración carbónica", "Honey / Semilavado", "Ensamblaje"]

export function ShopView({
  initialCategory = "Todos",
  onSelectLot,
  onQuickAdd,
  comparedIds,
  onToggleCompare,
  onOpenMatcher,
}: {
  initialCategory?: string
  onSelectLot: (lot: CoffeeLot) => void
  onQuickAdd: (lot: CoffeeLot, size: BagSizeOption, grind: GrindOption) => void
  comparedIds: string[]
  onToggleCompare: (id: string) => void
  onOpenMatcher: () => void
}) {
  const [roastFilter, setRoastFilter] = useState<string>(initialCategory)
  const [processFilter, setProcessFilter] = useState<string>("Todos")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<"no" | "price-asc" | "price-desc" | "score">("no")
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false)

  const filteredLots = useMemo(() => {
    return COFFEE_LOTS.filter((l) => {
      if (roastFilter !== "Todos" && l.roast !== roastFilter && l.category !== roastFilter) {
        return false
      }
      if (processFilter !== "Todos" && l.process !== processFilter) {
        return false
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase()
        const hay = `${l.name} ${l.origin} ${l.variety} ${l.notes.join(" ")} ${l.producer}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price250 - b.price250
      if (sortBy === "price-desc") return b.price250 - a.price250
      if (sortBy === "score") return parseFloat(b.score) - parseFloat(a.score)
      return a.no.localeCompare(b.no)
    })
  }, [roastFilter, processFilter, searchQuery, sortBy])

  const activeFilterCount = [roastFilter !== "Todos", processFilter !== "Todos", searchQuery.trim() !== ""].filter(Boolean).length
  const resetFilters = () => {
    setRoastFilter("Todos")
    setProcessFilter("Todos")
    setSearchQuery("")
    setSortBy("no")
  }

  return (
    <section className="k-section-sm k-shop-view">
      <div className="k-container">
        <header className="k-shop-head">
          <h1>Todos los cafés</h1>
          <span className="k-shop-count">{String(filteredLots.length).padStart(2, "0")} cafés</span>
        </header>

        <div className="k-shop-controls">
          <button type="button" className="k-shop-control is-primary" onClick={onOpenMatcher}>
            <span>Encontrar mi café</span>
            <small>2 preguntas rápidas</small>
          </button>
          <button
            type="button"
            className="k-shop-control"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="k-shop-filters"
          >
            <span>{filtersOpen ? "Cerrar filtros" : "Filtrar"}</span>
            <small>{activeFilterCount > 0 ? `${activeFilterCount} activo${activeFilterCount > 1 ? "s" : ""}` : "Perfil, proceso, precio"}</small>
          </button>
        </div>

        {filtersOpen && (
          <div id="k-shop-filters" className="k-shop-filters">
            <fieldset className="k-shop-filter-row">
              <legend>Uso</legend>
              <div>
                {ROAST_OPTIONS.map((r) => (
                  <button key={r} type="button" aria-pressed={roastFilter === r} onClick={() => setRoastFilter(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="k-shop-filter-row">
              <legend>Proceso</legend>
              <div>
                {PROCESS_OPTIONS.map((p) => (
                  <button key={p} type="button" aria-pressed={processFilter === p} onClick={() => setProcessFilter(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="k-shop-filter-tools">
              <label>
                <span>Buscar</span>
                <input
                  type="search"
                  placeholder="Origen, nota o nombre"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </label>
              <label>
                <span>Ordenar</span>
                <select aria-label="Ordenar cafés" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                  <option value="no">Colección</option>
                  <option value="score">Puntuación</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                </select>
              </label>
              <button type="button" className="k-shop-reset" onClick={resetFilters} disabled={activeFilterCount === 0 && sortBy === "no"}>
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Estado vacío con recuperación (Heurística de Nielsen #9) */}
        {filteredLots.length === 0 ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--line-subtle)",
              padding: "4rem 2rem",
              textAlign: "center",
            }}
          >
            <h3 className="k-title-md">No hay lotes que coincidan con esa combinación</h3>
            <p style={{ color: "var(--ink-secondary)", margin: "0.5rem 0 1.5rem" }}>
              Prueba a restablecer los filtros de proceso o perfil de tueste para ver toda la cosecha.
            </p>
            <button
              type="button"
              className="k-btn-primary"
              onClick={resetFilters}
            >
              Restablecer todos los filtros
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
    </section>
  )
}

/* ==========================================================================
   3. VISTA DETALLE DE PRODUCTO (PDP Completo con Radar SCA, Curva y Receta)
   ========================================================================== */
export function ProductDetailView({
  lot,
  onBack,
  onAddToCart,
  onSelectLot,
}: {
  lot: CoffeeLot
  onBack: () => void
  onAddToCart: (
    lot: CoffeeLot,
    size: BagSizeOption,
    grind: GrindOption,
    qty: number,
    mode: " puntual" | "suscripcion",
    cadenceWeeks?: number
  ) => void
  onSelectLot: (lot: CoffeeLot) => void
}) {
  const [size, setSize] = useState<BagSizeOption>("250g")
  const [grind, setGrind] = useState<GrindOption>("En grano")
  const [purchaseMode, setPurchaseMode] = useState<" puntual" | "suscripcion">(" puntual")
  const [cadenceWeeks, setCadenceWeeks] = useState<number>(2)
  const [qty, setQty] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<"terroir" | "tueste" | "receta">("terroir")

  const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
  const rawPrice = Math.round(lot.price250 * sizeObj.multiplier * 100) / 100
  const unitPrice = purchaseMode === "suscripcion" ? Math.round(rawPrice * 0.88 * 100) / 100 : rawPrice

  const relatedLots = COFFEE_LOTS.filter((item) => item.id !== lot.id).slice(0, 3)

  return (
    <section className="k-section-sm">
      <div className="k-container">
        <div style={{ marginBottom: "1.5rem" }}>
          <button type="button" className="k-link-arrow" onClick={onBack}>
            ← Volver al catálogo de lotes
          </button>
        </div>

        <div className="k-pdp-grid">
          {/* Columna Izquierda: Escenario de Packaging + Radar SCA */}
          <div>
            <div className="k-pdp-gallery">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                }}
              >
                <span className="k-pill-tag">LOTE N.º {lot.no} · {lot.category.toUpperCase()}</span>
                <span className="k-pill-tag">PUNTUACIÓN SCA {lot.score}</span>
              </div>

              <Bag
                lot={{
                  name: lot.name,
                  no: lot.no,
                  origin: lot.origin,
                  variety: lot.variety,
                  altitude: lot.altitude,
                  process: lot.process,
                  roast: lot.roast,
                  notes: lot.notes,
                  tone: lot.tone,
                  score: lot.score,
                  producer: lot.producer,
                }}
                size="lg"
              />

              <p
                className="font-mono"
                style={{
                  fontSize: "0.68rem",
                  color: "var(--ink-muted)",
                  marginTop: "1.8rem",
                  textAlign: "center",
                }}
              >
                BOLSA BARRERA DE PAPEL ALGODÓN COMPOSTABLE CON VÁLVULA SUIZA WIPF · SELLADO EN N₂
              </p>
            </div>

            {/* Gráfico Radar y Curva de Tueste */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.25rem",
                marginTop: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--line-subtle)",
                  padding: "1.5rem",
                }}
              >
                <span className="k-eyebrow">RUEDA DE ATRIBUTOS SENSORIALES (LABORATORIO KILN)</span>
                <SensoryRadar sensory={lot.sensory} />
              </div>

              <RoastCurveChart lot={lot} />
            </div>
          </div>

          {/* Columna Derecha: Compra Configurable + Trazabilidad Completa */}
          <div>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <span className="k-eyebrow">{lot.origin}</span>
              <span className="k-eyebrow">·</span>
              <span className="k-eyebrow">COSECHA {lot.harvestMonth}</span>
              <span className="k-eyebrow">·</span>
              <span className="k-eyebrow">CUPO {lot.lotAllocationKg} KG</span>
            </div>

            <h1 className="k-title-lg" style={{ marginBottom: "0.4rem" }}>
              {lot.name}
            </h1>
            <p className="k-lead" style={{ marginBottom: "1.25rem" }}>
              {lot.subtitle}
            </p>

            {/* Notas de cata destacadas */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
              {lot.notes.map((n) => (
                <span
                  key={n}
                  className="k-note-chip"
                  style={{ fontSize: "0.9rem", padding: "0.35rem 0.85rem" }}
                >
                  {n}
                </span>
              ))}
            </div>

            <p style={{ fontSize: "0.95rem", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "2rem" }}>
              {lot.tastingParagraph}
            </p>

            {/* Panel Configurador de Compra */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--line-medium)",
                padding: "1.75rem",
                borderRadius: "var(--radius-sm)",
                marginBottom: "2.25rem",
              }}
            >
              {/* Paso 1: Formato de Peso */}
              <div style={{ marginBottom: "1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span className="k-eyebrow">1. FORMATO Y PESO NETO</span>
                  <span className="font-mono" style={{ fontSize: "0.7rem", color: "var(--ink-muted)" }}>
                    Tueste martes y jueves
                  </span>
                </div>
                <div className="k-selector-grid">
                  {BAG_SIZES.map((s) => {
                    const p = Math.round(lot.price250 * s.multiplier * 100) / 100
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`k-selector-option ${size === s.id ? "active" : ""}`}
                        onClick={() => setSize(s.id)}
                      >
                        <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                          {s.label} · {formatEur(p)}
                        </div>
                        <div className="sub" style={{ fontSize: "0.7rem", color: "var(--ink-muted)", marginTop: "0.15rem" }}>
                          {s.note}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Paso 2: Molienda */}
              <div style={{ marginBottom: "1.4rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  2. CALIBRACIÓN DE MOLIENDA (MAHLKÖNIG EK43S)
                </span>
                <div className="k-selector-grid">
                  {GRIND_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`k-selector-option ${grind === g.id ? "active" : ""}`}
                      onClick={() => setGrind(g.id)}
                    >
                      <div style={{ fontWeight: 500, fontSize: "0.84rem" }}>{g.id}</div>
                      <div className="sub" style={{ fontSize: "0.66rem", color: "var(--ink-muted)", marginTop: "0.15rem" }}>
                        {g.microns}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 3: Compra Puntual vs Suscripción (-12%) */}
              <div style={{ marginBottom: "1.5rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  3. MODALIDAD DE ENTREGA
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <button
                    type="button"
                    className={`k-selector-option ${purchaseMode === " puntual" ? "active" : ""}`}
                    onClick={() => setPurchaseMode(" puntual")}
                  >
                    <div style={{ fontWeight: 600 }}>Compra puntual</div>
                    <div className="sub" style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>
                      {formatEur(rawPrice)} · Envío único
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`k-selector-option ${purchaseMode === "suscripcion" ? "active" : ""}`}
                    onClick={() => setPurchaseMode("suscripcion")}
                  >
                    <div style={{ fontWeight: 600 }}>Suscripción (−12%)</div>
                    <div className="sub" style={{ fontSize: "0.74rem", color: "var(--ink-muted)" }}>
                      {formatEur(Math.round(rawPrice * 0.88 * 100) / 100)} · Sin permanencia
                    </div>
                  </button>
                </div>

                {purchaseMode === "suscripcion" && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.85rem",
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius-xs)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem" }}>Frecuencia de envío:</span>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {[1, 2, 4].map((w) => (
                        <button
                          key={w}
                          type="button"
                          className={`k-filter-pill ${cadenceWeeks === w ? "active" : ""}`}
                          onClick={() => setCadenceWeeks(w)}
                        >
                          Cada {w} {w === 1 ? "semana" : "semanas"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de Acción y Selector de Cantidad */}
              <div style={{ display: "flex", gap: "0.85rem", alignItems: "stretch" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    border: "1px solid var(--line-strong)",
                    borderRadius: "var(--radius-xs)",
                    background: "var(--bg-primary)",
                  }}
                >
                  <button
                    type="button"
                    style={{ padding: "0 0.9rem", fontSize: "1.1rem" }}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Reducir cantidad"
                  >
                    −
                  </button>
                  <span className="font-mono" style={{ minWidth: "2rem", textAlign: "center", fontWeight: 600 }}>
                    {qty}
                  </span>
                  <button
                    type="button"
                    style={{ padding: "0 0.9rem", fontSize: "1.1rem" }}
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="k-btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => onAddToCart(lot, size, grind, qty, purchaseMode, cadenceWeeks)}
                >
                  Añadir a la cesta · {formatEur(unitPrice * qty)}
                </button>
              </div>
            </div>

            {/* Pestañas de Documentación Agronómica, Trazabilidad y Receta */}
            <div>
              <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--line-medium)", paddingBottom: "0.75rem" }}>
                {[
                  { id: "terroir", label: "Ficha Agronómica y Terroir" },
                  { id: "tueste", label: "Transparencia FOB y Laboratorio" },
                  { id: "receta", label: "Receta de Extracción Paso a Paso" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`k-filter-pill ${activeTab === t.id ? "active" : ""}`}
                    onClick={() => setActiveTab(t.id as typeof activeTab)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {activeTab === "terroir" && (
                <div style={{ paddingTop: "1.25rem" }}>
                  <p style={{ fontSize: "0.92rem", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
                    {lot.story}
                  </p>
                  <p style={{ fontSize: "0.92rem", color: "var(--ink-secondary)", lineHeight: 1.7 }}>
                    <strong>Ecología y Suelos:</strong> {lot.agronomy}
                  </p>

                  <table className="k-spec-table">
                    <tbody>
                      <tr>
                        <th>Productor / Estación</th>
                        <td>{lot.producer}</td>
                      </tr>
                      <tr>
                        <th>Subregión y País</th>
                        <td>{lot.region} ({lot.country})</td>
                      </tr>
                      <tr>
                        <th>Altitud de Cultivo</th>
                        <td>{lot.altitude} sobre el nivel del mar</td>
                      </tr>
                      <tr>
                        <th>Variedad Botánica</th>
                        <td>{lot.variety}</td>
                      </tr>
                      <tr>
                        <th>Beneficio / Fermentación</th>
                        <td>{lot.process}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "tueste" && (
                <div style={{ paddingTop: "1.25rem" }}>
                  <table className="k-spec-table">
                    <tbody>
                      <tr>
                        <th>Precio FOB Pagado</th>
                        <td>{lot.fobPriceUsd} ({lot.farmGatePremium})</td>
                      </tr>
                      <tr>
                        <th>Cupo Anual Adquirido</th>
                        <td>{lot.lotAllocationKg} kg en sacos GrainPro</td>
                      </tr>
                      <tr>
                        <th>Humedad & Actividad Agua</th>
                        <td>{lot.moistureContent} · {lot.waterActivity}</td>
                      </tr>
                      <tr>
                        <th>Densidad del Grano Verde</th>
                        <td>{lot.densityGml} (criba 16–18)</td>
                      </tr>
                      <tr>
                        <th>Tostadora y Desarrollo</th>
                        <td>{lot.roasterMachine} · DTR {lot.developmentTimeRatio}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "receta" && (
                <div style={{ paddingTop: "1.25rem" }}>
                  <div
                    style={{
                      background: "var(--bg-secondary)",
                      padding: "1.25rem",
                      borderRadius: "var(--radius-xs)",
                      marginBottom: "1rem",
                    }}
                  >
                    <div className="k-eyebrow">MÉTODO RECOMENDADO POR NUESTRO BARISTA JEFE</div>
                    <div className="font-serif" style={{ fontSize: "1.35rem", marginTop: "0.2rem" }}>
                      {lot.recipe.method} · {lot.recipe.doseG} g café / {lot.recipe.waterMl} ml agua a {lot.recipe.tempC} °C
                    </div>
                    <div className="font-mono" style={{ fontSize: "0.75rem", color: "var(--ink-secondary)", marginTop: "0.3rem" }}>
                      Molienda: {lot.recipe.grindClicks} · Tiempo total: {lot.recipe.totalTime}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {lot.recipe.steps.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "0.85rem 1rem",
                          background: "var(--bg-card)",
                          border: "1px solid var(--line-subtle)",
                          display: "grid",
                          gridTemplateColumns: "110px 85px 1fr",
                          gap: "0.75rem",
                          alignItems: "center",
                        }}
                      >
                        <span className="font-mono" style={{ fontSize: "0.75rem", fontWeight: 600 }}>
                          {s.time}
                        </span>
                        <span className="font-mono" style={{ fontSize: "0.75rem", color: "var(--accent-rust)" }}>
                          {s.water}
                        </span>
                        <span style={{ fontSize: "0.85rem", color: "var(--ink-secondary)" }}>{s.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lotes Relacionados */}
        <div style={{ marginTop: "5rem", paddingTop: "3.5rem", borderTop: "1px solid var(--line-subtle)" }}>
          <span className="k-eyebrow">EXPLORACIÓN COMPARATIVA</span>
          <h2 className="k-title-md" style={{ margin: "0.4rem 0 2rem" }}>
            Otros lotes de cosecha actual que podrían interesarte
          </h2>
          <div className="k-catalog-grid">
            {relatedLots.map((r) => (
              <LotCard
                key={r.id}
                lot={r}
                onSelectLot={onSelectLot}
                onQuickAdd={(l, s, g) => onAddToCart(l, s, g, 1, " puntual")}
                isCompared={false}
                onToggleCompare={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
