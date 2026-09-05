"use client";

import { useId, useState } from "react";
import "./exploration-player.css";

export type Exploration = {
  id: string; title: string; place: string; strand: string; duration: string;
  provider: string; sourceUrl: string; launchUrl: string; youtubeId?: string; videoUrl?: string;
  supportingSources?: { title: string; url: string }[];
  mediaLabel: string; goal: string; invitation: string; route: string;
  stops: { title: string; notice: string; question: string }[];
  task: string; entry: string; extension: string; check: string;
  fallback: { title: string; facts: string[]; action: string };
  teacher?: { placement: string; prepare: string; model: string; misconception: string; assessment: string; curriculum: string; sourceNotes: string; verification: string; logistics?: string; grades?: string[] };
};

export function ExplorationPlayer({ tour, audience = "student", initiallyOpen = false }: { tour: Exploration; audience?: "teacher" | "student" | "family"; initiallyOpen?: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(initiallyOpen);
  const [stage, setStage] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const stops = tour.stops;
  const isVisit = stage > 0 && stage <= stops.length;
  const isTry = stage === stops.length + 1;
  const isBackup = stage === stops.length + 2;
  const sourceLabel = tour.youtubeId ? "Open on YouTube" : "Open original tour";
  const labels = ["Begin", ...stops.map((_, i) => `Stop ${i + 1}`), "Try", "Without video"];
  function choose(next: number) {
    setStage(next);
    // Unmount media when leaving the viewing stops so hidden video cannot keep playing.
    if (next === 0 || next > stops.length) setLoaded(false);
    setFailed(false);
  }
  return <div className="exploration-frame"><details className="exploration" data-strand={tour.strand} open={open} onToggle={event => {
    const expanded = event.currentTarget.open;
    setOpen(expanded);
    if (!expanded) setLoaded(false);
  }}>
    <summary><span><small>EXPLORE · {tour.place}</small><strong>{tour.title}</strong><span>{tour.duration} · {tour.mediaLabel}</span></span><b aria-hidden="true">{open ? "−" : "+"}</b></summary>
    {open && <div className="exploration__body">
      <p className="exploration__goal">{tour.goal}</p>
      <nav className="exploration__steps" aria-label={`${tour.title}: exploration steps`}>
        {labels.map((label, index) => <button type="button" key={label} aria-current={stage === index ? "step" : undefined} onClick={() => choose(index)}>{label}</button>)}
      </nav>
      <div className="exploration__stage" aria-live="polite">
        {stage === 0 && <section><h3>{tour.invitation}</h3><p>{tour.route}</p><button type="button" className="exploration__primary" onClick={() => choose(1)}>Start exploring</button></section>}
        {isVisit && <section>
          <div className="exploration__stop"><small>STOP {stage} OF {stops.length}</small><h3>{stops[stage - 1].title}</h3><p>{stops[stage - 1].notice}</p><p className="exploration__question">{stops[stage - 1].question}</p></div>
        </section>}
        {isTry && <section><small>YOUR TURN</small><h3>{tour.task}</h3><p><b>Check your thinking:</b> {tour.check}</p><details><summary>Another way to begin</summary><p>{tour.entry}</p></details><details><summary>Take it further</summary><p>{tour.extension}</p></details></section>}
        {isBackup && <section className="exploration__fallback"><small>EXPLORE WITHOUT THE VIDEO</small><h3>{tour.fallback.title}</h3><ul>{tour.fallback.facts.map(fact => <li key={fact}>{fact}</li>)}</ul><p className="exploration__question">{tour.fallback.action}</p></section>}
      </div>
      {isVisit && <div className="exploration__media">
        {tour.youtubeId || tour.videoUrl ? <>
          {!loaded ? <button type="button" className="exploration__load" onClick={() => setLoaded(true)}>Load {tour.youtubeId ? "video" : "NASA video"} · {tour.provider}</button> : tour.youtubeId ? <iframe
            src={`https://www.youtube-nocookie.com/embed/${tour.youtubeId}?playsinline=1&cc_load_policy=1&rel=0`}
            title={`${tour.title} — ${tour.provider}`} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            : <video controls playsInline preload="metadata" src={tour.videoUrl} aria-label={tour.title} onError={() => setFailed(true)} />}
          {failed && <p role="status">The video could not load here. Open the original tour or choose Without video.</p>}
        </> : <p>Open the original tour in a new tab. Return here for the next stop.</p>}
        <div className="exploration__links"><a href={tour.launchUrl} target="_blank" rel="noopener noreferrer">{sourceLabel} ↗</a><button type="button" onClick={() => choose(stops.length + 2)}>Use the backup</button>{loaded && <button type="button" onClick={() => setLoaded(false)}>Close video</button>}</div>
        <p className="exploration__credit">{tour.provider} · {tour.mediaLabel}. Pause to talk at each stop. {tour.youtubeId ? "Use CC if available; the backup supplies a short text route." : "The backup supplies a short text route."}</p>
      </div>}
      <footer className="exploration__next"><button type="button" disabled={stage === 0} onClick={() => choose(stage - 1)}>Previous</button><span>{labels[stage]}</span><button type="button" disabled={stage === labels.length - 1} onClick={() => choose(stage + 1)}>Next</button></footer>
      {audience === "teacher" && tour.teacher && <details className="exploration__teacher"><summary>Teacher preparation, model and source checks</summary><dl>
        <dt>Where this fits</dt><dd>{tour.teacher.placement}</dd>
        <dt>Prepare</dt><dd>{tour.teacher.prepare}</dd>
        <dt>One possible response</dt><dd>{tour.teacher.model}</dd>
        <dt>Watch for</dt><dd>{tour.teacher.misconception}</dd>
        <dt>Notice learning</dt><dd>{tour.teacher.assessment}</dd>
        <dt>Curriculum</dt><dd>{tour.teacher.curriculum}</dd>
        {tour.teacher.grades && <><dt>Grade adaptations</dt><dd><ul>{tour.teacher.grades.map(grade => <li key={grade}>{grade}</li>)}</ul></dd></>}
        <dt>Source review</dt><dd>{tour.teacher.sourceNotes}</dd>
        {tour.teacher.logistics && <><dt>Access and timing</dt><dd>{tour.teacher.logistics}</dd></>}
        <dt>Access checks</dt><dd>{tour.teacher.verification}</dd>
      </dl></details>}
      {tour.supportingSources?.map(source => <a key={source.url} className="exploration__source" href={source.url} target="_blank" rel="noopener noreferrer">{source.title} ↗</a>)}
      <a className="exploration__source" href={tour.sourceUrl} target="_blank" rel="noopener noreferrer">Source and context · {tour.provider} ↗</a>
    </div>}
    </details><section className="exploration__print" aria-labelledby={`${id}-print`}><h3 id={`${id}-print`}>{tour.fallback.title}</h3><p>{tour.goal}</p><ul>{tour.fallback.facts.map(fact => <li key={fact}>{fact}</li>)}</ul><p>{tour.fallback.action}</p><p>{tour.check}</p><small>Source: {tour.provider} · {tour.sourceUrl}{tour.supportingSources?.map(source => <span key={source.url}><br />{source.title}: {source.url}</span>)}</small></section>
  </div>;
}
