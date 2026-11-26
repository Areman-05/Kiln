"use client"

import React, { useState } from "react"
import { CoffeeThumb, DEMO_ACCOUNT, Field, TextSelect, type Account } from "./Checkout"
import { formatEur, type ActiveSubscription, type CartItem } from "./Components"
import { BAG_SIZES, COFFEE_LOTS, GRIND_OPTIONS, type BagSizeOption, type CoffeeLot, type GrindOption } from "./data"
import { cadenceLabel, shipmentDates, sizeLabel } from "./Subscriptions"

/* ==========================================================================
   Cuenta: zona privada simulada sobre la sesión local del checkout
   ========================================================================== */
export type Order = { number: string; date: string; items: CartItem[]; total: number }
export type Rating = "like" | "dislike"
type ByEmail<T> = Record<string, T>

const ORDERS_KEY = "kiln-orders"
const RATINGS_KEY = "kiln-ratings"
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAY = 86_400_000

const orderLine = (lotId: string, qty = 1, size: BagSizeOption = "250g", grind: GrindOption = "En grano"): CartItem => {
  const lot = COFFEE_LOTS.find((l) => l.id === lotId) ?? COFFEE_LOTS[0]
  const multiplier = BAG_SIZES.find((s) => s.id === size)?.multiplier ?? 1
  return {
    key: `${lot.id}-${size}-${grind}- puntual`,
    lotId: lot.id,
    name: lot.name,
    origin: lot.origin,
    tone: lot.tone,
    no: lot.no,
    size,
    grind,
    purchaseMode: " puntual",
    unitPrice: Math.round(lot.price250 * multiplier * 100) / 100,
    qty,
  }
}

const demoOrder = (number: string, daysAgo: number, items: CartItem[]): Order => {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0)
  return { number, date: new Date(Date.now() - daysAgo * DAY).toISOString(), items, total: subtotal + (subtotal >= 38 ? 0 : 3.9) }
}

// Historial de la cuenta de prueba, con fechas relativas a hoy
const DEMO_ORDERS = (): Order[] => [
  demoOrder("KLN-4821", 1, [orderLine("halo-hartume"), orderLine("sidama-bensa")]),
  demoOrder("KLN-3307", 19, [orderLine("karinga-ab", 2, "250g", "Filtro / V60")]),
  demoOrder("KLN-2954", 47, [orderLine("puno-sandia"), orderLine("cerrado-patrocinio", 1, "500g", "Espresso")]),
]
const DEMO_RATINGS: Record<string, Rating> = { "halo-hartume": "like", "sidama-bensa": "like", "cerrado-patrocinio": "dislike" }

function loadByEmail<T>(key: string, demo: () => T): ByEmail<T> {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) ?? "{}")
    const map: ByEmail<T> = stored && typeof stored === "object" && !Array.isArray(stored) ? stored : {}
    return DEMO_ACCOUNT.email in map ? map : { ...map, [DEMO_ACCOUNT.email]: demo() }
  } catch {
    return { [DEMO_ACCOUNT.email]: demo() }
  }
}
function persist(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* almacenamiento no disponible */
  }
}
export const loadOrders = () => loadByEmail<Order[]>(ORDERS_KEY, DEMO_ORDERS)
export const persistOrders = (orders: ByEmail<Order[]>) => persist(ORDERS_KEY, orders)
export const loadRatings = () => loadByEmail<Record<string, Rating>>(RATINGS_KEY, () => ({ ...DEMO_RATINGS }))
export const persistRatings = (ratings: ByEmail<Record<string, Rating>>) => persist(RATINGS_KEY, ratings)

// Suscripción de ejemplo de la cuenta de prueba
export const demoSubscription = (): ActiveSubscription => {
  const lot = COFFEE_LOTS.find((l) => l.id === "halo-hartume") ?? COFFEE_LOTS[0]
  return {
    id: "SUB-2718",
    planName: lot.name,
    size: "250g",
    grind: "En grano",
    bagsPerShipment: 1,
    cadenceWeeks: 2,
    roastPreference: lot.notes.join(", "),
    status: "Activa",
    nextDeliveryDate: shipmentDates(2, 1)[0],
    skippedDates: [],
    pricePerShipment: Math.round(lot.price250 * 0.88 * 100) / 100,
  }
}

const orderStatus = (order: Order) => (Date.now() - new Date(order.date).getTime() < 3 * DAY ? "En camino" : "Entregado")
const longDate = (iso: string) => new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
const firstName = (name: string) => name.trim().split(/\s+/)[0] || name
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const isCoffee = (item: CartItem) => !item.kind && COFFEE_LOTS.some((l) => l.id === item.lotId)

/* ---------- Perfil de sabor ---------- */
type Family = "florales" | "achocolatados" | "afrutados"
const CHOCOLATE_RE = /cacao|chocolate|caramelo|avellana|almendra|toffee|nuez|melaza|praliné|tostado/i
const familyOf = (lot: CoffeeLot): Family =>
  lot.sensory.floral >= 7 ? "florales" : lot.sensory.body >= 7 && lot.notes.some((n) => CHOCOLATE_RE.test(n)) ? "achocolatados" : "afrutados"
const PROCESS_WORD: Record<CoffeeLot["process"], string> = {
  Lavado: "lavados",
  Natural: "naturales",
  "Honey / Semilavado": "honey",
  "Maceración carbónica": "cafés de maceración carbónica",
  Ensamblaje: "ensamblajes",
}
const DISLIKE_LINE: Record<Family, string> = {
  florales: "Los perfiles muy florales, no tanto.",
  achocolatados: "Los de cacao y mucho cuerpo, no tanto.",
  afrutados: "Los muy afrutados, no tanto.",
}
function mostCommon<T>(values: T[]): [T, number] | null {
  const counts = new Map<T, number>()
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1))
  let best: [T, number] | null = null
  counts.forEach((n, v) => {
    if (!best || n > best[1]) best = [v, n]
  })
  return best
}

export function tasteProfile(ratings: Record<string, Rating>) {
  const rated = (value: Rating) => COFFEE_LOTS.filter((l) => ratings[l.id] === value)
  const liked = rated("like")
  const disliked = rated("dislike")
  if (!liked.length) return null
  const process = mostCommon(liked.map((l) => l.process))![0]
  const family = mostCommon(liked.map(familyOf))![0]
  const country = mostCommon(liked.map((l) => l.country))!
  const place = country[1] * 2 >= liked.length ? ` de ${country[0]}` : ""
  const like =
    process === "Maceración carbónica"
      ? `Te gustan los cafés ${family} de maceración carbónica${place}.`
      : `Te gustan los ${PROCESS_WORD[process]} ${family}${place}.`
  const dislikedFamily = disliked.length ? mostCommon(disliked.map(familyOf))![0] : null
  const summary = dislikedFamily && dislikedFamily !== family ? `${like} ${DISLIKE_LINE[dislikedFamily]}` : like

  // Cafés para ti: misma familia y mismo proceso u origen, sin los descartados
  const pool = COFFEE_LOTS.filter((l) => l.category !== "Formatos" && ratings[l.id] !== "dislike" && familyOf(l) === family)
  const close = pool.filter((l) => l.process === process || l.country === country[0])
  const picks = (close.length >= 3 ? close : pool).map((l) => l.id)
  return { summary, picks }
}

/* ==========================================================================
   VISTA CUENTA
   ========================================================================== */
type Tab = "orders" | "subscription" | "taste" | "details"
const TABS: [Tab, string][] = [
  ["orders", "Pedidos"],
  ["subscription", "Suscripción"],
  ["taste", "Perfil de sabor"],
  ["details", "Datos"],
]

export function AccountView(props: {
  session: Account | null
  findAccount: (email: string) => Account | undefined
  onSignIn: (account: Account) => void
  onSignOut: () => void
  onCreateAccount: (account: Account) => void
  onUpdateAccount: (previousEmail: string, account: Account) => void
  orders: Order[]
  onRepeatOrder: (order: Order) => void
  onOpenLot: (lot: CoffeeLot) => void
  onShop: () => void
  activeSub: ActiveSubscription | null
  onSkipDate: (date: string) => void
  onUpdateSubStatus: (status: "Activa" | "Pausada") => void
  onCancelSub: () => void
  onChangeCoffee: () => void
  ratings: Record<string, Rating>
  onRate: (lotId: string, rating: Rating | null) => void
  onShowPicks: (lotIds: string[]) => void
  onNotify: (message: string) => void
}) {
  const [tab, setTab] = useState<Tab>("orders")
  const { session } = props
  if (!session) return <SignIn {...props} />

  return (
    <section className="k-account">
      <header className="k-account-head">
        <h1 className="k-view-title">Hola, {firstName(session.name)}</h1>
        <p>{session.email}</p>
      </header>
      <nav className="k-account-tabs" aria-label="Secciones de la cuenta">
        {TABS.map(([id, label], i) => (
          <React.Fragment key={id}>
            {i > 0 && <span aria-hidden="true">·</span>}
            <button type="button" aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}>
              {label}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="k-account-panel" key={tab}>
        {tab === "orders" && <Orders {...props} />}
        {tab === "subscription" && <Subscription {...props} />}
        {tab === "taste" && <Taste {...props} />}
        {tab === "details" && <Details key={session.email} {...props} session={session} />}
      </div>
    </section>
  )
}

/* ---------- Entrar / crear cuenta ---------- */
function SignIn({ findAccount, onSignIn, onCreateAccount }: React.ComponentProps<typeof AccountView>) {
  const [mode, setMode] = useState<"signin" | "create">("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tried, setTried] = useState(false)

  const trimmed = email.trim().toLowerCase()
  const existing = EMAIL_RE.test(trimmed) ? findAccount(trimmed) : undefined
  const minPassword = mode === "create" ? 8 : 4
  const errors = {
    name: mode === "create" && name.trim().length < 2 ? "Indica tu nombre." : "",
    email: !EMAIL_RE.test(trimmed)
      ? "Introduce un email válido."
      : mode === "signin" && !existing
        ? "No hay ninguna cuenta con este email."
        : mode === "create" && existing
          ? "Ya hay una cuenta con este email."
          : "",
    password: password.length < minPassword ? `Mínimo ${minPassword} caracteres.` : "",
  }
  const show = (key: keyof typeof errors) => (tried && errors[key]) || undefined

  const switchMode = (next: "signin" | "create") => {
    setMode(next)
    setTried(false)
    setPassword("")
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (Object.values(errors).some(Boolean)) return
    if (mode === "signin" && existing) onSignIn(existing)
    if (mode === "create") onCreateAccount({ email: trimmed, name: name.trim() })
  }

  return (
    <section className="k-account k-account-signin">
      <form className="k-account-form" onSubmit={submit} noValidate>
        <h1 className="k-view-title">{mode === "signin" ? "Entrar" : "Crear cuenta"}</h1>
        <p className="k-prose k-lede">
          {mode === "signin" ? "Tus pedidos, tu suscripción y lo que te gusta, en un solo sitio." : "Guarda tus datos y ve directo a confirmar en cada pedido."}
        </p>
        <div className="k-co-fields">
          {mode === "create" && <Field label="Nombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={show("name")} />}
          <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={show("email")} />
          <Field
            label="Contraseña"
            type="password"
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={show("password")}
          />
        </div>
        <button type="submit" className="k-btn-solid">
          {mode === "signin" ? "Entrar" : "Crear cuenta"}
        </button>
        <div className="k-account-links">
          {mode === "signin" ? (
            <>
              <button type="button" className="k-text-link" onClick={() => onSignIn(DEMO_ACCOUNT)}>
                — Usar la cuenta de prueba
              </button>
              <button type="button" className="k-text-link" onClick={() => switchMode("create")}>
                — Crear cuenta
              </button>
            </>
          ) : (
            <button type="button" className="k-text-link" onClick={() => switchMode("signin")}>
              — Ya tengo cuenta
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

/* ---------- Pedidos ---------- */
function Orders({ orders, onRepeatOrder, onShop }: React.ComponentProps<typeof AccountView>) {
  const [openNumber, setOpenNumber] = useState<string | null>(null)
  if (!orders.length) {
    return (
      <div className="k-account-empty">
        <p className="k-prose">Aún no has hecho ningún pedido.</p>
        <button type="button" className="k-text-link" onClick={onShop}>
          — Ver los cafés
        </button>
      </div>
    )
  }
  return (
    <ul className="k-orders">
      {orders.map((order) => {
        const status = orderStatus(order)
        const open = openNumber === order.number
        const bags = order.items.reduce((n, i) => n + i.qty, 0)
        return (
          <li key={order.number} className="k-order">
            <div className="k-order-row">
              <div className="k-order-id">
                <strong>Pedido {order.number}</strong>
                <span>{longDate(order.date)}</span>
              </div>
              <div className="k-order-thumbs" aria-label={`${bags} ${bags === 1 ? "artículo" : "artículos"}`}>
                {order.items.slice(0, 3).map((item) => (
                  <CoffeeThumb key={item.key} item={item} />
                ))}
              </div>
              <span className="k-order-total">{formatEur(order.total)}</span>
              <span className={`k-order-status ${status === "En camino" ? "is-live" : ""}`}>{status}</span>
              <div className="k-order-actions">
                <button type="button" className="k-text-link" aria-expanded={open} onClick={() => setOpenNumber(open ? null : order.number)}>
                  {open ? "— Ocultar" : "— Ver pedido"}
                </button>
                <button type="button" className="k-text-link" onClick={() => onRepeatOrder(order)}>
                  — Repetir pedido
                </button>
              </div>
            </div>
            {open && (
              <ul className="k-order-lines">
                {order.items.map((item) => (
                  <li key={item.key}>
                    <span>
                      {item.qty} × {item.name}
                    </span>
                    <small>{item.kind ? item.origin : `${sizeLabel(item.size)} · ${item.grind}`}</small>
                    <span>{formatEur(item.unitPrice * item.qty)}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Suscripción ---------- */
function Subscription({ activeSub, onSkipDate, onUpdateSubStatus, onCancelSub, onChangeCoffee }: React.ComponentProps<typeof AccountView>) {
  const [confirming, setConfirming] = useState(false)
  if (!activeSub) {
    return (
      <div className="k-account-empty">
        <p className="k-prose">No tienes ninguna suscripción activa. Café recién tostado a tu ritmo, con un 12 % menos.</p>
        <button type="button" className="k-text-link" onClick={onChangeCoffee}>
          — Crear una suscripción
        </button>
      </div>
    )
  }
  const paused = activeSub.status === "Pausada"
  const dates = shipmentDates(activeSub.cadenceWeeks, 8)
  const next = dates.find((d) => !activeSub.skippedDates.includes(d))
  const skipped = dates.filter((d) => activeSub.skippedDates.includes(d))

  return (
    <div className="k-account-sub">
      <dl className="k-pairs">
        <div>
          <dt>Café</dt>
          <dd>{activeSub.planName}</dd>
        </div>
        <div>
          <dt>Formato</dt>
          <dd>
            {sizeLabel(activeSub.size)} · {activeSub.grind}
          </dd>
        </div>
        <div>
          <dt>Frecuencia</dt>
          <dd>{cadenceLabel(activeSub.cadenceWeeks)}</dd>
        </div>
        <div>
          <dt>Próximo envío</dt>
          <dd>{paused ? "En pausa" : next ? capitalize(next) : "—"}</dd>
        </div>
        <div>
          <dt>Por envío</dt>
          <dd>{formatEur(activeSub.pricePerShipment)}</dd>
        </div>
      </dl>

      {!paused && skipped.length > 0 && (
        <ul className="k-subs-dates" aria-label="Envíos saltados">
          {skipped.map((d) => (
            <li key={d} className="is-skipped">
              <span>{d}</span>
              <button type="button" className="k-text-link" onClick={() => onSkipDate(d)}>
                — Restaurar
              </button>
            </li>
          ))}
        </ul>
      )}

      {confirming ? (
        <div className="k-account-confirm" role="alert">
          <p className="k-prose">¿Cancelar la suscripción? Dejarás de tener el 12 % en tus compras.</p>
          <div className="k-account-actions">
            <button
              type="button"
              className="k-text-link"
              onClick={() => {
                setConfirming(false)
                onCancelSub()
              }}
            >
              — Sí, cancelar
            </button>
            <button type="button" className="k-text-link" onClick={() => setConfirming(false)}>
              — Mantenerla
            </button>
          </div>
        </div>
      ) : (
        <div className="k-account-actions">
          {!paused && next && (
            <button type="button" className="k-text-link" onClick={() => onSkipDate(next)}>
              — Saltar el próximo envío
            </button>
          )}
          <button type="button" className="k-text-link" onClick={onChangeCoffee}>
            — Cambiar café
          </button>
          <button type="button" className="k-text-link" onClick={() => onUpdateSubStatus(paused ? "Activa" : "Pausada")}>
            {paused ? "— Reactivar" : "— Pausar"}
          </button>
          <button type="button" className="k-text-link" onClick={() => setConfirming(true)}>
            — Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------- Perfil de sabor ---------- */
function Taste({ orders, ratings, onRate, onOpenLot, onShowPicks, onShop }: React.ComponentProps<typeof AccountView>) {
  // Cafés probados: los de sus pedidos, del más reciente al más antiguo
  const tried: CoffeeLot[] = []
  orders.forEach((o) =>
    o.items.filter(isCoffee).forEach((i) => {
      const lot = COFFEE_LOTS.find((l) => l.id === i.lotId)
      if (lot && !tried.includes(lot)) tried.push(lot)
    })
  )
  const profile = tasteProfile(ratings)

  if (!tried.length) {
    return (
      <div className="k-account-empty">
        <p className="k-prose">Cuando pruebes nuestros cafés podrás valorarlos aquí y te diremos qué buscar.</p>
        <button type="button" className="k-text-link" onClick={onShop}>
          — Ver los cafés
        </button>
      </div>
    )
  }

  return (
    <div className="k-taste">
      <div className="k-taste-summary">
        <p>{profile ? profile.summary : "Valora los cafés que has probado y te diremos qué buscar."}</p>
        {profile && (
          <button type="button" className="k-text-link" onClick={() => onShowPicks(profile.picks)}>
            — Ver cafés para ti
          </button>
        )}
      </div>
      <ul className="k-taste-list" aria-label="Cafés que has probado">
        {tried.map((lot) => {
          const rating = ratings[lot.id]
          return (
            <li key={lot.id}>
              <CoffeeThumb item={{ name: lot.name, no: lot.no, origin: lot.origin, tone: lot.tone, size: "250g" }} />
              <div className="k-taste-info">
                <button type="button" className="k-cart-name" onClick={() => onOpenLot(lot)}>
                  {lot.name}
                </button>
                <small>
                  {lot.process} · {lot.country} · {lot.notes.join(" · ")}
                </small>
              </div>
              <div className="k-taste-rate" role="group" aria-label={`Valora ${lot.name}`}>
                {(
                  [
                    ["like", "Me gustó"],
                    ["dislike", "No es para mí"],
                  ] as [Rating, string][]
                ).map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={rating === value} onClick={() => onRate(lot.id, rating === value ? null : value)}>
                    {label}
                  </button>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---------- Datos ---------- */
function Details({ session, findAccount, onUpdateAccount, onSignOut, onNotify }: React.ComponentProps<typeof AccountView> & { session: Account }) {
  const [name, setName] = useState(session.name)
  const [email, setEmail] = useState(session.email)
  const [address, setAddress] = useState(session.address?.address ?? "")
  const [postal, setPostal] = useState(session.address?.postal ?? "")
  const [city, setCity] = useState(session.address?.city ?? "")
  const [phone, setPhone] = useState(session.address?.phone ?? "")
  const [grind, setGrind] = useState<GrindOption>(session.grind ?? "En grano")
  const [tried, setTried] = useState(false)

  const trimmed = email.trim().toLowerCase()
  const taken = trimmed !== session.email && !!findAccount(trimmed)
  const errors = {
    name: name.trim().length < 2 ? "Indica tu nombre." : "",
    email: !EMAIL_RE.test(trimmed) ? "Introduce un email válido." : taken ? "Ya hay otra cuenta con este email." : "",
    postal: postal.trim() && !/^\d{5}$/.test(postal.trim()) ? "El código postal tiene 5 cifras." : "",
  }
  const show = (key: keyof typeof errors) => (tried && errors[key]) || undefined

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (Object.values(errors).some(Boolean)) return
    const hasAddress = [address, postal, city, phone].some((v) => v.trim())
    onUpdateAccount(session.email, {
      ...session,
      name: name.trim(),
      email: trimmed,
      grind,
      address: hasAddress
        ? { name: name.trim(), address: address.trim(), postal: postal.trim(), city: city.trim(), phone: phone.trim() }
        : undefined,
    })
    setTried(false)
    onNotify("Datos guardados.")
  }

  return (
    <form className="k-account-form k-account-details" onSubmit={save} noValidate>
      <div className="k-co-fields">
        <Field label="Nombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={show("name")} />
        <Field label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={show("email")} />
        <Field label="Dirección" autoComplete="street-address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="k-co-row">
          <Field label="Código postal" inputMode="numeric" autoComplete="postal-code" value={postal} onChange={(e) => setPostal(e.target.value)} error={show("postal")} />
          <Field label="Ciudad" autoComplete="address-level2" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <Field label="Teléfono" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="k-field k-field-select">
          <span className="k-field-label">Molienda preferida</span>
          <TextSelect label="Molienda preferida" value={grind} options={GRIND_OPTIONS.map((g) => ({ value: g.id, label: g.id }))} onChange={(v) => setGrind(v as GrindOption)} />
        </div>
      </div>
      <button type="submit" className="k-btn-solid">
        Guardar
      </button>
      <button type="button" className="k-text-link" onClick={onSignOut}>
        — Cerrar sesión
      </button>
    </form>
  )
}
