"use client";

import Link from "next/link";

export type PublicElection = {
  title: string;
  question: string;
  calendar: Array<{ date: string; label: string }>;
  sources: Array<{ title: string; organization: string; url: string; dated?: string }>;
  familyPrompt: string;
};

export type PublicNewsroomFeature = {
  id: string;
  title: string;
  topic: string;
  question: string;
  summary: string;
  whyNow: string;
  minutes: string;
  checkedOn: string;
  reviewBy: string;
  publicFrom: string;
  publicUntil: string;
  sourceOrganization: string;
  preview?: {
    kind: string;
    label: string;
    text: string;
    credit: string;
    sourceUrl: string;
    checkedOn: string;
    prompt: string;
  } | null;
  factStrip: Array<{ value: string; label: string; note: string }>;
  statusStrip: Array<{ label: string; detail: string; state: "now" | "building" | "future" }>;
  sources: Array<{
    title: string;
    organization: string;
    url: string;
    sourceKind: string;
    sourceFocus: string;
    publishedOn?: string;
    updatedOn?: string;
    checkedOn: string;
    reproduction: string;
  }>;
  firstMove: string;
  inquirySeeds: string[];
  curriculumConnections: string[];
  familyConversationPrompt: string;
  spacesDisposition: string;
};

export type PublicNewsroom = {
  id: string;
  contentVersion: string;
  shared: {
    eyebrow: string;
    title: string;
    bigQuestion: string;
    summary: string;
    cadence: string;
    sourcePromise: string;
    routes: Array<{ id: string; label: string; minutes: string; path: string; use: string }>;
    routine: Array<{ id: string; label: string; title: string; prompt: string }>;
    endings: Array<{ id: string; label: string; title: string; detail: string }>;
  };
  student: {
    title: string;
    summary: string;
    firstMove: string;
    inquiryRoutes: Array<{ title: string; detail: string }>;
    finish: string;
    absentOrStuck: string;
    spacesNote: string;
  };
  family: {
    title: string;
    summary: string;
    quickReference: Array<{ label: string; detail: string }>;
    conversationPrompts: string[];
    spacesNote: string;
  };
  issues?: Array<{
    id: string;
    scope: string;
    title: string;
    question: string;
    whyItMatters: string;
    familyPrompt: string;
    sources: Array<{ title: string; organization: string; url: string; kind: string; sourcePrompt: string }>;
  }>;
  election?: PublicElection;
  featured: null | PublicNewsroomFeature;
  features?: PublicNewsroomFeature[];
};

export default function NewsroomPublic({ newsroom }: { newsroom?: PublicNewsroom }) {
  if (!newsroom) return <NewsroomUnavailable />;

  const today = vancouverDateKey();
  const feature = selectNewsroomFeature(newsroom, today);
  if (!feature) return <NoCurrentFeature newsroom={newsroom} />;
  const primarySource = feature.sources[0];
  if (!primarySource) return <NoCurrentFeature newsroom={newsroom} />;
  const currentFeature = featureIsCurrent(feature, today);
  const archivedFeatures = newsroomFeatureSet(newsroom).filter(item => item.id !== feature.id && item.publicUntil < today);
  const quickRoute = newsroom.shared.routes.find(route => route.id === "quick-look") ?? newsroom.shared.routes[0];
  const deepRoute = newsroom.shared.routes.find(route => route.id === "deep-dive") ?? newsroom.shared.routes[1];
  const quickMoves = newsroom.shared.routine.filter(move => ["watch", "notice", "question", "imagine"].includes(move.id));
  const deepMoves = newsroom.shared.routine.filter(move => ["discuss", "investigate"].includes(move.id));

  return <main className="content-page newsroom-page source-first-newsroom">
    <section className="source-feature" aria-labelledby="featured-source-title">
      <header className="source-feature-heading">
        <div><p className="eyebrow">{currentFeature ? "CURRENT SOURCE" : "SOURCE ARCHIVE"} · {feature.topic}</p><h1 id="featured-source-title">{feature.title}</h1></div>
        <dl><div><dt>Time</dt><dd>{feature.minutes}</dd></div><div><dt>Checked</dt><dd>{formatDate(feature.checkedOn)}</dd></div></dl>
      </header>

      <div className="source-stage">
        <article className="primary-source-card">
          <div className="source-kind" aria-hidden="true">{sourceKindLabel(primarySource.sourceKind)}</div>
          <div>
            <small>SOURCE 1 · {primarySource.organization} · {sourceDateLabel(primarySource)}</small>
            <h2>{primarySource.title}</h2>
            {feature.preview && <blockquote className="source-excerpt">“{feature.preview.text}”</blockquote>}
            <p className="source-credit">{feature.preview?.credit ?? primarySource.organization}</p>
            <p>{primarySource.sourceFocus}</p>
          </div>
          <a href={primarySource.url} target="_blank" rel="noreferrer">Open the complete source ↗</a>
        </article>
        <aside className="source-question-card">
          <small>QUESTION</small>
          <h2>{feature.question}</h2>
          <div><small>FIRST MOVE</small><p>{feature.firstMove}</p></div>
        </aside>
      </div>

      {feature.factStrip.length > 0 && <section className="newsroom-fact-strip" aria-label="Key facts from the dated source">
        <header><small>CLASSROOM INFOGRAPHIC · REPORTED {formatDate(primarySource.publishedOn ?? feature.checkedOn).toUpperCase()}</small><strong>Read the number, label, and note together.</strong></header>
        <div>{feature.factStrip.map(fact => <article key={fact.label}><b>{fact.value}</b><strong>{fact.label}</strong><span>{fact.note}</span></article>)}</div>
      </section>}

      {currentFeature && feature.statusStrip.length > 0 && <section className="newsroom-status-strip" aria-label="Present construction and future service comparison">
        {feature.statusStrip.map(status => <article key={status.label} data-state={status.state}><small>{status.label}</small><strong>{status.detail}</strong></article>)}
      </section>}

      {feature.sources.length > 1 && <details className="more-sources">
        <summary>Open the other sources in this set</summary>
        <div>{feature.sources.slice(1).map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{sourceKindLabel(source.sourceKind)}</span><div><small>SOURCE {index + 2} · {source.organization} · {sourceDateLabel(source)}</small><strong>{source.title}</strong><p>{source.sourceFocus}</p></div><b>OPEN ↗</b></a>)}</div>
      </details>}
    </section>

    {newsroom.election && <SurreyElectionStrip election={newsroom.election} detailsHref="#surrey-election" compact />}

    <section className="selected-source-route" aria-labelledby="quick-look-title">
      <header><div><small>START HERE · {quickRoute?.label}</small><h2 id="quick-look-title">{quickRoute?.minutes}</h2></div><p>{quickRoute?.use}</p></header>
      <ol>{quickMoves.map((move, index) => <li key={move.id}><b>{index + 1}</b><div><small>{move.label}</small><h3>{move.title}</h3><p>{move.prompt}</p></div></li>)}</ol>
    </section>

    {deepRoute && <details className="newsroom-deep-dive">
      <summary><span>DEEP DIVE</span><strong>{deepRoute.minutes}</strong><em>Add comparison + source checking</em></summary>
      <div><p>{deepRoute.use}</p><ol>{deepMoves.map((move, index) => <li key={move.id}><b>{index + 1}</b><div><small>ADD {move.label}</small><h3>{move.title}</h3><p>{move.prompt}</p></div></li>)}</ol></div>
    </details>}

    <section className="newsroom-finish-row">
      <div><small>FINISH FOR TODAY</small><p>{newsroom.student.finish}</p></div>
      <div><small>ASK AT HOME</small><blockquote>“{feature.familyConversationPrompt}”</blockquote></div>
    </section>

    {archivedFeatures.length > 0 && <details className="newsroom-source-archive">
      <summary><span>PAST SOURCE SETS</span><strong>{archivedFeatures.length} checked {archivedFeatures.length === 1 ? "feature" : "features"}</strong><em>Open archive</em></summary>
      <div>{archivedFeatures.map(item => <article key={item.id}>
        <small>{formatDate(item.publicFrom)}–{formatDate(item.publicUntil)}</small>
        <div><strong>{safeFeatureTitle(item)}</strong><p>{item.question}</p></div>
        <nav aria-label={`${safeFeatureTitle(item)} sources`}>{item.sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{index === 0 ? `Start: ${source.title}` : source.title} ↗</a>)}</nav>
      </article>)}</div>
    </details>}

    {newsroom.election && <section className="newsroom-election-window" id="surrey-election" aria-labelledby="surrey-election-window-title">
      <header><span>LIVE SURREY CASE</span><strong id="surrey-election-window-title">{newsroom.election.title}</strong><em>Questions + official timeline</em></header>
      <div><h2>{newsroom.election.question}</h2><ol>{newsroom.election.calendar.map(item => <li key={item.date}><b>{item.date}</b><span>{item.label}</span></li>)}</ol><nav aria-label="Official Surrey election sources">{newsroom.election.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><strong>{electionSourceLabel(source)}</strong><span>{source.organization}{source.dated ? ` · ${source.dated}` : ""} · OPEN ↗</span></a>)}</nav><blockquote>Talk at home: “{newsroom.election.familyPrompt}”</blockquote></div>
    </section>}

    {newsroom.issues && newsroom.issues.length > 0 && <details className="newsroom-issue-library">
      <summary><span>MORE CANADIAN + WORLD ISSUES</span><strong>{newsroom.issues.length} source-based questions</strong><em>Open question library</em></summary>
      <div>{newsroom.issues.map((issue) => <article key={issue.id}>
        <header><h2>{issue.question}</h2></header>
        <div><nav aria-label={`${issue.title} student-ready sources`}>{issue.sources.slice(0, 1).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><strong>Open source ↗</strong></a>)}</nav></div>
      </article>)}</div>
    </details>}

  </main>;
}

export function SurreyElectionStrip({ election, detailsHref, compact = false }: { election: PublicElection; detailsHref: string; compact?: boolean }) {
  const today = vancouverDateKey();
  const phase = surreyElectionPhase(today);
  if (!phase.visible) return null;
  const candidateSource = election.sources.find(source => /candidate/i.test(source.title));

  return <section className={`surrey-election-strip${compact ? " compact" : ""}`} aria-labelledby="surrey-election-strip-title">
    <div className="surrey-election-strip-copy">
      <small>{phase.label}</small>
      <h2 id="surrey-election-strip-title">{election.title}</h2>
      <p>{phase.detail}</p>
    </div>
    <div className="surrey-election-date" aria-label="Election day is October 17, 2026"><span>OCT.</span><strong>17</strong><small>Mayor · Council · Trustees</small></div>
    <nav aria-label="Surrey election quick links">
      <Link href={detailsHref}>Open questions + timeline →</Link>
      {candidateSource && <a href={candidateSource.url} target="_blank" rel="noreferrer">{candidateLinkLabel(today)} ↗</a>}
    </nav>
  </section>;
}

function NoCurrentFeature({ newsroom }: { newsroom: PublicNewsroom }) {
  return <main className="content-page newsroom-page source-first-newsroom">
    <section className="newsroom-empty-state">
      <p className="eyebrow">GRADE 6 NEWSROOM</p>
      <h1>The next source is being checked.</h1>
      <p>Students can still use a teacher-selected current or historical source in class.</p>
      <div><article><small>QUICK LOOK</small><strong>{newsroom.shared.routes[0]?.minutes}</strong><span>{newsroom.shared.routes[0]?.path}</span></article><article><small>DEEP DIVE</small><strong>{newsroom.shared.routes[1]?.minutes}</strong><span>{newsroom.shared.routes[1]?.path}</span></article></div>
      <Link href="/learning">See what we are learning →</Link>
    </section>
  </main>;
}

function NewsroomUnavailable() {
  return <main className="content-page newsroom-page source-first-newsroom">
    <section className="newsroom-empty-state"><p className="eyebrow">GRADE 6 NEWSROOM</p><h1>The public source set is being prepared.</h1><p>Nothing is posted until its source, question, and dates have been checked.</p><Link href="/">Return to current learning →</Link></section>
  </main>;
}

function newsroomFeatureSet(newsroom: PublicNewsroom) {
  const features = newsroom.features?.length ? newsroom.features : newsroom.featured ? [newsroom.featured] : [];
  return [...features].sort((left, right) => left.publicFrom.localeCompare(right.publicFrom)).map(feature => ({ ...feature, title: safeFeatureTitle(feature) }));
}

export function selectNewsroomFeature(newsroom: PublicNewsroom, today = vancouverDateKey()) {
  const features = newsroomFeatureSet(newsroom);
  const active = features.find(feature => feature.publicFrom <= today && today <= feature.publicUntil);
  if (active) return active;
  return [...features].reverse().find(feature => feature.publicFrom <= today) ?? features[0] ?? null;
}

function featureIsCurrent(feature: PublicNewsroomFeature | null, today = vancouverDateKey()): feature is PublicNewsroomFeature {
  if (!feature) return false;
  return feature.publicFrom <= today && today <= feature.publicUntil && today <= feature.reviewBy;
}

function vancouverDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Vancouver", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const value = (type: "year" | "month" | "day") => parts.find(part => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function formatDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", year: "numeric", timeZone: "America/Vancouver" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function sourceDateLabel(source: PublicNewsroomFeature["sources"][number]) {
  if (source.updatedOn) return `UPDATED ${formatDate(source.updatedOn).toUpperCase()}`;
  if (source.publishedOn) return `PUBLISHED ${formatDate(source.publishedOn).toUpperCase()}`;
  return `CHECKED ${formatDate(source.checkedOn).toUpperCase()}`;
}

function surreyElectionPhase(today: string) {
  if (today < "2026-08-20" || today > "2026-10-31") return { visible: false, label: "", detail: "" };
  if (today < "2026-09-01") return { visible: true, label: "COMING UP", detail: "Election learning begins in September. First question: who decides what in Surrey?" };
  if (today < "2026-09-11") return { visible: true, label: "NOMINATIONS", detail: "Nominations are open. Use candidate information—not a provisional list." };
  if (today < "2026-10-01") return { visible: true, label: "OFFICIAL CANDIDATES", detail: "Nominations are closed. Use the City of Surrey’s official candidate list." };
  if (today < "2026-10-17") return { visible: true, label: "COMPARE + CHECK", detail: "Compare responsibilities, claims, evidence, and trade-offs—not personalities." };
  if (today === "2026-10-17") return { visible: true, label: "ELECTION DAY", detail: "Surrey voters choose a mayor, councillors, and school trustees today." };
  return { visible: true, label: "RESULTS + WHAT NEXT", detail: "Check official results, then ask what the winners can actually do next." };
}

function candidateLinkLabel(today = vancouverDateKey()) {
  return today < "2026-09-11" ? "Candidate information" : "Official candidate list";
}

function electionSourceLabel(source: PublicElection["sources"][number]) {
  return /candidate/i.test(source.title) ? candidateLinkLabel() : source.title;
}

function sourceKindLabel(kind = "source") {
  if (kind.includes("news") || kind.includes("release") || kind.includes("article")) return "ARTICLE";
  if (kind.includes("map")) return "MAP";
  if (kind.includes("image") || kind.includes("photo")) return "IMAGE";
  if (kind.includes("video")) return "VIDEO";
  if (kind.includes("graph") || kind.includes("data")) return "DATA";
  return "SOURCE";
}

function safeFeatureTitle(feature: PublicNewsroomFeature) {
  if (feature.id === "surrey-election-results-and-next-2026") return "Check the official results. What can the winners do next?";
  return feature.title;
}
