"use client"

import React, { useId, useState } from "react"
import { Bag } from "./Bag"
import { KilnPattern, KilnWordmark } from "./Brand"
import { Field } from "./Checkout"
import { BAG_SIZES, COFFEE_LOTS, GRIND_OPTIONS, type BagSizeOption, type GrindOption } from "./data"
import { formatEur, type ActiveSubscription, type SubTab } from "./Components"

/* ==========================================================================
   Suscripciones y Regalos (estilo editorial, sin cajas)
   ========================================================================== */
const SUB_DISCOUNT = 0.88 // 12 % menos que en tienda
const HOUSE_PRICE = 19.5 // Selección del tostador: precio de referencia por 250 g
const CADENCES = [
  { weeks: 2, label: "Cada 2 semanas" },
  { weeks: 4, label: "Cada mes" },
  { weeks: 8, label: "Cada 2 meses" },
]
const GROUND_OPTIONS = GRIND_OPTIONS.filter((g) => g.id !== "En grano")
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const round2 = (n: number) => Math.round(n * 100) / 100
export const sizeLabel = (size: BagSizeOption) => BAG_SIZES.find((s) => s.id === size)?.label ?? size
export const cadenceLabel = (weeks: number) => CADENCES.find((c) => c.weeks === weeks)?.label ?? `Cada ${weeks} semanas`
// «50 €» si es entero, «51,48 €» si no
const formatPrice = (n: number) => (Number.isInteger(n) ? `${n} €` : formatEur(n))

// Próximos envíos: martes de tueste, separados por la frecuencia elegida
export const shipmentDates = (everyWeeks: number, count: number) => {
  const first = new Date()
  first.setDate(first.getDate() + ((9 - first.getDay()) % 7 || 7))
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(first)
    d.setDate(first.getDate() + i * everyWeeks * 7)
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
  })
}

/* Opciones en línea: la elegida en blanco subrayada, el resto en gris */
function InlineOptions<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="k-inline" role="radiogroup" aria-label={label}>
      <span className="k-inline-label" aria-hidden="true">
        {label}
      </span>
      <div>
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export type GiftLine = { name: string; detail: string; price: number; image?: string }

export function SubscriptionsView({
  activeTab,
  activeSub,
  onSaveSub,
  onUpdateSubStatus,
  onSkipNextSubDate,
  onAddGift,
}: {
  activeTab: SubTab
  activeSub: ActiveSubscription | null
  onSaveSub: (sub: ActiveSubscription) => void
  onUpdateSubStatus: (status: "Activa" | "Pausada") => void
  onSkipNextSubDate: (dateStr: string) => void
  onAddGift: (gift: GiftLine) => void
}) {
  if (activeTab === "gift") return <GiftsView onAddGift={onAddGift} />
  return (
    <SubscriptionConfigurator
      activeSub={activeSub}
      onSaveSub={onSaveSub}
      onUpdateSubStatus={onUpdateSubStatus}
      onSkipNextSubDate={onSkipNextSubDate}
    />
  )
}

/* ==========================================================================
   SUSCRIPCIONES: configurador en tres pasos
   ========================================================================== */
const SUB_COFFEES = COFFEE_LOTS.filter((lot) => lot.category !== "Formatos")

function SubscriptionConfigurator({
  activeSub,
  onSaveSub,
  onUpdateSubStatus,
  onSkipNextSubDate,
}: {
  activeSub: ActiveSubscription | null
  onSaveSub: (sub: ActiveSubscription) => void
  onUpdateSubStatus: (status: "Activa" | "Pausada") => void
  onSkipNextSubDate: (dateStr: string) => void
}) {
  const [coffee, setCoffee] = useState<string>("seleccion")
  const [showAll, setShowAll] = useState<boolean>(false)
  const [size, setSize] = useState<BagSizeOption>("250g")
  const [ground, setGround] = useState<boolean>(false)
  const [grind, setGrind] = useState<GrindOption>("Filtro / V60")
  const [cadence, setCadence] = useState<number>(4)

  const lot = SUB_COFFEES.find((l) => l.id === coffee)
  const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
  const shopPrice = round2((lot?.price250 ?? HOUSE_PRICE) * sizeObj.multiplier)
  const price = round2(shopPrice * SUB_DISCOUNT)
  const finalGrind: GrindOption = ground ? grind : "En grano"

  // Ocho cafés a la vista; el elegido siempre visible aunque esté más abajo
  const shortList = SUB_COFFEES.slice(0, 8)
  const visible = showAll ? SUB_COFFEES : lot && !shortList.includes(lot) ? [...shortList, lot] : shortList

  const subscribe = () => {
    onSaveSub({
      id: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      planName: lot ? lot.name : "Selección del tostador",
      size,
      grind: finalGrind,
      bagsPerShipment: 1,
      cadenceWeeks: cadence,
      roastPreference: lot ? lot.notes.join(", ") : "Rotativo",
      status: "Activa",
      nextDeliveryDate: shipmentDates(cadence, 1)[0],
      skippedDates: [],
      pricePerShipment: price,
    })
  }

  return (
    <section className="k-subs">
      <header className="k-subs-intro">
        <h1 className="k-view-title">Suscripciones</h1>
        <p className="k-prose k-lede">Café recién tostado a tu ritmo. Eliges el café, el formato y cada cuánto; nosotros tostamos la semana del envío.</p>
      </header>

      {activeSub && <ActivePlan sub={activeSub} onUpdateStatus={onUpdateSubStatus} onSkip={onSkipNextSubDate} />}

      <div className="k-subs-layout">
        <div className="k-subs-steps">
          <section className="k-subs-step" aria-labelledby="k-sub-step-1">
            <h2 id="k-sub-step-1">
              <span>01</span> Café
            </h2>
            <div className="k-rows" role="radiogroup" aria-label="Café">
              <button type="button" role="radio" aria-checked={coffee === "seleccion"} onClick={() => setCoffee("seleccion")}>
                <i aria-hidden="true">{coffee === "seleccion" ? "●" : ""}</i>
                <span>Selección del tostador</span>
                <small>Rotativo · un café distinto en cada envío</small>
              </button>
              {visible.map((l) => (
                <button key={l.id} type="button" role="radio" aria-checked={coffee === l.id} onClick={() => setCoffee(l.id)}>
                  <i aria-hidden="true">{coffee === l.id ? "●" : ""}</i>
                  <span>{l.name}</span>
                  <small>{l.notes.join(" · ")}</small>
                </button>
              ))}
            </div>
            {!showAll && (
              <button type="button" className="k-text-link" onClick={() => setShowAll(true)}>
                — Ver toda la carta ({SUB_COFFEES.length})
              </button>
            )}
          </section>

          <section className="k-subs-step" aria-labelledby="k-sub-step-2">
            <h2 id="k-sub-step-2">
              <span>02</span> Formato
            </h2>
            <InlineOptions<BagSizeOption> label="Tamaño" value={size} onChange={setSize} options={BAG_SIZES.map((s) => ({ value: s.id, label: s.label }))} />
            <InlineOptions<"grano" | "molido">
              label="Café"
              value={ground ? "molido" : "grano"}
              onChange={(v) => setGround(v === "molido")}
              options={[
                { value: "grano", label: "En grano" },
                { value: "molido", label: "Molido" },
              ]}
            />
            {ground && (
              <InlineOptions<GrindOption> label="Molienda" value={grind} onChange={setGrind} options={GROUND_OPTIONS.map((g) => ({ value: g.id, label: g.id }))} />
            )}
          </section>

          <section className="k-subs-step" aria-labelledby="k-sub-step-3">
            <h2 id="k-sub-step-3">
              <span>03</span> Frecuencia
            </h2>
            <div className="k-rows" role="radiogroup" aria-label="Frecuencia">
              {CADENCES.map((c) => (
                <button key={c.weeks} type="button" role="radio" aria-checked={cadence === c.weeks} onClick={() => setCadence(c.weeks)}>
                  <i aria-hidden="true">{cadence === c.weeks ? "●" : ""}</i>
                  <span>{c.label}</span>
                  <small>Primer envío el {shipmentDates(c.weeks, 1)[0]}</small>
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="k-subs-summary" aria-label="Resumen de la suscripción">
          <p className="k-co-label">Tu suscripción</p>
          <dl className="k-pairs">
            <div>
              <dt>Café</dt>
              <dd>{lot ? lot.name : "Selección del tostador"}</dd>
            </div>
            <div>
              <dt>Formato</dt>
              <dd>
                {sizeObj.label} · {ground ? "Molido" : "En grano"}
              </dd>
            </div>
            {ground && (
              <div>
                <dt>Molienda</dt>
                <dd>{grind}</dd>
              </div>
            )}
            <div>
              <dt>Frecuencia</dt>
              <dd>{cadenceLabel(cadence)}</dd>
            </div>
            <div>
              <dt>En tienda</dt>
              <dd className="is-struck">{formatEur(shopPrice)}</dd>
            </div>
          </dl>
          <p className="k-subs-price" aria-live="polite">
            {formatEur(price)}
            <small>por envío · 12 % menos que en tienda</small>
          </p>
          <button type="button" className="k-btn-solid" onClick={subscribe}>
            Suscribirse — {formatEur(price)} / envío
          </button>
          <ul className="k-subs-guarantees">
            <li>Pausa o cancela cuando quieras</li>
            <li>Envío gratis</li>
            <li>Tostado la semana del envío</li>
          </ul>
        </aside>
      </div>
    </section>
  )
}

/* Suscripción activa: gestión en filas de texto (es lo que abre «Cuenta») */
function ActivePlan({
  sub,
  onUpdateStatus,
  onSkip,
}: {
  sub: ActiveSubscription
  onUpdateStatus: (status: "Activa" | "Pausada") => void
  onSkip: (dateStr: string) => void
}) {
  const dates = shipmentDates(sub.cadenceWeeks, 4)
  return (
    <section className="k-subs-active" aria-labelledby="k-subs-active-title">
      <p className="k-co-label">Tu suscripción · {sub.id}</p>
      <h2 id="k-subs-active-title">{sub.planName}</h2>
      <dl className="k-pairs">
        <div>
          <dt>Formato</dt>
          <dd>
            {sub.bagsPerShipment > 1 ? `${sub.bagsPerShipment} × ` : ""}
            {sizeLabel(sub.size)} · {sub.grind}
          </dd>
        </div>
        <div>
          <dt>Frecuencia</dt>
          <dd>{cadenceLabel(sub.cadenceWeeks)}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{sub.status === "Activa" ? "Activa" : "En pausa"}</dd>
        </div>
        <div>
          <dt>Por envío</dt>
          <dd>{formatEur(sub.pricePerShipment)}</dd>
        </div>
      </dl>
      <ul className="k-subs-dates" aria-label="Próximos envíos">
        {dates.map((d) => {
          const skipped = sub.skippedDates.includes(d)
          return (
            <li key={d} className={skipped ? "is-skipped" : ""}>
              <span>{d}</span>
              <button type="button" className="k-text-link" onClick={() => onSkip(d)}>
                {skipped ? "— Restaurar" : "— Saltar"}
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" className="k-text-link" onClick={() => onUpdateStatus(sub.status === "Activa" ? "Pausada" : "Activa")}>
        {sub.status === "Activa" ? "— Pausar entregas" : "— Reactivar entregas"}
      </button>
    </section>
  )
}

/* ==========================================================================
   REGALOS
   ========================================================================== */
type GiftKind = "card" | "subscription" | "box"
const GIFT_OPTIONS: { id: GiftKind; title: string; line: string }[] = [
  { id: "card", title: "Tarjeta regalo", line: "De 25 a 100 €. Llega por email el día que elijas." },
  { id: "subscription", title: "Suscripción regalo", line: "Tres, seis o doce meses de café recién tostado." },
  { id: "box", title: "Caja de temporada", line: "Tres cafés de temporada de 250 g en caja." },
]
const CARD_AMOUNTS = [25, 50, 75, 100]
const GIFT_MONTHLY = round2(HOUSE_PRICE * SUB_DISCOUNT)
const BOX_PRICE = 54
const BOX_PHOTO = "/kiln/gifts/caja-temporada.jpg"

/* Tarjeta en negro con el wordmark y el patrón de marca */
function GiftCardPreview({ title, amount, to, message }: { title: string; amount: string; to: string; message: string }) {
  return (
    <figure className="k-giftcard" aria-label={`Vista previa: ${title}${to ? ` para ${to}` : ""}`}>
      <KilnPattern className="k-giftcard-pattern" color="#ffffff" opacity={0.16} />
      <div className="k-giftcard-top">
        <KilnWordmark />
        <span>{amount}</span>
      </div>
      <figcaption className="k-giftcard-bottom">
        <span>{title}</span>
        <span>{to ? `Para ${to}` : "Para —"}</span>
        {message && <span className="k-giftcard-msg">{message}</span>}
      </figcaption>
    </figure>
  )
}

function GiftVisual({ kind }: { kind: GiftKind }) {
  if (kind === "card") return <GiftCardPreview title="Tarjeta regalo" amount="50 €" to="" message="" />
  if (kind === "box") return <img src={BOX_PHOTO} alt="Caja de temporada con tres bolsas de café" loading="lazy" />
  const lot = COFFEE_LOTS[0]
  return (
    <span className="k-gift-stage">
      <Bag lot={{ name: lot.name, no: lot.no, origin: lot.origin, tone: lot.tone, weight: "250 g" }} size="lg" />
    </span>
  )
}

function GiftsView({ onAddGift }: { onAddGift: (gift: GiftLine) => void }) {
  const [kind, setKind] = useState<GiftKind>("card")
  const [amount, setAmount] = useState<number>(50)
  const [months, setMonths] = useState<3 | 6 | 12>(6)
  const [to, setTo] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [tried, setTried] = useState<boolean>(false)
  const messageId = useId()

  const option = GIFT_OPTIONS.find((o) => o.id === kind) ?? GIFT_OPTIONS[0]
  const price = kind === "card" ? amount : kind === "subscription" ? round2(months * GIFT_MONTHLY) : BOX_PRICE
  const needsEmail = kind !== "box"
  const errors = {
    to: to.trim().length < 2 ? "Indica el nombre de quien lo recibe." : "",
    email: needsEmail && !EMAIL_RE.test(email.trim()) ? "Introduce un email válido." : "",
  }
  const today = new Date().toISOString().slice(0, 10)
  const when = date ? new Date(`${date}T12:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "long" }) : "hoy"

  const add = () => {
    setTried(true)
    if (errors.to || errors.email) return
    const detail =
      kind === "card"
        ? `Para ${to.trim()} · se envía ${when}`
        : kind === "subscription"
          ? `${months} meses · para ${to.trim()} · desde ${when}`
          : `Para ${to.trim()} · se envía ${when}`
    onAddGift({
      name: kind === "card" ? `Tarjeta regalo ${amount} €` : kind === "subscription" ? `Suscripción regalo · ${months} meses` : "Caja de temporada",
      detail,
      price,
      image: kind === "box" ? BOX_PHOTO : undefined,
    })
    setTried(false)
  }

  return (
    <section className="k-gifts">
      <header className="k-subs-intro">
        <h1 className="k-view-title">Regalos</h1>
        <p className="k-prose k-lede">Café recién tostado para quien lo disfruta. Tú eliges el día; nosotros lo tostamos esa semana.</p>
      </header>

      <div className="k-gift-options" role="radiogroup" aria-label="Tipo de regalo">
        {GIFT_OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={kind === o.id}
            className={`k-gift-option ${kind === o.id ? "is-selected" : ""}`}
            onClick={() => setKind(o.id)}
          >
            <span className="k-gift-visual">
              <GiftVisual kind={o.id} />
            </span>
            <span className="k-gift-title">{o.title}</span>
            <span className="k-gift-line">{o.line}</span>
          </button>
        ))}
      </div>

      <div className="k-gift-config">
        <form
          className="k-gift-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            add()
          }}
        >
          <h2 className="k-gift-config-title">{option.title}</h2>
          {kind === "card" && (
            <InlineOptions<number> label="Importe" value={amount} onChange={setAmount} options={CARD_AMOUNTS.map((a) => ({ value: a, label: `${a} €` }))} />
          )}
          {kind === "subscription" && (
            <InlineOptions<3 | 6 | 12>
              label="Duración"
              value={months}
              onChange={setMonths}
              options={[
                { value: 3, label: "3 meses" },
                { value: 6, label: "6 meses" },
                { value: 12, label: "12 meses" },
              ]}
            />
          )}
          {kind === "box" && <p className="k-co-hint k-gift-hint">La dirección de entrega se indica al tramitar el pedido.</p>}
          <div className="k-co-fields">
            <Field label="Para" autoComplete="off" value={to} onChange={(e) => setTo(e.target.value)} error={tried ? errors.to || undefined : undefined} />
            {needsEmail && (
              <Field
                label="Email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={tried ? errors.email || undefined : undefined}
              />
            )}
            <div className="k-field">
              <label htmlFor={messageId}>Mensaje</label>
              <textarea id={messageId} rows={2} maxLength={160} value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Field label="Fecha de envío" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <button type="submit" className="k-btn-solid">
            Añadir — {formatPrice(price)}
          </button>
        </form>

        <div className="k-gift-preview">
          <p className="k-co-label">{kind === "card" ? "Vista previa" : "Tarjeta que acompaña al regalo"}</p>
          <GiftCardPreview title={option.title} amount={formatPrice(price)} to={to.trim()} message={message.trim()} />
        </div>
      </div>
    </section>
  )
}
