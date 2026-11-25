"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { KilnPattern, KilnWordmark } from "./Brand"
import { Bag } from "./Bag"
import {
  BAG_SIZES,
  COFFEE_LOTS,
  OBJECTS,
  type KilnObject,
  type Producer,
  type BagSizeOption,
  type CoffeeLot,
  type GrindOption,
} from "./data"
import {
  InteractiveBrewStudio,
  SensoryRadar,
  formatEur,
  type ActiveSubscription,
  type CartItem,
  type SubTab,
  type ViewName,
} from "./Components"
import { HomeView, NewArrivalsView, ProductDetailView, ShopView } from "./Views"
import { OriginView } from "./Origin"
import { ObjectDetailView, ObjectsView } from "./Objects"
import { StudioView, SubscriptionsView, VisitView, WholesaleView } from "./ExtraViews"
import {
  CartDrawer,
  CheckoutView,
  SESSION_KEY,
  loadAccounts,
  persistAccounts,
  type Account,
  type DeliveryMethod,
} from "./Checkout"

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void>; ready: Promise<void> }
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
const supportsViewTransitions = () => typeof (document as ViewTransitionDocument).startViewTransition === "function"

export default function KilnApp() {
  const [view, setView] = useState<ViewName>("home")
  const [shopCategory, setShopCategory] = useState<string>("Todos")
  const [selectedLot, setSelectedLot] = useState<CoffeeLot>(COFFEE_LOTS[0])
  // Vista desde la que se abrió la ficha, para que «Volver» regrese allí
  const [lotOrigin, setLotOrigin] = useState<"shop" | "news">("shop")
  const [selectedObject, setSelectedObject] = useState<KilnObject>(OBJECTS[0])
  const [newsletterEmail, setNewsletterEmail] = useState<string>("")
  const [newsletterState, setNewsletterState] = useState<"idle" | "error" | "done">("idle")
  // Café filtrado por los lotes de un productor (desde Origen)
  const [shopProducer, setShopProducer] = useState<Producer | null>(null)
  const [subTab, setSubTab] = useState<SubTab>("personal")

  // Carrito con un lote inicial realista para poder probar el checkout de inmediato
  const [cart, setCart] = useState<CartItem[]>([
    {
      key: "halo-hartume-250g-En grano- puntual",
      lotId: "halo-hartume",
      name: "Halo Hartume",
      origin: "Gedeb · Yirgacheffe, Etiopía",
      tone: "ivory",
      no: "01",
      size: "250g",
      grind: "En grano",
      purchaseMode: " puntual",
      unitPrice: 19.5,
      qty: 1,
    },
  ])
  const [cartOpen, setCartOpen] = useState<boolean>(false)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("shipping")

  // Cuentas y sesión simuladas (persisten en el navegador hasta conectar Payload)
  const [accounts, setAccounts] = useState<Account[]>(() => loadAccounts())
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => window.localStorage.getItem(SESSION_KEY))
  const session = accounts.find((a) => a.email === sessionEmail) ?? null
  useEffect(() => persistAccounts(accounts), [accounts])
  useEffect(() => {
    try {
      if (sessionEmail) window.localStorage.setItem(SESSION_KEY, sessionEmail)
      else window.localStorage.removeItem(SESSION_KEY)
    } catch {
      /* almacenamiento no disponible */
    }
  }, [sessionEmail])

  // Suscripción activa para el panel de usuario
  const [activeSub, setActiveSub] = useState<ActiveSubscription | null>(null)
  // Solo una suscripción activa da derecho al 12% en compras puntuales
  const isMember = activeSub?.status === "Activa"

  // Comparador de Lotes (máx 3)
  const [comparedIds, setComparedIds] = useState<string[]>([])
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false)

  // Buscador rápido (Cmd+K) y Asistente Sensorial
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false)
  const [quickQuery, setQuickQuery] = useState<string>("")
  const [searchIndex, setSearchIndex] = useState<number>(0)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [matcherOpen, setMatcherOpen] = useState<boolean>(false)
  const [matcherBrew, setMatcherBrew] = useState<"filtro" | "espresso" | "ambos">("filtro")
  const [matcherFlavor, setMatcherFlavor] = useState<"floral" | "frutal" | "cacao">("floral")

  // Toast con opción Deshacer (Heurística de Nielsen #3)
  const [toast, setToast] = useState<{ message: string; undo?: () => void } | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const overlayOpen = cartOpen || searchModalOpen || matcherOpen || compareModalOpen || mobileMenuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!overlayOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [cartOpen, searchModalOpen, matcherOpen, compareModalOpen, mobileMenuOpen])

  useEffect(() => {
    if (!searchModalOpen) return
    setSearchIndex(0)
    window.requestAnimationFrame(() => searchInputRef.current?.focus())
  }, [searchModalOpen])

  // Coloca cada ficha en su cabecera antes de que el navegador llegue a
  // mostrarla, incluso si el café se abrió desde el final del catálogo.
  useLayoutEffect(() => {
    if (view === "product") window.scrollTo({ top: 0, behavior: "instant" })
  }, [view, selectedLot.id])

  // Las imágenes que aún cargan aparecen con un fundido sobre su fondo gris
  // (su espacio ya está reservado por el contenedor, sin saltos).
  useEffect(() => {
    const root = shellRef.current
    if (!root || prefersReducedMotion()) return
    const prepare = (img: HTMLImageElement) => {
      // Ya cargada (o con dimensiones desde la caché): se muestra tal cual
      if (img.dataset.kFade || img.complete || img.naturalWidth > 0) return
      img.dataset.kFade = "1"
      img.style.opacity = "0"
      const reveal = () => {
        img.style.opacity = ""
        img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "cubic-bezier(.16,1,.3,1)" })
      }
      img.addEventListener("load", reveal, { once: true })
      img.addEventListener("error", () => (img.style.opacity = ""), { once: true })
    }
    root.querySelectorAll("img").forEach(prepare)
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLImageElement) prepare(node)
          else if (node instanceof HTMLElement) node.querySelectorAll("img").forEach(prepare)
        })
      }
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  // Atajo de teclado Cmd+K / Ctrl+K y Escape (Heurística de Nielsen #7)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setMobileMenuOpen(true)
        setSearchModalOpen(true)
      } else if (e.key === "Escape") {
        setSearchModalOpen(false)
        setMatcherOpen(false)
        setCompareModalOpen(false)
        setCartOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const showToast = (message: string, undo?: () => void) => {
    setToast({ message, undo })
    window.setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 4500)
  }

  /* Cambio de vista: fundido corto con View Transitions (o CSS si no hay soporte).
     `shared` crece hasta el recuadro de la ficha; `suppress` evita nombres duplicados. */
  const runViewChange = (update: () => void, shared?: HTMLElement | null, suppress?: HTMLElement | null, anchor?: string) => {
    // Tras el cambio: arriba del todo o, si se indica, al ancla (p. ej. un productor en Origen)
    const land = (behavior: ScrollBehavior) => {
      const target = anchor ? document.getElementById(anchor) : null
      if (target) target.scrollIntoView({ behavior, block: "start" })
      else window.scrollTo({ top: 0, behavior })
    }
    const doc = document as ViewTransitionDocument
    // Con ancla no se usa View Transitions: durante la transición el navegador no
    // aplica el scroll del documento. Se salta al bloque y el contenido entra con
    // el mismo fundido corto.
    if (anchor) {
      flushSync(update)
      land("instant")
      if (!prefersReducedMotion()) {
        document.querySelector(".k-main")?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: "cubic-bezier(.16,1,.3,1)" })
      }
      return
    }
    if (!doc.startViewTransition || prefersReducedMotion() || document.visibilityState !== "visible") {
      flushSync(update)
      land(prefersReducedMotion() ? "instant" : "smooth")
      return
    }
    if (shared) {
      if (suppress) suppress.style.viewTransitionName = "none"
      shared.style.viewTransitionName = "k-lot-media"
    }
    const transition = doc.startViewTransition(() => {
      flushSync(update)
      // El fundido oculta el salto: la vista nueva entra ya en su sitio
      land("instant")
    })
    // Si el navegador aborta la animación, el cambio de vista ya se aplicó igualmente
    transition.ready.catch(() => {})
    transition.finished.finally(() => {
      if (shared) shared.style.viewTransitionName = ""
    })
  }

  const navigateTo = (target: ViewName, category = "Todos", options: { producer?: Producer | null; anchor?: string } = {}) => {
    runViewChange(
      () => {
        setShopCategory(category)
        setShopProducer(options.producer ?? null)
        setView(target)
        setMobileMenuOpen(false)
        setSearchModalOpen(false)
        setCartOpen(false)
      },
      null,
      null,
      options.anchor
    )
  }

  const navigateWithTransition = (target: ViewName, category = "Todos") => {
    if (target === view && category === shopCategory && !shopProducer) {
      setMobileMenuOpen(false)
      return
    }
    navigateTo(target, category)
  }

  // Tarjeta visible pulsada: su imagen crece hasta el recuadro de la ficha
  const visibleStage = (selector: string) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector)).find((el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    })

  const openLotDetail = (lot: CoffeeLot) => {
    runViewChange(
      () => {
        if (view === "news" || view === "shop") setLotOrigin(view)
        setSelectedLot(lot)
        setView("product")
        setMobileMenuOpen(false)
        setSearchModalOpen(false)
      },
      visibleStage(`[data-lot-id="${lot.id}"] .k-lot-stage`),
      document.querySelector<HTMLElement>(".k-pdp2-frame")
    )
  }

  const openObject = (obj: KilnObject) => {
    runViewChange(
      () => {
        setSelectedObject(obj)
        setView("object")
        setMobileMenuOpen(false)
        setSearchModalOpen(false)
      },
      visibleStage(`[data-object-id="${obj.id}"] .k-lot-stage`),
      document.querySelector<HTMLElement>(".k-pdp2-frame")
    )
  }

  // Los objetos van a la misma cesta; `origin` guarda el material para la cesta y el checkout
  const handleAddObject = (obj: KilnObject) => {
    const key = `obj-${obj.id}`
    setCart((prev) =>
      prev.some((i) => i.key === key)
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [
            ...prev,
            {
              key,
              lotId: obj.id,
              kind: "object",
              name: obj.name,
              origin: obj.material,
              tone: "ivory",
              no: "OBJ",
              size: "250g",
              grind: "En grano",
              purchaseMode: " puntual",
              unitPrice: obj.price,
              qty: 1,
              image: obj.photos[0],
            },
          ]
    )
  }

  const meetProducer = (producer: Producer) => navigateTo("origin", "Todos", { anchor: `productor-${producer.id}` })

  const priceFor = (lot: CoffeeLot, size: BagSizeOption, purchaseMode: CartItem["purchaseMode"]) => {
    const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
    const raw = Math.round(lot.price250 * sizeObj.multiplier * 100) / 100
    // Suscripción o miembro con suscripción activa: 12% de descuento
    return purchaseMode === "suscripcion" || isMember ? Math.round(raw * 0.88 * 100) / 100 : raw
  }

  const changeQty = (key: string, delta: number) =>
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)))

  const removeItem = (key: string) => setCart((prev) => prev.filter((i) => i.key !== key))

  // Cambiar tamaño o molienda desde la cesta: recalcula precio y fusiona líneas iguales
  const updateCartItem = (key: string, patch: { size?: BagSizeOption; grind?: GrindOption }) =>
    setCart((prev) => {
      const item = prev.find((i) => i.key === key)
      const lot = item && COFFEE_LOTS.find((l) => l.id === item.lotId)
      if (!item || !lot) return prev
      const size = patch.size ?? item.size
      const grind = patch.grind ?? item.grind
      const nextKey = `${lot.id}-${size}-${grind}-${item.purchaseMode}`
      if (nextKey !== key && prev.some((i) => i.key === nextKey)) {
        return prev.filter((i) => i.key !== key).map((i) => (i.key === nextKey ? { ...i, qty: i.qty + item.qty } : i))
      }
      return prev.map((i) => (i.key === key ? { ...i, key: nextKey, size, grind, unitPrice: priceFor(lot, size, item.purchaseMode) } : i))
    })

  const openSubscriptions = () => {
    setSubTab("personal")
    navigateWithTransition("subscriptions")
  }

  const handleAddToCart = (
    lot: CoffeeLot,
    size: BagSizeOption,
    grind: GrindOption,
    qty = 1,
    purchaseMode: " puntual" | "suscripcion" = " puntual",
    cadenceWeeks?: number,
    options?: { silent?: boolean }
  ) => {
    const unitPrice = priceFor(lot, size, purchaseMode)
    const key = `${lot.id}-${size}-${grind}-${purchaseMode}`

    const prevSnapshot = [...cart]
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...prev,
        {
          key,
          lotId: lot.id,
          name: lot.name,
          origin: lot.origin,
          tone: lot.tone,
          no: lot.no,
          size,
          grind,
          purchaseMode,
          cadenceWeeks,
          unitPrice,
          qty,
        },
      ]
    })

    // La ficha confirma en el propio botón; el resto de vistas usan el aviso con deshacer
    if (options?.silent) return
    showToast(`Añadido: ${qty} × ${lot.name} (${size}, ${grind})`, () => {
      setCart(prevSnapshot)
    })
  }

  const handleToggleCompare = (lotId: string) => {
    setComparedIds((prev) => {
      if (prev.includes(lotId)) return prev.filter((id) => id !== lotId)
      if (prev.length >= 3) {
        showToast("Puedes comparar hasta 3 lotes simultáneamente.")
        return prev
      }
      return [...prev, lotId]
    })
  }

  // Si el usuario se suscribe (o pausa) con productos en la cesta, los precios se recalculan
  useEffect(() => {
    setCart((prev) =>
      prev.map((item) => {
        const lot = COFFEE_LOTS.find((l) => l.id === item.lotId)
        const sizeObj = BAG_SIZES.find((s) => s.id === item.size)
        if (!lot || !sizeObj || item.purchaseMode === "suscripcion") return item
        const raw = Math.round(lot.price250 * sizeObj.multiplier * 100) / 100
        const unitPrice = isMember ? Math.round(raw * 0.88 * 100) / 100 : raw
        return unitPrice === item.unitPrice ? item : { ...item, unitPrice }
      })
    )
  }, [isMember])

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart])
  const cartSubtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.unitPrice * item.qty, 0),
    [cart]
  )
  const freeShippingThreshold = 38
  const shippingCost =
    deliveryMethod === "pickup" || cartSubtotal >= freeShippingThreshold || cartSubtotal === 0
      ? 0
      : 3.9
  const cartTotal = cartSubtotal + shippingCost

  // Recomendación del Asistente Sensorial
  const recommendedLot = useMemo(() => {
    if (matcherBrew === "espresso" || matcherFlavor === "cacao") {
      return COFFEE_LOTS.find((l) => l.id === "kiln-house") ?? COFFEE_LOTS[0]
    }
    if (matcherFlavor === "frutal") {
      return COFFEE_LOTS.find((l) => l.id === "karinga-ab") ?? COFFEE_LOTS[1]
    }
    return COFFEE_LOTS[0]
  }, [matcherBrew, matcherFlavor])

  const comparedLots = useMemo(
    () => COFFEE_LOTS.filter((l) => comparedIds.includes(l.id)),
    [comparedIds]
  )

  const quickSearchResults = useMemo(() => {
    const normalize = (value: string) =>
      value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    const q = normalize(quickQuery.trim())
    if (!q) return []
    return COFFEE_LOTS.filter((lot) =>
      normalize(
        `${lot.name} ${lot.origin} ${lot.country} ${lot.region} ${lot.notes.join(" ")} ${lot.variety} ${lot.process} ${lot.roast}`
      ).includes(q)
    )
      .sort((a, b) => Number(normalize(b.name).startsWith(q)) - Number(normalize(a.name).startsWith(q)))
      .slice(0, 10)
  }, [quickQuery])

  const viewLabels: Record<ViewName, string> = {
    home: "Inicio",
    shop: "Tienda de Café",
    product: selectedLot.name,
    subscriptions: "Suscripciones (Personal, Regalo y Oficinas)",
    studio: "Estudio & Tostador",
    visit: "Visítanos · nuestro estudio",
    wholesale: "Profesionales B2B",
    brew: "Laboratorio de Extracción",
    checkout: "Pedido",
    news: "Novedades",
    origin: "Origen",
    objects: "Objetos",
    object: selectedObject.name,
  }

  return (
    <div
      ref={shellRef}
      className={`kiln-shell ${mobileMenuOpen ? "is-menu-open" : ""} ${["shop", "news", "product", "checkout", "origin", "objects", "object"].includes(view) ? "is-dark" : ""} ${supportsViewTransitions() ? "" : "no-vt"}`}
    >
      {/* 1. BARRA SUPERIOR DE ESTADO DE TUESTE EN VIVO (Heurística #1) */}
      <div className="k-roast-bar">
        <div className="k-roast-bar-left">
          <span>
            <span className="k-pulse-dot" />
            Tueste en curso: Loring S15 Falcon · lote 26-042 (Gedeb, Etiopía)
          </span>
        </div>
        <div className="k-roast-bar-right">
          <span>Envío 24 h gratis desde {formatEur(freeShippingThreshold)}</span>
          <span>·</span>
          <span>EUR (€) · ES</span>
        </div>
      </div>

      {/* 2. NAVBAR: Menú — Marca — Cesta */}
      <header className={`k-topnav ${view === "home" ? "is-overlay" : ""}`}>
        <button
          type="button"
          className="k-topnav-link"
          onClick={() => setMobileMenuOpen(true)}
          aria-expanded={mobileMenuOpen}
          aria-controls="k-side-menu"
        >
          Menú
        </button>

        <button
          type="button"
          className="k-topnav-brand"
          onClick={() => navigateWithTransition("home")}
          aria-label="Ir a inicio de Kiln"
        >
          <KilnWordmark />
        </button>

        <button
          type="button"
          className="k-topnav-link k-topnav-cart"
          onClick={() => setCartOpen(true)}
          aria-label={`Cesta, ${cartCount} ${cartCount === 1 ? "artículo" : "artículos"}`}
        >
          Cesta{cartCount > 0 && <span className="k-topnav-count"> {cartCount}</span>}
        </button>
      </header>

      <div
        className={`k-side-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => {
          setMobileMenuOpen(false)
          setSearchModalOpen(false)
        }}
      />
      <aside id="k-side-menu" className={`k-side-menu ${mobileMenuOpen ? "open" : ""}`} aria-label="Menú principal" aria-hidden={!mobileMenuOpen}>
        <KilnPattern className="k-side-pattern" color="#ffffff" opacity={0.06} />
        <div className="k-side-menu-head">
          <button
            type="button"
            className="k-side-close"
            onClick={() => {
              setMobileMenuOpen(false)
              setSearchModalOpen(false)
            }}
            tabIndex={mobileMenuOpen ? 0 : -1}
          >
            Cerrar
          </button>
        </div>
        <nav className="k-side-nav" aria-label="Secciones">
          {(
            [
              ["news", "Novedades", view === "news" || (view === "product" && lotOrigin === "news"), () => navigateWithTransition("news")],
              ["shop", "Café", view === "shop" || (view === "product" && lotOrigin === "shop"), () => navigateWithTransition("shop")],
              ["objects", "Objetos", view === "objects" || view === "object", () => navigateWithTransition("objects")],
              [
                "subscriptions",
                "Suscripciones",
                view === "subscriptions" && subTab !== "gift",
                () => {
                  setSubTab("personal")
                  navigateTo("subscriptions")
                },
              ],
              ["origin", "Origen", view === "origin", () => navigateWithTransition("origin")],
            ] as [string, string, boolean, () => void][]
          ).map(([id, label, active, go], index) => (
            <button
              key={id}
              type="button"
              className={active ? "active" : ""}
              aria-current={active ? "page" : undefined}
              style={{ transitionDelay: mobileMenuOpen ? `${120 + index * 45}ms` : "0ms" }}
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => {
                setMobileMenuOpen(false)
                setSearchModalOpen(false)
                go()
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="k-side-minor">
          <button
            type="button"
            className={view === "subscriptions" && subTab === "gift" ? "active" : ""}
            aria-current={view === "subscriptions" && subTab === "gift" ? "page" : undefined}
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => {
              setSearchModalOpen(false)
              setSubTab("gift")
              navigateTo("subscriptions")
            }}
          >
            Regalos
          </button>
        </div>
        <div className="k-side-secondary">
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            aria-expanded={searchModalOpen}
            onClick={() => setSearchModalOpen((open) => !open)}
          >
            Buscar
          </button>
          <button
            type="button"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={() => {
              setSearchModalOpen(false)
              setSubTab("personal")
              navigateTo("subscriptions")
            }}
          >
            Cuenta
          </button>
        </div>
        {searchModalOpen && (
          <div className="k-side-search">
            <div className="k-side-search-field">
              <input
                id="kiln-menu-search"
                ref={searchInputRef}
                type="search"
                placeholder="Buscar café…"
                value={quickQuery}
                onChange={(e) => {
                  setQuickQuery(e.target.value)
                  setSearchIndex(0)
                }}
                onKeyDown={(e) => {
                  if (!quickSearchResults.length) return
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setSearchIndex((i) => (i + 1) % quickSearchResults.length)
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setSearchIndex((i) => (i - 1 + quickSearchResults.length) % quickSearchResults.length)
                  } else if (e.key === "Enter") {
                    e.preventDefault()
                    setSearchModalOpen(false)
                    openLotDetail(quickSearchResults[searchIndex])
                  }
                }}
              />
              {quickQuery && <button type="button" onClick={() => setQuickQuery("")}>Limpiar</button>}
            </div>
            {quickQuery.trim() && (quickSearchResults.length ? (
              <div className="k-side-search-results" role="listbox" aria-label={`${quickSearchResults.length} resultados`}>
                {quickSearchResults.map((lot, index) => (
                  <button
                    key={lot.id}
                    type="button"
                    role="option"
                    aria-selected={index === searchIndex}
                    onMouseEnter={() => setSearchIndex(index)}
                    onClick={() => {
                      setSearchModalOpen(false)
                      openLotDetail(lot)
                    }}
                  >
                    <strong>{lot.name}</strong>
                    <small>{lot.origin} · {lot.process} · {lot.notes.slice(0, 2).join(" · ")}</small>
                  </button>
                ))}
              </div>
            ) : (
              <p>No encontramos “{quickQuery}”. Prueba con otro origen o sabor.</p>
            ))}
          </div>
        )}
      </aside>

      {/* 3. BARRA DE RASTRO (BREADCRUMBS) EN VISTAS INTERNAS */}
      {!["home", "shop", "news", "product", "checkout", "origin", "objects", "object"].includes(view) && (
        <div className="k-breadcrumb-bar">
          <div className="k-container">
            <div className="k-breadcrumbs">
              <button type="button" onClick={() => navigateTo("home")}>
                Kiln
              </button>
              <span>/</span>
              <span className="current">{viewLabels[view]}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONTENIDO PRINCIPAL DE CADA VISTA */}
      <main key={view} className="k-main">
        {view === "home" && (
          <HomeView
            onNavigate={(target) => navigateWithTransition(target)}
            onOpenSeason={() => navigateWithTransition("news")}
            onOpenSubTab={(t) => setSubTab(t)}
          />
        )}

        {view === "shop" && (
          <ShopView
            key={shopCategory}
            initialCategory={shopCategory}
            onSelectLot={openLotDetail}
            onQuickAdd={(l, s, g) => handleAddToCart(l, s, g, 1, " puntual")}
            comparedIds={comparedIds}
            onToggleCompare={handleToggleCompare}
            onOpenMatcher={() => setMatcherOpen(true)}
          />
        )}

        {view === "news" && <NewArrivalsView onSelectLot={openLotDetail} />}

        {view === "product" && (
          <ProductDetailView
            key={selectedLot.id}
            lot={selectedLot}
            onBack={() => navigateTo(lotOrigin)}
            onAddToCart={(l, s, g) => handleAddToCart(l, s, g, 1, " puntual", undefined, { silent: true })}
            onSelectLot={openLotDetail}
            isMember={isMember}
          />
        )}

        {view === "subscriptions" && (
          <SubscriptionsView
            activeTab={subTab}
            onChangeTab={setSubTab}
            activeSub={activeSub}
            onSaveSub={(sub) => {
              setActiveSub(sub)
              showToast(`Suscripción ${sub.planName} activada correctamente.`)
            }}
            onUpdateSubStatus={(status) => {
              if (!activeSub) return
              setActiveSub({ ...activeSub, status })
              showToast(`Estado de tu suscripción actualizado a: ${status}`)
            }}
            onSkipNextSubDate={(dateStr) => {
              if (!activeSub) return
              const exists = activeSub.skippedDates.includes(dateStr)
              const nextSkipped = exists
                ? activeSub.skippedDates.filter((d) => d !== dateStr)
                : [...activeSub.skippedDates, dateStr]
              setActiveSub({ ...activeSub, skippedDates: nextSkipped })
              showToast(exists ? `Entrega del ${dateStr} restaurada.` : `Entrega del ${dateStr} saltada sin cargo.`)
            }}
            onAddGiftToCart={(months, bagsPerMonth, grind, recipient, _note, price) => {
              const giftKey = `gift-${months}m-${bagsPerMonth}b-${grind}`
              setCart((prev) => [
                ...prev,
                {
                  key: giftKey,
                  lotId: "gift-card",
                  name: `Bono Regalo ${months} Meses (Para ${recipient || "Destinatario"})`,
                  origin: `${bagsPerMonth} × 250g al mes · Envío urgente incluido`,
                  tone: "noir",
                  no: "GIFT",
                  size: "250g",
                  grind,
                  purchaseMode: " puntual",
                  unitPrice: price,
                  qty: 1,
                },
              ])
              setCartOpen(true)
              showToast(`Tarjeta Regalo de ${months} meses añadida a la cesta.`)
            }}
            onNotify={(msg) => showToast(msg)}
          />
        )}

        {view === "brew" && (
          <section className="k-section-sm">
            <div className="k-container">
              <div className="k-section-head">
                <div>
                  <span className="k-eyebrow">PROTOCOLOS DE EXTRACCIÓN Y AGUA · KILN LAB</span>
                  <h1 className="k-title-lg" style={{ marginTop: "0.35rem" }}>
                    Calculadora Barista y Cronómetro de Vertido
                  </h1>
                </div>
              </div>
              <InteractiveBrewStudio initialLot={selectedLot} onSelectLot={openLotDetail} />
            </div>
          </section>
        )}

        {view === "studio" && <StudioView onNavigate={navigateTo} />}

        {view === "visit" && <VisitView onNotify={(m) => showToast(m)} />}

        {view === "wholesale" && <WholesaleView onNotify={(m) => showToast(m)} />}

        {view === "checkout" && (
          <CheckoutView
            items={cart}
            subtotal={cartSubtotal}
            threshold={freeShippingThreshold}
            delivery={deliveryMethod}
            onDeliveryChange={setDeliveryMethod}
            session={session}
            findAccount={(email) => accounts.find((a) => a.email === email)}
            onSignIn={(account) => setSessionEmail(account.email)}
            onSignOut={() => setSessionEmail(null)}
            onSaveAccount={(account) => setAccounts((prev) => [...prev.filter((a) => a.email !== account.email), account])}
            onPlaceOrder={() => setCart([])}
            onEditCart={() => setCartOpen(true)}
            onShop={() => navigateWithTransition("shop")}
            onSubscribe={openSubscriptions}
            isMember={isMember}
          />
        )}
      </main>

      {/* 5. DOCK FLOTANTE DE COMPARACIÓN DE LOTES */}
      {comparedLots.length > 0 && (
        <div className="k-compare-dock">
          <span className="font-mono" style={{ fontSize: "0.74rem" }}>
            COMPARADOR SENSORIAL ({comparedLots.length}/3):{" "}
            {comparedLots.map((c) => c.name).join(" vs. ")}
          </span>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button
              type="button"
              className="k-btn-light"
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.72rem" }}
              onClick={() => setCompareModalOpen(true)}
            >
              Ver Tabla Comparativa
            </button>
            <button
              type="button"
              className="k-btn-outline-light"
              style={{ padding: "0.45rem 0.75rem", fontSize: "0.72rem" }}
              onClick={() => setComparedIds([])}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* 6. MODAL COMPARADOR DE LOTES LADO A LADO */}
      <div
        className={`k-backdrop ${compareModalOpen ? "open" : ""}`}
        onClick={() => setCompareModalOpen(false)}
      />
      <div className={`k-modal-center ${compareModalOpen ? "open" : ""}`} role="dialog" aria-label="Comparador de lotes">
        <div style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <span className="k-eyebrow">ANÁLISIS COMPARATIVO LADO A LADO</span>
              <h3 className="k-title-md">Comparativa Técnica de Lotes</h3>
            </div>
            <button type="button" className="k-btn-secondary" style={{ padding: "0.45rem 0.9rem" }} onClick={() => setCompareModalOpen(false)}>
              Cerrar
            </button>
          </div>

          {comparedLots.length >= 2 && (
            <div style={{ marginBottom: "1.5rem", background: "var(--bg-primary)", padding: "1rem", border: "1px solid var(--line-subtle)" }}>
              <span className="k-eyebrow">SUPERPOSICIÓN DE RADAR SENSORIAL ({comparedLots[0].name} vs {comparedLots[1].name})</span>
              <SensoryRadar sensory={comparedLots[0].sensory} compareSensory={comparedLots[1].sensory} />
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, comparedLots.length)}, 1fr)`, gap: "1rem" }}>
            {comparedLots.map((c) => (
              <div key={c.id} style={{ border: "1px solid var(--line-subtle)", padding: "1.25rem", background: "var(--bg-primary)" }}>
                <span className="k-eyebrow">LOTE {c.no} · SCA {c.score}</span>
                <h4 className="font-serif" style={{ fontSize: "1.35rem", margin: "0.25rem 0" }}>{c.name}</h4>
                <p style={{ fontSize: "0.78rem", color: "var(--ink-secondary)", marginBottom: "0.85rem" }}>{c.origin}</p>
                <div style={{ fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1rem" }}>
                  <div><strong>Variedad:</strong> {c.variety}</div>
                  <div><strong>Proceso:</strong> {c.process}</div>
                  <div><strong>Altitud:</strong> {c.altitude}</div>
                  <div><strong>Notas:</strong> {c.notes.join(", ")}</div>
                  <div><strong>Precio 250g:</strong> {formatEur(c.price250)}</div>
                </div>
                <button
                  type="button"
                  className="k-btn-primary"
                  style={{ width: "100%", padding: "0.6rem" }}
                  onClick={() => {
                    setCompareModalOpen(false)
                    openLotDetail(c)
                  }}
                >
                  Abrir ficha
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. MODAL ASISTENTE SENSORIAL DE RECOMENDACIÓN */}
      <div
        className={`k-backdrop ${matcherOpen ? "open" : ""}`}
        onClick={() => setMatcherOpen(false)}
      />
      <div className={`k-modal-center ${matcherOpen ? "open" : ""}`} role="dialog" aria-label="Asistente sensorial">
        <div style={{ padding: "2.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <span className="k-eyebrow">SOMMELIER DE CAFÉ INTERACTIVO</span>
              <h3 className="k-title-md">Encuentra tu lote ideal en dos preguntas</h3>
            </div>
            <button type="button" onClick={() => setMatcherOpen(false)}>
              Cerrar ✕
            </button>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.45rem" }}>
              1. ¿CÓMO PREPARAS EL CAFÉ HABITUALMENTE?
            </span>
            <div className="k-selector-grid">
              {[
                { id: "filtro", label: "Filtro / V60 / Chemex" },
                { id: "espresso", label: "Espresso / Italiana / Leche" },
                { id: "ambos", label: "Prensa / AeroPress / Ambos" },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`k-selector-option ${matcherBrew === b.id ? "active" : ""}`}
                  onClick={() => setMatcherBrew(b.id as typeof matcherBrew)}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.45rem" }}>
              2. ¿QUÉ PERFIL EN TAZA TE ATRAE MÁS HOY?
            </span>
            <div className="k-selector-grid">
              {[
                { id: "floral", label: "Floral, jazmín y té delicado" },
                { id: "frutal", label: "Fruta jugosa y acidez vibrante" },
                { id: "cacao", label: "Cacao 70%, avellana y caramelo" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`k-selector-option ${matcherFlavor === f.id ? "active" : ""}`}
                  onClick={() => setMatcherFlavor(f.id as typeof matcherFlavor)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-secondary)",
              padding: "1.5rem",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Bag
              lot={{
                name: recommendedLot.name,
                no: recommendedLot.no,
                origin: recommendedLot.origin,
                variety: recommendedLot.variety,
                altitude: recommendedLot.altitude,
                process: recommendedLot.process,
                roast: recommendedLot.roast,
                notes: recommendedLot.notes,
                tone: recommendedLot.tone,
              }}
              size="sm"
            />
            <div style={{ flex: 1, minWidth: "220px" }}>
              <span className="k-eyebrow">NUESTRA RECOMENDACIÓN PARA TI</span>
              <h4 className="k-title-md" style={{ margin: "0.2rem 0" }}>
                Lote {recommendedLot.no} · {recommendedLot.name}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-secondary)", marginBottom: "0.85rem" }}>
                {recommendedLot.origin} · Notas: {recommendedLot.notes.join(" · ")}
              </p>
              <div style={{ display: "flex", gap: "0.65rem" }}>
                <button
                  type="button"
                  className="k-btn-primary"
                  onClick={() => {
                    handleAddToCart(
                      recommendedLot,
                      "250g",
                      matcherBrew === "espresso" ? "Espresso" : "Filtro / V60",
                      1,
                      " puntual"
                    )
                    setMatcherOpen(false)
                  }}
                >
                  Añadir 250 g ({formatEur(recommendedLot.price250)})
                </button>
                <button
                  type="button"
                  className="k-btn-secondary"
                  onClick={() => {
                    setMatcherOpen(false)
                    openLotDetail(recommendedLot)
                  }}
                >
                  Ver ficha completa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9. CESTA: panel lateral solo con los productos */}
      <CartDrawer
        open={cartOpen}
        items={cart}
        count={cartCount}
        subtotal={cartSubtotal}
        shippingCost={shippingCost}
        total={cartTotal}
        threshold={freeShippingThreshold}
        isMember={isMember}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={removeItem}
        onUpdate={updateCartItem}
        onCheckout={() => navigateTo("checkout")}
        onShop={() => navigateWithTransition("shop")}
        onSubscribe={openSubscriptions}
      />

      {/* 10. FOOTER */}
      <footer className="k-footer k-footer-v2">
        <div className="k-footer-v2-top">
          <button type="button" className="k-footer-v2-mark" onClick={() => navigateWithTransition("home")} aria-label="Ir a inicio de Kiln">
            <span className="k-logo-mark" aria-hidden="true"><i /><b /><b /><b /><b /></span>
          </button>
          {(
            [
              ["Tienda", [["Café", () => navigateWithTransition("shop")], ["Suscripciones", () => { setSubTab("personal"); navigateWithTransition("subscriptions") }], ["Regalos", () => { setSubTab("gift"); navigateWithTransition("subscriptions") }]]],
              ["Kiln", [["El estudio", () => navigateWithTransition("studio")], ["Visítanos", () => navigateWithTransition("visit")], ["Profesionales", () => navigateWithTransition("wholesale")]]],
              ["Ayuda", [["Guías", () => navigateWithTransition("brew")], ["Encontrar mi café", () => setMatcherOpen(true)], ["hola@kilncoffee.es", () => { window.location.href = "mailto:hola@kilncoffee.es" }]]],
            ] as [string, [string, () => void][]][]
          ).map(([title, links]) => (
            <nav key={title} className="k-footer-v2-col" aria-label={title}>
              <span>{title}</span>
              {links.map(([label, onClick]) => (
                <button key={label} type="button" onClick={onClick}>
                  {label}
                </button>
              ))}
            </nav>
          ))}
        </div>
        <div className="k-footer-v2-word" aria-hidden="true">KILN</div>
        <div className="k-footer-v2-bottom">
          <span>© 2026 Kiln</span>
          <span>EUR (€) · ES</span>
        </div>
      </footer>

      {/* 11. TOAST FLOTANTE CON BOTÓN DESHACER */}
      {toast && (
        <div className="k-toast" role="status">
          <span>{toast.message}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.()
                setToast(null)
              }}
              style={{
                color: "#c8a46e",
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textDecoration: "underline",
              }}
            >
              Deshacer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
