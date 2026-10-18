import { FormEvent, useEffect, useState } from "react"

type Page = "home" | "shop" | "product" | "about" | "visit" | "contact"
type Product = {
  id: number
  name: string
  origin: string
  process: string
  notes: string[]
  price: number
  tone: string
}

const coffees: Product[] = [
  {
    id: 1,
    name: "Los Nogales",
    origin: "Huila, Colombia",
    process: "Lavado",
    notes: ["Manzana roja", "Cacao", "Caramelo"],
    price: 18,
    tone: "rust",
  },
  {
    id: 2,
    name: "Karinga",
    origin: "Nyeri, Kenya",
    process: "Lavado",
    notes: ["Grosella negra", "Ruibarbo", "Té oolong"],
    price: 20,
    tone: "olive",
  },
  {
    id: 3,
    name: "Halo Hartume",
    origin: "Gedeb, Etiopía",
    process: "Natural",
    notes: ["Albaricoque", "Jazmín", "Miel"],
    price: 21,
    tone: "ochre",
  },
  {
    id: 4,
    name: "El Jardín",
    origin: "Antioquia, Colombia",
    process: "Natural",
    notes: ["Ciruela", "Vainilla", "Cacao"],
    price: 19,
    tone: "plum",
  },
  {
    id: 5,
    name: "Kiln Casa",
    origin: "Brasil · Colombia",
    process: "Mezcla",
    notes: ["Avellana", "Caramelo", "Higo"],
    price: 15,
    tone: "clay",
  },
  {
    id: 6,
    name: "Gitesi",
    origin: "Karongi, Ruanda",
    process: "Lavado",
    notes: ["Naranja", "Té negro", "Azúcar moreno"],
    price: 19,
    tone: "forest",
  },
]

const images = {
  hero: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=2200&q=90",
  detail:
    "https://images.unsplash.com/photo-1680381615265-6cce996f6e4f?auto=format&fit=crop&w=1400&q=85",
  method:
    "https://images.unsplash.com/photo-1789451820951-a6a1776c64b2?auto=format&fit=crop&w=1800&q=85",
  farm: "https://images.unsplash.com/photo-1746623691157-c4c7a3bad0c4?auto=format&fit=crop&w=1800&q=85",
  cup: "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=1400&q=85",
  poblenou:
    "https://images.unsplash.com/photo-1609862776578-88150048aa70?auto=format&fit=crop&w=1800&q=85",
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={down ? "arrow down" : "arrow"}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d={down ? "M12 3v17m0 0 7-7m-7 7-7-7" : "M4 12h16m0 0-6-6m6 6-6 6"}
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5h13l-1 12h-11l-1-12Z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function CoffeeBag({
  product,
  large = false,
}: {
  product: Product
  large?: boolean
}) {
  return (
    <div className={`coffee-bag ${product.tone} ${large ? "large" : ""}`}>
      <div className="bag-seal">
        <i />
      </div>
      <div className="bag-head">
        <span className="bag-brand">KILN</span>
        <span className="bag-lot">L/{String(product.id).padStart(3, "0")}</span>
      </div>
      <div className="bag-label">
        <span className="bag-type">
          {product.process === "Mezcla" ? "MEZCLA DE LA CASA" : "CAFÉ DE ORIGEN"}
        </span>
        <strong>{product.name}</strong>
        <span className="bag-origin">{product.origin}</span>
        <span className="bag-notes">{product.notes.slice(0, 2).join(" / ")}</span>
      </div>
      <div className="bag-foot">
        <span>BCN—22@</span>
        <span>250 G</span>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>("home")
  const [transitioning, setTransitioning] = useState(false)
  const [activeProduct, setActiveProduct] = useState(coffees[0])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cart, setCart] = useState<{
    product: Product
    qty: number
    size: string
  }[]>([])
  const [filter, setFilter] = useState("Todos")

  const navigate = (next: Page) => {
    if (next === page) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    setTransitioning(true)
    setMenuOpen(false)
    window.setTimeout(() => {
      setPage(next)
      window.scrollTo({ top: 0 })
    }, 280)
    window.setTimeout(() => setTransitioning(false), 720)
  }

  const openProduct = (product: Product) => {
    setActiveProduct(product)
    navigate("product")
  }

  const addToCart = (product: Product, size = "250g") => {
    setCart((current) => {
      const found = current.find(
        (item) => item.product.id === product.id && item.size === size,
      )
      return found
        ? current.map((item) =>
            item === found ? { ...item, qty: item.qty + 1 } : item,
          )
        : [...current, { product, qty: 1, size }]
    })
    setCartOpen(true)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.qty * (item.size === "1kg" ? 3.2 : 1),
    0,
  )

  useEffect(() => {
    document.body.style.overflow = cartOpen || menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [cartOpen, menuOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("is-visible"),
        ),
      { threshold: 0.12 },
    )
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [page])

  const isDarkHeader = page === "home"

  return (
    <div className="app">
      <div className={`page-transition ${transitioning ? "active" : ""}`} aria-hidden="true">
        <span>KILN</span>
        <i />
      </div>
      <Header
        dark={isDarkHeader}
        page={page}
        cartCount={cartCount}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen(!menuOpen)}
        onNavigate={navigate}
        onCart={() => setCartOpen(true)}
      />

      <main>
        {page === "home" && (
          <Home
            onNavigate={navigate}
            onProduct={openProduct}
            onAdd={addToCart}
          />
        )}
        {page === "shop" && (
          <Shop
            filter={filter}
            setFilter={setFilter}
            onProduct={openProduct}
            onAdd={addToCart}
          />
        )}
        {page === "product" && (
          <ProductPage
            product={activeProduct}
            onAdd={addToCart}
            onNavigate={navigate}
          />
        )}
        {page === "about" && <About onNavigate={navigate} />}
        {page === "visit" && <Visit onNavigate={navigate} />}
        {page === "contact" && <Contacto />}
      </main>

      <Footer onNavigate={navigate} />
      <CartDrawer
        open={cartOpen}
        items={cart}
        subtotal={subtotal}
        onClose={() => setCartOpen(false)}
        onQty={(id, qty) =>
          setCart((current) =>
            qty === 0
              ? current.filter((item) => item.product.id !== id)
              : current.map((item) =>
                  item.product.id === id ? { ...item, qty } : item,
                ),
          )
        }
        onShop={() => {
          setCartOpen(false)
          navigate("shop")
        }}
      />
    </div>
  )
}

function Header({
  dark,
  page,
  cartCount,
  menuOpen,
  onMenu,
  onNavigate,
  onCart,
}: {
  dark: boolean
  page: Page
  cartCount: number
  menuOpen: boolean
  onMenu: () => void
  onNavigate: (page: Page) => void
  onCart: () => void
}) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let lastY = window.scrollY
    let idle = 0
    const onScroll = () => {
      const currentY = window.scrollY
      // Mientras se ve el carrusel de la Home, la barra queda fija y transparente
      const hero = document.querySelector<HTMLElement>(".hm-hero")
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 90 : 24
      const overHero = currentY <= limit
      setScrolled(!overHero)
      // Oculta al subir; reaparece al bajar o al detenerse
      if (!overHero && currentY < lastY - 2) setHidden(true)
      else if (currentY > lastY + 2 || overHero) setHidden(false)
      lastY = currentY
      window.clearTimeout(idle)
      idle = window.setTimeout(() => setHidden(false), 220)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, (currentY / scrollable) * 100) : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`site-header ${dark && !scrolled ? "on-dark" : ""} ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`}
      >
        <nav className="desktop-nav" aria-label="Navegación principal">
          <button
            className={page === "shop" ? "active" : ""}
            onClick={() => onNavigate("shop")}
          >
            Café
          </button>
          <button
            className={page === "shop" ? "active" : ""}
            onClick={() => onNavigate("shop")}
          >
            Suscripción
          </button>
          <button
            className={page === "about" ? "active" : ""}
            onClick={() => onNavigate("about")}
          >
            Sobre nosotros
          </button>
        </nav>
        <button
          className="wordmark"
          onClick={() => onNavigate("home")}
          aria-label="Inicio de Kiln"
        >
          KILN
        </button>
        <div className="header-actions">
          <button className="profile-button" type="button" aria-label="Abrir perfil">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="3.25" />
              <path d="M5.5 20c.45-3.6 2.6-5.4 6.5-5.4s6.05 1.8 6.5 5.4" />
            </svg>
          </button>
          <button className="bag-button" onClick={onCart} aria-label={`Abrir cesta, ${cartCount} productos`}>
            <BagIcon />
            <span>{cartCount}</span>
          </button>
          <button
            className="menu-button"
            onClick={onMenu}
            aria-label="Abrir menú"
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => onNavigate("shop")}>
          Café <Arrow />
        </button>
        <button onClick={() => onNavigate("about")}>
          Estudio <Arrow />
        </button>
        <button onClick={() => onNavigate("visit")}>
          Visítanos <Arrow />
        </button>
        <button onClick={() => onNavigate("contact")}>
          Profesionales <Arrow />
        </button>
        <p>
          Tostado en Poblenou, Barcelona.
          <br />
          Envíos de martes a viernes.
        </p>
      </div>
    </>
  )
}

function Pill({
  children,
  onClick,
  light = false,
}: {
  children: React.ReactNode
  onClick: () => void
  light?: boolean
}) {
  return (
    <button className={`pill ${light ? "light" : ""}`} onClick={onClick}>
      <span>{children}</span>
      <Arrow />
    </button>
  )
}

function Home({
  onNavigate,
  onProduct,
  onAdd,
}: {
  onNavigate: (page: Page) => void
  onProduct: (product: Product) => void
  onAdd: (product: Product) => void
}) {
  return (
    <div className="hm">
      <HomeHero onNavigate={onNavigate} onProduct={onProduct} />

      <section className="k-sec k-drop">
        <div className="k-drop-intro">
          <div className="k-drop-meta">
            <span className="k-tag">Colección de temporada</span>
            <span className="k-drop-num">Nº 03 / 2026</span>
          </div>
          <h2 className="k-drop-title">Primavera<br /><em>en flor.</em></h2>
          <p>Tres lotes elegidos para los días que se alargan: más luz, más fruta, más claridad. Tueste ligero, cantidades pequeñas y una sola tirada.</p>
          <div className="k-stock">
            <div><b>Quedan 184 bolsas</b><span>de 600</span></div>
            <i><span style={{ width: "31%" }} /></i>
          </div>
          <button className="k-btn" onClick={() => onNavigate("shop")}>Ver la colección <Arrow /></button>
        </div>
        <div className="k-drop-cards">
          {[
            { c: coffees[5], badge: "Nuevo", tone: "d0", line: "Cítrico y sedoso" },
            { c: coffees[1], badge: "Edición limitada", tone: "d1", line: "Jugoso y vibrante" },
            { c: coffees[3], badge: "Vuelve", tone: "d2", line: "Dulce y profundo" },
          ].map(({ c, badge, tone, line }, i) => (
            <article key={c.id} className={`k-drop-card ${tone}`} onClick={() => onProduct(c)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onProduct(c)}>
              <div className="k-drop-top">
                <span className="k-pill">{badge}</span>
                <span className="k-drop-idx">0{i + 1}</span>
              </div>
              <span className="k-drop-back" aria-hidden="true">{c.origin.split(",")[1]?.trim() ?? c.origin}</span>
              <div className="k-drop-bag"><CoffeeBag product={c} /></div>
              <ul className="k-drop-notes">{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
              <div className="k-drop-info">
                <div>
                  <h3>{c.name}</h3>
                  <p>{line} · {c.origin}</p>
                </div>
                <button className="k-drop-add" onClick={(e) => { e.stopPropagation(); onAdd(c) }} aria-label={`Añadir ${c.name} a la cesta`}>
                  <span>{c.price} €</span><b>+</b>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="k-sec k-catalog">
        <div className="k-head">
          <div>
            <span className="k-tag">Catálogo permanente</span>
            <h2>Los de siempre, siempre frescos.</h2>
          </div>
          <button className="k-btn" onClick={() => onNavigate("shop")}>Ver todo el catálogo <Arrow /></button>
        </div>
        <div className="k-cards">
          {[coffees[0], coffees[4], coffees[3], coffees[1]].map((c) => (
            <article key={c.id} className="k-card" onClick={() => onProduct(c)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onProduct(c)}>
              <div className="k-card-visual"><CoffeeBag product={c} /></div>
              <div className="k-card-body">
                <div className="k-card-top">
                  <span>{c.origin}</span>
                  <span>{c.process}</span>
                </div>
                <h3>{c.name}</h3>
                <ul>{c.notes.map((n) => <li key={n}>{n}</li>)}</ul>
                <div className="k-card-foot">
                  <b>{c.price} € <small>/ 250 g</small></b>
                  <button className="k-add" aria-label={`Añadir ${c.name} a la cesta`} onClick={(e) => { e.stopPropagation(); onAdd(c) }}>+</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <HomeValues onNavigate={onNavigate} />

      <section className="k-sec k-producers">
        <div className="k-head">
          <div>
            <span className="k-tag">Productores y colaboradores</span>
            <h2>Las personas detrás de cada taza.</h2>
          </div>
          <p>Relaciones de años, no compras de temporada. Y en el barrio, gente que comparte nuestra forma de hacer.</p>
        </div>
        <div className="k-prod-grid">
          {[
            ["https://images.unsplash.com/photo-1642613630414-1d9938f4fe02?auto=format&fit=crop&w=1200&q=80", "Finca Los Nogales", "Huila, Colombia", "Familia Ortega · desde 2019"],
            ["https://images.unsplash.com/photo-1597816760638-406d7271105c?auto=format&fit=crop&w=1200&q=80", "Tesfaye Bekele", "Gedeb, Etiopía", "Estación Halo · desde 2021"],
            ["https://images.unsplash.com/photo-1629008642899-178df6fc5f2f?auto=format&fit=crop&w=1200&q=80", "Cooperativa Gitesi", "Karongi, Ruanda", "320 caficultoras · desde 2022"],
          ].map(([img, name, place, since]) => (
            <article key={name} className="k-prod">
              <img src={img} alt={`${name}, ${place}`} />
              <div>
                <span className="k-badge soft">{place}</span>
                <h3>{name}</h3>
                <p>{since}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="k-sec k-reviews">
        <h2 className="k-reviews-title">Lo que dice <em>quien ya repite.</em></h2>
        <div className="k-reviews-row">
          <div className="k-score">
            <b>Excelente</b>
            <span className="k-stars" aria-label="5 de 5">★★★★★</span>
            <p>4,9 de 5 · 1.240 opiniones</p>
          </div>
          <div className="k-rev-marquee">
            <div className="k-rev-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="k-rev-group" aria-hidden={dup === 1}>
                  {[
                    ["Laia M.", "El café que tenemos en el estudio cuando hay entrega. Nos baja el ruido y nos sube la claridad.", "hace 1 semana"],
                    ["Pau R.", "Por fin una marca que trata el café como nosotros tratamos la tipografía. Las fichas de cata son una joya.", "hace 2 semanas"],
                    ["Anónimo", "Halo Hartume en V60 es otra liga. Floral, limpio, dulce.", "hace 3 semanas"],
                    ["Irene S.", "Las catas del jueves se han convertido en mi reunión favorita del mes.", "hace 1 mes"],
                    ["Marc T.", "Suscripción Explorador desde hace un año. Nunca me ha llegado un café repetido ni pasado.", "hace 1 mes"],
                    ["Júlia F.", "Envío en bici al día siguiente y la bolsa es tan bonita que la reutilizo en el estudio.", "hace 2 meses"],
                  ].map(([n, t, d]) => (
                    <article key={n + t} className="k-rev">
                      <div className="k-rev-top"><b>{n}</b><span className="k-stars sm">★★★★★</span></div>
                      <span className="k-verified">
                        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" /><path d="M4.5 8.2l2.2 2.2 4.8-4.8" /></svg>
                        Cliente verificado
                      </span>
                      <p>{t}</p>
                      <time>{d}</time>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="k-sec k-club">
        <div className="k-club-img">
          <img src={images.cup} alt="Taza de café de filtro en una mesa de trabajo" />
          <span className="k-club-stamp">Club<br />Kiln</span>
        </div>
        <div className="k-club-copy">
          <span className="k-tag">Suscripción</span>
          <h2>Tu café,<br /><em>sin pensarlo.</em></h2>
          <p>Elige tu ritmo y nosotros nos encargamos del resto. Recién tostado, en tu puerta, justo cuando se te acaba.</p>
          <ul>
            {[
              ["Tostado esa semana", "Sale del tambor el lunes, llega el martes."],
              ["15 % menos, siempre", "En cada envío y con envío gratis."],
              ["Pausa cuando quieras", "Cambia, salta o cancela en un clic."],
            ].map(([t, d], i) => (
              <li key={t}>
                <span>0{i + 1}</span>
                <div><b>{t}</b><p>{d}</p></div>
              </li>
            ))}
          </ul>
          <button className="k-btn" onClick={() => onNavigate("shop")}>Descubre la suscripción <Arrow /></button>
        </div>
      </section>

      <section className="k-partners" aria-label="Nuestros colaboradores">
        <div className="k-partners-head">
          <span className="k-tag">Nuestros colaboradores</span>
          <h2>Donde se sirve Kiln.</h2>
        </div>
        {[0, 1].map((row) => (
          <div key={row} className={`k-marquee ${row ? "rev" : ""}`}>
            <div className="k-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="k-group" aria-hidden={dup === 1}>
                  {(row === 0
                    ? [["Brava", "l-outline"], ["CASA ONA", "l-didone"], ["SALITRE", "l-wide"], ["NAU.12", "l-dot"], ["Forn", "l-badge"], ["LLUM", "l-condensed"], ["Taller Terra", "l-italic"], ["RÀDIO PALLARS", "l-serif"]]
                    : [["remei", "l-round"], ["ARXIU", "l-box"], ["Fil & Forma", "l-garamond"], ["SANT MARTÍ", "l-fat"], ["olivera/", "l-mono"], ["RIERA", "l-thin"], ["TAULA", "l-under"], ["Cal Tòfol", "l-display"]]
                  ).map(([n, cls]) => (
                    <span key={n} className={`k-logo ${cls}`}>{n}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

function HomeValues({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const values = [
    { name: "Precio justo", img: images.farm, tone: "terra", title: "Pagar bien es la única forma de que el buen café exista.", text: "Compramos directamente a productores con los que trabajamos año tras año. De media pagamos un 60 % por encima del precio de mercado y publicamos lo que pagamos por cada lote." },
    { name: "Trazabilidad", img: "https://images.unsplash.com/photo-1629008642899-178df6fc5f2f?auto=format&fit=crop&w=1200&q=80", tone: "sage", title: "Cada bolsa cuenta de dónde viene, quién la cultivó y cuándo la tostamos.", text: "Finca, productor, variedad, altitud, proceso y fecha de tueste. Sin mezclas opacas ni orígenes genéricos: si no podemos contarlo, no lo vendemos." },
    { name: "Residuo mínimo", img: images.method, tone: "roast", title: "Tostar en Poblenou y llegar a tu casa sin dejar rastro.", text: "Bolsas compostables, envíos sin plástico en bicicleta por Barcelona y la cascarilla del tueste convertida en compost para los huertos del barrio." },
  ]
  const [active, setActive] = useState(0)
  const v = values[active]
  return (
    <section className="k-sec k-ethos">
      <div className="k-ethos-left">
        <span className="k-tag">La ética Kiln</span>
        <ul role="tablist" aria-label="Nuestros valores">
          {values.map((item, i) => (
            <li key={item.name}>
              <button role="tab" aria-selected={active === i} className={active === i ? "on" : ""} onClick={() => setActive(i)}>
                <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M2 12h26M18 3l10 9-10 9" /></svg>
                {item.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="k-btn" onClick={() => onNavigate("about")}>Conoce nuestra ética <Arrow /></button>
      </div>
      <div className={`k-ethos-card ${v.tone}`} key={active} role="tabpanel">
        <div className="k-ethos-img"><img src={v.img} alt={v.name} /></div>
        <div className="k-ethos-text">
          <span>0{active + 1} / 03</span>
          <h3>{v.title}</h3>
          <p>{v.text}</p>
        </div>
      </div>
    </section>
  )
}

function HomeHero({ onNavigate, onProduct }: { onNavigate: (p: Page) => void; onProduct: (p: Product) => void }) {
  const slides = [
    { img: "https://images.unsplash.com/photo-1542181961-9590d0c79dab?auto=format&fit=crop&w=2400&q=85", tag: "Kiln · Poblenou", title: "Despacio se piensa mejor.", cta: "Ver la tienda", go: () => onNavigate("shop") },
    { img: images.farm, tag: "Nuevo lote · Gedeb, Etiopía", title: "Halo Hartume ya está aquí.", cta: "Ver el café", go: () => onProduct(coffees[2]) },
    { img: images.cup, tag: "Oferta · Suscripción", title: "Tu café, siempre un 15 % menos.", cta: "Ver la oferta", go: () => onNavigate("shop") },
    { img: images.method, tag: "Agenda · Jueves 19 h", title: "Catas abiertas en el tostador.", cta: "Más información", go: () => onNavigate("visit") },
    { img: images.poblenou, tag: "Profesionales", title: "Café para estudios con criterio.", cta: "Más información", go: () => onNavigate("contact") },
  ]
  const [index, setIndex] = useState(0)
  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length)
  useEffect(() => {
    const t = window.setTimeout(() => go(1), 5000)
    return () => window.clearTimeout(t)
  }, [index])
  return (
    <section className="hm-hero" aria-roledescription="carrusel" aria-label="Novedades de Kiln">
      {slides.map((sl, i) => (
        <div key={i} className={`hm-slide ${i === index ? "on" : ""}`} aria-hidden={i !== index}>
          <div className="hm-hero-media"><img src={sl.img} alt="" /></div>
          <div className="hm-hero-haze" />
          <div className="hm-hero-center">
            <p className="hm-slide-tag">{sl.tag}</p>
            <h2 className="hm-slide-title">{sl.title}</h2>
            <button className="hm-slide-cta" onClick={sl.go} tabIndex={i === index ? 0 : -1}>
              {sl.cta} <Arrow />
            </button>
          </div>
        </div>
      ))}
      <button className="hm-arrow prev" onClick={() => go(-1)} aria-label="Anterior">
        <svg viewBox="0 0 24 48"><path d="M20 4L4 24l16 20" /></svg>
      </button>
      <button className="hm-arrow next" onClick={() => go(1)} aria-label="Siguiente">
        <svg viewBox="0 0 24 48"><path d="M4 4l16 20L4 44" /></svg>
      </button>
      <div className="hm-dots">
        {slides.map((_, i) => (
          <button key={i} className={i === index ? "on" : ""} onClick={() => setIndex(i)} aria-label={`Ir a la diapositiva ${i + 1}`} />
        ))}
      </div>
    </section>
  )
}

function HomeNewsletter() {
  const [sent, setSent] = useState(false)
  return (
    <section className="hm-news reveal">
      <h2>Notas de tueste.</h2>
      <p>Un correo al mes: nuevos lotes, catas y lo que estamos escuchando en el tostador.</p>
      {sent ? (
        <p className="mono hm-news-ok">Gracias. Te escribimos con el próximo lote.</p>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
          <input type="email" required placeholder="tu@estudio.com" aria-label="Email" />
          <button type="submit" className="mono">Suscribirme <Arrow /></button>
        </form>
      )}
    </section>
  )
}

function ProductCard({
  product,
  onOpen,
  onAdd,
}: {
  product: Product
  onOpen: (p: Product) => void
  onAdd: (p: Product) => void
}) {
  const tilt = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    event.currentTarget.style.setProperty("--tilt-x", `${x * 7}deg`)
    event.currentTarget.style.setProperty("--tilt-y", `${y * -7}deg`)
    event.currentTarget.style.setProperty("--move-x", `${x * 10}px`)
    event.currentTarget.style.setProperty("--move-y", `${y * 10}px`)
  }
  const resetTilt = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.removeProperty("--tilt-x")
    event.currentTarget.style.removeProperty("--tilt-y")
    event.currentTarget.style.removeProperty("--move-x")
    event.currentTarget.style.removeProperty("--move-y")
  }

  return (
    <article className="product-card">
      <button
        className={`product-image ${product.tone}`}
        onClick={() => onOpen(product)}
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
        aria-label={`Ver ${product.name}`}
      >
        <span className="product-code">K/{String(product.id).padStart(2, "0")}</span>
        <CoffeeBag product={product} />
        <span className="product-profile">{product.process} · 250 G</span>
        <span className="quick-view">
          Ver café <Arrow />
        </span>
      </button>
      <div className="product-card-info">
        <button className="product-name" onClick={() => onOpen(product)}>
          {product.name}
        </button>
        <span>Desde {product.price} €</span>
        <p>{product.origin}</p>
        <button
          className="round-add"
          onClick={() => onAdd(product)}
          aria-label={`Añadir ${product.name} a la cesta`}
        >
          Añadir
        </button>
      </div>
    </article>
  )
}

function Shop({
  filter,
  setFilter,
  onProduct,
  onAdd,
}: {
  filter: string
  setFilter: (f: string) => void
  onProduct: (p: Product) => void
  onAdd: (p: Product) => void
}) {
  return (
    <div className="page-shell shop-page">
      <section className="page-intro">
        <p className="eyebrow">Tostado cada semana · Poblenou / BCN</p>
        <h1>
          Café para
          <br />
          <em>tu momento.</em>
        </h1>
        <p>
          Lotes de temporada y un café de la casa que siempre está. Todos
          tostados para encontrar dulzor, claridad y equilibrio.
        </p>
      </section>
      <div className="shop-toolbar">
        <span>{coffees.length} cafés</span>
        <div className="filters">
          {["Todos", "Filtro", "Espresso"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <section className="shop-grid">
        {coffees.map((coffee) => (
          <ProductCard
            key={coffee.id}
            product={coffee}
            onOpen={onProduct}
            onAdd={onAdd}
          />
        ))}
      </section>
      <section className="shipping-note">
        <span>TOSTADO BAJO PEDIDO</span>
        <p>
          Los pedidos realizados hasta el lunes se tuestan y salen el martes. El
          resto viaja con el tueste del viernes.
        </p>
      </section>
    </div>
  )
}

function ProductPage({
  product,
  onAdd,
  onNavigate,
}: {
  product: Product
  onAdd: (p: Product, size: string) => void
  onNavigate: (p: Page) => void
}) {
  const [size, setTamaño] = useState("250g")
  const [grind, setMolienda] = useState("En grano")
  const price = size === "1kg" ? Math.round(product.price * 3.2) : product.price
  return (
    <div className="product-page page-shell">
      <div className="product-gallery">
        <div className={`gallery-main ${product.tone}`}>
          <CoffeeBag product={product} large />
          <span className="gallery-index">01 / 03</span>
        </div>
        <img src={images.cup} alt="Café servido en una taza de cerámica" />
      </div>
      <section className="product-buy">
        <button className="back-link" onClick={() => onNavigate("shop")}>
          ← Ver todos
        </button>
        <p className="origin">
          {product.origin} · {product.process}
        </p>
        <h1 className="serif-title">{product.name}</h1>
        <p className="tasting">{product.notes.join(" · ")}</p>
        <div className="choice">
          <div>
            <span>Tamaño</span>
            <span>
              {size === "250g" ? "aprox. 15 tazas" : "aprox. 60 tazas"}
            </span>
          </div>
          <div className="choice-row">
            {["250g", "1kg"].map((v) => (
              <button
                className={size === v ? "selected" : ""}
                onClick={() => setTamaño(v)}
                key={v}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="choice">
          <div>
            <span>Molienda</span>
            <span>Elige según tu cafetera</span>
          </div>
          <select
            value={grind}
            onChange={(event) => setMolienda(event.target.value)}
          >
            <option>En grano</option>
            <option>Filtro</option>
            <option>Espresso</option>
            <option>Prensa francesa</option>
          </select>
        </div>
        <button className="add-main" onClick={() => onAdd(product, size)}>
          <span>Añadir a la cesta</span>
          <span>{price} €</span>
        </button>
        <div className="dispatch">
          <span>Recién tostado</span>
          <span>Sale en 1–2 días</span>
        </div>
      </section>
      <section className="lot-story">
        <div className="section-number">EL LOTE / 01</div>
        <h2>
          Una taza con
          <br />
          <em>un lugar propio.</em>
        </h2>
        <div>
          <p>
            Este lote procede de pequeñas fincas familiares de altura. Las
            cerezas maduras se recogen a mano, se seleccionan con cuidado y
            reposan antes de un secado lento y limpio.
          </p>
          <dl>
            <div>
              <dt>Productor</dt>
              <dd>Colectivo de pequeños productores</dd>
            </div>
            <div>
              <dt>Altitud</dt>
              <dd>1,850–2,050 masl</dd>
            </div>
            <div>
              <dt>Variedad</dt>
              <dd>Caturra, Colombia</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  )
}

function About({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="about-page page-shell">
      <section className="about-hero">
        <div>
          <p className="eyebrow">Sobre Kiln</p>
          <h1>
            Tostamos café
            <br />
            <em>sin correr.</em>
          </h1>
        </div>
        <p className="serif-lead">Un tostador independiente en el Poblenou industrial.</p>
        <img
          src={images.farm}
          alt="Productora recogiendo cerezas de café maduras"
        />
      </section>
      <section className="about-story">
        <div className="section-number">01 / ORIGEN</div>
        <div>
          <h2>
            Hecho despacio.
            <br />
            Compartido siempre.
          </h2>
          <p>
            Kiln nació en Barcelona alrededor de un tostador prestado y una
            idea sencilla: el café extraordinario no necesita artificio.
            Necesita buen origen, precisión y una puerta abierta.
          </p>
          <p>
            Trabajamos con importadores y productores que prefieren relaciones
            duraderas a resultados rápidos. Después, intentamos no interponernos
            en el camino del café.
          </p>
        </div>
      </section>
      <section className="about-values">
        <div>
          <span>01</span>
          <h3>Comprar con honestidad</h3>
          <p>
            Lotes trazables, relaciones justas e información clara sobre cada
            café que compramos.
          </p>
        </div>
        <div>
          <span>02</span>
          <h3>Tostar escuchando</h3>
          <p>
            Cada café pide algo distinto. Escuchamos, probamos, ajustamos y
            mantenemos el tueste transparente.
          </p>
        </div>
        <div>
          <span>03</span>
          <h3>Servir con cercanía</h3>
          <p>
            El café de especialidad debe abrir una puerta, no vigilarla. Nuestro
            lenguaje y nuestra bienvenida son sencillos.
          </p>
        </div>
      </section>
      <section className="about-cta">
        <p className="serif-lead">
          Encuentra algo bueno para mañana por la mañana.
        </p>
        <Pill onClick={() => onNavigate("shop")}>Comprar café</Pill>
      </section>
    </div>
  )
}

function Visit({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="visit-page page-shell">
      <section className="visit-hero">
        <div className="visit-heading">
          <p className="eyebrow">Tostador / Tienda / Poblenou</p>
          <h1>La puerta está abierta.</h1>
          <p>Tueste, café y bolsas recién hechas. Sin reservas.</p>
        </div>
        <img src={images.poblenou} alt="Edificio industrial en Poblenou, Barcelona" />
      </section>
      <section className="visit-details">
        <div>
          <span className="section-number">DÓNDE</span>
          <p>Carrer de Pujades, 118<br />08005 Barcelona</p>
          <a className="text-link" href="https://maps.google.com" target="_blank" rel="noreferrer">
            Abrir en Maps <Arrow />
          </a>
        </div>
        <div>
          <span className="section-number">CUÁNDO</span>
          <p>Martes—Viernes · 08:00—17:00<br />Sábado · 09:00—15:00</p>
        </div>
        <div>
          <span className="section-number">QUÉ ENCONTRARÁS</span>
          <p>Café de temporada, espresso, filtro y recogida de pedidos online.</p>
          <button className="text-link" onClick={() => onNavigate("shop")}>
            Ver cafés <Arrow />
          </button>
        </div>
      </section>
    </div>
  )
}

function Contacto() {
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setSent(true)
  }
  return (
    <div className="contact-page page-shell">
      <section className="contact-intro">
        <p className="eyebrow">Profesionales / Contacto</p>
        <h1>
          Hagamos
          <br />
          <em>buen café.</em>
        </h1>
        <p>
          Para cafeterías, restaurantes, estudios y lugares con un poco de
          tiempo que compartir.
        </p>
      </section>
      <section className="contact-body">
        <div className="contact-aside">
          <p>
            Cuéntanos cómo es tu espacio y qué necesitas. Solemos responder en
            dos días laborables.
          </p>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>hola@kiln.coffee</dd>
            </div>
            <div>
              <dt>Tostador</dt>
              <dd>
                Carrer de Pujades, 118
                <br />
                Poblenou, Barcelona
              </dd>
            </div>
          </dl>
        </div>
        {sent ? (
          <div className="success-state">
            <span>Mensaje recibido</span>
            <h2>
              Gracias.
              <br />
              <em>Hablamos pronto.</em>
            </h2>
            <button className="text-link" onClick={() => setSent(false)}>
              Enviar otro mensaje <Arrow />
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label>
              <span>Tu nombre</span>
              <input required name="name" placeholder="Nombre" />
            </label>
            <label>
              <span>Correo electrónico</span>
              <input
                required
                type="email"
                name="email"
                placeholder="tu@correo.com"
              />
            </label>
            <label>
              <span>
                Empresa <small>opcional</small>
              </span>
              <input name="company" placeholder="Tu cafetería o empresa" />
            </label>
            <label>
              <span>¿Cómo podemos ayudarte?</span>
              <textarea
                required
                name="message"
                placeholder="Cuéntanos un poco sobre tu espacio..."
                rows={5}
              />
            </label>
            <button className="add-main" type="submit">
              <span>Enviar consulta</span>
              <Arrow />
            </button>
          </form>
        )}
      </section>
    </div>
  )
}

function CartDrawer({
  open,
  items,
  subtotal,
  onClose,
  onQty,
  onShop,
}: {
  open: boolean
  items: { product: Product; qty: number; size: string }[]
  subtotal: number
  onClose: () => void
  onQty: (id: number, qty: number) => void
  onShop: () => void
}) {
  const [checkedOut, setCheckedOut] = useState(false)
  useEffect(() => {
    if (!open) setCheckedOut(false)
  }, [open])
  return (
    <>
      <button
        className={`drawer-backdrop ${open ? "open" : ""}`}
        onClick={onClose}
        aria-label="Cerrar cesta"
      />
      <aside
        className={`cart-drawer ${open ? "open" : ""}`}
        aria-label="Cesta de compra"
      >
        <div className="drawer-head">
          <h2>
            Tu cesta <span>{items.reduce((s, i) => s + i.qty, 0)}</span>
          </h2>
          <button onClick={onClose}>Cerrar</button>
        </div>
        {checkedOut ? (
          <div className="cart-success">
            <span>PEDIDO / DEMO</span>
            <h3>Todo listo.</h3>
            <p>
              Esta es una compra de demostración: no se ha realizado ningún
              cobro.
            </p>
            <Pill onClick={onClose}>Seguir explorando</Pill>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-cart">
            <p className="serif-lead">Hay sitio para algo bueno.</p>
            <p>Tu cesta está vacía.</p>
            <Pill onClick={onShop}>Elegir café</Pill>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div
                  className="cart-item"
                  key={`${item.product.id}-${item.size}`}
                >
                  <div className={`mini-bag ${item.product.tone}`}>
                    <CoffeeBag product={item.product} />
                  </div>
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>{item.size} · En grano</p>
                    <div className="qty">
                      <button
                        onClick={() => onQty(item.product.id, item.qty - 1)}
                      >
                        −
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => onQty(item.product.id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <strong>
                    {Math.round(
                      item.product.price *
                        item.qty *
                        (item.size === "1kg" ? 3.2 : 1),
                    )} €
                  </strong>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <div>
                <span>Subtotal</span>
                <strong>{Math.round(subtotal)} €</strong>
              </div>
              <p>El envío se calcula al finalizar.</p>
              <button className="add-main" onClick={() => setCheckedOut(true)}>
                <span>Finalizar compra</span>
                <Arrow />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

function Footer({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [sent, setSent] = useState(false)
  const cols: { title: string; links: [string, Page][] }[] = [
    { title: "Kiln", links: [["Cómo tostamos", "about"], ["Journal", "about"], ["Visítanos", "visit"], ["Catas y cursos", "visit"], ["Club Kiln", "shop"]] },
    { title: "Ayuda", links: [["Contacto", "contact"], ["Mi cuenta", "home"], ["Envíos y devoluciones", "contact"], ["Guías de preparación", "about"], ["Preguntas frecuentes", "contact"], ["Trabaja con nosotros", "contact"]] },
    { title: "Profesionales", links: [["Café para empresas", "contact"], ["Cafeterías y hostelería", "contact"], ["Cuenta de partner", "contact"]] },
  ]
  return (
    <footer className="kf">
      <section className="kf-news">
        <h2>Notas desde el tostador.</h2>
        <p>Únete a la comunidad Kiln y llévate un 10 % en tu primer pedido, además de lotes nuevos y catas antes que nadie.</p>
        {sent ? (
          <p className="kf-ok">Gracias. Revisa tu correo: tu código ya va de camino.</p>
        ) : (
          <form className="kf-form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <input type="email" required placeholder="Tu correo electrónico" aria-label="Correo electrónico" />
            <button type="submit" aria-label="Suscribirme">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>
            </button>
          </form>
        )}
      </section>

      <div className="kf-main">
        <div className="kf-left">
          <div className="kf-social">
            {[
              ["Instagram", <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="fill" /></>],
              ["TikTok", <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.2 4.4 5 4.6" />],
              ["Spotify", <><circle cx="12" cy="12" r="9" /><path d="M7.5 9.5c3-1 6.5-.7 9 .8M8 12.6c2.5-.7 5.2-.4 7.3.8M8.6 15.4c1.9-.5 3.8-.3 5.4.6" /></>],
              ["Pinterest", <><circle cx="12" cy="12" r="9" /><path d="M11 8.5c2.8-1 5 .6 4.6 3-.4 2.6-3 3.4-4.2 2.1M11.6 10.5 9.8 19" /></>],
              ["LinkedIn", <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10.5V16M8 7.6v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" /></>],
            ].map(([label, icon]) => (
              <a key={label as string} href="#" aria-label={label as string} onClick={(e) => e.preventDefault()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
              </a>
            ))}
          </div>
          <p className="kf-address">C/ Pujades 118, Poblenou · Barcelona<br />Mar–Sáb · 8–15 h</p>
        </div>
        <nav className="kf-cols" aria-label="Pie de página">
          {cols.map((c) => (
            <div key={c.title}>
              <h3>{c.title}</h3>
              {c.links.map(([label, page]) => (
                <button key={label} onClick={() => onNavigate(page)}>{label}</button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="kf-sign">
        <button className="kf-wordmark" onClick={() => onNavigate("home")} aria-label="Kiln, ir al inicio">KILN</button>
      </div>

      <div className="kf-bottom">
        <span>© Kiln Coffee Roasters 2026</span>
        <div>
          <button>Política de privacidad</button>
          <button>Cookies</button>
          <button>Aviso legal</button>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Volver arriba ↑</button>
      </div>
    </footer>
  )
}

export default App
