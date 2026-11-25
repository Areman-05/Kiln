"use client"

import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { OBJECTS, type KilnObject } from "./data"
import { formatEur } from "./Components"

/* Tarjeta de objeto: misma cuadrícula y estilo que las de café */
export function ObjectCard({ obj, onSelect }: { obj: KilnObject; onSelect: (obj: KilnObject) => void }) {
  return (
    <article className="k-lot-card k-object-card" data-object-id={obj.id}>
      <button type="button" className="k-lot-stage" onClick={() => onSelect(obj)} aria-label={`Ver ${obj.name}`}>
        <img className="k-lot-photo" src={obj.photos[0]} alt={obj.name} loading="lazy" />
        <span className="k-lot-view" aria-hidden="true">
          Ver objeto
        </span>
      </button>
      <div className="k-lot-body">
        <div className="k-lot-headline">
          <button type="button" className="k-lot-title" onClick={() => onSelect(obj)}>
            {obj.name}
          </button>
          <span className="k-lot-price">{formatEur(obj.price)}</span>
        </div>
        <span className="k-lot-meta-line">{obj.collab ?? obj.material}</span>
      </div>
    </article>
  )
}

/* ==========================================================================
   OBJETOS: listado a dos por fila, como Novedades
   ========================================================================== */
export function ObjectsView({ onSelect }: { onSelect: (obj: KilnObject) => void }) {
  return (
    <section className="k-section-sm k-shop-view k-news-view">
      <div className="k-container">
        <header className="k-shop-head">
          <h1>Objetos</h1>
        </header>
        <div className="k-catalog-grid is-editorial">
          {OBJECTS.map((obj) => (
            <ObjectCard key={obj.id} obj={obj} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ==========================================================================
   FICHA DE OBJETO: layout de la ficha de café, sin tamaño ni molienda
   ========================================================================== */
export function ObjectDetailView({
  obj,
  onBack,
  onAdd,
  onSelect,
}: {
  obj: KilnObject
  onBack: () => void
  onAdd: (obj: KilnObject) => void
  onSelect: (obj: KilnObject) => void
}) {
  const [index, setIndex] = useState<number>(0)
  const [dir, setDir] = useState<"next" | "prev">("next")
  const [added, setAdded] = useState<boolean>(false)
  const timer = useRef<number | undefined>(undefined)
  const count = obj.photos.length

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const step = (delta: 1 | -1) => {
    setDir(delta === 1 ? "next" : "prev")
    setIndex((i) => (i + delta + count) % count)
  }

  const handleAdd = () => {
    onAdd(obj)
    setAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 1500)
  }
  const addLabel = added ? "Añadido ✓" : `Añadir — ${formatEur(obj.price)}`

  const position = OBJECTS.findIndex((o) => o.id === obj.id)
  const others = [1, 2, 3].map((n) => OBJECTS[(position + n) % OBJECTS.length])

  return (
    <section className="k-pdp2 k-object-pdp">
      <div className="k-pdp2-layout">
        <div className="k-pdp2-media">
          <button type="button" className="k-pdp2-back" onClick={onBack}>
            — Volver
          </button>
          <div className="k-pdp2-frame k-object-frame">
            <img
              key={index}
              className={`k-object-photo is-${dir}`}
              src={obj.photos[index]}
              alt={`${obj.name}, foto ${index + 1} de ${count}`}
            />
            {count > 1 && (
              <>
                <button type="button" className="k-pdp2-arrow is-prev" aria-label="Foto anterior" onClick={() => step(-1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 4l-8 8 8 8" />
                  </svg>
                </button>
                <button type="button" className="k-pdp2-arrow is-next" aria-label="Foto siguiente" onClick={() => step(1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 4l8 8-8 8" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="k-pdp2-panel">
          <div className="k-pdp2-title">
            <h1>{obj.name}</h1>
            <p className="k-pdp2-cost">
              {formatEur(obj.price)}
              {obj.collab && <small>{obj.collab}</small>}
            </p>
          </div>
          <p className="k-prose k-object-text">{obj.text}</p>
          <dl className="k-pairs k-object-pairs">
            <div>
              <dt>Material</dt>
              <dd>{obj.material}</dd>
            </div>
            <div>
              <dt>Medidas</dt>
              <dd>{obj.dimensions}</dd>
            </div>
            <div>
              <dt>Origen</dt>
              <dd>{obj.origin}</dd>
            </div>
          </dl>
          <button type="button" className={`k-pdp2-cta ${added ? "is-added" : ""}`} onClick={handleAdd} aria-live="polite">
            {addLabel}
          </button>
          <p className="k-pdp2-note">Envío 24 h gratis desde 38 €</p>
        </div>
      </div>

      <div className="k-shop-view k-pdp2-related">
        <h2>Otros objetos</h2>
        <div className="k-catalog-grid">
          {others.map((o) => (
            <ObjectCard key={o.id} obj={o} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {createPortal(
        <div className="k-pdp2-mobilebar">
          <button type="button" className={added ? "is-added" : ""} onClick={handleAdd}>
            {addLabel}
          </button>
        </div>,
        document.body
      )}
    </section>
  )
}
