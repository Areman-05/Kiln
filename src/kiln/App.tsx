"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Bag } from "./Bag"
import {
  BAG_SIZES,
  COFFEE_LOTS,
  GRIND_OPTIONS,
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
import { HomeView, ProductDetailView, ShopView } from "./Views"
import { StudioView, SubscriptionsView, VisitView, WholesaleView } from "./ExtraViews"

export default function KilnApp() {
  const [view, setView] = useState<ViewName>("home")
  const [shopCategory, setShopCategory] = useState<string>("Todos")
  const [selectedLot, setSelectedLot] = useState<CoffeeLot>(COFFEE_LOTS[0])
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
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "shipping" | "confirmed">("cart")
  const [deliveryMethod, setDeliveryMethod] = useState<"shipping" | "pickup">("shipping")
  const [customerName, setCustomerName] = useState<string>("Marc Soler")
  const [customerEmail, setCustomerEmail] = useState<string>("marc.soler@estudio22.cat")
  const [customerAddress, setCustomerAddress] = useState<string>("Carrer de Pallars 190, 08005  ")
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("")

  // Suscripción activa para el panel de usuario
  const [activeSub, setActiveSub] = useState<ActiveSubscription | null>(null)
  const [subOfferSeen, setSubOfferSeen] = useState<boolean>(false)
  const [checkoutTried, setCheckoutTried] = useState<boolean>(false)
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
  const [routeTransition, setRouteTransition] = useState<boolean>(false)
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
    if (view === "product") window.scrollTo(0, 0)
  }, [view, selectedLot.id])

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

  const navigateTo = (target: ViewName, category = "Todos") => {
    setShopCategory(category)
    setView(target)
    setMobileMenuOpen(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navigateWithTransition = (target: ViewName, category = "Todos") => {
    if (target === view) return
    setMobileMenuOpen(false)
    setRouteTransition(true)
    window.setTimeout(() => navigateTo(target, category), 260)
    window.setTimeout(() => setRouteTransition(false), 760)
  }

  const openLotDetail = (lot: CoffeeLot) => {
    setMobileMenuOpen(false)
    setRouteTransition(true)
    window.setTimeout(() => {
      setSelectedLot(lot)
      setView("product")
      window.scrollTo(0, 0)
    }, 260)
    window.setTimeout(() => setRouteTransition(false), 760)
  }

  const handleAddToCart = (
    lot: CoffeeLot,
    size: BagSizeOption,
    grind: GrindOption,
    qty = 1,
    purchaseMode: " puntual" | "suscripcion" = " puntual",
    cadenceWeeks?: number
  ) => {
    const sizeObj = BAG_SIZES.find((s) => s.id === size) ?? BAG_SIZES[0]
    const raw = Math.round(lot.price250 * sizeObj.multiplier * 100) / 100
    // Suscripción o miembro con suscripción activa: 12% de descuento
    const unitPrice = purchaseMode === "suscripcion" || isMember ? Math.round(raw * 0.88 * 100) / 100 : raw
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

    setCheckoutStep("cart")
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
  const checkoutErrors = {
    name: customerName.trim().length < 2 ? "Indica tu nombre completo." : "",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim()) ? "" : "Introduce un email válido.",
    address: deliveryMethod === "shipping" && customerAddress.trim().length < 6 ? "Indica calle, número y ciudad." : "",
  }
  const checkoutValid = !checkoutErrors.name && !checkoutErrors.email && !checkoutErrors.address

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
  }

  return (
    <div className={`kiln-shell ${mobileMenuOpen ? "is-menu-open" : ""} ${view === "shop" || view === "product" ? "is-dark" : ""}`}>
      {/* 1. BARRA SUPERIOR DE ESTADO DE TUESTE EN VIVO (Heurística #1) */}
      <div className="k-roast-bar">
        <div className="k-roast-bar-left">
          <span>
            <span className="k-pulse-dot" />
            TUESTE EN CURSO: LORING S15 FALCON · LOTE #26-042 (GEDEB, ETIOPÍA)
          </span>
        </div>
        <div className="k-roast-bar-right">
          <span>ENVÍO 24H SIN COSTE DESDE {formatEur(freeShippingThreshold)}</span>
          <span>·</span>
          <span>EUR (€) · ES</span>
        </div>
      </div>

      {routeTransition && (
        <div className="k-route-transition" aria-hidden="true">
          <span className="k-logo-mark"><i /><b /><b /><b /><b /></span>
          <span>KILN</span>
        </div>
      )}

      {/* 2. NAVBAR: Menú · Marca · Cuenta */}
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
          <span className="k-logo-mark" aria-hidden="true"><i /><b /><b /><b /><b /></span>
          <span>KILN</span>
        </button>

        <div className="k-topnav-right">
          <button
            type="button"
            className="k-topnav-link"
            onClick={() => {
              setSubTab("personal")
              navigateWithTransition("subscriptions")
            }}
          >
            Cuenta
          </button>
        </div>
      </header>

      <div
        className={`k-side-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => {
          setMobileMenuOpen(false)
          setSearchModalOpen(false)
        }}
      />
      <aside id="k-side-menu" className={`k-side-menu ${mobileMenuOpen ? "open" : ""}`} aria-label="Menú principal" aria-hidden={!mobileMenuOpen}>
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
          <div className="k-side-actions">
            <button
              type="button"
              className="k-side-close"
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => {
                setSearchModalOpen((open) => !open)
              }}
            >
              Buscar
            </button>
            <button
              type="button"
              className="k-side-close"
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => {
                setMobileMenuOpen(false)
                setSearchModalOpen(false)
                setCheckoutStep("cart")
                setCartOpen(true)
              }}
            >
              Cesta ({cartCount})
            </button>
          </div>
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
        <nav className="k-side-nav">
          {(
            [
              ["home", "Inicio"],
              ["shop", "Café"],
              ["subscriptions", "Suscripciones"],
              ["studio", "El estudio"],
              ["visit", "Visítanos"],
              ["brew", "Guías"],
              ["wholesale", "Profesionales"],
            ] as [ViewName, string][]
          ).map(([id, label], index) => (
            <button
              key={id}
              type="button"
              className={view === id || (id === "shop" && view === "product") ? "active" : ""}
              style={{ transitionDelay: mobileMenuOpen ? `${120 + index * 45}ms` : "0ms" }}
              tabIndex={mobileMenuOpen ? 0 : -1}
              onClick={() => {
                setMobileMenuOpen(false)
                setSearchModalOpen(false)
                navigateWithTransition(id)
              }}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 3. BARRA DE RASTRO (BREADCRUMBS) EN VISTAS INTERNAS */}
      {view !== "home" && view !== "shop" && view !== "product" && (
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
      <main style={{ flex: 1 }}>
        {view === "home" && (
          <HomeView
            onNavigate={(target) => navigateWithTransition(target)}
            onOpenSeason={() => navigateWithTransition("shop", "Cosecha Estacional")}
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

        {view === "product" && (
          <ProductDetailView
            lot={selectedLot}
            onBack={() => navigateTo("shop")}
            onAddToCart={handleAddToCart}
            onSelectLot={openLotDetail}
            isMember={isMember}
            showSubscriptionOffer={activeSub === null && !subOfferSeen}
            onSubscriptionOfferSeen={() => setSubOfferSeen(true)}
            onOpenCart={() => {
              setCheckoutStep("cart")
              setCartOpen(true)
            }}
            onOpenSubscriptions={() => {
              setSubTab("personal")
              navigateWithTransition("subscriptions")
            }}
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

      {/* 9. DRAWER DE CESTA Y CHECKOUT COMPLETO EN 3 PASOS */}
      <div className={`k-backdrop ${cartOpen ? "open" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`k-drawer ${cartOpen ? "open" : ""} ${checkoutStep === "shipping" ? "is-shipping" : ""}`} aria-label="Cesta de compra y checkout">
        <div
          style={{
            padding: "1.5rem 1.75rem",
            borderBottom: "1px solid var(--line-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span className="k-eyebrow">
              {checkoutStep === "cart"
                ? "PASO 1 DE 2 · TU SELECCIÓN"
                : checkoutStep === "shipping"
                ? "PASO 2 DE 2 · ENTREGA Y PAGO"
                : "PEDIDO CONFIRMADO"}
            </span>
            <h3 className="font-serif" style={{ fontSize: "1.45rem", fontWeight: 400 }}>
              {checkoutStep === "cart"
                ? `Cesta (${cartCount})`
                : checkoutStep === "shipping"
                ? "Finalizar Pedido"
                : `Orden #${confirmedOrderId}`}
            </h3>
          </div>
          <button type="button" onClick={() => setCartOpen(false)} style={{ fontSize: "0.85rem" }}>
            Cerrar ✕
          </button>
        </div>

        {/* Barra de progreso envío gratuito */}
        {checkoutStep !== "confirmed" && (
          <div className="k-drawer-ship" style={{ padding: "0.85rem 1.75rem", background: "var(--bg-secondary)", fontSize: "0.78rem" }}>
            {cartSubtotal >= freeShippingThreshold || deliveryMethod === "pickup" ? (
              <span>Tienes <strong>envío urgente 24 h gratis</strong> en este pedido.</span>
            ) : (
              <span>
                Te faltan <strong>{formatEur(freeShippingThreshold - cartSubtotal)}</strong> para el envío urgente
                gratis (o elige recogida en el estudio).
              </span>
            )}
            <div style={{ height: "4px", background: "var(--line-medium)", marginTop: "0.45rem", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, (cartSubtotal / freeShippingThreshold) * 100)}%`,
                  background: "var(--accent-rust)",
                }}
              />
            </div>
          </div>
        )}

        {/* Cuerpo del Drawer según el paso */}
        <div className="k-drawer-body" style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem" }}>
          {checkoutStep === "cart" && (
            <>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3.5rem 1rem" }}>
                  <p className="font-serif" style={{ fontSize: "1.35rem", marginBottom: "0.5rem" }}>
                    Tu cesta está vacía
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "var(--ink-secondary)", marginBottom: "1.5rem" }}>
                    Explora los micro-lotes recién tostados de esta semana.
                  </p>
                  <button
                    type="button"
                    className="k-btn-primary"
                    onClick={() => {
                      setCartOpen(false)
                      navigateTo("shop")
                    }}
                  >
                    Explorar Cafés
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {cart.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "68px 1fr auto",
                        gap: "1rem",
                        paddingBottom: "1.25rem",
                        borderBottom: "1px solid var(--line-subtle)",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Bag
                          lot={{
                            name: item.name,
                            no: item.no,
                            origin: item.origin,
                            tone: item.tone,
                          }}
                          size="sm"
                          style={{ width: "62px", height: "90px" }}
                        />
                      </div>

                      <div>
                        <div className="font-serif" style={{ fontSize: "1.1rem" }}>
                          {item.name}
                        </div>
                        <div className="font-mono" style={{ fontSize: "0.68rem", color: "var(--ink-muted)", margin: "0.15rem 0 0.5rem" }}>
                          {item.size} · {item.grind} ·{" "}
                          {item.purchaseMode === "suscripcion"
                            ? "Suscripción (−12%)"
                            : isMember && COFFEE_LOTS.some((l) => l.id === item.lotId)
                            ? "Precio suscriptor (−12%)"
                            : "Compra única"}
                        </div>

                        <div className="k-drawer-qty" style={{ display: "inline-flex", alignItems: "center", border: "1px solid var(--line-medium)" }}>
                          <button
                            type="button"
                            style={{ padding: "0.15rem 0.55rem" }}
                            onClick={() =>
                              setCart((prev) =>
                                prev
                                  .map((x) => (x.key === item.key ? { ...x, qty: x.qty - 1 } : x))
                                  .filter((x) => x.qty > 0)
                              )
                            }
                          >
                            −
                          </button>
                          <span className="font-mono" style={{ fontSize: "0.75rem", padding: "0 0.5rem" }}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            style={{ padding: "0.15rem 0.55rem" }}
                            onClick={() =>
                              setCart((prev) =>
                                prev.map((x) => (x.key === item.key ? { ...x, qty: x.qty + 1 } : x))
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 600 }}>{formatEur(item.unitPrice * item.qty)}</div>
                        <button
                          type="button"
                          style={{ fontSize: "0.7rem", color: "var(--ink-muted)", textDecoration: "underline", marginTop: "0.4rem" }}
                          onClick={() => setCart((prev) => prev.filter((x) => x.key !== item.key))}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === "shipping" && (
            <div className="k-shipping-form" style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div>
                <span className="k-eyebrow" style={{ display: "block", marginBottom: "0.5rem" }}>
                  MODALIDAD DE ENTREGA
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                  <button
                    type="button"
                    className={`k-selector-option ${deliveryMethod === "shipping" ? "active" : ""}`}
                    onClick={() => setDeliveryMethod("shipping")}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.84rem" }}>Mensajería 24h</div>
                    <div className="sub" style={{ fontSize: "0.68rem", color: "var(--ink-muted)" }}>
                      {cartSubtotal >= freeShippingThreshold ? "Gratis" : "3,90 €"}
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`k-selector-option ${deliveryMethod === "pickup" ? "active" : ""}`}
                    onClick={() => setDeliveryMethod("pickup")}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.84rem" }}>Recogida en nuestro estudio</div>
                    <div className="sub" style={{ fontSize: "0.68rem", color: "var(--ink-muted)" }}>
                      Gratis · Listo en 2 horas
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  aria-invalid={checkoutTried && !!checkoutErrors.name}
                  style={{ width: "100%", padding: "0.7rem", border: `1px solid ${checkoutTried && checkoutErrors.name ? "#ff8a70" : "var(--line-medium)"}`, background: "var(--bg-primary)" }}
                />
                {checkoutTried && checkoutErrors.name && (
                  <p role="alert" style={{ marginTop: "0.35rem", fontSize: "0.72rem", color: "#ff8a70" }}>
                    {checkoutErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                  EMAIL PARA SEGUIMIENTO DE TUESTE
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  aria-invalid={checkoutTried && !!checkoutErrors.email}
                  style={{ width: "100%", padding: "0.7rem", border: `1px solid ${checkoutTried && checkoutErrors.email ? "#ff8a70" : "var(--line-medium)"}`, background: "var(--bg-primary)" }}
                />
                {checkoutTried && checkoutErrors.email && (
                  <p role="alert" style={{ marginTop: "0.35rem", fontSize: "0.72rem", color: "#ff8a70" }}>
                    {checkoutErrors.email}
                  </p>
                )}
              </div>

              {deliveryMethod === "shipping" && (
                <div>
                  <label className="k-eyebrow" style={{ display: "block", marginBottom: "0.3rem" }}>
                    DIRECCIÓN DE ENTREGA
                  </label>
                  <input
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    aria-invalid={checkoutTried && !!checkoutErrors.address}
                    style={{ width: "100%", padding: "0.7rem", border: `1px solid ${checkoutTried && checkoutErrors.address ? "#ff8a70" : "var(--line-medium)"}`, background: "var(--bg-primary)" }}
                  />
                  {checkoutTried && checkoutErrors.address && (
                    <p role="alert" style={{ marginTop: "0.35rem", fontSize: "0.72rem", color: "#ff8a70" }}>
                      {checkoutErrors.address}
                    </p>
                  )}
                </div>
              )}

              <div style={{ padding: "1rem", background: "var(--bg-secondary)", fontSize: "0.8rem" }}>
                <strong>Garantía de Frescura Kiln:</strong> Todos los paquetes se sellan en atmósfera de
                nitrógeno con fecha de tueste impresa en el reverso.
              </div>
            </div>
          )}

          {checkoutStep === "confirmed" && (
            <div style={{ padding: "1.5rem 0" }}>
              <div
                style={{
                  background: "var(--bg-secondary)",
                  padding: "1.75rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1.5rem",
                }}
              >
                <span className="k-eyebrow" style={{ color: "var(--accent-rust)" }}>
                  PEDIDO REGISTRADO EN LA COLA DE TUESTE
                </span>
                <h4 className="k-title-md" style={{ margin: "0.4rem 0 0.75rem" }}>
                  Gracias, {customerName}
                </h4>
                <p style={{ fontSize: "0.88rem", color: "var(--ink-secondary)", lineHeight: 1.6 }}>
                  Hemos enviado el recibo y la curva de tueste de tus lotes a{" "}
                  <strong>{customerEmail}</strong>.{" "}
                  {deliveryMethod === "pickup"
                    ? "Puedes pasar a recoger tu pedido hoy mismo por nuestra barra de  118 (con un espresso de cortesía al recoger)."
                    : `Tu pedido saldrá del tostador rumbo a ${customerAddress}.`}
                </p>
              </div>

              <button
                type="button"
                className="k-btn-primary"
                style={{ width: "100%" }}
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutStep("cart")
                }}
              >
                Seguir explorando Kiln
              </button>
            </div>
          )}
        </div>

        {/* Pie del Drawer con desglose en Euros */}
        {cart.length > 0 && checkoutStep !== "confirmed" && (
          <div className="k-drawer-summary" style={{ padding: "1.5rem 1.75rem", borderTop: "1px solid var(--line-subtle)", background: "var(--bg-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: "0.35rem" }}>
              <span style={{ color: "var(--ink-secondary)" }}>Subtotal</span>
              <span>{formatEur(cartSubtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "var(--ink-secondary)" }}>
                {deliveryMethod === "pickup" ? "Recogida en nuestro estudio" : "Envío urgente 24h"}
              </span>
              <span>{shippingCost === 0 ? "Gratis (0,00 €)" : formatEur(shippingCost)}</span>
            </div>
            <div
              className="k-drawer-total"
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.15rem",
                fontWeight: 600,
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--line-subtle)",
                marginBottom: "1rem",
              }}
            >
              <span>Total (IVA incl.)</span>
              <span>{formatEur(cartTotal)}</span>
            </div>

            {checkoutStep === "cart" ? (
              <button
                type="button"
                className="k-btn-primary"
                style={{ width: "100%" }}
                onClick={() => setCheckoutStep("shipping")}
              >
                Continuar a Datos de Entrega →
              </button>
            ) : (
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  type="button"
                  className="k-btn-secondary"
                  onClick={() => setCheckoutStep("cart")}
                >
                  ← Atrás
                </button>
                <button
                  type="button"
                  className="k-btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    if (!checkoutValid) {
                      setCheckoutTried(true)
                      return
                    }
                    setCheckoutTried(false)
                    const orderNo = `KLN-${Math.floor(10000 + Math.random() * 89999)}`
                    setConfirmedOrderId(orderNo)
                    setCart([])
                    setCheckoutStep("confirmed")
                  }}
                >
                  Confirmar y Pagar {formatEur(cartTotal)}
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

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
