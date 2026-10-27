"use client"

import React, { useState } from "react"
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
  formatEur,
  type ActiveSubscription,
  type SubTab,
  type ViewName,
} from "./Components"

/* ==========================================================================
   4. VISTA DE SUSCRIPCIONES (Personal + Regalo + Oficinas + Gestor Activo)
   ========================================================================== */
export function SubscriptionsView({
  activeTab,
  onChangeTab,
  activeSub,
  onSaveSub,
  onUpdateSubStatus,
  onSkipNextSubDate,
  onAddGiftToCart,
  onNotify,
}: {
  activeTab: SubTab
  onChangeTab: (t: SubTab) => void
  activeSub: ActiveSubscription | null
  onSaveSub: (sub: ActiveSubscription) => void
  onUpdateSubStatus: (status: "Activa" | "Pausada") => void
  onSkipNextSubDate: (dateStr: string) => void
  onAddGiftToCart: (months: number, bagsPerMonth: number, grind: GrindOption, recipient: string, note: string, price: number) => void
  onNotify: (msg: string) => void
}) {
  // Estado para configurador Personal
  const [planId, setPlanId] = useState<string>("origen")
  const [size, setSize] = useState<BagSizeOption>("250g")
  const [grind, setGrind] = useState<GrindOption>("En grano")
  const [bagsPerShipment, setBagsPerShipment] = useState<number>(2)
  const [cadenceWeeks, setCadenceWeeks] = useState<number>(2)
  const [roastPref, setRoastPref] = useState<string>("Filtro luminoso y floral")

  // Estado para Suscripción Regalo
  const [giftMonths, setGiftMonths] = useState<3 | 6 | 12>(3)
  const [giftBagsPerMonth, setGiftBagsPerMonth] = useState<1 | 2>(2)
  const [giftGrind, setGiftGrind] = useState<GrindOption>("En grano")
  const [giftRecipient, setGiftRecipient] = useState<string>("Clara Valls")
  const [giftEmail, setGiftEmail] = useState<string>("clara.valls@ejemplo.es")
  const [giftMessage, setGiftMessage] = useState<string>(
    "Para acompañar tus mañanas de lectura con cosecha fresca recién tostada ."
  )
  const [giftDeliveryFormat, setGiftDeliveryFormat] = useState<"impresa" | "digital">("impresa")

  // Estado para Suscripción Oficinas & Estudios
  const [teamSize, setTeamSize] = useState<number>(18)
  const [cupsPerPerson, setCupsPerPerson] = useState<number>(2)
  const [officeMachine, setOfficeMachine] = useState<"superauto" | "moccamaster" | "portafiltro">("superauto")
  const [officeCompany, setOfficeCompany] = useState<string>("")
  const [officeContactEmail, setOfficeContactEmail] = useState<string>("")
  const [officeProposalSent, setOfficeProposalSent] = useState<boolean>(false)

  const selectedPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) ?? SUBSCRIPTION_PLANS[0]
  const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
  const pricePerShipment =
    Math.round(selectedPlan.basePrice250 * sizeObj.multiplier * bagsPerShipment * 100) / 100

  // Fechas próximas de martes de tueste
  const upcomingDates = ["Martes 28 Oct", "Martes 11 Nov", "Martes 25 Nov", "Martes 9 Dic"]

  const giftTotalPrice = giftMonths * giftBagsPerMonth * 18

  // Cálculo para oficinas: 10g por taza * 22 días laborables
  const monthlyKg = Math.max(2, Math.round((teamSize * cupsPerPerson * 10 * 22) / 1000))
  const monthlyOfficeCost = monthlyKg * 26.5 // 26.50 €/kg B2B

  const handleActivatePersonal = () => {
    const newSub: ActiveSubscription = {
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      planName: selectedPlan.name,
      size,
      grind,
      bagsPerShipment,
      cadenceWeeks,
      roastPreference: roastPref,
      status: "Activa",
      nextDeliveryDate: upcomingDates[0],
      skippedDates: [],
      pricePerShipment,
    }
    onSaveSub(newSub)
  }

  return (
    <section className="k-section-sm">
      <div className="k-container">
        <div className="k-section-head">
          <div>
            <span className="k-eyebrow">PROGRAMA DE SUSCRIPCIÓN KILN · CERO ATADURAS</span>
            <h1 className="k-title-lg" style={{ marginTop: "0.35rem" }}>
              Café de Cosecha Fresca a Tu Ritmo
            </h1>
          </div>

          {/* Selector de las 3 modalidades pedidas por el usuario */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {[
              { id: "personal", label: "01 · Suscripción Personal" },
              { id: "gift", label: "02 · Suscripción para Regalo" },
              { id: "office", label: "03 · Oficinas y Estudios" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`k-filter-pill ${activeTab === tab.id ? "active" : ""}`}
                style={{ padding: "0.65rem 1.2rem", fontSize: "0.8rem" }}
                onClick={() => onChangeTab(tab.id as SubTab)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* PANEL DE CONTROL DEL SUSCRIPTOR SI YA TIENE UNA SUSCRIPCIÓN ACTIVA (Nielsen #1 y #3) */}
        {activeSub && (
          <div
            style={{
              background: "var(--bg-dark)",
              color: "var(--ink-light)",
              padding: "2rem 2.25rem",
              borderRadius: "var(--radius-sm)",
              marginBottom: "3rem",
              border: "1px solid rgba(200, 164, 110, 0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <div>
                <span className="k-eyebrow" style={{ color: "#c8a46e" }}>
                  PANEL DE MI SUSCRIPCIÓN ACTIVA · REF. {activeSub.id}
                </span>
                <h2 className="k-title-md" style={{ color: "#ffffff", marginTop: "0.25rem" }}>
                  {activeSub.planName} · {activeSub.bagsPerShipment} × {activeSub.size} ({activeSub.grind})
                </h2>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span
                  className="font-mono"
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "2px",
                    background: activeSub.status === "Activa" ? "rgba(122,184,122,0.2)" : "rgba(200,164,110,0.2)",
                    color: activeSub.status === "Activa" ? "#98e098" : "#f0cfa0",
                    fontSize: "0.74rem",
                  }}
                >
                  ● {activeSub.status.toUpperCase()} · {formatEur(activeSub.pricePerShipment)} / envío
                </span>
                <button
                  type="button"
                  className="k-btn-outline-light"
                  style={{ padding: "0.55rem 1rem" }}
                  onClick={() =>
                    onUpdateSubStatus(activeSub.status === "Activa" ? "Pausada" : "Activa")
                  }
                >
                  {activeSub.status === "Activa" ? "Pausar entregas" : "Reactivar entregas"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem" }}>
              {upcomingDates.map((d) => {
                const isSkipped = activeSub.skippedDates.includes(d)
                return (
                  <div
                    key={d}
                    style={{
                      padding: "1rem",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "var(--radius-xs)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div className="font-mono" style={{ fontSize: "0.78rem", color: isSkipped ? "#9e9688" : "#ffffff", textDecoration: isSkipped ? "line-through" : "none" }}>
                        {d}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#c8a46e" }}>
                        {isSkipped ? "Envío saltado" : "Tueste programado"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSkipNextSubDate(d)}
                      style={{
                        fontSize: "0.7rem",
                        textDecoration: "underline",
                        color: "#ded8cc",
                      }}
                    >
                      {isSkipped ? "Restaurar" : "Saltar fecha"}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* MODALIDAD 1: SUSCRIPCIÓN PERSONAL */}
        {activeTab === "personal" && (
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "3rem", alignItems: "start" }} className="k-pdp-grid">
            <div>
              <h2 className="k-title-md" style={{ marginBottom: "1.25rem" }}>
                Paso 1 · Elige la línea editorial de tu suscripción
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2.25rem" }}>
                {SUBSCRIPTION_PLANS.map((plan) => {
                  const isSel = plan.id === planId
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setPlanId(plan.id)}
                      style={{
                        cursor: "pointer",
                        padding: "1.5rem",
                        background: "var(--bg-card)",
                        border: `1.5px solid ${isSel ? "var(--ink-primary)" : "var(--line-subtle)"}`,
                        borderRadius: "var(--radius-sm)",
                        transition: "all 0.25s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <h3 className="font-serif" style={{ fontSize: "1.45rem", fontWeight: 400 }}>
                            {plan.name}
                          </h3>
                          <span className="k-pill-tag">{plan.tag}</span>
                        </div>
                        <span className="font-mono" style={{ fontWeight: 600 }}>
                          Desde {formatEur(plan.basePrice250)} / 250g
                        </span>
                      </div>
                      <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", marginBottom: "0.85rem" }}>
                        {plan.summary}
                      </p>
                      <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", fontSize: "0.78rem", color: "var(--ink-secondary)" }}>
                        {plan.includes.map((inc) => (
                          <li key={inc}>✓ {inc}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>

              <h2 className="k-title-md" style={{ marginBottom: "1rem" }}>
                Paso 2 · Calibra tamaño, molienda y frecuencia
              </h2>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--line-subtle)",
                  padding: "1.75rem",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.4rem",
                }}
              >
                <div>
                  <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                    FORMATO DE BOLSA Y CANTIDAD POR ENVÍO
                  </span>
                  <div className="k-selector-grid">
                    {BAG_SIZES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`k-selector-option ${size === s.id ? "active" : ""}`}
                        onClick={() => setSize(s.id)}
                      >
                        <div style={{ fontWeight: 600 }}>{s.label}</div>
                        <div className="sub" style={{ fontSize: "0.7rem", color: "var(--ink-muted)" }}>
                          {s.note}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                    NÚMERO DE BOLSAS EN CADA ENTREGA
                  </span>
                  <div className="k-selector-grid">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`k-selector-option ${bagsPerShipment === n ? "active" : ""}`}
                        onClick={() => setBagsPerShipment(n)}
                      >
                        <div style={{ fontWeight: 600 }}>
                          {n} {n === 1 ? "bolsa" : "bolsas"} ({n * parseInt(size)} g)
                        </div>
                        <div className="sub" style={{ fontSize: "0.7rem", color: "var(--ink-muted)" }}>
                          {n >= 2 ? "Envío urgente gratuito incluido" : "+3,50 € envío peninsular"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.4rem" }}>
                      MOLIENDA
                    </span>
                    <select
                      value={grind}
                      onChange={(e) => setGrind(e.target.value as GrindOption)}
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: "1px solid var(--line-medium)",
                        background: "var(--bg-primary)",
                      }}
                    >
                      {GRIND_OPTIONS.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} ({g.microns})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.4rem" }}>
                      CADENCIA DE ENVÍO
                    </span>
                    <select
                      value={cadenceWeeks}
                      onChange={(e) => setCadenceWeeks(Number(e.target.value))}
                      style={{
                        width: "100%",
                        padding: "0.7rem",
                        border: "1px solid var(--line-medium)",
                        background: "var(--bg-primary)",
                      }}
                    >
                      <option value={1}>Cada semana (Martes)</option>
                      <option value={2}>Cada 2 semanas (Quincenal)</option>
                      <option value={4}>Cada 4 semanas (Mensual)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.4rem" }}>
                    PREFERENCIA SENSORIAL EN TAZA
                  </span>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {[
                      "Filtro luminoso y floral",
                      "Equilibrado y frutal",
                      "Cacao, nuez y baja acidez",
                      "Selección libre del tostador",
                    ].map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        className={`k-filter-pill ${roastPref === pref ? "active" : ""}`}
                        onClick={() => setRoastPref(pref)}
                      >
                        {pref}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del Plan en Vivo */}
            <div
              style={{
                position: "sticky",
                top: "6.5rem",
                background: "var(--bg-card)",
                border: "1px solid var(--line-strong)",
                padding: "2.25rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <span className="k-eyebrow">RESUMEN DE TU SUSCRIPCIÓN</span>
              <h3 className="k-title-md" style={{ margin: "0.4rem 0 1.25rem" }}>
                {selectedPlan.name}
              </h3>

              <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0", background: "var(--bg-secondary)", borderRadius: "var(--radius-xs)", marginBottom: "1.5rem" }}>
                <Bag
                  lot={{
                    name: selectedPlan.name,
                    no: "SUB",
                    origin: roastPref,
                    variety: "Cosecha Rotativa",
                    altitude: "1.800 – 2.250 m",
                    process: "Lavado & Natural",
                    roast: grind === "En grano" ? "En grano" : grind,
                    notes: ["Jazmín", "Fruta de hueso", "Cacao fino"],
                    tone: selectedPlan.tone,
                  }}
                  size="md"
                />
              </div>

              <table className="k-spec-table" style={{ marginTop: 0, marginBottom: "1.5rem" }}>
                <tbody>
                  <tr>
                    <th>Cantidad por envío</th>
                    <td>{bagsPerShipment} × {size}</td>
                  </tr>
                  <tr>
                    <th>Calibración</th>
                    <td>{grind}</td>
                  </tr>
                  <tr>
                    <th>Frecuencia</th>
                    <td>Cada {cadenceWeeks} {cadenceWeeks === 1 ? "semana" : "semanas"}</td>
                  </tr>
                  <tr>
                    <th>Próximo tueste</th>
                    <td>{upcomingDates[0]} (Envío 24h)</td>
                  </tr>
                  <tr>
                    <th>Envío</th>
                    <td>{bagsPerShipment >= 2 ? "Gratis (0,00 €)" : "3,50 €"}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.25rem" }}>
                <span className="k-eyebrow">TOTAL POR ENTREGA (IVA INCL.)</span>
                <span className="font-serif" style={{ fontSize: "2.1rem" }}>
                  {formatEur(pricePerShipment)}
                </span>
              </div>

              <button
                type="button"
                className="k-btn-primary"
                style={{ width: "100%" }}
                onClick={handleActivatePersonal}
              >
                Activar Suscripción Flexible →
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)", textAlign: "center", marginTop: "0.75rem" }}>
                Cancela, pausa o salta fechas desde esta misma página en cualquier momento.
              </p>
            </div>
          </div>
        )}

        {/* MODALIDAD 2: SUSCRIPCIÓN PARA REGALO (Con previsualización en vivo de tarjeta) */}
        {activeTab === "gift" && (
          <div className="k-pdp-grid">
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--line-subtle)",
                padding: "2.25rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <span className="k-eyebrow">EDICIÓN REGALO · PAGO ÚNICO SIN RENOVACIÓN AUTOMÁTICA</span>
              <h2 className="k-title-md" style={{ margin: "0.4rem 0 1.5rem" }}>
                Configura tu Regalo de Cosecha
              </h2>

              <div style={{ marginBottom: "1.4rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  1. DURACIÓN DEL REGALO
                </span>
                <div className="k-selector-grid">
                  {([3, 6, 12] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`k-selector-option ${giftMonths === m ? "active" : ""}`}
                      onClick={() => setGiftMonths(m)}
                    >
                      <div style={{ fontWeight: 600 }}>{m} Meses</div>
                      <div className="sub" style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>
                        {m} envíos mensuales gratuitos
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "1.4rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  2. CANTIDAD MENSUAL Y MOLIENDA
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <button
                    type="button"
                    className={`k-selector-option ${giftBagsPerMonth === 1 ? "active" : ""}`}
                    onClick={() => setGiftBagsPerMonth(1)}
                  >
                    <div style={{ fontWeight: 600 }}>1 bolsa / mes (250 g)</div>
                    <div className="sub" style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>
                      Lote estacional del tostador
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`k-selector-option ${giftBagsPerMonth === 2 ? "active" : ""}`}
                    onClick={() => setGiftBagsPerMonth(2)}
                  >
                    <div style={{ fontWeight: 600 }}>2 bolsas / mes (500 g)</div>
                    <div className="sub" style={{ fontSize: "0.72rem", color: "var(--ink-muted)" }}>
                      Dos orígenes distintos cada mes
                    </div>
                  </button>
                </div>

                <select
                  value={giftGrind}
                  onChange={(e) => setGiftGrind(e.target.value as GrindOption)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid var(--line-medium)",
                    background: "var(--bg-primary)",
                  }}
                >
                  {GRIND_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      Molienda inicial: {g.id}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "1.4rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  3. PERSONALIZACIÓN DE LA TARJETA IMPRESA EN PAPEL ALGODÓN
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <input
                    type="text"
                    placeholder="Nombre del destinatario"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    style={{ padding: "0.7rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                  />
                  <input
                    type="email"
                    placeholder="Email del destinatario (opcional)"
                    value={giftEmail}
                    onChange={(e) => setGiftEmail(e.target.value)}
                    style={{ padding: "0.7rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                  />
                </div>
                <textarea
                  rows={3}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                />
              </div>

              <button
                type="button"
                className="k-btn-primary"
                style={{ width: "100%" }}
                onClick={() =>
                  onAddGiftToCart(giftMonths, giftBagsPerMonth, giftGrind, giftRecipient, giftMessage, giftTotalPrice)
                }
              >
                Añadir Suscripción Regalo a la Cesta · {formatEur(giftTotalPrice)}
              </button>
            </div>

            {/* Vista Previa de la Tarjeta Física de Regalo */}
            <div
              style={{
                background: "#1b1916",
                color: "#f6f3ec",
                padding: "3rem 2.5rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid #c8a46e",
                boxShadow: "var(--shadow-lg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "480px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(246,243,236,0.16)", paddingBottom: "1.25rem" }}>
                <div>
                  <div className="font-serif" style={{ fontSize: "1.8rem", letterSpacing: "0.12em" }}>
                    KILN
                  </div>
                  <div className="font-mono" style={{ fontSize: "0.62rem", color: "#c8a46e", letterSpacing: "0.18em" }}>
                    KILN COFFEE
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="font-mono" style={{ fontSize: "0.7rem", color: "#c8a46e" }}>
                    BONO DE COSECHA #{giftMonths}M-{giftBagsPerMonth}B
                  </span>
                  <div style={{ fontSize: "0.78rem", color: "#d8d1c5" }}>
                    {giftMonths} Meses · {giftBagsPerMonth * 250} g/mes
                  </div>
                </div>
              </div>

              <div style={{ margin: "2.5rem 0" }}>
                <span className="k-eyebrow" style={{ color: "#c8a46e" }}>
                  PARA: {giftRecipient || "DESTINATARIO"}
                </span>
                <p
                  className="font-serif"
                  style={{
                    fontSize: "1.55rem",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    marginTop: "0.85rem",
                    color: "#ffffff",
                  }}
                >
                  “{giftMessage}”
                </p>
              </div>

              <div style={{ borderTop: "1px solid rgba(246,243,236,0.16)", paddingTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem", color: "#d8d1c5" }}>
                <span>Molienda inicial: {giftGrind}</span>
                <span>Envío urgente incluido en cada entrega</span>
              </div>
            </div>
          </div>
        )}

        {/* MODALIDAD 3: SUSCRIPCIÓN PARA OFICINAS Y ESTUDIOS CREATIVOS */}
        {activeTab === "office" && (
          <div className="k-pdp-grid">
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--line-subtle)",
                padding: "2.25rem",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <span className="k-eyebrow">SUMINISTRO CORPORATIVO EN PENÍNSULA</span>
              <h2 className="k-title-md" style={{ margin: "0.4rem 0 1rem" }}>
                Calculadora de Café para Estudios y Equipos
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-secondary)", marginBottom: "1.75rem" }}>
                Abastecemos estudios de arquitectura, agencias de diseño y empresas tecnológicas en el
                y toda España con café en grano recién tostado, mantenimiento mensual y maquinaria
                en depósito.
              </p>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span className="k-eyebrow">PERSONAS EN EL EQUIPO / ESTUDIO</span>
                  <strong className="font-mono">{teamSize} personas</strong>
                </div>
                <input
                  type="range"
                  min={5}
                  max={150}
                  step={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--ink-primary)" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span className="k-eyebrow">TAZAS MEDIAS POR PERSONA AL DÍA</span>
                  <strong className="font-mono">{cupsPerPerson} tazas / día</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={cupsPerPerson}
                  onChange={(e) => setCupsPerPerson(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--ink-primary)" }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  EQUIPAMIENTO REQUERIDO EN CESIÓN
                </span>
                <div className="k-selector-grid">
                  {[
                    { id: "superauto", label: "Jura WE8 / GIGA", sub: "Grano a taza en un botón" },
                    { id: "moccamaster", label: "Moccamaster + Molino", sub: "Filtro por lotes rápido" },
                    { id: "portafiltro", label: "La Marzocco Linea Micra", sub: "Rincón barista completo" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className={`k-selector-option ${officeMachine === m.id ? "active" : ""}`}
                      onClick={() => setOfficeMachine(m.id as typeof officeMachine)}
                    >
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{m.label}</div>
                      <div className="sub" style={{ fontSize: "0.68rem", color: "var(--ink-muted)" }}>
                        {m.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
                <input
                  type="text"
                  placeholder="Nombre del Estudio o Empresa"
                  value={officeCompany}
                  onChange={(e) => setOfficeCompany(e.target.value)}
                  style={{ padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                />
                <input
                  type="email"
                  placeholder="Email de contacto profesional"
                  value={officeContactEmail}
                  onChange={(e) => setOfficeContactEmail(e.target.value)}
                  style={{ padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                />
              </div>

              <button
                type="button"
                className="k-btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  setOfficeProposalSent(true)
                  onNotify(`Propuesta corporativa de ${monthlyKg} kg/mes generada y caja de cata gratuita reservada.`)
                }}
              >
                Solicitar Caja de Cata Gratuita para la Oficina →
              </button>

              {officeProposalSent && (
                <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-secondary)", fontSize: "0.84rem" }}>
                  ✓ Hemos registrado la solicitud para <strong>{officeCompany || "tu estudio"}</strong>. Nuestro equipo
                  de cuentas  enviará mañana un pack de degustación de 3 × 250 g sin compromiso.
                </div>
              )}
            </div>

            {/* Desglose Financiero Oficina */}
            <div style={{ background: "var(--bg-dark)", color: "var(--ink-light)", padding: "2.5rem", borderRadius: "var(--radius-sm)" }}>
              <span className="k-eyebrow" style={{ color: "#c8a46e" }}>
                ESTIMACIÓN MENSUAL TRANSPARENTE (FACTURA B2B DEDUCIBLE)
              </span>
              <h3 className="k-title-lg" style={{ color: "#ffffff", margin: "0.5rem 0 1.5rem" }}>
                {monthlyKg} kg / mes · {formatEur(monthlyOfficeCost)}
              </h3>

              <table className="k-spec-table" style={{ color: "#ded8cc" }}>
                <tbody>
                  <tr>
                    <th style={{ color: "#c8a46e" }}>Coste real por taza servida</th>
                    <td style={{ color: "#ffffff" }}>{formatEur(0.27)} por taza de especialidad</td>
                  </tr>
                  <tr>
                    <th style={{ color: "#c8a46e" }}>Formato de entrega</th>
                    <td style={{ color: "#ffffff" }}>{monthlyKg} bolsas de 1 kg con válvula o bidones retornables de 3 kg</td>
                  </tr>
                  <tr>
                    <th style={{ color: "#c8a46e" }}>Equipamiento y filtrado Brita</th>
                    <td style={{ color: "#ffffff" }}>Incluido en cesión a partir de 8 kg/mes</td>
                  </tr>
                  <tr>
                    <th style={{ color: "#c8a46e" }}>Reparto en  </th>
                    <td style={{ color: "#ffffff" }}>En cargo-bike eléctrica cada lunes a las 09:00h</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

/* ==========================================================================
   5. VISTA ESTUDIO / TOSTADOR (Filosofía, Máquina Loring, Equipo y Transparencia)
   ========================================================================== */
export function StudioView({ onNavigate }: { onNavigate: (v: ViewName) => void }) {
  return (
    <div>
      <section className="k-section k-border-bottom">
        <div className="k-container">
          <div style={{ maxWidth: "54rem", marginBottom: "3.5rem" }}>
            <span className="k-eyebrow">ESTUDIO Y NAVE DE TUESTE · FUNDADO EN 2021 EN EL</span>
            <h1 className="k-title-xl" style={{ margin: "0.5rem 0 1.5rem" }}>
              Tostamos para revelar lo que el caficultor ya construyó en el árbol.
            </h1>
            <p className="k-lead">
              Situado en una antigua nave textil de ladrillo visto de 1924 en  118,
              Kiln nació con una premisa radical: tratar el café como un producto agrícola estacional
              con denominación de parcela, libre de mezclas opacas y tuestes oscuros que enmascaran
              defectos.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }} className="k-pdp-grid">
            <img
              src={PHOTOS.roasterDrum}
              alt="Tostadora Loring S15 Falcon en la nave de "
              style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
            />
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--line-subtle)", padding: "2.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <span className="k-eyebrow">INGENIERÍA TÉRMICA</span>
                <h2 className="k-title-md" style={{ margin: "0.5rem 0 1rem" }}>
                  Por qué tostamos exclusivamente con convección pura (Loring S15 Falcon)
                </h2>
                <p style={{ fontSize: "0.92rem", color: "var(--ink-secondary)", lineHeight: 1.7, marginBottom: "1rem" }}>
                  A diferencia de los tambores tradicionales de hierro fundido por contacto directo,
                  nuestra Loring S15 calienta el grano mediante una corriente ciclónica de aire limpio
                  recirculado. Esto evita puntos de quemado superficial (tipping y scorching) y permite
                  desarrollar el corazón del grano preservando intactos los ácidos orgánicos florales y
                  frutales.
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--line-subtle)", paddingTop: "1.25rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div className="font-serif" style={{ fontSize: "1.8rem" }}>−80%</div>
                  <div className="k-eyebrow">Consumo de gas y CO₂</div>
                </div>
                <div>
                  <div className="font-serif" style={{ fontSize: "1.8rem" }}>100%</div>
                  <div className="k-eyebrow">Control PID por lote</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROTOCOLO DE AGUA Y CONTROL DE CALIDAD */}
      <section className="k-section k-border-bottom" style={{ background: "var(--bg-secondary)" }}>
        <div className="k-container">
          <div className="k-section-head">
            <div>
              <span className="k-eyebrow">LABORATORIO DE CONTROL DE CALIDAD</span>
              <h2 className="k-title-lg" style={{ marginTop: "0.4rem" }}>
                Tres pilares invisibles en cada bolsa.
              </h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem" }}>
            <div style={{ background: "var(--bg-card)", padding: "2rem", border: "1px solid var(--line-subtle)" }}>
              <span className="k-eyebrow">01 · MINERALIZACIÓN DEL AGUA</span>
              <h3 className="k-title-sm" style={{ margin: "0.6rem 0" }}>
                Ósmosis Inversa + Magnesio Calibrado
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", lineHeight: 1.65 }}>
                El agua de red de   supera los 350 ppm de dureza y apaga cualquier acidez
                delicada. En Kiln remineralizamos el agua a <strong>65 ppm de dureza total (GH)</strong> y{" "}
                <strong>22 ppm de alcalinidad (KH)</strong>, y diseñamos nuestros perfiles de tueste
                tanto para aguas blandas como para agua mineral embotellada (Bezoya / Bronchales).
              </p>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "2rem", border: "1px solid var(--line-subtle)" }}>
              <span className="k-eyebrow">02 · REPOSO Y DESGASIFICACIÓN</span>
              <h3 className="k-title-sm" style={{ margin: "0.6rem 0" }}>
                Curva Óptima de Consumo (Día 5 a Día 45)
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", lineHeight: 1.65 }}>
                Al tostar tan ligero, la estructura celular del grano es densa y retiene CO₂. Nuestros
                cafés de filtro alcanzan su plenitud aromática a partir del <strong>día 6 post-tueste</strong>{" "}
                y se mantienen vibrantes durante 8 semanas gracias al barrido de nitrógeno.
              </p>
            </div>

            <div style={{ background: "var(--bg-card)", padding: "2rem", border: "1px solid var(--line-subtle)" }}>
              <span className="k-eyebrow">03 · SOSTENIBILIDAD SIN GREENWASHING</span>
              <h3 className="k-title-sm" style={{ margin: "0.6rem 0" }}>
                Retorno de Envases
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", lineHeight: 1.65 }}>
                Nuestras bolsas están libres de capas de aluminio y se degradan en compost doméstico.
                Además, si traes tu lata hermética a nuestra barra de , te descontamos{" "}
                <strong>1,00 € por cada 250 g</strong> recargados a granel desde tolva.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ==========================================================================
   6. VISTA VISÍTANOS / CAFETERÍA Y SALA DE CATA
   ========================================================================== */
export function VisitView({ onNotify }: { onNotify: (msg: string) => void }) {
  const [cuppingDate, setCuppingDate] = useState<string>("Viernes 31 Oct · 17:30h")
  const [cuppingSeats, setCuppingSeats] = useState<number>(2)
  const [cuppingName, setCuppingName] = useState<string>("")
  const [cuppingBooked, setCuppingBooked] = useState<boolean>(false)

  return (
    <section className="k-section-sm">
      <div className="k-container">
        <div className="k-pdp-grid" style={{ marginBottom: "4.5rem" }}>
          <div>
            <span className="k-eyebrow">BARRA DE DEGUSTACIÓN & OBRADOR · LLACUNA L4</span>
            <h1 className="k-title-lg" style={{ margin: "0.4rem 0 1rem" }}>
               (08005  )
            </h1>
            <p className="k-lead" style={{ marginBottom: "1.75rem" }}>
              Nuestra barra comparte espacio diáfano con la nave de tueste, separada únicamente por un
              cerramiento acústico de vidrio y acero. Ven a tomar un V60 preparado al momento o recoger
              tu pedido online sin gastos de envío.
            </p>

            <table className="k-spec-table" style={{ marginBottom: "2rem" }}>
              <tbody>
                <tr>
                  <th>Lunes a Viernes</th>
                  <td>08:00 – 18:30 h (Barra de espresso, filtro y obrador)</td>
                </tr>
                <tr>
                  <th>Sábados y Domingos</th>
                  <td>09:00 – 19:00 h (Servicio continuo de brunch y catas)</td>
                </tr>
                <tr>
                  <th>Días de Tueste en Vivo</th>
                  <td>Lunes y Miércoles de 09:00 a 14:00 h</td>
                </tr>
                <tr>
                  <th>Cómo llegar</th>
                  <td>Metro L4 Llacuna (a 3 min) · Bicing estación 142 · Parking bicis interior</td>
                </tr>
                <tr>
                  <th>Política de Espacio</th>
                  <td>Espacio tranquilo sin música alta · Pet-friendly · Mesas sin portátiles en fin de semana</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <img
              src={PHOTOS.studioCafe}
              alt="Interior de la cafetería y tostador Kiln   "
              style={{ width: "100%", height: "460px", objectFit: "cover", borderRadius: "var(--radius-sm)" }}
            />
          </div>
        </div>

        {/* CARTA ACTUAL DE LA BARRA EN EUROS */}
        <div style={{ marginBottom: "4.5rem" }}>
          <span className="k-eyebrow">CARTA DE TEMPORADA EN BARRA (IVA INCLUIDO)</span>
          <h2 className="k-title-md" style={{ margin: "0.4rem 0 2rem" }}>
            Menú de Extracciones y Obrador Matinal
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
            {CAFE_MENU.map((block) => (
              <div
                key={block.category}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--line-subtle)",
                  padding: "1.8rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <h3 className="k-eyebrow" style={{ color: "var(--accent-rust)", marginBottom: "1.25rem" }}>
                  {block.category}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  {block.items.map((it) => (
                    <div key={it.name} style={{ borderBottom: "1px solid var(--line-subtle)", paddingBottom: "0.85rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, fontSize: "0.94rem" }}>
                        <span>{it.name}</span>
                        <span className="font-mono">{it.price}</span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "var(--ink-secondary)", marginTop: "0.2rem" }}>
                        {it.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESERVA DE CATA PÚBLICA DE LOS VIERNES */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--line-medium)",
            padding: "2.5rem",
            borderRadius: "var(--radius-sm)",
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "2.5rem",
            alignItems: "center",
          }}
          className="k-pdp-grid"
        >
          <div>
            <span className="k-eyebrow">MESA DE CATA ABIERTA · AFORO 8 PERSONAS</span>
            <h2 className="k-title-md" style={{ margin: "0.4rem 0 0.85rem" }}>
              Reserva plaza en nuestra Cata Pública de los Viernes ({formatEur(15)} reembolsables en café)
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--ink-secondary)", lineHeight: 1.65 }}>
              Cada viernes a las 17:30h abrimos el laboratorio para catar a ciegas 6 orígenes de la
              cosecha actual siguiendo el protocolo oficial SCA. El importe de la entrada (15,00 €) se
              descuenta íntegramente si te llevas cualquier bolsa de café al terminar.
            </p>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "1.75rem", border: "1px solid var(--line-subtle)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <select
                value={cuppingDate}
                onChange={(e) => setCuppingDate(e.target.value)}
                style={{ padding: "0.7rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
              >
                <option>Viernes 31 Oct · 17:30h (3 plazas)</option>
                <option>Viernes 7 Nov · 17:30h (6 plazas)</option>
                <option>Viernes 14 Nov · 17:30h (8 plazas)</option>
              </select>

              <select
                value={cuppingSeats}
                onChange={(e) => setCuppingSeats(Number(e.target.value))}
                style={{ padding: "0.7rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
              >
                <option value={1}>1 plaza (15,00 €)</option>
                <option value={2}>2 plazas (30,00 €)</option>
                <option value={3}>3 plazas (45,00 €)</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Tu nombre y apellidos"
              value={cuppingName}
              onChange={(e) => setCuppingName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.7rem",
                border: "1px solid var(--line-medium)",
                background: "var(--bg-primary)",
                marginBottom: "0.75rem",
              }}
            />

            <button
              type="button"
              className="k-btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                setCuppingBooked(true)
                onNotify(`Plaza confirmada para la cata del ${cuppingDate}.`)
              }}
            >
              Confirmar Reserva de Cata ({formatEur(cuppingSeats * 15)})
            </button>

            {cuppingBooked && (
              <p style={{ fontSize: "0.8rem", color: "var(--accent-rust)", marginTop: "0.65rem" }}>
                ✓ Reserva confirmada a nombre de {cuppingName || "Invitado Kiln"} para el {cuppingDate}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   7. VISTA PROFESIONALES / HORECA B2B (Cafeterías, Restaurantes y Hoteles)
   ========================================================================== */
export function WholesaleView({ onNotify }: { onNotify: (msg: string) => void }) {
  const [bizName, setBizName] = useState("")
  const [bizCity, setBizCity] = useState(" ")
  const [weeklyKg, setWeeklyKg] = useState("10 – 25 kg / semana")
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="k-section-sm">
      <div className="k-container">
        <div className="k-pdp-grid">
          <div>
            <span className="k-eyebrow">PROGRAMA MAYORISTA & PARTNERS HORECA</span>
            <h1 className="k-title-lg" style={{ margin: "0.4rem 0 1rem" }}>
              Acompañamos a las mejores barras gastronómicas, hoteles boutique y cafeterías.
            </h1>
            <p className="k-lead" style={{ marginBottom: "2rem" }}>
              No somos un simple proveedor de grano: actuamos como departamento técnico externo de tu
              local. Calibramos el sistema de filtración de agua, formamos a tus baristas según
              estándares SCA y diseñamos perfiles de tueste exclusivos para tu carta.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
              <div style={{ background: "var(--bg-card)", padding: "1.5rem", border: "1px solid var(--line-subtle)" }}>
                <span className="k-eyebrow">DISTRIBUCIÓN ZERO-WASTE</span>
                <h3 className="k-title-sm" style={{ margin: "0.4rem 0" }}>
                  Cubos Herméticos Retornables de 3 kg y 5 kg
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--ink-secondary)" }}>
                  En el área metropolitana de   entregamos en bidones alimentarios presurizados
                  con válvula, eliminando el 100% de los residuos de envases en tu cafetería.
                </p>
              </div>

              <div style={{ background: "var(--bg-card)", padding: "1.5rem", border: "1px solid var(--line-subtle)" }}>
                <span className="k-eyebrow">PARTNERS DE MAQUINARIA</span>
                <h3 className="k-title-sm" style={{ margin: "0.4rem 0" }}>
                  Distribuidor Oficial La Marzocco, Victoria Arduino y Mahlkönig
                </h3>
                <p style={{ fontSize: "0.84rem", color: "var(--ink-secondary)" }}>
                  Financiación, instalación técnica y servicio de urgencia en menos de 4 horas los 365
                  días del año.
                </p>
              </div>
            </div>
          </div>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--line-strong)", padding: "2.25rem", borderRadius: "var(--radius-sm)" }}>
            <span className="k-eyebrow">SOLICITAR MUESTRAS DE PROFESIONAL Y TARIFA MAYORISTA</span>
            <h2 className="k-title-md" style={{ margin: "0.4rem 0 1.25rem" }}>
              Pide tu Caja de Cata Profesional B2B
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                  NOMBRE DEL PROYECTO / RESTAURANTE / CAFETERÍA
                </label>
                <input
                  type="text"
                  placeholder="Ej. Café Babette / Hotel Mercer"
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                    CIUDAD
                  </label>
                  <input
                    type="text"
                    value={bizCity}
                    onChange={(e) => setBizCity(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                  />
                </div>
                <div>
                  <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                    VOLUMEN SEMANAL ESTIMADO
                  </label>
                  <select
                    value={weeklyKg}
                    onChange={(e) => setWeeklyKg(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem", border: "1px solid var(--line-medium)", background: "var(--bg-primary)" }}
                  >
                    <option>3 – 10 kg / semana</option>
                    <option>10 – 25 kg / semana</option>
                    <option>Más de 25 kg / semana</option>
                    <option>Nueva apertura en proyecto</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="k-btn-primary"
                style={{ marginTop: "0.5rem" }}
                onClick={() => {
                  setSubmitted(true)
                  onNotify("Solicitud B2B registrada. Te enviaremos tarifario y muestras de tueste.")
                }}
              >
                Solicitar Tarifario Profesional y Cata en nuestro estudio →
              </button>

              {submitted && (
                <div style={{ padding: "1rem", background: "var(--bg-secondary)", fontSize: "0.84rem" }}>
                  ✓ Gracias. Nuestro responsable de calidad contactará hoy con{" "}
                  <strong>{bizName || "tu proyecto"}</strong> en {bizCity} para agendar la sesión de
                  calibración.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
