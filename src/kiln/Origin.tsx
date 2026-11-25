"use client"

import React from "react"
import { PRODUCERS, type Producer } from "./data"

const PRINCIPLES = ["Relación directa", "Precio justo y público", "Solo temporada"]

/* ==========================================================================
   ORIGEN: las personas detrás de cada café
   ========================================================================== */
export function OriginView({ onViewCoffees }: { onViewCoffees: (producer: Producer) => void }) {
  return (
    <section className="k-origin">
      <header className="k-origin-intro">
        <h1 className="k-view-title">Origen</h1>
        <p className="k-prose k-lede">
          Conocemos a cada persona detrás de cada café. Compramos por temporada, pagamos por encima del precio justo y volvemos cada año.
        </p>
      </header>

      <ol className="k-origin-principles">
        {PRINCIPLES.map((principle, i) => (
          <li key={principle}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {principle}
          </li>
        ))}
      </ol>

      <div className="k-origin-list">
        {PRODUCERS.map((producer, i) => (
          <article
            key={producer.id}
            id={`productor-${producer.id}`}
            className={`k-producer ${i % 2 === 1 ? "is-reverse" : ""}`}
            aria-labelledby={`productor-${producer.id}-nombre`}
          >
            <figure className="k-producer-photo">
              <img src={producer.photo} alt={`Paisaje de ${producer.region}, ${producer.country}`} loading="lazy" />
            </figure>
            <div className="k-producer-body">
              <h2 id={`productor-${producer.id}-nombre`}>{producer.name}</h2>
              <dl className="k-pairs">
                <div>
                  <dt>País</dt>
                  <dd>{producer.country}</dd>
                </div>
                <div>
                  <dt>Región</dt>
                  <dd>{producer.region}</dd>
                </div>
                <div>
                  <dt>Altitud</dt>
                  <dd>{producer.altitude}</dd>
                </div>
                <div>
                  <dt>Con Kiln desde</dt>
                  <dd>{producer.since}</dd>
                </div>
              </dl>
              <p className="k-prose">{producer.text}</p>
              <button type="button" className="k-text-link" onClick={() => onViewCoffees(producer)}>
                — Ver sus cafés
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
