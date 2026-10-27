export type GrindOption =
  | "En grano"
  | "Filtro / V60"
  | "Aeropress"
  | "Espresso"
  | "Italiana (Moka)"
  | "Prensa francesa"

export type BagSizeOption = "250g" | "500g" | "1kg"

export type CoffeeLot = {
  id: string
  no: string
  name: string
  subtitle: string
  origin: string
  country: "Etiopía" | "Colombia" | "Panamá" | "Kenia" | "Ruanda" | "Guatemala" | "Perú" | "Brasil"
  region: string
  producer: string
  altitude: string
  variety: string
  process: "Lavado" | "Natural" | "Maceración carbónica" | "Honey / Semilavado" | "Ensamblaje"
  roast: "Filtro" | "Espresso" | "Omnitueste"
  category: "Microlote" | "Cosecha Estacional" | "Reserva Competición" | "Casa & Espresso" | "Formatos"
  score: string
  price250: number
  tone: "ivory" | "noir" | "stone" | "oxblood" | "olive" | "smoke" | "terracotta" | "sand"
  harvestMonth: string
  lotAllocationKg: number
  fobPriceUsd: string
  farmGatePremium: string
  moistureContent: string
  waterActivity: string
  densityGml: string
  roasterMachine: string
  developmentTimeRatio: string
  endTempCelsius: string
  notes: [string, string, string]
  tastingParagraph: string
  story: string
  agronomy: string
  sensory: {
    acidity: number // 1-10
    sweetness: number // 1-10
    body: number // 1-10
    floral: number // 1-10
    clarity: number // 1-10
  }
  recipe: {
    method: string
    doseG: number
    waterMl: number
    tempC: number
    grindClicks: string
    totalTime: string
    steps: { time: string; water: string; note: string }[]
  }
}

export const GRIND_OPTIONS: { id: GrindOption; desc: string; microns: string }[] = [
  { id: "En grano", desc: "Recomendado para preservar compuestos aromáticos volátiles", microns: "Grano entero" },
  { id: "Filtro / V60", desc: "Molienda media-fina en Mahlkönig EK43S para cono y Kalita", microns: "650 – 750 μm" },
  { id: "Aeropress", desc: "Molienda media equilibrada para inmersión corta", microns: "550 – 650 μm" },
  { id: "Espresso", desc: "Calibrado fino para portafiltro de 58 mm (9 bares)", microns: "250 – 320 μm" },
  { id: "Italiana (Moka)", desc: "Punto fino-medio sin sobreextracción amarga", microns: "380 – 450 μm" },
  { id: "Prensa francesa", desc: "Molienda gruesa uniforme para inmersión completa", microns: "850 – 950 μm" },
]

export const BAG_SIZES: { id: BagSizeOption; label: string; multiplier: number; note: string }[] = [
  { id: "250g", label: "250 g", multiplier: 1, note: "Bolsa estándar · ~15 tazas" },
  { id: "500g", label: "500 g", multiplier: 1.9, note: "2 × 250 g o bolsa doble · −5%" },
  { id: "1kg", label: "1 kg", multiplier: 3.55, note: "Formato barista con válvula doble · −11%" },
]

export const PHOTOS = {
  homeHero: "https://images.unsplash.com/photo-1788311170929-5a461a7d9718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=2200",
  heroRoastery: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=2000&q=85",
  pourOverBar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85",
  roasterDrum: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=85",
  cuppingTable: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=85",
  farmCherries: "https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1600&q=85",
  studioCafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=85",
  espressoShot: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1400&q=85",
  greenCoffee: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=85",
}

export const COFFEE_LOTS: CoffeeLot[] = [
  {
    id: "halo-hartume",
    no: "01",
    name: "Halo Hartume",
    subtitle: "Lavado floral de altitud extrema en Gedeb",
    origin: "Gedeb · Yirgacheffe, Etiopía",
    country: "Etiopía",
    region: "Worka Sakaro, Distrito de Gedeb",
    producer: "240 pequeños caficultores locales",
    altitude: "2.150 – 2.280 m",
    variety: "74110 & 74112 (JARC)",
    process: "Lavado",
    roast: "Filtro",
    category: "Cosecha Estacional",
    score: "89.25",
    price250: 19.5,
    tone: "ivory",
    harvestMonth: "Enero 2026",
    lotAllocationKg: 280,
    fobPriceUsd: "10,40 $/kg",
    farmGatePremium: "+215% sobre mercado C",
    moistureContent: "10.6%",
    waterActivity: "0.54 aw",
    densityGml: "0.742 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "11.8% (1:04 min)",
    endTempCelsius: "203.4 °C",
    notes: ["Bergamota", "Melocotón blanco", "Flor de jazmín"],
    tastingParagraph:
      "Una expresión cristalina de Gedeb: entrada sedosa con fragancia inmediata a jazmín fresco, centro de boca de fruta de hueso blanca y un posgusto prolongado que recuerda al té Earl Grey frío.",
    story:
      "Procesado en la estación de lavado Halo Hartume, donde las cerezas maduras se despulpan en seco y fermentan en tanques de cerámica sumergidos en agua de manantial durante 48 horas antes de reposar 12 días en camas africanas bajo sombra parcial.",
    agronomy:
      "Suelos arcillosos rojizos ricos en hierro bajo bosque autóctono de falso banano (Enset) y albizia. Cultivo orgánico tradicional sin insumos sintéticos.",
    sensory: { acidity: 9, sweetness: 8, body: 5, floral: 10, clarity: 10 },
    recipe: {
      method: "Hario V60 02 (Papel blanqueado japonés)",
      doseG: 15,
      waterMl: 250,
      tempC: 94,
      grindClicks: "22 clics Comandante C40 (680 μm)",
      totalTime: "02:35",
      steps: [
        { time: "0:00 – 0:40", water: "45 ml", note: "Preinfusión suave en espiral; agitar ligeramente el cono." },
        { time: "0:40 – 1:20", water: "150 ml", note: "Primer vertido central continuo con caudal medio." },
        { time: "1:20 – 2:35", water: "250 ml", note: "Segundo vertido suave hasta el borde y drenaje plano." },
      ],
    },
  },
  {
    id: "karinga-ab",
    no: "02",
    name: "Karinga AB",
    subtitle: "Doble fermentación keniana vibrante y jugosa",
    origin: "Kiambu · Monte Kenia, Kenia",
    country: "Kenia",
    region: "Condado de Kiambu, faldas del Monte Kenia",
    producer: "Cooperativa Gitwe Farmers (480 socios)",
    altitude: "1.850 – 1.950 m",
    variety: "SL28 (70%) & SL34 (30%)",
    process: "Lavado",
    roast: "Filtro",
    category: "Microlote",
    score: "90.00",
    price250: 21.0,
    tone: "stone",
    harvestMonth: "Diciembre 2025",
    lotAllocationKg: 190,
    fobPriceUsd: "12,10 $/kg",
    farmGatePremium: "+240% sobre subasta Nairobi",
    moistureContent: "10.4%",
    waterActivity: "0.52 aw",
    densityGml: "0.758 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "12.2% (1:08 min)",
    endTempCelsius: "204.1 °C",
    notes: ["Grosella negra", "Pomelo rosa", "Ruibarbo"],
    tastingParagraph:
      "Acidez málica chispeante equilibrada por un dulzor denso de confitura de frutos del bosque. A medida que se atempera se abre hacia notas cítricas de pomelo rosado y panela.",
    story:
      "La fábrica Karinga utiliza aguas del río Chania para su clásico lavado keniano de doble fermentación (16h en seco + 24h con cambio de agua limpia) seguido de remojo en canales de clasificación por densidad.",
    agronomy:
      "Tierra volcánica kikuyu de gran drenaje. Selección genética pura de las selecciones Scott Agricultural Laboratories de los años 30.",
    sensory: { acidity: 10, sweetness: 9, body: 7, floral: 7, clarity: 9 },
    recipe: {
      method: "Kalita Wave 185 (Acero inoxidable)",
      doseG: 16,
      waterMl: 260,
      tempC: 95,
      grindClicks: "24 clics Comandante C40 (720 μm)",
      totalTime: "02:50",
      steps: [
        { time: "0:00 – 0:45", water: "50 ml", note: "Saturación uniforme de la cama plana." },
        { time: "0:45 – 1:30", water: "160 ml", note: "Pulso concéntrico manteniendo nivel de agua constante." },
        { time: "1:30 – 2:50", water: "260 ml", note: "Pulso final en el centro para realzar dulzor." },
      ],
    },
  },
  {
    id: "la-esmeralda-geisha",
    no: "03",
    name: "Hacienda La Esmeralda",
    subtitle: "Parcela Cañas Verdes · Geisha lavado de archivo",
    origin: "Boquete · Chiriquí, Panamá",
    country: "Panamá",
    region: "Cañas Verdes, Volcán Barú, Boquete",
    producer: "Familia Peterson",
    altitude: "1.780 m",
    variety: "Geisha Panameño",
    process: "Lavado",
    roast: "Filtro",
    category: "Reserva Competición",
    score: "92.50",
    price250: 44.0,
    tone: "noir",
    harvestMonth: "Febrero 2026",
    lotAllocationKg: 60,
    fobPriceUsd: "58,00 $/kg",
    farmGatePremium: "Trato directo en finca",
    moistureContent: "10.2%",
    waterActivity: "0.51 aw",
    densityGml: "0.765 g/ml",
    roasterMachine: "Ikawa Pro V3 / Loring S15",
    developmentTimeRatio: "10.9% (0:56 min)",
    endTempCelsius: "201.8 °C",
    notes: ["Flor de azahar", "Mandarina", "Té oolong"],
    tastingParagraph:
      "Un café de extraordinaria transparencia y perfume. Fragancia envolvente de azahar y madreselva; en boca es etéreo, con acidez cítrica de mandarina dulce y textura sedosa de té oolong taiwanés.",
    story:
      "La familia Peterson redescubrió el Geisha en las laderas altas de Boquete en 2004. Este micro-lote de la parcela Cañas Verdes se recolectó exclusivamente por encima de los 22 °Brix y se tostó con perfil ultraligero .",
    agronomy:
      "Microclima de bosque nuboso afectado por la brisa combinada del Pacífico y el Caribe, conocido localmente como el 'Bajareque'.",
    sensory: { acidity: 9, sweetness: 9, body: 5, floral: 10, clarity: 10 },
    recipe: {
      method: "Origami Dripper S (Filtro cónico Cafec Abaca)",
      doseG: 14,
      waterMl: 230,
      tempC: 93,
      grindClicks: "21 clics Comandante C40 (640 μm)",
      totalTime: "02:20",
      steps: [
        { time: "0:00 – 0:35", water: "40 ml", note: "Floración delicada para liberar terpenos florales." },
        { time: "0:35 – 1:15", water: "140 ml", note: "Vertido lento a baja altura sin turbulencia." },
        { time: "1:15 – 2:20", water: "230 ml", note: "Cierre central limpio." },
      ],
    },
  },
  {
    id: "los-nogales-bourbon",
    no: "04",
    name: "Finca Los Nogales",
    subtitle: "Bourbon Rosado de Pitalito · Jugoso y floral",
    origin: "Pitalito · Huila, Colombia",
    country: "Colombia",
    region: "Bruselas, Pitalito, Sur del Huila",
    producer: "Óscar Hernández",
    altitude: "1.820 m",
    variety: "Bourbon Rosado",
    process: "Lavado",
    roast: "Omnitueste",
    category: "Microlote",
    score: "88.75",
    price250: 20.5,
    tone: "terracotta",
    harvestMonth: "Noviembre 2025",
    lotAllocationKg: 240,
    fobPriceUsd: "11,20 $/kg",
    farmGatePremium: "+195% sobre precio base FNC",
    moistureContent: "10.8%",
    waterActivity: "0.55 aw",
    densityGml: "0.738 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "13.1% (1:14 min)",
    endTempCelsius: "205.2 °C",
    notes: ["Nectarina", "Miel de azahar", "Cacao fino"],
    tastingParagraph:
      "Versátil tanto en filtro como en espresso moderno (ratio 1:2.5). Despliega notas nítidas de nectarina madura y caramelo rubio con un fondo limpio de nibs de cacao.",
    story:
      "Óscar Hernández realiza una pre-fermentación en cereza de 24 horas antes del despulpado, seguida de una oxidación controlada que potencia los precursores aromáticos propios del Bourbon Rosado.",
    agronomy:
      "Cultivado en laderas escarpadas del Macizo Colombiano, donde confluyen corrientes térmicas cálidas del valle del Magdalena y vientos fríos andinos.",
    sensory: { acidity: 8, sweetness: 9, body: 7, floral: 8, clarity: 9 },
    recipe: {
      method: "V60 / Espresso Moderno (18 g → 44 g en 27s)",
      doseG: 16,
      waterMl: 255,
      tempC: 93,
      grindClicks: "22 clics Comandante C40",
      totalTime: "02:40",
      steps: [
        { time: "0:00 – 0:40", water: "48 ml", note: "Saturación homogénea del café recién molido." },
        { time: "0:40 – 1:35", water: "160 ml", note: "Espiral pausada desde el centro hacia fuera." },
        { time: "1:35 – 2:40", water: "255 ml", note: "Último pulso suave hasta completar." },
      ],
    },
  },
  {
    id: "finca-deborah-symbiosis",
    no: "05",
    name: "Finca Deborah Symbiosis",
    subtitle: "Geisha en maceración carbónica a 1.950 metros",
    origin: "Volcán · Chiriquí, Panamá",
    country: "Panamá",
    region: "Santa Clara, Volcán Barú",
    producer: "Jamison Savage",
    altitude: "1.950 – 2.020 m",
    variety: "Geisha",
    process: "Maceración carbónica",
    roast: "Filtro",
    category: "Reserva Competición",
    score: "91.75",
    price250: 48.0,
    tone: "oxblood",
    harvestMonth: "Febrero 2026",
    lotAllocationKg: 45,
    fobPriceUsd: "64,00 $/kg",
    farmGatePremium: "Lote exclusivo Kiln",
    moistureContent: "10.3%",
    waterActivity: "0.52 aw",
    densityGml: "0.761 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "11.2% (0:59 min)",
    endTempCelsius: "202.3 °C",
    notes: ["Frambuesa silvestre", "Pétalo de rosa", "Cacao blanco"],
    tastingParagraph:
      "Complejidad aromática de campeonato sin notas fermentadas invasivas: frambuesa fresca, agua de rosas y una dulzura cremosa que recuerda al chocolate blanco artesanal.",
    story:
      "Las cerezas enteras fermentan en tanques de acero inoxidable inyectados con CO₂ durante 120 horas a baja temperatura en la montaña (14 °C), seguidas de 25 días de secado lento en marquesinas solares.",
    agronomy:
      "Finca rodeada por el Parque Internacional La Amistad, con más de 2.800 horas de niebla anual que ralentizan la maduración del fruto.",
    sensory: { acidity: 9, sweetness: 10, body: 8, floral: 9, clarity: 9 },
    recipe: {
      method: "Hario Switch (Híbrido inmersión + percolación)",
      doseG: 15,
      waterMl: 240,
      tempC: 91,
      grindClicks: "23 clics Comandante C40",
      totalTime: "02:30",
      steps: [
        { time: "0:00 – 0:45", water: "60 ml", note: "Válvula abierta: floración directa." },
        { time: "0:45 – 1:45", water: "240 ml", note: "Cerrar válvula y verter hasta 240 ml en inmersión." },
        { time: "1:45 – 2:30", water: "240 ml", note: "Abrir válvula y dejar drenar por completo." },
      ],
    },
  },
  {
    id: "gitesi-bourbon",
    no: "06",
    name: "Estación Gitesi",
    subtitle: "Red Bourbon lavado a orillas del Lago Kivu",
    origin: "Karongi · Provincia Oeste, Ruanda",
    country: "Ruanda",
    region: "Distrito de Karongi, Lago Kivu",
    producer: "Alexis & Aime Gahizi",
    altitude: "1.800 m",
    variety: "Red Bourbon",
    process: "Lavado",
    roast: "Filtro",
    category: "Cosecha Estacional",
    score: "88.00",
    price250: 18.0,
    tone: "olive",
    harvestMonth: "Octubre 2025",
    lotAllocationKg: 320,
    fobPriceUsd: "9,50 $/kg",
    farmGatePremium: "+180% sobre precio mínimo NAEB",
    moistureContent: "10.9%",
    waterActivity: "0.56 aw",
    densityGml: "0.731 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "12.6% (1:11 min)",
    endTempCelsius: "204.8 °C",
    notes: ["Naranja sanguina", "Higo seco", "Té negro Darjeeling"],
    tastingParagraph:
      "Un clásico africano de taza redonda y reconfortante. Destaca su acidez cítrica dulce de naranja sanguina seguida de notas de higo caramelizado y final especiado.",
    story:
      "Fundada en 2005 por padre e hijo en Karongi, la estación Gitesi clasifica manualmente cada cereza sobre mesas de agua antes de un secado de tres semanas con volteo cada hora.",
    agronomy:
      "Suelos esquistosos y franco-limosos enriquecidos con compost de pulpa de café reciclada en la propia estación.",
    sensory: { acidity: 8, sweetness: 8, body: 7, floral: 7, clarity: 8 },
    recipe: {
      method: "Aeropress (Método estándar con papel doble)",
      doseG: 15,
      waterMl: 230,
      tempC: 93,
      grindClicks: "19 clics Comandante C40",
      totalTime: "02:00",
      steps: [
        { time: "0:00 – 0:20", water: "230 ml", note: "Verter toda el agua y colocar el émbolo para crear vacío." },
        { time: "1:15 – 1:25", water: "230 ml", note: "Retirar émbolo, girar suavemente la cámara." },
        { time: "1:25 – 2:00", water: "230 ml", note: "Presionar con peso constante durante 35 segundos." },
      ],
    },
  },
  {
    id: "santa-irene-maragogipe",
    no: "07",
    name: "Finca Santa Irene",
    subtitle: "Pacamara & Caturra en las cumbres de Huehuetenango",
    origin: "Huehuetenango, Guatemala",
    country: "Guatemala",
    region: "San Pedro Necta, Huehuetenango",
    producer: "Familia Mérida",
    altitude: "1.750 – 1.880 m",
    variety: "Caturra & Pacamara",
    process: "Honey / Semilavado",
    roast: "Omnitueste",
    category: "Cosecha Estacional",
    score: "87.50",
    price250: 17.5,
    tone: "sand",
    harvestMonth: "Enero 2026",
    lotAllocationKg: 350,
    fobPriceUsd: "8,90 $/kg",
    farmGatePremium: "+170% trato directo",
    moistureContent: "11.0%",
    waterActivity: "0.56 aw",
    densityGml: "0.728 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "14.0% (1:22 min)",
    endTempCelsius: "206.5 °C",
    notes: ["Ciruela amarilla", "Praliné de avellana", "Chocolate con leche"],
    tastingParagraph:
      "Textura aterciopelada con un equilibrio impecable entre fruta de hueso madura y notas golosas de praliné. Nuestro lote predilecto para quienes buscan dulzor sin aristas.",
    story:
      "Gracias a los vientos secos y cálidos que suben desde las llanuras de Tehuantepec en México, San Pedro Necta cultiva café a gran altitud libre de heladas, secado en patios de barro cocido con el 40% de su mucílago.",
    agronomy:
      "Sombra de árboles de Inga (Chalúm) y gravilea que fijan nitrógeno de forma natural en suelos calizos de montaña.",
    sensory: { acidity: 6, sweetness: 9, body: 8, floral: 5, clarity: 8 },
    recipe: {
      method: "Chemex / Cafetera de filtro o Espresso",
      doseG: 24,
      waterMl: 380,
      tempC: 93,
      grindClicks: "25 clics Comandante C40",
      totalTime: "03:20",
      steps: [
        { time: "0:00 – 0:45", water: "70 ml", note: "Humedecer todo el lecho de café." },
        { time: "0:45 – 2:00", water: "250 ml", note: "Vertido continuo central." },
        { time: "2:00 – 3:20", water: "380 ml", note: "Completar volumen y retirar filtro a los 3:20." },
      ],
    },
  },
  {
    id: "kiln-house",
    no: "08",
    name: "Ensamblaje Casa",
    subtitle: "Nuestra receta diaria de espresso en el tostador",
    origin: "Huila (Colombia) · Mogiana (Brasil)",
    country: "Brasil",
    region: "60% Pitalito (Colombia) · 40% Alta Mogiana (Brasil)",
    producer: "Finca El Mirador & Fazenda Ambiental Fortaleza",
    altitude: "1.250 – 1.750 m",
    variety: "Castillo & Mundo Novo",
    process: "Ensamblaje",
    roast: "Espresso",
    category: "Casa & Espresso",
    score: "86.50",
    price250: 15.0,
    tone: "smoke",
    harvestMonth: "Cosecha continua",
    lotAllocationKg: 1200,
    fobPriceUsd: "7,80 $/kg",
    farmGatePremium: "Contrato plurianual fijo",
    moistureContent: "10.9%",
    waterActivity: "0.55 aw",
    densityGml: "0.715 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "15.8% (1:36 min)",
    endTempCelsius: "209.0 °C",
    notes: ["Cacao 70%", "Almendra tostada", "Caramelo salado"],
    tastingParagraph:
      "Diseñado para brillar tanto solo en un espresso denso y dulce como cortado con leche fresca o bebida de avena. Cero amargor de tueste; puro dulzor de cacao y fruto seco.",
    story:
      "Tostamos cada componente por separado según su densidad celular y los ensamblamos en frío tras el desgasificado inicial de 24 horas. Es el café que servimos cada mañana en nuestra barra.",
    agronomy:
      "Agricultura regenerativa certificada en Brasil combinada con lotes lavados de altura de nuestra red de productores en el sur de Colombia.",
    sensory: { acidity: 5, sweetness: 9, body: 9, floral: 4, clarity: 7 },
    recipe: {
      method: "Espresso 9 bar / Cafetera Italiana",
      doseG: 18.5,
      waterMl: 40,
      tempC: 93,
      grindClicks: "Molienda fina de espresso (280 μm)",
      totalTime: "00:29",
      steps: [
        { time: "0:00 – 0:06", water: "5 g", note: "Preinfusión suave a 2 bares hasta las primeras gotas." },
        { time: "0:06 – 0:22", water: "30 g", note: "Extracción estable a 9 bares con flujo de miel tibia." },
        { time: "0:22 – 0:29", water: "40 g", note: "Corte limpio en 40 g en taza para máxima dulzura." },
      ],
    },
  },
  {
    id: "finca-mileydi-peru",
    no: "09",
    name: "Finca Mileydi",
    subtitle: "Bourbon Amarillo de Jaén · Tropical y sedoso",
    origin: "Cajamarca · Jaén, Perú",
    country: "Perú",
    region: "Huabal, Provincia de Jaén, Cajamarca",
    producer: "Familia Guevara",
    altitude: "1.920 m",
    variety: "Bourbon Amarillo",
    process: "Natural",
    roast: "Omnitueste",
    category: "Microlote",
    score: "88.50",
    price250: 19.0,
    tone: "ivory",
    harvestMonth: "Octubre 2025",
    lotAllocationKg: 160,
    fobPriceUsd: "10,60 $/kg",
    farmGatePremium: "+205% sobre mercado",
    moistureContent: "10.5%",
    waterActivity: "0.53 aw",
    densityGml: "0.740 g/ml",
    roasterMachine: "Loring S15 Falcon (Convección)",
    developmentTimeRatio: "12.9% (1:13 min)",
    endTempCelsius: "204.5 °C",
    notes: ["Maracuyá dulce", "Albaricoque", "Panela"],
    tastingParagraph:
      "Un natural de montaña extraordinariamente limpio: notas tropicales de maracuyá y albaricoque envueltas en un cuerpo cremoso con final de caña de azúcar.",
    story:
      "Secado lentamente en marquesinas ventiladas a casi 2.000 metros en los Andes del norte peruano, evitando la sobrefermentación gracias a las noches frías de Huabal.",
    agronomy:
      "Parcela familiar de 3,5 hectáreas rodeada de bosque de neblina con policultivo de pino y guamo.",
    sensory: { acidity: 8, sweetness: 9, body: 8, floral: 7, clarity: 8 },
    recipe: {
      method: "Hario V60 / Clever Dripper",
      doseG: 16,
      waterMl: 250,
      tempC: 92,
      grindClicks: "23 clics Comandante C40",
      totalTime: "02:35",
      steps: [
        { time: "0:00 – 0:40", water: "45 ml", note: "Preinfusión suave a 92 °C para cuidar notas frutales." },
        { time: "0:40 – 1:30", water: "155 ml", note: "Vertido continuo concéntrico." },
        { time: "1:30 – 2:35", water: "250 ml", note: "Segundo pulso hasta 250 ml." },
      ],
    },
  },
  {
    id: "pack-cata-estacional",
    no: "TRIO",
    name: "Trilogía de Cosecha",
    subtitle: "3 × 250 g · Etiopía, Kenia y Colombia con libreto de cata",
    origin: "Gedeb · Kiambu · Huila",
    country: "Etiopía",
    region: "Selección del Tostador (750 g totales)",
    producer: "Halo Hartume, Karinga AB & Los Nogales",
    altitude: "1.820 – 2.280 m",
    variety: "74110 · SL28 · Bourbon Rosado",
    process: "Lavado",
    roast: "Filtro",
    category: "Formatos",
    score: "89.30",
    price250: 52.0,
    tone: "stone",
    harvestMonth: "Edición Primavera",
    lotAllocationKg: 150,
    fobPriceUsd: "11,25 $/kg media",
    farmGatePremium: "100% Trazable",
    moistureContent: "10.6%",
    waterActivity: "0.54 aw",
    densityGml: "0.746 g/ml",
    roasterMachine: "Loring S15 Falcon",
    developmentTimeRatio: "12.0%",
    endTempCelsius: "204.2 °C",
    notes: ["Jazmín", "Grosella negra", "Nectarina"],
    tastingParagraph:
      "Nuestra caja de iniciación y estudio sensorial: incluye tres bolsas de 250 g de nuestros lotes estacionales más representativos junto con fichas impresas en papel algodón y curva de tueste.",
    story:
      "Pensada para comparar en casa la influencia de la variedad botánica y el terroir entre África Oriental y la cordillera de los Andes.",
    agronomy:
      "Tres orígenes de pequeña escala seleccionados en mesa de cata a ciegas en nuestro laboratorio.",
    sensory: { acidity: 9, sweetness: 9, body: 7, floral: 9, clarity: 9 },
    recipe: {
      method: "Cata comparativa / Filtro V60",
      doseG: 15,
      waterMl: 250,
      tempC: 94,
      grindClicks: "22 clics Comandante C40",
      totalTime: "02:35",
      steps: [
        { time: "Paso 1", water: "12 g / 200 ml", note: "Para cata brasileña: moler medio-grueso y verter agua a 94 °C." },
        { time: "Paso 2", water: "Minuto 4:00", note: "Romper costra oliendo el vapor liberado y limpiar espuma." },
        { time: "Paso 3", water: "Minuto 10:00", note: "Catar con cuchara a tres temperaturas (caliente, tibio, frío)." },
      ],
    },
  },
]

export const SUBSCRIPTION_PLANS = [
  {
    id: "origen",
    name: "Despacho de Origen",
    tag: "Más elegido",
    tone: "ivory" as const,
    basePrice250: 17.5,
    cadenceNote: "Ahorra un 12% frente a compra suelta + envío sin coste a partir de 2 bolsas",
    summary:
      "Recibe en cada envío los lotes estacionales recién llegados de Etiopía, Kenia, Colombia y Perú, seleccionados por nuestro jefe de tueste cada martes.",
    includes: [
      "Rotación de micro-lotes con puntuación SCA 88 – 90+",
      "Ficha técnica impresa con curva de tueste y receta V60 / Espresso",
      "Acceso anticipado 48h antes a lotes limitados",
      "Pausa, salta un envío o cambia molienda en un clic sin permanencia",
    ],
  },
  {
    id: "casa",
    name: "Ritual Diario",
    tag: "Espresso & Leche",
    tone: "smoke" as const,
    basePrice250: 13.5,
    cadenceNote: "Ideal para máquinas espresso domésticas, superautomáticas e italiana",
    summary:
      "Perfiles redondos, dulces y achocolatados con acidez sedosa. Consistencia absoluta taza tras taza sin necesidad de recalibrar tu molino cada semana.",
    includes: [
      "Ensamblaje Casa y lotes lavados de Guatemala y Brasil",
      "Tueste calibrado para solubilidad fácil en espresso y moka",
      "Descuento del 15% adicional en formatos de 500 g y 1 kg",
      "Muestra gratuita de 60 g de un lote de temporada cada mes",
    ],
  },
  {
    id: "archivo",
    name: "Archivo & Competición",
    tag: "Cupo limitado (80 plazas)",
    tone: "noir" as const,
    basePrice250: 39.0,
    cadenceNote: "Variedades exóticas: Geisha, Eugenioides, Chiroso y Sidra",
    summary:
      "Nuestra suscripción de coleccionista: lotes de menos de 90 kg anuales procedentes de Boquete, Volcán y subastas privadas que rara vez llegan a la tienda general.",
    includes: [
      "1 o 2 bolsas de lotes Reserva (SCA 91 – 93 puntos)",
      "Sobre de minerales Third Wave Water incluido para calibrar tu agua",
      "Invitación trimestral a la cata privada en nuestro estudio",
      "Envío urgente 24h incluido en cada entrega",
    ],
  },
]

export const CAFE_MENU = [
  {
    category: "Barra de Filtro (Hand Brew · Hario V60 / Origami)",
    items: [
      { name: "Lote del Día — Halo Hartume (Etiopía Lavado)", detail: "Bergamota, melocotón blanco, jazmín · Servido en jarra de vidrio soplado", price: "4,50 €" },
      { name: "Lote Micro — Karinga AB (Kenia SL28/SL34)", detail: "Grosella negra, pomelo rosa · Extracción a 94 °C", price: "5,20 €" },
      { name: "Reserva de Archivo — Hacienda La Esmeralda Geisha", detail: "Boquete, Panamá · Molido al momento en Weber EG-1", price: "9,50 €" },
      { name: "Vuelo Sensorial (Tasting Flight)", detail: "Espresso + Cappuccino + Filtro V60 del mismo origen en paralelo", price: "8,50 €" },
    ],
  },
  {
    category: "Barra Espresso (La Marzocco KB90 · Leche Fresca de Pastoreo Caldes)",
    items: [
      { name: "Espresso Doble (18,5 g → 40 g)", detail: "Ensamblaje Casa o Lote Invitado de Huila", price: "2,80 €" },
      { name: "Cortado / Macchiato", detail: "Doble ristretto con microespuma sedosa a 60 °C", price: "3,10 €" },
      { name: "Flat White / Cappuccino", detail: "Leche fresca ecológica de granja catalana o avena barista sin cargo extra", price: "3,60 €" },
      { name: "Cold Brew 18 Horas (Grifo Nitrógeno)", detail: "Infusión lenta en frío de Finca Mileydi Perú", price: "4,20 €" },
    ],
  },
  {
    category: "Obrador Matinal (Horneado cada mañana a las 07:00h)",
    items: [
      { name: "Bollo Escandinavo de Cardamomo Recién Molido", detail: "Masa madre dulce con mantequilla avellana y semillas de cardamomo verde", price: "3,90 €" },
      { name: "Tostada de Hogaza Espelta & Mantequilla Ahumada", detail: "Pan de Pa de Kilo con flor de sal del Delta del Ebro", price: "4,40 €" },
      { name: "Bizcocho de Aceite de Oliva Arbequina & Limón", detail: "Húmedo, con glaseado ligero de bergamota", price: "4,10 €" },
      { name: "Tarta Vasca Cremosa al Cascara de Café", detail: "Horneada a alta temperatura con infusión de cereza de café", price: "5,80 €" },
    ],
  },
]
