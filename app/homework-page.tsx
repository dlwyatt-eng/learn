"use client";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import manifest from "./generated/public-window-v2.json";
import { vancouverDateKey } from "./public-window-selection.mjs";
import "./homework-page.css";

const practice = manifest.homePractice;
export function HomeworkDoorway() {
  return <section className="homework-doorway"><div><h2>Homework &amp; Extra Practice</h2><p>Short optional activities, practice links and a printable menu for home.</p></div><Link href="/homework">Choose your practice →</Link></section>;
}
export default function HomeworkPage() {
  const [printing, setPrinting] = useState(false);
  const [includeChecks, setIncludeChecks] = useState(false);
  useEffect(() => {
    const before = () => flushSync(() => setPrinting(true));
    const after = () => setPrinting(false);
    window.addEventListener("beforeprint", before); window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);
  const today = vancouverDateKey();
  const current = today >= practice.week.from && today <= practice.week.through;
  function printMenu() {
    setPrinting(true);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.print()));
  }
  return <main className={`content-page homework-page${includeChecks ? " include-checks" : ""}`}>
    <header><p className="eyebrow">FOR STUDENTS &amp; FAMILIES · UPDATED {practice.updatedOn}</p><h1>Homework &amp; Extra Practice</h1><p>{practice.policy}</p><nav aria-label="Homework sections"><Link href="/homework#homework-finish">Class work to finish</Link><Link href="/homework#homework-menu">Optional practice menu</Link><Link href="/homework#homework-resources">Practice links</Link></nav></header>
    <section id="homework-finish"><h2>Class work to finish</h2><p>{practice.unfinished}</p><p><strong>This menu has no hand-in deadline.</strong> Individual instructions come from your teacher. Check school reminders separately on the <Link href="/families">Families page</Link>.</p></section>
    <section className="homework-routine"><h2>A routine that fits your family</h2><p>{practice.routine}</p><p>{practice.access}</p><p><strong>When to stop:</strong> {practice.stopRule}</p></section>
    <section id="homework-menu"><header><p className="eyebrow">{current ? "THIS WEEK’S OPTIONAL PRACTICE" : "LATEST PUBLISHED PRACTICE"}</p><h2>{practice.week.label}</h2><p>{practice.week.connection}</p>{!current && <p><strong>This is the latest published menu, not a new assignment for today.</strong> You may reuse familiar activities while the next menu is prepared.</p>}<p><strong>Choose one to start.</strong> Open another subject when you want a different choice. Use paper, draw or explain aloud; no printer is needed.</p></header>
    <div className="homework-print-controls"><button type="button" onClick={printMenu}>Print activity menu</button><label><input type="checkbox" checked={includeChecks} onChange={e => setIncludeChecks(e.target.checked)} /> Include checking guidance in print</label><p>The printed menu includes every activity. Choose a few, not all.</p></div>
    <div className="homework-activities">{practice.week.activities.map((item, i) => <details key={item.id} className="homework-activity" open={printing || i < 2}>
      <summary><span><small>{item.subject} · {item.time}</small><strong>{item.title}</strong></span><span className="homework-open-hint" aria-hidden="true">Open / close</span></summary>
      <div className="homework-activity-body"><p>{item.context}</p><p><strong>Example:</strong> {item.example}</p><ol>{item.steps.map(step => <li key={step}>{step}</li>)}</ol>{item.extension && <p><strong>Want a challenge?</strong> {item.extension}</p>}<div className="homework-check"><h3>Check after you try</h3><p>{item.check}</p></div><div className="homework-response"><p>My explanation, drawing or notes:</p><div /></div></div>
    </details>)}</div></section>
    <section id="homework-resources" className="homework-resources"><h2>Practice links</h2><p>Use the login details and class instructions Mr. Wyatt provides. If you do not have access yet, use the screen-free choice. You do not need to buy anything.</p><div>{practice.resources.map(item => <article key={item.title}><small>{item.subject}</small><h3>{item.href ? (item.href.startsWith("/") ? <Link href={item.href}>{item.title} →</Link> : <a href={item.href} target="_blank" rel="noreferrer">{item.title} ↗</a>) : item.title}</h3><p>{item.description}</p><p><strong>Screen-free choice:</strong> {item.offline}</p></article>)}</div></section>
    <section className="homework-family-check"><h2>For families: notice understanding</h2><ul>{practice.familyCheck.map(item => <li key={item}>{item}</li>)}</ul><p>Students can explain in a home language, draw, dictate or choose fewer questions. For an individually adapted task, contact Mr. Wyatt privately.</p><p>{manifest.classroomWelcome.spaces.status === "pending" ? manifest.classroomWelcome.spaces.message : "SpacesEDU holds selected student work and feedback. Optional practice does not require a routine upload."}</p><a href={manifest.safeLinks.email}>Ask Mr. Wyatt about home practice</a></section>
  </main>;
}
