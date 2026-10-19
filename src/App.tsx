import { FormEvent, useEffect, useId, useRef, useState } from "react"

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
  {
    id: 7,
    name: "La Esperanza",
    origin: "Cauca, Colombia",
    process: "Fermentación asistida",
    notes: ["Frambuesa", "Lavanda", "Ponche"],
    price: 24,
    tone: "roast",
  },
  {
    id: 8,
    name: "Santa Irene",
    origin: "Huehuetenango, Guatemala",
    process: "Semilavado",
    notes: ["Mermelada", "Chocolate", "Sedoso"],
    price: 20,
    tone: "sand",
  },
  {
    id: 9,
    name: "Bensa",
    origin: "Sidama, Etiopía",
    process: "Natural",
    notes: ["Arándano", "Cacao", "Vino tinto"],
    price: 22,
    tone: "plum",
  },
  {
    id: 10,
    name: "Kiln Oficina",
    origin: "Brasil · Perú",
    process: "Mezcla",
    notes: ["Chocolate", "Nuez", "Panela"],
    price: 14,
    tone: "clay",
  },
  {
    id: 11,
    name: "Cápsulas Casa",
    origin: "Brasil · Colombia",
    process: "Mezcla",
    notes: ["Caramelo", "Cacao", "Avellana"],
    price: 9,
    tone: "ochre",
  },
  {
    id: 12,
    name: "Cold Brew 22@",
    origin: "Colombia · Etiopía",
    process: "Mezcla",
    notes: ["Cacao", "Naranja", "Melaza"],
    price: 12,
    tone: "forest",
  },
  {
    id: 13,
    name: "Pack Descubrimiento",
    origin: "Tres orígenes, Varios",
    process: "Lavado",
    notes: ["Fruta", "Floral", "Chocolate"],
    price: 32,
    tone: "sand",
  },
  {
    id: 14,
    name: "Sitio Baixadão",
    origin: "Sul de Minas, Brasil",
    process: "Semilavado",
    notes: ["Cacahuete", "Chocolate", "Caramelo"],
    price: 16,
    tone: "olive",
  },
  {
    id: 15,
    name: "Finca Mileydi",
    origin: "Cajamarca, Perú",
    process: "Fermentación asistida",
    notes: ["Mango", "Maracuyá", "Panela"],
    price: 23,
    tone: "rust",
  },
  {
    id: 16,
    name: "Chelbesa",
    origin: "Gedeb, Etiopía",
    process: "Lavado",
    notes: ["Bergamota", "Limón", "Té blanco"],
    price: 20,
    tone: "forest",
  },
  {
    id: 17,
    name: "Kochere",
    origin: "Yirgacheffe, Etiopía",
    process: "Lavado",
    notes: ["Jazmín", "Limón", "Melocotón"],
    price: 21,
    tone: "olive",
  },
  {
    id: 18,
    name: "Las Flores",
    origin: "Huila, Colombia",
    process: "Natural",
    notes: ["Fresa", "Chocolate con leche", "Ron"],
    price: 22,
    tone: "rust",
  },
  {
    id: 19,
    name: "Kiambu AA",
    origin: "Kiambu, Kenya",
    process: "Lavado",
    notes: ["Pomelo", "Tomate dulce", "Grosella"],
    price: 23,
    tone: "forest",
  },
  {
    id: 20,
    name: "Santa Lucía",
    origin: "Antigua, Guatemala",
    process: "Lavado",
    notes: ["Cacao", "Almendra", "Naranja"],
    price: 17,
    tone: "ochre",
  },
  {
    id: 21,
    name: "Volcán Azul",
    origin: "Tarrazú, Costa Rica",
    process: "Semilavado",
    notes: ["Miel", "Pera", "Caña"],
    price: 19,
    tone: "sand",
  },
  {
    id: 22,
    name: "Kiln Nocturno",
    origin: "Brasil · Uganda",
    process: "Mezcla",
    notes: ["Chocolate negro", "Melaza", "Especias"],
    price: 15,
    tone: "roast",
  },
  {
    id: 23,
    name: "El Mirador",
    origin: "Nariño, Colombia",
    process: "Fermentación asistida",
    notes: ["Cereza", "Canela", "Panela"],
    price: 25,
    tone: "plum",
  },
  {
    id: 24,
    name: "Gakenke",
    origin: "Gakenke, Ruanda",
    process: "Natural",
    notes: ["Mora", "Hibisco", "Cacao"],
    price: 21,
    tone: "plum",
  },
  {
    id: 25,
    name: "Kirinyaga",
    origin: "Kirinyaga, Kenya",
    process: "Lavado",
    notes: ["Casis", "Lima", "Panela"],
    price: 22,
    tone: "forest",
  },
  {
    id: 26,
    name: "Cerro Azul",
    origin: "Valle del Cauca, Colombia",
    process: "Fermentación asistida",
    notes: ["Uva", "Lichi", "Rosa"],
    price: 28,
    tone: "roast",
  },
  {
    id: 27,
    name: "Fazenda Ambiental",
    origin: "Mogiana, Brasil",
    process: "Natural",
    notes: ["Cacahuete", "Cacao", "Caramelo"],
    price: 15,
    tone: "clay",
  },
  {
    id: 28,
    name: "Kiln Descafeinado",
    origin: "Huila, Colombia",
    process: "Lavado",
    notes: ["Caramelo", "Cacao", "Manzana"],
    price: 17,
    tone: "sand",
  },
  {
    id: 29,
    name: "Sumatra Gayo",
    origin: "Aceh, Indonesia",
    process: "Semilavado",
    notes: ["Tabaco dulce", "Cedro", "Chocolate"],
    price: 18,
    tone: "olive",
  },
  {
    id: 30,
    name: "Bombe",
    origin: "Sidama, Etiopía",
    process: "Lavado",
    notes: ["Bergamota", "Miel", "Melocotón"],
    price: 22,
    tone: "ochre",
  },
  {
    id: 31,
    name: "Kiln Brunch",
    origin: "Colombia · Etiopía",
    process: "Mezcla",
    notes: ["Frutos rojos", "Chocolate", "Vainilla"],
    price: 16,
    tone: "rust",
  },
  {
    id: 32,
    name: "Finca Hamilton",
    origin: "Santa Bárbara, Honduras",
    process: "Natural",
    notes: ["Piña", "Ron", "Cacao"],
    price: 20,
    tone: "clay",
  },
  {
    id: 33,
    name: "Mzuzu",
    origin: "Mzuzu, Malaui",
    process: "Lavado",
    notes: ["Albaricoque", "Té verde", "Azúcar"],
    price: 19,
    tone: "forest",
  },
  {
    id: 34,
    name: "Cold Brew Clásico",
    origin: "Brasil · Colombia",
    process: "Mezcla",
    notes: ["Chocolate", "Caramelo", "Avellana"],
    price: 11,
    tone: "roast",
  },
  {
    id: 35,
    name: "Chirinos",
    origin: "Cajamarca, Perú",
    process: "Semilavado",
    notes: ["Ciruela", "Panela", "Cacao"],
    price: 18,
    tone: "plum",
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

const bagColors: Record<string, { c: string; st: string; ink: string }> = {
  rust: { c: "#b8674a", st: "#f3b391", ink: "#fff8ef" },
  olive: { c: "#6f7a5b", st: "#cfd8a6", ink: "#fff8ef" },
  ochre: { c: "#b98a42", st: "#f6d68a", ink: "#fff8ef" },
  plum: { c: "#5f414a", st: "#e9a6b8", ink: "#fff8ef" },
  clay: { c: "#33281f", st: "#e3a37f", ink: "#f3e6d4" },
  forest: { c: "#43523f", st: "#b8d39a", ink: "#fff8ef" },
  roast: { c: "#231b16", st: "#f08aa5", ink: "#f3e6d4" },
  sand: { c: "#e2d2b9", st: "#f2a273", ink: "#3a2e26" },
}

function CoffeeBag({
  product,
  large = false,
}: {
  product: Product
  large?: boolean
}) {
  const uid = useId().replace(/:/g, "")
  const col = bagColors[product.tone] ?? bagColors.rust
  const lot = String(product.id).padStart(3, "0")
  const roast = product.process === "Mezcla" ? 4 : product.tone === "roast" || product.tone === "plum" || product.tone === "clay" ? 3 : 2
  const notesTxt = product.notes.join("  ·  ")
  const nameSize = product.name.length > 15 ? 11 : product.name.length > 11 ? 13.5 : 16
  const body = "M31 26 L169 26 C173 70 177 140 179 220 C180 250 179 268 172 276 C166 282 150 283 100 283 C50 283 34 282 28 276 C21 268 20 250 21 220 C23 140 27 70 31 26 Z"
  return (
    <div className={`coffee-bag kb kb2 ${product.tone} ${large ? "large" : ""}`}>
      <svg viewBox="0 0 200 290" role="img" aria-label={`Bolsa de ${product.name}`}>
        <defs>
          <clipPath id={`b${uid}`}><path d={body} /></clipPath>
          <linearGradient id={`h${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".38" />
            <stop offset=".1" stopColor="#000" stopOpacity=".08" />
            <stop offset=".24" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".34" stopColor="#fff" stopOpacity=".06" />
            <stop offset=".62" stopColor="#000" stopOpacity="0" />
            <stop offset=".86" stopColor="#000" stopOpacity=".12" />
            <stop offset="1" stopColor="#000" stopOpacity=".42" />
          </linearGradient>
          <linearGradient id={`v${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".3" />
            <stop offset=".08" stopColor="#000" stopOpacity="0" />
            <stop offset=".82" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".35" />
          </linearGradient>
          <linearGradient id={`s${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor={col.st} />
            <stop offset="1" stopColor="#fbf4e8" />
          </linearGradient>
          <pattern id={`c${uid}`} width="3" height="20" patternUnits="userSpaceOnUse">
            <rect width="1.5" height="20" fill="#000" opacity=".22" />
            <rect x="1.5" width="1.5" height="20" fill="#fff" opacity=".1" />
          </pattern>
          <filter id={`n${uid}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed={product.id} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .14 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id={`t${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={col.st} stopOpacity=".55" />
            <stop offset=".35" stopColor={col.st} stopOpacity=".12" />
            <stop offset="1" stopColor="#fbf4e8" stopOpacity="0" />
          </linearGradient>
          <filter id={`w${uid}`}><feGaussianBlur stdDeviation="2.2" /></filter>
          <filter id={`l${uid}`} x="-10%" y="-10%" width="120%" height="125%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodColor="#000" floodOpacity=".28" />
          </filter>
        </defs>

        {/* cuerpo */}
        <path d={body} fill={col.c} />
        <g clipPath={`url(#b${uid})`}>
          <rect width="200" height="290" fill="#fff" filter={`url(#n${uid})`} />
          {/* arrugas y pliegues */}
          <g filter={`url(#w${uid})`} fill="none" strokeLinecap="round">
            <path d="M48 40 C52 90 46 150 52 230" stroke="#fff" strokeOpacity=".16" strokeWidth="5" />
            <path d="M150 44 C146 100 154 170 148 250" stroke="#000" strokeOpacity=".16" strokeWidth="6" />
            <path d="M30 248 C70 266 130 266 170 248" stroke="#000" strokeOpacity=".3" strokeWidth="7" />
            <path d="M40 34 C70 44 130 44 162 34" stroke="#000" strokeOpacity=".25" strokeWidth="5" />
            <path d="M64 236 L84 262 M136 236 L118 262" stroke="#000" strokeOpacity=".14" strokeWidth="4" />
          </g>
          <rect width="200" height="290" fill={`url(#h${uid})`} />
          <rect width="200" height="290" fill={`url(#v${uid})`} />
        </g>

        {/* cierre termosellado */}
        <path d="M29 6 L171 6 L170 28 L30 28 Z" fill={col.c} />
        <path d="M29 6 L171 6 L170 28 L30 28 Z" fill={`url(#c${uid})`} />
        <path d="M29 6 L171 6 L170 28 L30 28 Z" fill={`url(#h${uid})`} />
        <line x1="30" y1="28" x2="170" y2="28" stroke="#000" strokeOpacity=".3" />
        <circle cx="100" cy="15" r="3.2" fill="#000" fillOpacity=".55" />
        <path d="M30 18 l5 -2 v4 Z M170 18 l-5 -2 v4 Z" fill="#000" fillOpacity=".4" />

        {/* marca impresa */}
        <g fill={col.ink} fontFamily="Quicksand, sans-serif" textAnchor="middle">
          <text x="100" y="64" fontSize="28" fontWeight="700" letterSpacing="2">kiln</text>
          <text x="100" y="77" fontSize="5.4" fontWeight="700" letterSpacing="2.4" opacity=".75">TOSTADORES · POBLENOU</text>
          <circle cx="100" cy="90" r="4.5" fill="none" stroke={col.ink} strokeOpacity=".6" />
          <path d="M100 93c-1.8 0-2.7-1.4-2.2-2.7.4-.9 1.3-1.3 1.3-2.7 1.4.9 2.7 2.2 2.7 3.6 0 1-.9 1.8-1.8 1.8Z" fill={col.st} />
        </g>

        {/* etiqueta troquelada en arco */}
        <g filter={`url(#l${uid})`}>
          <path d="M40 244 V138 A60 32 0 0 1 160 138 V244 Z" fill="#fbf4e8" />
        </g>
        <path d="M40 244 V138 A60 32 0 0 1 160 138 V244 Z" fill={`url(#t${uid})`} />
        <path d="M44.5 239.5 V139 A55.5 28.5 0 0 1 155.5 139 V239.5 Z" fill="none" stroke="#3a2e26" strokeOpacity=".35" strokeWidth=".6" />
        <path d="M47 237 V139.5 A53 26.5 0 0 1 153 139.5 V237 Z" fill="none" stroke="#3a2e26" strokeOpacity=".2" strokeWidth=".4" />
        <path id={`a${uid}`} d="M56 142 A44 21 0 0 1 144 142" fill="none" />
        <g fontFamily="Quicksand, sans-serif" fill="#3a2e26" textAnchor="middle">
          <text fontSize="5.2" fontWeight="700" letterSpacing="1.8" opacity=".75">
            <textPath href={`#a${uid}`} startOffset="50%">{product.process === "Mezcla" ? "MEZCLA DE LA CASA" : "CAFÉ DE ORIGEN"}</textPath>
          </text>
          <circle cx="100" cy="141" r="6.5" fill={col.c} />
          <text x="100" y="143.6" fontSize="7" fontWeight="700" fill={col.ink}>K</text>
          <text x="100" y="166" fontSize={nameSize} fontWeight="700" letterSpacing="-.2">{product.name}</text>
          <text x="100" y="177" fontSize="6.2" fontWeight="600" opacity=".7">{product.origin}</text>
          <g opacity=".45" stroke="#3a2e26" strokeWidth=".6">
            <line x1="62" y1="185" x2="94" y2="185" />
            <line x1="106" y1="185" x2="138" y2="185" />
          </g>
          <rect x="97.6" y="182.6" width="4.8" height="4.8" transform="rotate(45 100 185)" fill={col.c} />
          <text x="100" y="198" fontSize={notesTxt.length > 36 ? 4.8 : 5.6} fontWeight="700" fill="#9a4f35">{notesTxt}</text>
          <line x1="47" y1="207" x2="153" y2="207" stroke="#3a2e26" strokeOpacity=".2" strokeWidth=".6" />
          <line x1="82" y1="211" x2="82" y2="233" stroke="#3a2e26" strokeOpacity=".2" strokeWidth=".6" />
          <line x1="118" y1="211" x2="118" y2="233" stroke="#3a2e26" strokeOpacity=".2" strokeWidth=".6" />
          <g fontSize="4.2" fontWeight="700" letterSpacing="1" opacity=".55">
            <text x="64.5" y="217">PROCESO</text>
            <text x="100" y="217">TUESTE</text>
            <text x="135.5" y="217">LOTE</text>
          </g>
          <text x="64.5" y="228" fontSize={product.process.length > 10 ? 4.4 : 6} fontWeight="700">{product.process}</text>
          {[0, 1, 2, 3, 4].map((k) => (
            <circle key={k} cx={92 + k * 4} cy="226" r="1.4" fill={k < roast ? "#3a2e26" : "none"} stroke="#3a2e26" strokeWidth=".5" />
          ))}
          <text x="135.5" y="228" fontSize="6" fontWeight="700">Nº {lot}</text>
        </g>
        <path d="M40 244 V138 A60 32 0 0 1 160 138 V244 Z" fill={`url(#h${uid})`} opacity=".3" />
        <text x="100" y="256" fontFamily="Quicksand, sans-serif" fontSize="6.4" fontWeight="700" letterSpacing="1.5" textAnchor="middle" fill={col.ink} opacity=".8">250 g · GRANO ENTERO</text>


        <text x="100" y="270" fontFamily="Quicksand, sans-serif" fontSize="5.4" fontWeight="700" letterSpacing="2" textAnchor="middle" fill={col.ink} opacity=".6">BARCELONA · 22@</text>
      </svg>
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

  const addToCart = (product: Product, size = "250g", qty = 1) => {
    setCart((current) => {
      const found = current.find(
        (item) => item.product.id === product.id && item.size === size,
      )
      return found
        ? current.map((item) =>
            item === found ? { ...item, qty: item.qty + qty } : item,
          )
        : [...current, { product, qty, size }]
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
        onFilter={(f) => { setFilter(f); navigate("shop") }}
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
            onProduct={openProduct}
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
  onFilter,
  onCart,
}: {
  onFilter: (f: string) => void
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
  const [coffeeOpen, setCoffeeOpen] = useState(false)
  const coffeeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!coffeeOpen) return
    const close = (e: MouseEvent) => {
      if (!coffeeRef.current?.contains(e.target as Node)) setCoffeeOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setCoffeeOpen(false)
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [coffeeOpen])

  useEffect(() => { if (hidden) setCoffeeOpen(false) }, [hidden])

  const coffeeMenu = [
    { title: "Todo el café", items: ["Todos", "Cápsulas", "Para la oficina", "Packs de descubrimiento", "Suscripción en casa"] },
    { title: "Por método", items: ["Filtro", "Espresso", "Prensa francesa", "Cafetera de goteo", "Cold brew y concentrado"] },
    { title: "Por proceso", items: ["Lavado", "Semilavado", "Fermentación asistida", "Natural"] },
    { title: "Por colección", items: ["Cafés de la casa", "Selección de temporada", "Microlotes", "Edición Poblenou"] },
  ]

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
          <div className="coffee-menu-wrap" ref={coffeeRef}>
            <button
              className={page === "shop" || coffeeOpen ? "active" : ""}
              onClick={() => setCoffeeOpen(!coffeeOpen)}
              aria-expanded={coffeeOpen}
              aria-haspopup="true"
            >
              Café
            </button>
            <div className={`coffee-menu ${coffeeOpen ? "open" : ""}`} role="menu">
              {coffeeMenu.map((col) => (
                <div key={col.title} className="coffee-menu-col">
                  <p>{col.title}</p>
                  {col.items.map((item) => (
                    <a
                      key={item}
                      href="#"
                      role="menuitem"
                      onClick={(e) => { e.preventDefault(); setCoffeeOpen(false); onFilter(item) }}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
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
          ].map(({ c, badge, tone, line }) => (
            <article key={c.id} className={`k-drop-card ${tone}`} onClick={() => onProduct(c)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onProduct(c)}>
              <div className="ks-tags">
                <span className="ks-tag new">{badge}</span>
                <span className={`ks-tag ${tagTone[coffeeMeta[c.id].collection]}`}>{coffeeMeta[c.id].collection}</span>
              </div>
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
              <div className="k-card-visual"><Tags product={c} /><CoffeeBag product={c} /></div>
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
            <h2 className="hm-slide-title" aria-label={sl.title}>
              {sl.title.split(" ").map((w, wi) => (
                <span key={wi} className="hm-word" aria-hidden="true">
                  {w.split("").map((ch, ci) => <span key={ci} className="hm-char">{ch}</span>)}
                </span>
              ))}
            </h2>
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

type Meta = {
  methods: string[]
  collection: string
  formats: string[]
  isNew?: boolean
  best?: boolean
  added: number
}

const coffeeMeta: Record<number, Meta> = {
  1: { methods: ["Filtro", "Espresso", "Prensa francesa", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Para la oficina", "Suscripción en casa"], best: true, added: 1 },
  2: { methods: ["Filtro", "Cafetera de goteo"], collection: "Selección de temporada", formats: ["Grano", "Packs de descubrimiento"], isNew: true, added: 7 },
  3: { methods: ["Filtro", "Cold brew y concentrado"], collection: "Microlotes", formats: ["Grano", "Packs de descubrimiento"], isNew: true, added: 8 },
  4: { methods: ["Espresso", "Prensa francesa"], collection: "Selección de temporada", formats: ["Grano", "Cápsulas"], added: 4 },
  5: { methods: ["Espresso", "Prensa francesa", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Cápsulas", "Para la oficina", "Suscripción en casa"], best: true, added: 2 },
  6: { methods: ["Filtro", "Espresso"], collection: "Edición Poblenou", formats: ["Grano", "Suscripción en casa"], added: 3 },
  7: { methods: ["Filtro", "Espresso", "Cold brew y concentrado"], collection: "Microlotes", formats: ["Grano"], isNew: true, added: 9 },
  8: { methods: ["Filtro", "Cafetera de goteo"], collection: "Edición Poblenou", formats: ["Grano", "Packs de descubrimiento"], isNew: true, added: 6 },
  9: { methods: ["Filtro", "Prensa francesa"], collection: "Microlotes", formats: ["Grano", "Packs de descubrimiento"], isNew: true, added: 10 },
  10: { methods: ["Espresso", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Para la oficina", "Cápsulas", "Suscripción en casa"], best: true, added: 2 },
  11: { methods: ["Espresso"], collection: "Cafés de la casa", formats: ["Cápsulas", "Para la oficina", "Suscripción en casa"], added: 3 },
  12: { methods: ["Cold brew y concentrado"], collection: "Edición Poblenou", formats: ["Para la oficina"], isNew: true, added: 11 },
  13: { methods: ["Filtro", "Espresso", "Prensa francesa"], collection: "Selección de temporada", formats: ["Packs de descubrimiento", "Suscripción en casa"], isNew: true, added: 12 },
  14: { methods: ["Espresso", "Prensa francesa", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Cápsulas", "Para la oficina"], added: 1 },
  15: { methods: ["Filtro", "Cold brew y concentrado"], collection: "Microlotes", formats: ["Grano"], isNew: true, added: 13 },
  16: { methods: ["Filtro", "Cafetera de goteo"], collection: "Selección de temporada", formats: ["Grano", "Packs de descubrimiento", "Suscripción en casa"], added: 5 },
  17: { methods: ["Filtro", "Cafetera de goteo"], collection: "Selección de temporada", formats: ["Grano", "Packs de descubrimiento"], added: 0 },
  18: { methods: ["Filtro", "Espresso"], collection: "Microlotes", formats: ["Grano"], added: 1 },
  19: { methods: ["Filtro", "Cold brew y concentrado"], collection: "Selección de temporada", formats: ["Grano", "Suscripción en casa"], added: 2 },
  20: { methods: ["Espresso", "Prensa francesa", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Para la oficina", "Suscripción en casa"], added: 3 },
  21: { methods: ["Filtro", "Espresso"], collection: "Selección de temporada", formats: ["Grano", "Packs de descubrimiento"], added: 4 },
  22: { methods: ["Espresso", "Prensa francesa"], collection: "Cafés de la casa", formats: ["Grano", "Cápsulas", "Para la oficina"], best: true, added: 5 },
  23: { methods: ["Filtro", "Espresso"], collection: "Microlotes", formats: ["Grano"], added: 6 },
  24: { methods: ["Filtro", "Prensa francesa"], collection: "Edición Poblenou", formats: ["Grano", "Packs de descubrimiento"], added: 7 },
  25: { methods: ["Filtro", "Cafetera de goteo"], collection: "Microlotes", formats: ["Grano"], added: 8 },
  26: { methods: ["Filtro"], collection: "Microlotes", formats: ["Grano", "Packs de descubrimiento"], added: 9 },
  27: { methods: ["Espresso", "Prensa francesa", "Cafetera de goteo", "Cold brew y concentrado"], collection: "Cafés de la casa", formats: ["Grano", "Cápsulas", "Para la oficina", "Suscripción en casa"], best: true, added: 10 },
  28: { methods: ["Espresso", "Filtro", "Cafetera de goteo"], collection: "Cafés de la casa", formats: ["Grano", "Cápsulas", "Suscripción en casa"], added: 11 },
  29: { methods: ["Prensa francesa", "Espresso"], collection: "Selección de temporada", formats: ["Grano", "Para la oficina"], added: 12 },
  30: { methods: ["Filtro", "Cold brew y concentrado"], collection: "Edición Poblenou", formats: ["Grano", "Packs de descubrimiento"], added: 20 },
  31: { methods: ["Espresso", "Filtro", "Cafetera de goteo"], collection: "Edición Poblenou", formats: ["Grano", "Cápsulas", "Suscripción en casa"], best: true, added: 21 },
  32: { methods: ["Filtro", "Prensa francesa"], collection: "Selección de temporada", formats: ["Grano", "Suscripción en casa"], added: 22 },
  33: { methods: ["Filtro", "Cafetera de goteo"], collection: "Selección de temporada", formats: ["Grano", "Packs de descubrimiento"], added: 23 },
  34: { methods: ["Cold brew y concentrado"], collection: "Cafés de la casa", formats: ["Para la oficina", "Suscripción en casa"], added: 24 },
  35: { methods: ["Espresso", "Prensa francesa", "Cafetera de goteo"], collection: "Edición Poblenou", formats: ["Grano", "Cápsulas", "Para la oficina"], added: 25 },
}

const filterGroups: { key: string; label: string; options: string[]; get: (p: Product) => string[] }[] = [
  { key: "method", label: "Método", options: ["Filtro", "Espresso", "Prensa francesa", "Cafetera de goteo", "Cold brew y concentrado"], get: (p) => coffeeMeta[p.id].methods },
  { key: "process", label: "Proceso", options: ["Lavado", "Semilavado", "Fermentación asistida", "Natural", "Mezcla"], get: (p) => [p.process] },
  { key: "collection", label: "Colección", options: ["Cafés de la casa", "Selección de temporada", "Microlotes", "Edición Poblenou"], get: (p) => [coffeeMeta[p.id].collection] },
  { key: "format", label: "Formato", options: ["Cápsulas", "Para la oficina", "Packs de descubrimiento", "Suscripción en casa"], get: (p) => coffeeMeta[p.id].formats },
]

const tagTone: Record<string, string> = {
  Novedad: "new",
  "Más vendido": "best",
  "Cafés de la casa": "house",
  "Selección de temporada": "season",
  Microlotes: "micro",
  "Edición Poblenou": "poble",
}

function tagsFor(p: Product) {
  const m = coffeeMeta[p.id]
  return [m.isNew ? "Novedad" : m.best ? "Más vendido" : null, m.collection].filter(Boolean) as string[]
}

function Tags({ product }: { product: Product }) {
  return (
    <div className="ks-tags">
      {tagsFor(product).map((t) => (
        <span key={t} className={`ks-tag ${tagTone[t] ?? ""}`}>{t}</span>
      ))}
    </div>
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
  return (
    <article className="ks-card">
      <button className={`ks-visual ${product.tone}`} onClick={() => onOpen(product)} aria-label={`Ver ${product.name}`}>
        <Tags product={product} />
        <CoffeeBag product={product} />
      </button>
      <div className="ks-info">
        <div>
          <button className="ks-name" onClick={() => onOpen(product)}>{product.name}</button>
          <p className="ks-origin">{product.origin} · {product.process}</p>
          <p className="ks-notes">{product.notes.join(" + ")}</p>
        </div>
        <div className="ks-buy">
          <span>{product.price} €</span>
          <button onClick={() => onAdd(product)} aria-label={`Añadir ${product.name} a la cesta`}>Añadir</button>
        </div>
      </div>
    </article>
  )
}

function ShopFeatured({ onProduct }: { onProduct: (p: Product) => void }) {
  const items = [...coffees].filter((c) => coffeeMeta[c.id].isNew).sort((a, b) => coffeeMeta[b.id].added - coffeeMeta[a.id].added)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = (d: number) => setI((v) => (v + d + items.length) % items.length)
  const cur = items[i]

  return (
    <section className="ks-featured">
      <p className="ks-kicker">Novedades en la colección</p>
      <div className="ks-stage">
        {items.map((c, n) => {
          const half = Math.floor(items.length / 2)
          const off = ((n - i + items.length + half) % items.length) - half
          return (
            <button
              key={c.id}
              className={`ks-slide ${c.tone} ${off === 0 ? "active" : ""} ${Math.abs(off) > 3 ? "far" : ""}`}
              style={{ "--off": off } as React.CSSProperties}
              onMouseEnter={off === 0 ? () => setPaused(true) : undefined}
              onMouseLeave={() => setPaused(false)}
              onClick={() => (off === 0 ? onProduct(c) : (setPaused(false), setI(n)))}
              aria-label={off === 0 ? `Ver ${c.name}` : `Mostrar ${c.name}`}
              tabIndex={Math.abs(off) > 2 ? -1 : 0}
            >
              <Tags product={c} />
              <CoffeeBag product={c} />
            </button>
          )
        })}
        <button className="hm-arrow prev ks-arrow" onClick={() => go(-1)} aria-label="Anterior">
          <svg viewBox="0 0 24 48"><path d="M20 4L4 24l16 20" /></svg>
        </button>
        <button className="hm-arrow next ks-arrow" onClick={() => go(1)} aria-label="Siguiente">
          <svg viewBox="0 0 24 48"><path d="M4 4l16 20L4 44" /></svg>
        </button>
      </div>
      <div className={`ks-dots ${paused ? "paused" : ""}`}>
        {items.map((c, n) => (
          <button key={c.id} className={n === i ? "on" : ""} onClick={() => { setPaused(false); setI(n) }} aria-label={`Ir a ${c.name}`}>
            <i key={n === i ? `on-${i}` : "off"} onAnimationEnd={n === i ? () => go(1) : undefined} />
          </button>
        ))}
      </div>
      <div className="ks-feat-meta">
        <p>{cur.notes.join(" + ")}</p>
      </div>
      <h2 key={cur.id} className="ks-feat-title">{cur.origin.split(",").pop()?.trim()} — {cur.name}</h2>
      <button className="k-btn light ks-feat-cta" onClick={() => onProduct(cur)}>Descubrir este café <Arrow /></button>
    </section>
  )
}

const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "new", label: "Novedades" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name", label: "Nombre A–Z" },
]

function SortMenu({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc) }
  }, [open])
  const current = sortOptions.find((o) => o.value === value) ?? sortOptions[0]
  return (
    <div className="ks-sort" ref={ref}>
      <span className="ks-sort-label">Ordenar por</span>
      <button className={`ks-sort-btn ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open}>
        {current.label}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <ul className={`ks-sort-menu ${open ? "open" : ""}`} role="listbox">
        {sortOptions.map((o) => (
          <li key={o.value}>
            <button role="option" aria-selected={o.value === value} className={o.value === value ? "on" : ""} onClick={() => { onChange(o.value); setOpen(false) }}>
              {o.label}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
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
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [sort, setSort] = useState("featured")
  const [panel, setPanel] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Sincroniza la selección que llega desde el menú de la navbar
  useEffect(() => {
    const group = filterGroups.find((g) => g.options.includes(filter))
    setSelected(group ? { [group.key]: [filter] } : {})
    if (group) window.setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 450)
  }, [filter])

  const toggle = (key: string, opt: string) =>
    setSelected((s) => {
      const cur = s[key] ?? []
      const next = cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]
      return { ...s, [key]: next }
    })
  const clear = () => { setSelected({}); setFilter("Todos") }

  const active = filterGroups.flatMap((g) => (selected[g.key] ?? []).map((o) => ({ key: g.key, o })))
  const list = coffees
    .filter((p) => filterGroups.every((g) => {
      const sel = selected[g.key] ?? []
      return sel.length === 0 || g.get(p).some((v) => sel.includes(v))
    }))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price
      if (sort === "price-desc") return b.price - a.price
      if (sort === "new") return coffeeMeta[b.id].added - coffeeMeta[a.id].added
      if (sort === "name") return a.name.localeCompare(b.name)
      return Number(!!coffeeMeta[b.id].best) - Number(!!coffeeMeta[a.id].best)
    })

  return (
    <div className="ks-page">
      <ShopFeatured onProduct={onProduct} />

      <section className="ks-all" ref={gridRef}>
        <div className="ks-head">
          <div>
            <span className="k-tag">Tostado cada semana · Poblenou</span>
            <h1>Todo el café</h1>
            <p>Café de especialidad recién tostado para espresso o filtro.</p>
          </div>
          <div className="ks-controls">
            <SortMenu value={sort} onChange={setSort} />
            <button className={`ks-filter-btn ${panel ? "open" : ""}`} onClick={() => setPanel(!panel)} aria-expanded={panel}>
              Filtros{active.length > 0 && <b>{active.length}</b>}
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
          </div>
        </div>

        <div className={`ks-panel ${panel ? "open" : ""}`}>
          <div className="ks-panel-inner">
            {filterGroups.map((g) => (
              <div key={g.key} className="ks-group">
                <p>{g.label}</p>
                {g.options.map((o) => {
                  const on = (selected[g.key] ?? []).includes(o)
                  const count = coffees.filter((p) => g.get(p).includes(o)).length
                  return (
                    <button key={o} className={on ? "on" : ""} onClick={() => toggle(g.key, o)} disabled={count === 0}>
                      <i aria-hidden="true" />{o}<small>{count}</small>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="ks-active">
          <span>{list.length} {list.length === 1 ? "café" : "cafés"}</span>
          {active.map(({ key, o }) => (
            <button key={key + o} onClick={() => toggle(key, o)}>{o} <span aria-hidden="true">×</span></button>
          ))}
          {active.length > 0 && <button className="ks-clear" onClick={clear}>Limpiar filtros</button>}
        </div>

        {list.length > 0 ? (
          <div className="ks-grid">
            {list.map((c) => (
              <ProductCard key={c.id} product={c} onOpen={onProduct} onAdd={onAdd} />
            ))}
          </div>
        ) : (
          <div className="ks-empty">
            <p>Ningún café coincide con estos filtros.</p>
            <button className="k-btn" onClick={clear}>Ver todo el café <Arrow /></button>
          </div>
        )}
      </section>

      <section className="ks-note">
        <span className="k-tag">Tostado bajo pedido</span>
        <p>Los pedidos hasta el lunes se tuestan y salen el martes. El resto viaja con el tueste del viernes.</p>
      </section>
    </div>
  )
}

function productDetails(p: Product) {
  const n = p.id
  const farms = ["Familia Rodríguez", "Cooperativa local", "Finca de altura", "Colectivo de pequeños productores", "Familia Mutua", "Estación de lavado comunitaria"]
  const varieties = ["Caturra y Castillo", "SL28 y SL34", "Heirloom etíope", "Bourbon rojo", "Catuaí y Mundo Novo", "Geisha", "Pacamara", "Typica"]
  const alt = 1400 + ((n * 137) % 700)
  const isBlend = p.process === "Mezcla"
  return {
    producer: isBlend ? "Varios productores" : farms[n % farms.length],
    variety: isBlend ? "Mezcla de varietales" : varieties[n % varieties.length],
    altitude: `${alt}–${alt + 200} m`,
    harvest: ["Octubre – Enero", "Noviembre – Febrero", "Mayo – Agosto"][n % 3],
    story: isBlend
      ? `${p.name} es nuestra respuesta al café de cada día: orígenes que se complementan para dar una taza redonda, dulce y fácil de querer, tanto sola como con leche.`
      : `Este lote de ${p.origin} llega de pequeñas fincas que trabajan a mano. Las cerezas maduras se seleccionan una a una y el proceso ${p.process.toLowerCase()} subraya notas de ${p.notes[0].toLowerCase()} y ${p.notes[1].toLowerCase()}.`,
    filter: { dose: `${14 + (n % 3)} g`, water: `${(14 + (n % 3)) * 16} g`, ratio: "1:16", time: `${["2:45", "3:00", "3:15"][n % 3]} min`, temp: `${93 + (n % 3)} °C` },
    espresso: { dose: `${18 + (n % 2)} g`, yield: `${38 + (n % 3) * 2} g`, time: `${27 + (n % 4)}–${29 + (n % 4)} segundos`, temp: `${(92.5 + (n % 3) * 0.5).toFixed(1)} °C`, pressure: "9 bar" },
  }
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`kp-acc ${open ? "open" : ""}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        {title}
        <span aria-hidden="true" />
      </button>
      <div className="kp-acc-body"><div>{children}</div></div>
    </div>
  )
}

function ProductPage({
  product,
  onAdd,
  onNavigate,
  onProduct,
}: {
  product: Product
  onAdd: (p: Product, size: string, qty: number) => void
  onNavigate: (p: Page) => void
  onProduct: (p: Product) => void
}) {
  const [size, setSize] = useState("250g")
  const [grind, setGrind] = useState("En grano")
  const [qty, setQty] = useState(1)
  const [slide, setSlide] = useState(0)
  const d = productDetails(product)
  const unit = size === "1kg" ? Math.round(product.price * 3.2) : product.price
  const total = unit * qty
  const points = total * 10
  const slides = ["bag", images.cup, images.farm, images.method]

  useEffect(() => {
    setQty(1); setSize("250g"); setSlide(0)
  }, [product.id])
  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500)
    return () => window.clearInterval(t)
  }, [product.id, slides.length])

  const related = coffees.filter((c) => c.id !== product.id && (c.process === product.process || coffeeMeta[c.id].collection === coffeeMeta[product.id].collection)).slice(0, 3)

  return (
    <div className="kp-page">
      <div className="kp-top">
        <div className="kp-gallery">
          <div className={`kp-stage ks-visual ${product.tone}`}>
            {slides.map((s, n) => (
              <div key={n} className={`kp-slide ${n === slide ? "on" : ""}`}>
                {s === "bag" ? <CoffeeBag product={product} large /> : <img src={s} alt="" />}
              </div>
            ))}
            <Tags product={product} />
            <div className="kp-dots">
              {slides.map((_, n) => (
                <button key={n} className={n === slide ? "on" : ""} onClick={() => setSlide(n)} aria-label={`Imagen ${n + 1}`}><i /></button>
              ))}
            </div>
          </div>
          <div className="kp-thumbs">
            {slides.map((s, n) => (
              <button key={n} className={`ks-visual ${product.tone} ${n === slide ? "on" : ""}`} onClick={() => setSlide(n)} aria-label={`Ver imagen ${n + 1}`}>
                {s === "bag" ? <CoffeeBag product={product} /> : <img src={s} alt="" />}
              </button>
            ))}
          </div>
        </div>

        <section className="kp-buy">
          <button className="kp-back" onClick={() => onNavigate("shop")}>← Todo el café</button>
          <span className="k-tag">{product.origin} · {product.process}</span>
          <h1>{product.name}</h1>
          <p className="kp-notes">{product.notes.join(" + ")}</p>
          <p className="kp-story">{d.story}</p>

          <div className="kp-opt">
            <div className="kp-opt-head"><span>Tamaño</span><small>{size === "250g" ? "aprox. 15 tazas" : "aprox. 60 tazas"}</small></div>
            <div className="kp-chips">
              {["250g", "1kg"].map((v) => (
                <button key={v} className={size === v ? "on" : ""} onClick={() => setSize(v)}>
                  {v === "250g" ? "250 g" : "1 kg"}
                  <small>{v === "1kg" ? Math.round(product.price * 3.2) : product.price} €</small>
                </button>
              ))}
            </div>
          </div>

          <div className="kp-opt">
            <div className="kp-opt-head"><span>Molienda</span><small>Según tu cafetera</small></div>
            <div className="kp-chips wrap">
              {["En grano", "Espresso", "Filtro", "Prensa francesa"].map((g) => (
                <button key={g} className={grind === g ? "on" : ""} onClick={() => setGrind(g)}>{g}</button>
              ))}
            </div>
          </div>

          <div className="kp-opt">
            <div className="kp-opt-head"><span>Cantidad</span><small>{qty} {qty === 1 ? "paquete" : "paquetes"}</small></div>
            <div className="kp-qty-row">
              <div className="kp-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty === 1} aria-label="Quitar un paquete">−</button>
                <span key={qty}>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty === 10} aria-label="Añadir un paquete">+</button>
              </div>
              <button className="kp-add" onClick={() => onAdd(product, size, qty)}>
                Añadir a la cesta <b>{total} €</b>
              </button>
            </div>
          </div>

          <div className="kp-points">
            <span className="kp-points-badge">★</span>
            <p>Con este pedido ganarás <strong key={points}>{points} puntos</strong> para el Club Kiln.</p>
            <small>10 puntos por cada euro</small>
          </div>

          <div className="kp-perks">
            <span>Tostado el martes</span>
            <span>Envío gratis desde 35 €</span>
            <span>Sale en 1–2 días</span>
          </div>

          <div className="kp-accs">
            <Accordion title="Origen" defaultOpen>
              <p>{d.story}</p>
              <dl>
                <div><dt>Productor</dt><dd>{d.producer}</dd></div>
                <div><dt>Región</dt><dd>{product.origin}</dd></div>
                <div><dt>Variedad</dt><dd>{d.variety}</dd></div>
                <div><dt>Altitud</dt><dd>{d.altitude}</dd></div>
                <div><dt>Proceso</dt><dd>{product.process}</dd></div>
                <div><dt>Cosecha</dt><dd>{d.harvest}</dd></div>
              </dl>
            </Accordion>
            <Accordion title="Receta de preparación">
              <h4>Espresso</h4>
              <ul className="kp-recipe">
                <li><b>Dosis:</b> {d.espresso.dose}</li>
                <li><b>Rendimiento:</b> {d.espresso.yield}</li>
                <li><b>Tiempo de extracción:</b> {d.espresso.time}</li>
                <li><b>Temperatura:</b> {d.espresso.temp}</li>
                <li><b>Presión:</b> {d.espresso.pressure}</li>
              </ul>
              <h4>Filtro (V60)</h4>
              <ul className="kp-recipe">
                <li><b>Dosis:</b> {d.filter.dose}</li>
                <li><b>Agua:</b> {d.filter.water}</li>
                <li><b>Ratio:</b> {d.filter.ratio}</li>
                <li><b>Tiempo total:</b> {d.filter.time}</li>
                <li><b>Temperatura:</b> {d.filter.temp}</li>
              </ul>
            </Accordion>
            <Accordion title="Notas de cata">
              <p>Una taza de {product.notes[0].toLowerCase()} al principio, con {product.notes[1].toLowerCase()} en el centro y un final largo de {product.notes[2].toLowerCase()}.</p>
            </Accordion>
            <Accordion title="Envío y frescura">
              <p>Tostamos los martes y viernes en Poblenou. Recomendamos dejar reposar el café 5–7 días tras el tueste y consumirlo antes de 6 semanas. Envío gratis en pedidos desde 35 €.</p>
            </Accordion>
          </div>
        </section>
      </div>

      {related.length > 0 && (
        <section className="kp-related">
          <div className="kp-related-head">
            <h2>También te puede gustar</h2>
            <button className="k-btn" onClick={() => onNavigate("shop")}>Ver todo el café <Arrow /></button>
          </div>
          <div className="ks-grid">
            {related.map((c) => (
              <ProductCard key={c.id} product={c} onOpen={onProduct} onAdd={(p) => onAdd(p, "250g", 1)} />
            ))}
          </div>
        </section>
      )}
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
