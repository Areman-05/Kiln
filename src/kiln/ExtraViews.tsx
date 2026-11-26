"use client"

import React, { useState } from "react"
import { CAFE_MENU, PHOTOS } from "./data"
import { formatEur, type ViewName } from "./Components"

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
