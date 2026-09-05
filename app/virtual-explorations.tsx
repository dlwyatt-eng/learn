"use client";
import { useState } from "react";
import register from "./generated/virtual-explorations.json";
import { ExplorationPlayer } from "./generated/exploration-player";

export function ExplorationRevisits() {
  const [selected, setSelected] = useState("");
  const tour = register.trips.find(t => t.id === selected);
  return <section className="exploration-revisits" aria-labelledby="revisits-title">
    <small>EXPLORE AGAIN</small><h2 id="revisits-title">Where would you like to go?</h2>
    <p>Revisit a class exploration or discover a new place together. These are optional: a home device, video or account is never needed to finish your classroom learning. You can choose the text and hands-on route inside each visit.</p>
    <label htmlFor="exploration-destination">Choose a destination </label><select id="exploration-destination" value={selected} onChange={e => setSelected(e.target.value)} style={{font:'inherit',padding:'.75rem',maxWidth:'100%',minHeight:44}}><option value="">Choose a visit…</option>{register.trips.map(t => <option key={t.id} value={t.id}>{t.place} · {t.title}</option>)}</select>
    {tour && <ExplorationPlayer key={tour.id} tour={tour} audience="family" initiallyOpen />}
  </section>;
}
