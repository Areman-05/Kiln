"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import { Bag } from "./Bag"
import { BAG_SIZES, COFFEE_LOTS, GRIND_OPTIONS, type BagSizeOption, type GrindOption } from "./data"
import { formatEur, type CartItem } from "./Components"
import { KilnPattern } from "./Brand"

/* ==========================================================================
   Cuentas y pago: simulación local en el navegador.
   Sustituir por Payload (cuentas, pedidos) y Stripe al conectar el pago real.
   ========================================================================== */
export type SavedAddress = { name: string; address: string; postal: string; city: string; phone: string }
export type SavedPayment = { method: "card"; brand: string; last4: string; exp: string } | { method: "paypal" | "bizum" }
export type Account = { email: string; name: string; address?: SavedAddress; payment?: SavedPayment }
export type DeliveryMethod = "shipping" | "pickup"

export const DEMO_ACCOUNT: Account = {
  email: "marc.soler@estudio22.cat",
  name: "Marc Soler",
  address: { name: "Marc Soler", address: "Calle de Hortaleza 48, 3º", postal: "28004", city: "Madrid", phone: "612 345 678" },
  payment: { method: "card", brand: "Visa", last4: "4242", exp: "09/28" },
}

// Datos que devolvería la cartera (Apple Pay / Google Pay) a un invitado
const WALLET_CONTACT = {
  email: "laia.vidal@icloud.com",
  address: { name: "Laia Vidal", address: "Calle de Fuencarral 112", postal: "28010", city: "Madrid", phone: "655 210 334" },
}

const ACCOUNTS_KEY = "kiln-accounts"
export const SESSION_KEY = "kiln-session"

export function loadAccounts(): Account[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? "[]")
    const list: Account[] = Array.isArray(stored) ? stored : []
    return list.some((a) => a.email === DEMO_ACCOUNT.email) ? list : [DEMO_ACCOUNT, ...list]
  } catch {
    return [DEMO_ACCOUNT]
  }
}

export function persistAccounts(accounts: Account[]) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  } catch {
    /* almacenamiento no disponible: la sesión vive solo en memoria */
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const sizeLabel = (size: BagSizeOption) => BAG_SIZES.find((s) => s.id === size)?.label ?? size
const isCoffee = (item: CartItem) => COFFEE_LOTS.some((l) => l.id === item.lotId)
// Línea secundaria: «250 g · En grano» para cafés, el material para objetos
const itemDetail = (item: CartItem) => (item.kind === "object" ? item.origin : `${sizeLabel(item.size)} · ${item.grind}`)

/* Miniatura: bolsa sobre el mismo recuadro de yeso que la ficha */
export function CoffeeThumb({ item }: { item: Pick<CartItem, "name" | "no" | "origin" | "tone" | "size" | "image"> }) {
  if (item.image) {
    return (
      <span className="k-thumb is-photo" aria-hidden="true">
        <img src={item.image} alt="" />
      </span>
    )
  }
  return (
    <span className="k-plaster k-thumb" aria-hidden="true">
      <Bag lot={{ name: item.name, no: item.no, origin: item.origin, tone: item.tone, weight: sizeLabel(item.size) }} size="xs" />
    </span>
  )
}

function Totals({ subtotal, shipping, total }: { subtotal: number; shipping: number; total: number }) {
  return (
    <dl className="k-totals">
      <div>
        <dt>Subtotal</dt>
        <dd>{formatEur(subtotal)}</dd>
      </div>
      <div>
        <dt>Envío</dt>
        <dd>{shipping === 0 ? "Gratis" : formatEur(shipping)}</dd>
      </div>
      <div className="is-total">
        <dt>
          Total <small>IVA incluido</small>
        </dt>
        <dd>{formatEur(total)}</dd>
      </div>
    </dl>
  )
}

/* Desplegable de texto: select nativo (accesible y cómodo en móvil) sin caja */
function TextSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  return (
    <label className="k-tselect">
      <span className="k-sr">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

/* ==========================================================================
   CESTA (panel lateral): solo lo que el usuario tiene, sin pasos
   ========================================================================== */
export function CartDrawer({
  open,
  items,
  count,
  subtotal,
  shippingCost,
  total,
  threshold,
  isMember,
  onClose,
  onQty,
  onRemove,
  onUpdate,
  onCheckout,
  onShop,
  onSubscribe,
}: {
  open: boolean
  items: CartItem[]
  count: number
  subtotal: number
  shippingCost: number
  total: number
  threshold: number
  isMember: boolean
  onClose: () => void
  onQty: (key: string, delta: number) => void
  onRemove: (key: string) => void
  onUpdate: (key: string, patch: { size?: BagSizeOption; grind?: GrindOption }) => void
  onCheckout: () => void
  onShop: () => void
  onSubscribe: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) window.requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }))
  }, [open])

  const missing = Math.max(0, threshold - subtotal)
  const progress = Math.min(1, subtotal / threshold)
  const coffees = items.filter(isCoffee)
  const showSubscribe = !isMember && coffees.some((i) => i.purchaseMode !== "suscripcion")

  return (
    <>
      <div className={`k-overlay ${open ? "open" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`k-cart ${open ? "open" : ""}`} aria-label="Cesta" aria-hidden={!open} inert={!open}>
        <header className="k-cart-head">
          <h2>
            Cesta{count > 0 && <span> {count}</span>}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose}>
            Cerrar
          </button>
        </header>

        {items.length === 0 ? (
          <div className="k-cart-empty">
            <p className="k-prose">Tu cesta está vacía. Empieza por los cafés de esta temporada.</p>
            <button type="button" className="k-text-link" onClick={onShop}>
              — Ver novedades
            </button>
          </div>
        ) : (
          <>
            <div className="k-cart-body">
              <ul className="k-cart-list">
                {items.map((item) => {
                  const editable = isCoffee(item)
                  return (
                    <li key={item.key} className="k-cart-row">
                      <CoffeeThumb item={item} />
                      <div className="k-cart-info">
                        <div className="k-cart-line">
                          <strong>{item.name}</strong>
                          <span>{formatEur(item.unitPrice * item.qty)}</span>
                        </div>
                        {(!editable || item.purchaseMode === "suscripcion") && (
                          <p className="k-cart-meta">
                            {editable ? `Suscripción cada ${item.cadenceWeeks ?? 2} semanas` : item.origin}
                          </p>
                        )}
                        {editable && (
                          <div className="k-cart-selects">
                            <TextSelect
                              label={`Tamaño de ${item.name}`}
                              value={item.size}
                              options={BAG_SIZES.map((s) => ({ value: s.id, label: s.label }))}
                              onChange={(v) => onUpdate(item.key, { size: v as BagSizeOption })}
                            />
                            <TextSelect
                              label={`Molienda de ${item.name}`}
                              value={item.grind}
                              options={GRIND_OPTIONS.map((g) => ({ value: g.id, label: g.id }))}
                              onChange={(v) => onUpdate(item.key, { grind: v as GrindOption })}
                            />
                          </div>
                        )}
                        <div className="k-cart-actions">
                          <div className="k-qty" role="group" aria-label={`Cantidad de ${item.name}`}>
                            <button type="button" aria-label="Quitar una" disabled={item.qty <= 1} onClick={() => onQty(item.key, -1)}>
                              −
                            </button>
                            <span aria-live="polite">{item.qty}</span>
                            <button type="button" aria-label="Añadir una" onClick={() => onQty(item.key, 1)}>
                              +
                            </button>
                          </div>
                          <button type="button" className="k-cart-remove" onClick={() => onRemove(item.key)}>
                            — Quitar
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="k-cart-ship">
                <p>{missing > 0 ? `Te faltan ${formatEur(missing)} para el envío gratis` : "Envío gratis"}</p>
                <span className="k-cart-bar" aria-hidden="true">
                  <i style={{ transform: `scaleX(${progress})` }} />
                </span>
              </div>

              {showSubscribe && (
                <button type="button" className="k-text-link" onClick={onSubscribe}>
                  {coffees.length === 1 ? "— Suscríbete a este café y ahorra un 12 %" : "— Suscríbete a estos cafés y ahorra un 12 %"}
                </button>
              )}
            </div>

            <footer className="k-cart-foot">
              <Totals subtotal={subtotal} shipping={shippingCost} total={total} />
              <button type="button" className="k-btn-solid" onClick={onCheckout}>
                Tramitar pedido
              </button>
              <button type="button" className="k-text-link is-center" onClick={onClose}>
                — Seguir comprando
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

/* ==========================================================================
   PROCESO DE COMPRA (página propia)
   ========================================================================== */
type Step = "id" | "address" | "payment" | "confirm" | "done"
const STEPS: { id: Step; label: string }[] = [
  { id: "id", label: "Identificación" },
  { id: "address", label: "Dirección" },
  { id: "payment", label: "Pago" },
  { id: "confirm", label: "Confirmar" },
  { id: "done", label: "Listo" },
]
const stepIndex = (s: Step) => STEPS.findIndex((x) => x.id === s)

type PlacedOrder = {
  number: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  email: string
  delivery: DeliveryMethod
  address: SavedAddress
  paymentLabel: string
  payment?: SavedPayment
  guest: boolean
  placedAt: Date
  roastDate: Date
  shipDate: Date
}

const EMPTY_ADDRESS: SavedAddress = { name: "", address: "", postal: "", city: "", phone: "" }

const nextBusinessDay = (from: Date) => {
  const d = new Date(from)
  do d.setDate(d.getDate() + 1)
  while (d.getDay() === 0 || d.getDay() === 6)
  return d
}
const formatDay = (d: Date) => d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })

const luhn = (digits: string) => {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}
const cardBrand = (digits: string) => (digits.startsWith("4") ? "Visa" : /^5[1-5]/.test(digits) ? "Mastercard" : /^3[47]/.test(digits) ? "Amex" : "Tarjeta")
const validExp = (exp: string) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp)
  if (!m) return false
  const month = Number(m[1])
  if (month < 1 || month > 12) return false
  const now = new Date()
  const year = 2000 + Number(m[2])
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}
const formatCardNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
const formatExp = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function Field({
  label,
  error,
  className = "",
  ...input
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId()
  return (
    <div className={`k-field ${error ? "is-error" : ""} ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} {...input} />
      {error && (
        <p id={`${id}-error`} className="k-field-error">
          {error}
        </p>
      )}
    </div>
  )
}

/* Opciones como filas de texto: un marcador indica la elegida, detalle a la derecha */
function TextChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string; note?: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="k-choice" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}>
          <i aria-hidden="true">{value === o.value ? "●" : ""}</i>
          <span>{o.label}</span>
          {o.note && <small>{o.note}</small>}
        </button>
      ))}
    </div>
  )
}

export function CheckoutView({
  items,
  subtotal,
  threshold,
  delivery,
  onDeliveryChange,
  session,
  findAccount,
  onSignIn,
  onSignOut,
  onSaveAccount,
  onPlaceOrder,
  onEditCart,
  onShop,
  onBrew,
  onSubscribe,
  isMember,
}: {
  items: CartItem[]
  subtotal: number
  threshold: number
  delivery: DeliveryMethod
  onDeliveryChange: (d: DeliveryMethod) => void
  session: Account | null
  findAccount: (email: string) => Account | undefined
  onSignIn: (account: Account) => void
  onSignOut: () => void
  onSaveAccount: (account: Account) => void
  onPlaceOrder: () => void
  onEditCart: () => void
  onShop: () => void
  onBrew: () => void
  onSubscribe: () => void
  isMember: boolean
}) {
  // Con sesión y datos guardados se entra directamente a CONFIRMAR
  const savedComplete = !!(session?.address && session?.payment)
  const initialStep: Step = savedComplete ? "confirm" : session ? "address" : "id"

  const [step, setStep] = useState<Step>(initialStep)
  const [reached, setReached] = useState<number>(stepIndex(initialStep))
  const [email, setEmail] = useState<string>(session?.email ?? "")
  const [password, setPassword] = useState<string>("")
  const [linkSent, setLinkSent] = useState<boolean>(false)
  const [address, setAddress] = useState<SavedAddress>(session?.address ?? { ...EMPTY_ADDRESS, name: session?.name ?? "" })
  const [payMethod, setPayMethod] = useState<SavedPayment["method"]>(session?.payment?.method ?? "card")
  const [savedCard, setSavedCard] = useState<Extract<SavedPayment, { method: "card" }> | null>(
    session?.payment?.method === "card" ? session.payment : null
  )
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [tried, setTried] = useState<Partial<Record<Step, boolean>>>({})
  const [busy, setBusy] = useState<null | "pay" | "applepay" | "googlepay">(null)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const [summaryOpen, setSummaryOpen] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>("")
  const [accountTried, setAccountTried] = useState<boolean>(false)
  const [accountCreated, setAccountCreated] = useState<boolean>(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const current = stepIndex(step)
  const goTo = (next: Step) => {
    setStep(next)
    setReached((r) => Math.max(r, stepIndex(next)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  // Al editar desde CONFIRMAR, guardar devuelve directamente a CONFIRMAR
  const nextAfter = (s: Step): Step => (reached >= stepIndex("confirm") ? "confirm" : STEPS[stepIndex(s) + 1].id)
  const touch = (name: string) => () => setTouched((t) => ({ ...t, [name]: true }))
  const show = (s: Step, name: string, error: string) => (tried[s] || touched[name] ? error || undefined : undefined)

  const shippingFor = (d: DeliveryMethod) => (d === "pickup" || subtotal >= threshold ? 0 : 3.9)
  const shipping = shippingFor(delivery)
  const total = subtotal + shipping

  /* ---------- Validación ---------- */
  const trimmedEmail = email.trim().toLowerCase()
  const emailValid = EMAIL_RE.test(trimmedEmail)
  const existing = emailValid ? findAccount(trimmedEmail) : undefined

  const addressErrors = {
    name: address.name.trim().length < 2 ? "Indica nombre y apellidos." : "",
    address: delivery === "shipping" && address.address.trim().length < 5 ? "Indica calle y número." : "",
    postal: delivery === "shipping" && !/^\d{5}$/.test(address.postal.trim()) ? "El código postal tiene 5 cifras." : "",
    city: delivery === "shipping" && address.city.trim().length < 2 ? "Indica la ciudad." : "",
    phone: address.phone.replace(/\D/g, "").length < 9 ? "Indica un teléfono de 9 cifras." : "",
  }
  const addressValid = Object.values(addressErrors).every((e) => !e)

  const cardDigits = card.number.replace(/\D/g, "")
  const cardErrors = {
    number: cardDigits.length < 13 || !luhn(cardDigits) ? "Número de tarjeta no válido." : "",
    exp: validExp(card.exp) ? "" : "Fecha no válida (MM/AA).",
    cvc: /^\d{3,4}$/.test(card.cvc) ? "" : "El CVC tiene 3 o 4 cifras.",
  }
  const usingSavedCard = payMethod === "card" && !!savedCard
  const paymentValid = payMethod !== "card" || usingSavedCard || Object.values(cardErrors).every((e) => !e)

  const paymentDetails = (): { label: string; saved: SavedPayment } => {
    if (payMethod === "paypal") return { label: "PayPal", saved: { method: "paypal" } }
    if (payMethod === "bizum") return { label: `Bizum · ${address.phone}`, saved: { method: "bizum" } }
    const c = usingSavedCard && savedCard ? savedCard : { method: "card" as const, brand: cardBrand(cardDigits), last4: cardDigits.slice(-4), exp: card.exp }
    return { label: `${c.brand} ···· ${c.last4} · ${c.exp}`, saved: c }
  }

  /* ---------- Acciones ---------- */
  const enterWith = (account: Account) => {
    onSignIn(account)
    setEmail(account.email)
    setAddress(account.address ?? { ...EMPTY_ADDRESS, name: account.name })
    if (account.payment) {
      setPayMethod(account.payment.method)
      setSavedCard(account.payment.method === "card" ? account.payment : null)
    }
    setPassword("")
    setLinkSent(false)
    if (account.address && account.payment) {
      setStep("confirm")
      setReached(stepIndex("confirm"))
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else goTo("address")
  }

  const submitIdentity = (e: React.FormEvent) => {
    e.preventDefault()
    setTried((t) => ({ ...t, id: true }))
    if (session) return goTo(nextAfter("id"))
    if (!emailValid) return
    if (existing) {
      // Simulación: cualquier contraseña de 4 o más caracteres es válida
      if (password.length >= 4) enterWith(existing)
      return
    }
    goTo(nextAfter("id"))
  }

  const submitAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setTried((t) => ({ ...t, address: true }))
    if (addressValid) goTo(nextAfter("address"))
  }

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setTried((t) => ({ ...t, payment: true }))
    if (paymentValid) goTo("confirm")
  }

  const finalize = (opts: { email: string; address: SavedAddress; paymentLabel: string; payment?: SavedPayment }) => {
    const placedAt = new Date()
    const roastDate = nextBusinessDay(placedAt)
    setPlaced({
      number: `KLN-${Math.floor(1000 + Math.random() * 9000)}`,
      items,
      subtotal,
      shipping,
      total,
      email: opts.email,
      delivery,
      address: opts.address,
      paymentLabel: opts.paymentLabel,
      payment: opts.payment,
      guest: !session,
      placedAt,
      roastDate,
      shipDate: delivery === "pickup" ? roastDate : nextBusinessDay(roastDate),
    })
    onPlaceOrder()
    setBusy(null)
    goTo("done")
  }

  const pay = () => {
    // Comprobación final: si falta algo, se vuelve a su paso
    if (!session && !emailValid) return goTo("id")
    if (!addressValid) {
      setTried((t) => ({ ...t, address: true }))
      return goTo("address")
    }
    if (!paymentValid) {
      setTried((t) => ({ ...t, payment: true }))
      return goTo("payment")
    }
    const details = paymentDetails()
    setBusy("pay")
    timers.current.push(
      window.setTimeout(
        () => finalize({ email: session?.email ?? trimmedEmail, address, paymentLabel: details.label, payment: details.saved }),
        1100
      )
    )
  }

  // Pago exprés: la cartera aporta contacto y dirección, y se saltan los pasos
  const payExpress = (wallet: "applepay" | "googlepay") => {
    setBusy(wallet)
    const contact = session?.address ? { email: session.email, address: session.address } : WALLET_CONTACT
    if (!session?.address) setAddress(WALLET_CONTACT.address)
    timers.current.push(
      window.setTimeout(
        () =>
          finalize({
            email: contact.email,
            address: contact.address,
            paymentLabel: wallet === "applepay" ? "Apple Pay" : "Google Pay",
          }),
        900
      )
    )
  }

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setAccountTried(true)
    if (!placed || newPassword.length < 8) return
    const account: Account = {
      email: placed.email,
      name: placed.address.name,
      address: placed.delivery === "shipping" ? placed.address : undefined,
      payment: placed.payment,
    }
    onSaveAccount(account)
    onSignIn(account)
    setAccountCreated(true)
  }

  /* ---------- Render ---------- */
  const finished = step === "done" && !!placed
  const rows = finished && placed ? placed.items : items
  const sums = finished && placed ? placed : { subtotal, shipping, total }
  const cartEmpty = items.length === 0 && !finished

  const stepsNav = (
    <nav className="k-steps" aria-label="Pasos del pedido">
      <ol>
        {STEPS.filter((s) => s.id !== "done").map((s, i) => {
          const done = i < current || (i < reached && i !== current && s.id !== "confirm")
          const state = i === current ? "is-current" : done ? "is-done" : "is-todo"
          const label = (
            <>
              <span className="k-step-no">{String(i + 1).padStart(2, "0")}</span> <span className="k-step-label">{s.label}</span>
            </>
          )
          return (
            <li key={s.id} className={state} aria-current={i === current ? "step" : undefined}>
              {done ? (
                <button type="button" onClick={() => goTo(s.id)} aria-label={`${s.label}, completado. Editar`}>
                  {label}
                </button>
              ) : (
                <span>{label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )

  // Pasos completados plegados en una línea: «Email   pablo@email.com   — Editar»
  const recapRows: { step: Step; label: string; value: string }[] = [
    { step: "id", label: "Email", value: session?.email ?? trimmedEmail },
    {
      step: "address",
      label: "Entrega",
      value:
        delivery === "pickup"
          ? `Recogida en el estudio · ${address.name}`
          : [address.address, `${address.postal} ${address.city}`.trim()].filter(Boolean).join(", "),
    },
    { step: "payment", label: "Pago", value: paymentValid ? paymentDetails().label : "Pendiente" },
  ]
  const recap = (rowsToShow: typeof recapRows) =>
    rowsToShow.length > 0 && (
      <dl className="k-recap">
        {rowsToShow.map((row) => (
          <div key={row.step}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
            <button type="button" className="k-text-link" onClick={() => goTo(row.step)} aria-label={`Editar ${row.label.toLowerCase()}`}>
              — Editar
            </button>
          </div>
        ))}
      </dl>
    )
  const completedBefore = recapRows.filter((row) => stepIndex(row.step) < current)

  const summary = (
    <aside className={`k-co-summary ${summaryOpen ? "is-open" : ""}`} aria-label="Resumen del pedido">
      <button type="button" className="k-co-summary-toggle" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((o) => !o)}>
        <span>Resumen · {formatEur(sums.total)}</span>
        <i aria-hidden="true">{summaryOpen ? "—" : "+"}</i>
      </button>
      <div className="k-co-summary-body">
        <div>
          <div className="k-co-summary-head">
            <span>Resumen</span>
            {!finished && (
              <button type="button" className="k-text-link" onClick={onEditCart}>
                Editar cesta
              </button>
            )}
          </div>
          <ul className="k-co-items">
            {rows.map((item) => (
              <li key={item.key}>
                <CoffeeThumb item={item} />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.qty} × {sizeLabel(item.size)} · {item.grind}
                  </span>
                </div>
                <span>{formatEur(item.unitPrice * item.qty)}</span>
              </li>
            ))}
          </ul>
          <Totals subtotal={sums.subtotal} shipping={sums.shipping} total={sums.total} />
        </div>
      </div>
    </aside>
  )

  const express = (
    <div className="k-express">
      <span className="k-co-label">Pago exprés</span>
      <div>
        <button type="button" onClick={() => payExpress("applepay")} disabled={!!busy}>
          {busy === "applepay" ? "Procesando…" : "Apple Pay"}
        </button>
        <button type="button" onClick={() => payExpress("googlepay")} disabled={!!busy}>
          {busy === "googlepay" ? "Procesando…" : "Google Pay"}
        </button>
      </div>
      <p className="k-co-or">
        <span>o paso a paso</span>
      </p>
    </div>
  )

  const identity = (
    <form onSubmit={submitIdentity} noValidate>
      <h1 className="k-co-title">Identificación</h1>
      {session ? (
        <>
          <p className="k-co-text">Sesión iniciada como {session.email}.</p>
          <button type="submit" className="k-btn-solid">
            Continuar
          </button>
          <button
            type="button"
            className="k-text-link"
            onClick={() => {
              onSignOut()
              setEmail("")
              setAddress(EMPTY_ADDRESS)
              setSavedCard(null)
              setPayMethod("card")
              setReached(0)
            }}
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setLinkSent(false)
            }}
            onBlur={touch("email")}
            error={show("id", "email", emailValid ? "" : "Introduce un email válido.")}
          />

          {existing ? (
            <div className="k-co-reveal">
              <p className="k-co-text">Ya tienes cuenta con este email.</p>
              {linkSent ? (
                <>
                  <p className="k-co-text">Enlace enviado a {trimmedEmail}. Ábrelo para continuar.</p>
                  <button type="button" className="k-btn-solid" onClick={() => enterWith(existing)}>
                    Ya he abierto el enlace
                  </button>
                </>
              ) : (
                <>
                  <Field
                    label="Contraseña"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={tried.id && password.length < 4 ? "Introduce tu contraseña." : undefined}
                  />
                  <button type="submit" className="k-btn-solid">
                    Entrar
                  </button>
                  <button type="button" className="k-text-link" onClick={() => setLinkSent(true)}>
                    Enviarme un enlace de acceso
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <button type="submit" className="k-btn-solid">
                Continuar como invitado
              </button>
              <p className="k-co-hint">No hace falta crear una cuenta.</p>
            </>
          )}

          {!existing && (
            <button
              type="button"
              className="k-text-link is-muted"
              onClick={() => {
                setEmail(DEMO_ACCOUNT.email)
                setTouched({})
              }}
            >
              Usar la cuenta de prueba
            </button>
          )}
        </>
      )}
    </form>
  )

  const setField = (name: keyof SavedAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [name]: e.target.value }))

  const addressStep = (
    <form onSubmit={submitAddress} noValidate>
      <h1 className="k-co-title">Dirección</h1>
      <span className="k-co-label">Entrega</span>
      <TextChoice<DeliveryMethod>
        label="Método de entrega"
        value={delivery}
        onChange={onDeliveryChange}
        options={[
          { value: "shipping", label: "Envío 24 h", note: shippingFor("shipping") === 0 ? "Gratis" : formatEur(3.9) },
          { value: "pickup", label: "Recogida en el estudio", note: "Gratis" },
        ]}
      />
      <div className="k-co-fields">
        <Field label="Nombre" autoComplete="name" value={address.name} onChange={setField("name")} onBlur={touch("name")} error={show("address", "name", addressErrors.name)} />
        {delivery === "shipping" && (
          <>
            <Field
              label="Dirección"
              autoComplete="street-address"
              value={address.address}
              onChange={setField("address")}
              onBlur={touch("address")}
              error={show("address", "address", addressErrors.address)}
            />
            <div className="k-co-pair">
              <Field
                label="Código postal"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={5}
                value={address.postal}
                onChange={setField("postal")}
                onBlur={touch("postal")}
                error={show("address", "postal", addressErrors.postal)}
              />
              <Field label="Ciudad" autoComplete="address-level2" value={address.city} onChange={setField("city")} onBlur={touch("city")} error={show("address", "city", addressErrors.city)} />
            </div>
          </>
        )}
        <Field label="Teléfono" type="tel" autoComplete="tel" inputMode="tel" value={address.phone} onChange={setField("phone")} onBlur={touch("phone")} error={show("address", "phone", addressErrors.phone)} />
      </div>
      {delivery === "pickup" && <p className="k-co-hint">Listo para recoger el día del tueste, desde las 16:00.</p>}
      <button type="submit" className="k-btn-solid">
        {reached >= stepIndex("confirm") ? "Guardar y revisar" : "Continuar al pago"}
      </button>
    </form>
  )

  const paymentStep = (
    <form onSubmit={submitPayment} noValidate>
      <h1 className="k-co-title">Pago</h1>
      <TextChoice<SavedPayment["method"]>
        label="Método de pago"
        value={payMethod}
        onChange={setPayMethod}
        options={[
          { value: "card", label: "Tarjeta" },
          { value: "paypal", label: "PayPal" },
          { value: "bizum", label: "Bizum" },
        ]}
      />
      {payMethod === "card" &&
        (usingSavedCard && savedCard ? (
          <div className="k-co-saved">
            <p className="k-co-text">
              {savedCard.brand} ···· {savedCard.last4} · {savedCard.exp}
            </p>
            <button type="button" className="k-text-link" onClick={() => setSavedCard(null)}>
              Usar otra tarjeta
            </button>
          </div>
        ) : (
          <div className="k-co-fields">
            <Field
              label="Número de tarjeta"
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
              onBlur={touch("number")}
              error={show("payment", "number", cardErrors.number)}
            />
            <div className="k-co-pair">
              <Field
                label="Caducidad"
                autoComplete="cc-exp"
                inputMode="numeric"
                placeholder="MM/AA"
                value={card.exp}
                onChange={(e) => setCard((c) => ({ ...c, exp: formatExp(e.target.value) }))}
                onBlur={touch("exp")}
                error={show("payment", "exp", cardErrors.exp)}
              />
              <Field
                label="CVC"
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "") }))}
                onBlur={touch("cvc")}
                error={show("payment", "cvc", cardErrors.cvc)}
              />
            </div>
          </div>
        ))}
      {payMethod === "paypal" && <p className="k-co-hint">Al pagar se abrirá PayPal para autorizar el cargo.</p>}
      {payMethod === "bizum" && <p className="k-co-hint">Recibirás la solicitud de pago en el {address.phone || "teléfono indicado"}.</p>}
      <button type="submit" className="k-btn-solid">
        Revisar pedido
      </button>
    </form>
  )

  const block = (title: string, target: Step | "cart", children: React.ReactNode) => (
    <section className="k-co-block">
      <header>
        <h2>{title}</h2>
        <button type="button" className="k-text-link" onClick={() => (target === "cart" ? onEditCart() : goTo(target))}>
          Editar
        </button>
      </header>
      {children}
    </section>
  )

  const confirmStep = (
    <div>
      <h1 className="k-co-title">Confirmar</h1>
      {block(
        "Productos",
        "cart",
        <ul className="k-co-lines">
          {items.map((item) => (
            <li key={item.key}>
              <span>
                {item.qty} × {item.name} · {sizeLabel(item.size)} · {item.grind}
              </span>
              <span>{formatEur(item.unitPrice * item.qty)}</span>
            </li>
          ))}
        </ul>
      )}
      {block("Contacto", "id", <p>{session?.email ?? trimmedEmail}</p>)}
      {block("Entrega", "address", <p>{delivery === "pickup" ? "Recogida en el estudio · Gratis" : `Envío 24 h · ${shipping === 0 ? "Gratis" : formatEur(shipping)}`}</p>)}
      {block(
        delivery === "pickup" ? "Datos de recogida" : "Dirección",
        "address",
        <p>
          {address.name}
          {delivery === "shipping" && (
            <>
              <br />
              {address.address}
              <br />
              {address.postal} {address.city}
            </>
          )}
          <br />
          {address.phone}
        </p>
      )}
      {block("Pago", "payment", <p>{paymentValid ? paymentDetails().label : "Pendiente"}</p>)}
      <div className="k-co-total">
        <span>
          Total <small>IVA incluido</small>
        </span>
        <span>{formatEur(total)}</span>
      </div>
      <button type="button" className="k-btn-solid" onClick={pay} disabled={!!busy}>
        {busy === "pay" ? "Procesando…" : `Pagar — ${formatEur(total)}`}
      </button>
    </div>
  )

  const doneStep = placed && (
    <div>
      <p className="k-co-label">Pedido confirmado</p>
      <h1 className="k-co-title">Pedido nº {placed.number}</h1>
      <dl className="k-co-facts">
        <div>
          <dt>Tueste</dt>
          <dd>{formatDay(placed.roastDate)}</dd>
        </div>
        <div>
          <dt>{placed.delivery === "pickup" ? "Recogida desde" : "Envío"}</dt>
          <dd>{formatDay(placed.shipDate)}</dd>
        </div>
        <div>
          <dt>Confirmación</dt>
          <dd>{placed.email}</dd>
        </div>
      </dl>

      <div className={`k-acc ${trackingOpen ? "is-open" : ""}`}>
        <button type="button" className="k-acc-trigger" aria-expanded={trackingOpen} aria-controls="k-co-tracking" onClick={() => setTrackingOpen((o) => !o)}>
          Seguimiento del pedido <i aria-hidden="true">{trackingOpen ? "−" : "+"}</i>
        </button>
        <div id="k-co-tracking" className="k-acc-body" aria-hidden={!trackingOpen}>
          <div>
            <ol className="k-co-track">
              <li className="is-done">
                <span>✓ Recibido</span>
                <span>{formatDay(placed.placedAt)}</span>
              </li>
              <li>
                <span>Tueste</span>
                <span>{formatDay(placed.roastDate)}</span>
              </li>
              <li>
                <span>{placed.delivery === "pickup" ? "Listo para recoger" : "Enviado"}</span>
                <span>{formatDay(placed.shipDate)}</span>
              </li>
              {placed.delivery === "shipping" && (
                <li>
                  <span>Entregado</span>
                  <span>{formatDay(nextBusinessDay(placed.shipDate))}</span>
                </li>
              )}
            </ol>
          </div>
        </div>
      </div>

      {placed.guest &&
        (accountCreated ? (
          <p className="k-co-text k-co-gap">Cuenta creada. La próxima vez irás directo a confirmar.</p>
        ) : (
          <form className="k-co-account" onSubmit={createAccount} noValidate>
            <h2 className="k-co-label">Crear cuenta con este email</h2>
            <p className="k-co-text">{placed.email}</p>
            <Field
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={accountTried && newPassword.length < 8 ? "Mínimo 8 caracteres." : undefined}
            />
            <button type="submit" className="k-btn-outline">
              Crear cuenta
            </button>
          </form>
        ))}

      <div className="k-co-after">
        {!isMember && (
          <button type="button" className="k-text-link" onClick={onSubscribe}>
            Suscríbete y ahorra un 12 % en cada bolsa
          </button>
        )}
        <button type="button" className="k-text-link is-muted" onClick={onShop}>
          Volver a la tienda
        </button>
      </div>
    </div>
  )

  if (cartEmpty) {
    return (
      <section className="k-co">
        <div className="k-co-empty">
          <p>Tu cesta está vacía</p>
          <button type="button" className="k-text-link" onClick={onShop}>
            Ver cafés
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="k-co">
      <div className="k-co-layout">
        <div className="k-co-main">
          {stepsNav}
          {!finished && express}
          <div key={step} className="k-co-step">
            {step === "id" && identity}
            {step === "address" && addressStep}
            {step === "payment" && paymentStep}
            {step === "confirm" && confirmStep}
            {step === "done" && doneStep}
          </div>
        </div>
        {summary}
      </div>
    </section>
  )
}
