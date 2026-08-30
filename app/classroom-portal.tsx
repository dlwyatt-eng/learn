"use client";

import Link from "next/link";
import Image from "next/image";
import publicWindowManifest from "./generated/public-window-v2.json";
import { monthlyPublicWindowForDate } from "./monthly-public-window.mjs";
import NewsroomPublic, { selectNewsroomFeature, SurreyElectionStrip, type PublicNewsroom } from "./newsroom-public";
import { publicWindowState, selectPublicWindow, vancouverDateKey } from "./public-window-selection.mjs";

export type PortalRoute = "home" | "students" | "families" | "newsroom" | "learning" | "portfolio" | "guide";

type PublicWindow = Omit<typeof publicWindowManifest.window, "shared"> & {
  shared: Omit<typeof publicWindowManifest.window.shared, "primaryResource"> & {
    primaryResource: typeof publicWindowManifest.window.shared.primaryResource | null;
  };
};

const publicWindows = ((publicWindowManifest as unknown as { windows?: PublicWindow[] }).windows ?? [publicWindowManifest.window]) as PublicWindow[];
const today = vancouverDateKey();
const current = selectPublicWindow(publicWindows, today)
  ?? (monthlyPublicWindowForDate(publicWindowManifest.yearMonths, publicWindowManifest.window, today) as PublicWindow | null)
  ?? (publicWindowManifest.window as PublicWindow);
const familyMilestones = current.id === "surrey-place-and-election"
  ? [...current.family.milestones.slice(0, 2), ...current.family.milestones.filter(item => item.date === "Oct. 17")].slice(0, 3)
  : current.family.milestones.slice(0, 3);
const spacesUrl = publicWindowManifest.safeLinks.spacesEduCanada;
const schoolUrl = publicWindowManifest.safeLinks.school;
const schoolCalendarUrl = publicWindowManifest.safeLinks.surreyCalendar;
const emailUrl = publicWindowManifest.safeLinks.email;
const emailAddress = emailUrl.replace(/^mailto:/, "").split("?")[0];
const portfolioSummary = publicWindowManifest.portfolioSummary;
const newsroom = (publicWindowManifest as unknown as { newsroom?: PublicNewsroom }).newsroom;
const compactPathCopy: Record<string, string> = {
  Detect: "Can you tell who made it? Point to a clue and say what it proves.",
  Sort: "Choose Helps, Check, or Stop + Ask.",
  Prompt: "Change ‘do it for me’ into questions.",
  Repair: "Circle what must be checked and fix one part.",
  Draft: "Write one class commitment that says what to do.",
  Agree: "Write your own commitment and teacher question.",
};
const studentPathSteps = current.student.steps.slice(0, 6).map((step, index) => {
  const [label, ...rest] = step.split(":");
  const literalDetail = rest.join(":").trim();
  return { number: index + 1, label, detail: current.id === "september-opening" ? compactPathCopy[label] ?? literalDetail : literalDetail };
});

const navigation: { route: PortalRoute; href: string; label: string }[] = [
  { route: "home", href: "/", label: "Now" },
  { route: "students", href: "/students", label: "Students" },
  { route: "families", href: "/families", label: "Families" },
  { route: "newsroom", href: "/newsroom", label: "Newsroom" },
  { route: "learning", href: "/learning", label: "Learning" },
];

export default function ClassroomPortal({ route }: { route: PortalRoute }) {
  return (
    <div className="portal-shell classroom-window portal-v2">
      <a className="public-skip-link" href="#public-main">Skip to main content</a>
      <header className="site-header portal-header">
        <Link className="site-brand" href="/">
          <span>W</span>
          <div><strong>Mr. Wyatt&apos;s Grade 6</strong><small>WALNUT ROAD ELEMENTARY</small></div>
        </Link>
        <nav id="public-navigation" aria-label="Main navigation">
          {navigation.map(item => <Link key={item.route} href={item.href} className={route === item.route ? "active" : ""} aria-current={route === item.route ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <a className="header-spaces-link" href={spacesUrl} target="_blank" rel="noreferrer">SpacesEDU ↗</a>
      </header>

      <div id="public-main" tabIndex={-1}>
        {route === "home" && <HomePage />}
        {route === "students" && <StudentPage />}
        {route === "families" && <FamilyPage />}
        {route === "newsroom" && <NewsroomPublic newsroom={newsroom} />}
        {route === "learning" && <LearningPage />}
        {route === "portfolio" && <PortfolioPage />}
        {route === "guide" && <GuidePage />}
      </div>

      <footer className="site-footer compact-footer">
        <div><strong>Mr. Wyatt&apos;s Grade 6</strong><span>Student &amp; Family Site · 2026–27</span></div>
        <nav aria-label="Footer links">
          <a href={emailUrl}>Email</a>
          <a href={schoolUrl} target="_blank" rel="noreferrer">School site ↗</a>
          <a href={spacesUrl} target="_blank" rel="noreferrer">SpacesEDU Canada ↗</a>
          <Link href="/guide">Classroom help</Link>
        </nav>
        <p>No student names, work, grades, or private classroom information appear here.</p>
      </footer>
    </div>
  );
}

function HomePage() {
  return <main className="public-home">
    <section className="current-hero">
      <figure><Image unoptimized src={current.shared.visual.src} alt={current.shared.visual.alt} fill priority sizes="(max-width: 1050px) 100vw, 55vw" /><figcaption>{current.shared.visual.caption}</figcaption></figure>
      <div className="current-hero-copy">
        <p className="eyebrow">{windowStateLabel()} · {formatWindowDates()}</p>
        <h1>{current.student.title}</h1>
        <div className="first-action"><small>{homeActionLabel()}</small><p>{current.student.firstMove}</p></div>
        <div className="status-pills" aria-label="Quick facts">
          <span>{current.student.duration}</span><span>{compactGrouping()}</span><span>{homeworkStatus()}</span>
        </div>
        <div className="hero-buttons">
          <Link href="/students">Student page →</Link>
          <Link href="/families" className="secondary">Family page</Link>
          <ResourceDownload compact />
        </div>
      </div>
    </section>

    <section className="home-glance" aria-label="At a glance">
      <div className="key-dates-card">
        <header><small>DATES</small><h2>Learning dates</h2></header>
        <ol>{familyMilestones.map(item => <li key={item.date}><strong>{item.date}</strong><span>{item.shortLabel ?? item.label}</span></li>)}</ol>
      </div>
      <NewsroomDoorway />
    </section>

    {newsroom?.election && <SurreyElectionStrip election={newsroom.election} detailsHref="/newsroom#surrey-election" />}

    <section className="official-link-row" aria-label="Useful official links">
      <a href={spacesUrl} target="_blank" rel="noreferrer"><small>PORTFOLIO</small><strong>SpacesEDU Canada ↗</strong></a>
      <a href={schoolUrl} target="_blank" rel="noreferrer"><small>SCHOOL</small><strong>Walnut Road Elementary ↗</strong></a>
      <a href={emailUrl}><small>CONTACT</small><strong>Email Mr. Wyatt</strong></a>
    </section>
  </main>;
}

function StudentPage() {
  return <main className="content-page audience-page student-page">
    <section className="student-task-hero">
      <figure><Image unoptimized src={current.shared.visual.src} alt={current.shared.visual.alt} fill priority sizes="(max-width: 1050px) 100vw, 53vw" /><figcaption>{current.shared.visual.caption}</figcaption></figure>
      <div>
        <p className="eyebrow">{windowStateLabel()} · FOR STUDENTS</p>
        <h1>{current.student.title}</h1>
        <div className="first-action student-first-action"><small>{studentActionLabel()}</small><p>{current.student.quickReference.firstMove}</p></div>
        <div className="hero-buttons"><ResourceDownload compact /><Link href="/newsroom" className="secondary">Open Newsroom →</Link></div>
      </div>
    </section>

    <section className="student-task-facts" aria-label="Lesson quick facts">
      <article><small>TIME</small><strong>{current.student.duration}</strong></article>
      <article><small>WORK WITH</small><strong>{compactGrouping()}</strong></article>
      <article><small>BRING</small><strong>{compactBring()}</strong></article>
      <article><small>FINISH</small><strong>{current.student.product}</strong></article>
    </section>

    <details className="student-visual-path" aria-labelledby="student-path-title">
      <summary><small>LEARNING ROUTE</small><strong id="student-path-title">See all {studentPathSteps.length} moves</strong></summary>
      <ol>{studentPathSteps.map(step => <li key={step.number}><b>{step.number}</b><div><strong>{step.label}</strong><span>{step.detail}</span></div></li>)}</ol>
    </details>

    {current.id === "september-opening" && <section className="technology-decision-map" aria-labelledby="decision-map-title">
      <header><small>FAST DECISION MAP</small><h2 id="decision-map-title">What kind of moment is this?</h2></header>
      <div>
        <article className="helps"><strong>HELPS LEARNING</strong><p>Practise · organize · question · create · communicate</p></article>
        <article className="check"><strong>CHECK IT</strong><p>Claims · numbers · sources · who made it and how · tool help</p></article>
        <article className="stop"><strong>STOP + ASK</strong><p>Private information · accounts · photos · unsafe content · the tool doing the whole task</p></article>
      </div>
      <footer>Student decides · student explains · help is named</footer>
    </section>}

    <section className="student-next-grid">
      <article><small>FINISH / SAVE</small><h2>Keep the part that matters.</h2><p>{current.student.quickReference.handIn}</p></article>
      <article><small>MISSED IT?</small><h2>Recover the important part.</h2><p>{current.student.quickReference.missed}</p></article>
    </section>

    <section className="student-launch-row single" aria-label="Student launch point">
      <a href={spacesUrl} target="_blank" rel="noreferrer"><span>↗</span><div><small>WHEN YOUR TEACHER ASKS</small><strong>Open SpacesEDU Canada</strong></div></a>
    </section>
  </main>;
}

function FamilyPage() {
  return <main className="content-page audience-page family-page">
    <section className="family-dashboard-hero">
      <div>
        <p className="eyebrow">{windowStateLabel()} · FOR FAMILIES</p>
        <h1>{current.family.title}</h1>
        <div className="status-pills"><span>{homeworkStatus()}</span><span>{assessmentStatus()}</span><span>{current.student.duration}</span></div>
      </div>
      <ResourceDownload />
    </section>

    <section className="family-priority-grid">
      <article className="family-dates"><small>DATES</small><h2>Learning dates</h2><ol>{familyMilestones.map(item => <li key={item.date}><strong>{item.date}</strong><span>{item.shortLabel ?? item.label}</span></li>)}</ol></article>
      <article><small>AT SCHOOL</small><h2>What students will do</h2><p>{current.family.quickReference.atSchool}</p></article>
      <article><small>AT HOME</small><h2>Nothing due</h2><p>{current.family.quickReference.home}</p></article>
      <article><small>ASSESSMENT</small><h2>{assessmentStatus()}</h2><p>{current.family.quickReference.assessment}</p></article>
    </section>

    {current.id === "september-opening" ? <section className="family-visual-summary" aria-labelledby="family-flow-title">
      <figure><Image unoptimized src="/images/public-family-artifact-conversation-v1.webp" alt="Illustrated family looking together at a student's paper learning agreement and discussing one question" width={1792} height={1008} sizes="(max-width: 900px) 100vw, 42vw" /><figcaption>ILLUSTRATION · THE PAGE STARTS A CONVERSATION</figcaption></figure>
      <div><small>THE SHORT VERSION</small><h2 id="family-flow-title">Talk → write → follow up</h2><ol><li><b>1</b><span>Pairs and tables reason through realistic choices.</span></li><li><b>2</b><span>Each student writes an agreement in their own words.</span></li><li><b>3</b><span>The teacher uses it for a private follow-up conversation.</span></li></ol><div className="family-answer-chips"><span>No account needed</span><span>No supplies</span><span>Not homework</span><span>Not graded</span></div><ResourceDownload compact /></div>
    </section> : <section className="family-question-card"><div><small>WHY THIS MATTERS</small><blockquote>{current.family.whyThisMatters}</blockquote></div><p><strong>Ask at home:</strong> “{current.family.conversationPrompts[0]}”</p></section>}

    {current.id === "september-opening" && <section className="family-question-card"><div><small>ASK AT HOME</small><blockquote>“{current.family.conversationPrompts[0]}”</blockquote></div><p><strong>Agreement note:</strong> {current.family.agreementNote}</p></section>}

    <section className="family-utilities">
      <div><small>SPACES EDU</small><h2>Selected evidence, feedback, and reflection</h2><p>{current.family.quickReference.spaces}</p><a href={spacesUrl} target="_blank" rel="noreferrer">Open SpacesEDU Canada ↗</a></div>
      <nav aria-label="Family contact and official links">
        <a href={emailUrl}><strong>Email Mr. Wyatt</strong><span>{emailAddress}</span></a>
        <a href={schoolUrl} target="_blank" rel="noreferrer"><strong>Walnut Road Elementary</strong><span>Official school site ↗</span></a>
        <a href={schoolCalendarUrl} target="_blank" rel="noreferrer"><strong>Surrey Schools calendar</strong><span>District dates ↗</span></a>
        <Link href="/guide"><strong>Classroom help</strong><span>Homework, absences, and expectations →</span></Link>
      </nav>
    </section>
  </main>;
}

function LearningPage() {
  return <main className="content-page learning-page compact-content-page">
    <section className="functional-page-header">
      <p className="eyebrow">WHAT WE&apos;RE LEARNING · 2026–27</p>
      <h1>Now and across the year</h1>
      <p><strong>{windowStateLabel()}:</strong> {current.shared.title}</p>
    </section>

    <figure className="learning-mosaic"><Image unoptimized src="/images/public-student-learning-mosaic-v1.webp" alt="Illustrated panorama of Grade 6 students reading, analyzing a map, investigating science materials, making art, moving, discussing, and using a shared projector" width={1792} height={1008} sizes="(max-width: 1180px) 100vw, 1180px" /><figcaption>ILLUSTRATION · READING, DISCUSSION, DATA, MAKING, MOVEMENT, ART, AND SHARED-SCREEN INQUIRY</figcaption></figure>

    <section className="subject-now-grid" aria-labelledby="subject-now-title">
      <header><small>RIGHT NOW</small><h2 id="subject-now-title">Learning by subject</h2></header>
      <div>{current.shared.subjectSnapshot.map(item => <article key={item.subject}><small>{item.subject}</small><h3>{item.now}</h3></article>)}</div>
    </section>

    <section className="year-at-a-glance" aria-labelledby="year-title">
      <header><small>YEAR AT A GLANCE</small><h2 id="year-title">Ten monthly focuses</h2><p>Plans stay flexible when students need more time or a strong question deserves attention.</p></header>
      <div>{publicWindowManifest.yearMonths.map((item, index) => <article key={item.month}><b>{String(index + 1).padStart(2, "0")}</b><div><small>{item.month}</small><h3>{item.focus}</h3><span>{item.phase}</span></div></article>)}</div>
    </section>

    <section className="simple-callout"><div><small>STUDENTS</small><h2>Need today&apos;s starting point?</h2></div><Link href="/students">Open Student page →</Link></section>
  </main>;
}

function PortfolioPage() {
  return <main className="content-page portfolio-page compact-content-page">
    <section className="portfolio-action-hero">
      <div><p className="eyebrow">PROJECTS &amp; SPACES EDU</p><h1>Choose. Explain. Reflect.</h1><p>SpacesEDU is where students share selected evidence, feedback, and reflection—not every piece of class work.</p></div>
      <a href={spacesUrl} target="_blank" rel="noreferrer"><small>OFFICIAL CANADIAN SITE</small><strong>Open SpacesEDU Canada ↗</strong></a>
    </section>

    <section className="portfolio-steps" aria-label="How to make a useful post">
      <article><b>1</b><h2>Choose</h2><p>Select work that shows important learning or progress.</p></article>
      <article><b>2</b><h2>Explain</h2><p>Name a decision, challenge, contribution, or revision.</p></article>
      <article><b>3</b><h2>Reflect</h2><p>Say what changed and what you will try next.</p></article>
    </section>

    <section className="portfolio-current"><div><small>CURRENT WINDOW</small><h2>{current.student.title}</h2></div><p>{current.student.spacesNote}</p></section>

    <details className="compact-disclosure">
      <summary>See major projects across the year</summary>
      <div className="project-title-list">{publicWindowManifest.projects.map(project => <article key={project.id}><small>{project.timing}</small><h2>{project.title}</h2><p>{project.question}</p></article>)}</div>
    </details>

    <p className="portfolio-selection-note">{portfolioSummary.selectionGuidance}</p>
  </main>;
}

function GuidePage() {
  return <main className="content-page guide-page compact-content-page">
    <section className="functional-page-header"><p className="eyebrow">CLASSROOM HELP</p><h1>Four quick answers</h1></section>

    <section className="guide-quick-grid">
      {publicWindowManifest.guideSections.map((section, index) => <article key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{section.title.toUpperCase()}</small><h2>{section.lead}</h2>{section.items.map(item => <p key={item}>{publicGuideItem(item)}</p>)}</div></article>)}
    </section>

    <section className="contact-action-card"><div><small>CONTACT MR. WYATT</small><h2>Questions or concerns?</h2><p>Use school email to arrange a conversation or ask what matters most after an absence.</p></div><a href={emailUrl}>{emailAddress}</a></section>

    <section className="official-link-row" aria-label="Official links">
      <a href={schoolUrl} target="_blank" rel="noreferrer"><small>SCHOOL</small><strong>Walnut Road Elementary ↗</strong></a>
      <a href={schoolCalendarUrl} target="_blank" rel="noreferrer"><small>DATES</small><strong>Surrey Schools calendar ↗</strong></a>
      <a href={spacesUrl} target="_blank" rel="noreferrer"><small>PORTFOLIO</small><strong>SpacesEDU Canada ↗</strong></a>
    </section>
  </main>;
}

function ResourceDownload({ compact = false }: { compact?: boolean }) {
  const resource = current.shared.primaryResource;
  if (!resource) return null;
  return <a className={`resource-download${compact ? " compact" : ""}`} href={resource.href} download>
    <span aria-hidden="true">↓</span>
    <div><small>{resource.format}</small><strong>{resource.label}</strong>{!compact && <p>{resource.description}</p>}</div>
  </a>;
}

function NewsroomDoorway() {
  const today = vancouverDateKey();
  const feature = newsroom ? selectNewsroomFeature(newsroom, today) : null;
  const title = feature?.title ?? newsroom?.shared.title ?? "Grade 6 Newsroom";
  const question = feature?.question ?? newsroom?.shared.bigQuestion ?? "What does the source show?";
  const preview = feature?.preview;
  const currentSource = Boolean(feature && feature.publicFrom <= today && today <= feature.publicUntil && today <= feature.reviewBy);
  const sourceLabel = currentSource ? "CURRENT SOURCE" : "HISTORICAL SOURCE";
  const checkedLabel = feature ? ` · CHECKED ${formatShortDate(feature.checkedOn).toUpperCase()}` : "";
  return <article className="newsroom-home-card">{preview && <div className="newsroom-home-source"><small>DATED EXCERPT{checkedLabel}</small><blockquote>“{preview.text}”</blockquote><span>{preview.credit}</span></div>}<div><small>{sourceLabel}{checkedLabel}</small><h2>{title}</h2><p>{question}</p><Link href="/newsroom">Open the source and evidence →</Link></div></article>;
}

function windowStateLabel() {
  const state = currentWindowState();
  if (state === "up-next") return "COMING UP";
  if (state === "finished") return "RECENTLY FINISHED";
  return "HAPPENING NOW";
}

function homeActionLabel() {
  const state = currentWindowState();
  if (state === "up-next") return "UP NEXT · TRY THE FIRST MOVE";
  if (state === "finished") return "RECENT LEARNING · REVIEW THE FIRST MOVE";
  return "STUDENTS START HERE";
}

function studentActionLabel() {
  const state = currentWindowState();
  if (state === "up-next") return "TRY THE FIRST MOVE";
  if (state === "finished") return "THE FIRST MOVE WAS";
  return "DO THIS FIRST";
}

function currentWindowState(): "up-next" | "current" | "finished" {
  return publicWindowState(current);
}

function formatWindowDates() {
  const start = formatShortDate(current.effectiveFrom);
  const end = formatShortDate(current.effectiveTo);
  return `${start}–${end.replace(/^\D+\s/, "")}`;
}

function formatShortDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric", timeZone: "America/Vancouver" }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

function compactGrouping() {
  if (/partner/i.test(current.student.grouping) && /table/i.test(current.student.grouping)) return "Pairs + table groups";
  return current.student.grouping.split(/[;.]/)[0];
}

function compactBring() {
  const first = current.student.bring[0] ?? "Ask your teacher";
  return /pencil/i.test(first) ? "Pencil" : first;
}

function homeworkStatus() {
  return /^no\b/i.test(current.family.homework) ? "No homework or special supplies" : "Check the family page";
}

function assessmentStatus() {
  return /not graded/i.test(current.family.assessment) ? "Practice · not graded" : "Formative assessment";
}

function publicGuideItem(item: string) {
  return item.replace("Check This week and SpacesEDU", "Check Now and SpacesEDU");
}
