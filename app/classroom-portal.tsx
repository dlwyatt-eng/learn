"use client";

import RightsStrand, { RightsEntry } from "./rights-strand";
import HomeworkPage, { HomeworkDoorway } from "./homework-page";
import TruthFamilyPage, { TruthLearningLink } from "./truth-family-page";
import { ExplorationRevisits } from "./virtual-explorations";
import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import publicWindowManifest from "./generated/public-window-v2.json";
import { monthlyPublicWindowForDate } from "./monthly-public-window.mjs";
import NewsroomPublic, { selectNewsroomFeature, SurreyElectionStrip, type PublicNewsroom } from "./newsroom-public";
import { publicWindowState, selectPublicWindow, vancouverDateKey } from "./public-window-selection.mjs";

export type PortalRoute = "homework" | "rights" | "home" | "students" | "families" | "newsroom" | "learning" | "portfolio" | "guide" | "truth-and-reconciliation";

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
const isDiscoveryWindow = /discovery/i.test(current.shared.title)
  || /Grade_6_Discovery_Booklet\.pdf$/i.test(current.shared.primaryResource?.href ?? "");
const isLegacyAiOpeningWindow = current.id === "september-opening" && /technology|\bAI\b/i.test(current.shared.title);
const familyMilestones = current.id === "surrey-place-and-election"
  ? [...current.family.milestones.slice(0, 2), ...current.family.milestones.filter(item => item.date === "Oct. 17")].slice(0, 3)
  : current.family.milestones.slice(0, 3);
const welcome = publicWindowManifest.classroomWelcome;
const spacesPending = welcome.spaces.status === "pending";
const spacesUrl = publicWindowManifest.safeLinks.spacesEduCanada;
const schoolUrl = publicWindowManifest.safeLinks.school;
const schoolCalendarUrl = publicWindowManifest.safeLinks.surreyCalendar;
const emailUrl = publicWindowManifest.safeLinks.email;
const emailAddress = emailUrl.replace(/^mailto:/, "").split("?")[0];
const portfolioSummary = publicWindowManifest.portfolioSummary;
const guideSections = publicWindowManifest.guideSections.map(section => spacesPending && section.title === "SpacesEDU" ? {...section, lead: welcome.spaces.title, items: [welcome.spaces.message, welcome.spaces.purpose]} : section);
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
  return { number: index + 1, label, detail: isLegacyAiOpeningWindow ? compactPathCopy[label] ?? literalDetail : literalDetail };
});

const navigation: { route: PortalRoute; href: string; label: string }[] = [
  { route: "home", href: "/", label: "Now" },
  { route: "students", href: "/students", label: "Students" },
  { route: "families", href: "/families", label: "Families" },
  { route: "homework", href: "/homework", label: "Homework" },
  { route: "newsroom", href: "/newsroom", label: "Newsroom" },
  { route: "learning", href: "/learning", label: "Learning" },
];

const largeTextStorageKey = "wyatt-large-text-v1";

function skipToMain(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const main = document.getElementById("public-main");
  if (!main) return;
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: "start", behavior: "auto" });
}

export default function ClassroomPortal({ route }: { route: PortalRoute }) {
  const [largeText, setLargeText] = useState(false);
  const [largeTextReady, setLargeTextReady] = useState(false);

  useEffect(() => {
    try { setLargeText(window.localStorage.getItem(largeTextStorageKey) === "true"); } catch {}
    setLargeTextReady(true);
  }, []);

  useEffect(() => {
    if (!largeTextReady) return;
    try { window.localStorage.setItem(largeTextStorageKey, String(largeText)); } catch {}
  }, [largeText, largeTextReady]);

  return (
    <div className={`portal-shell classroom-window portal-v2${largeText ? " large-text-mode" : ""}`}>
      <a className="public-skip-link" href="#public-main" onClick={skipToMain}>Skip to main content</a>
      <header className="site-header portal-header">
        <Link className="site-brand" href="/">
          <span>W</span>
          <div><strong>Mr. Wyatt&apos;s Grade 6</strong><small>DIVISION 8 · ROOM 112 · ANNEX</small></div>
        </Link>
        <nav id="public-navigation" aria-label="Main navigation">
          {navigation.map(item => <Link key={item.route} href={item.href} className={route === item.route ? "active" : ""} aria-current={route === item.route ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <div className="portal-header-actions">
          <button type="button" className="portal-large-text" aria-label={largeText ? "Use standard text" : "Use large text"} aria-pressed={largeText} onClick={() => setLargeText(value => !value)}><span aria-hidden="true">Aa</span><strong>{largeText ? "Standard text" : "Large text"}</strong></button>
          {spacesPending ? <Link className="header-spaces-link" href="/portfolio">SpacesEDU setup</Link> : <a className="header-spaces-link" href={spacesUrl} target="_blank" rel="noreferrer">SpacesEDU ↗</a>}
        </div>
      </header>

      <div id="public-main" tabIndex={-1}>
        {route === "rights" && <RightsStrand />}
        {route === "home" && <HomePage />}
        {route === "homework" && <HomeworkPage />}
        {route === "students" && <StudentPage />}
        {route === "families" && <FamilyPage />}
        {route === "newsroom" && <NewsroomPublic newsroom={newsroom} />}
        {route === "learning" && <LearningPage />}
        {route === "portfolio" && <PortfolioPage />}
        {route === "guide" && <GuidePage />}
        {route === "truth-and-reconciliation" && <TruthFamilyPage />}
      </div>

      <footer className="site-footer compact-footer">
        <div><strong>Mr. Wyatt&apos;s Grade 6</strong><span>Walnut Road Elementary · Division 8 · 2026–27</span></div>
        <nav aria-label="Footer links">
          <a href={emailUrl}>Email</a>
          <a href={schoolUrl} target="_blank" rel="noreferrer">School site ↗</a>
          {spacesPending ? <Link href="/portfolio">SpacesEDU setup</Link> : <a href={spacesUrl} target="_blank" rel="noreferrer">SpacesEDU Canada ↗</a>}
          <Link href="/guide">Classroom help</Link>
        </nav>
        <p>No student names, work, grades, or private classroom information appear here.</p>
      </footer>
    </div>
  );
}

function WelcomeUpdate() {
  return <section className="welcome-update" aria-labelledby="welcome-update-title">
    <header><small>CLASS UPDATE · {welcome.updatedOn}</small><h2 id="welcome-update-title">Getting settled, together</h2></header>
    <div className="welcome-update-grid"><article><h3>{welcome.recapTitle}</h3><p>{welcome.recap}</p></article><article><h3>{welcome.nextTitle}</h3><p>{welcome.next}</p></article></div>
    <p className="welcome-next"><strong>Looking ahead:</strong> {welcome.later}</p>
    <p><a href="https://dlwyatt-eng.github.io/teacher-hub/?view=Games+%26+Activities&deck=belonging&mode=student">Our belonging question and picture supports →</a> · <a href="https://dlwyatt-eng.github.io/teacher-hub/printables/belonging/Monday_Inclusive_Printables.pdf">Classroom printables (PDF)</a></p><p>These supports offer different ways to communicate the same ideas. They are classroom options, not additional homework.</p>
  </section>;
}
function SchoolDates() {
  const upcoming = publicWindowManifest.schoolEvents.filter(item => item.date ? item.date >= today : item.month >= today.slice(0, 7));
  if (!upcoming.length) return null;
  return <section className="school-dates" aria-labelledby="school-dates-title"><header><small>MARK YOUR CALENDAR · 2026</small><h2 id="school-dates-title">School dates</h2><p>Times are local to Surrey.</p></header><ol>{upcoming.map(item => <li key={item.id}><div>{item.date ? <time dateTime={item.date}>{item.dateLabel}</time> : <span>{item.dateLabel}</span>}</div><div><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}</div></li>)}</ol></section>;
}

function FamilyReminders() {
  return <section className="family-reminders" aria-labelledby="family-reminders-title"><header><small>FOR HOME</small><h2 id="family-reminders-title">A few things to know</h2></header><div>{welcome.reminders.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p>{item.link && <a className="family-reminder-link" href={item.link.url} target="_blank" rel="noreferrer">{item.link.label} ↗</a>}</article>)}</div></section>;
}
function FamilyLinks() {
  return <section className="family-links" aria-labelledby="family-links-title">
    <header><h2 id="family-links-title">Useful family links</h2><p>Payments, school updates, and support for home.</p></header>
    <div>{welcome.familyLinks.map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer"><h3>{item.title} ↗</h3><p>{item.description}</p></a>)}</div>
    <aside className="family-links-note" aria-label={welcome.volunteerInvitation.title}><h3>{welcome.volunteerInvitation.title}</h3><p>{welcome.volunteerInvitation.text}</p><a className="family-reminder-link" href={emailUrl}>{welcome.volunteerInvitation.linkLabel}</a></aside>
    <p className="family-links-note">{welcome.hotLunchNotice}</p>
  </section>;
}
function SpacesStatus({showLink=true}:{showLink?:boolean}) {
  if (!spacesPending) return null;
  return <aside className="spaces-setup" aria-labelledby="spaces-setup-title"><div><small>SPACES EDU · SETUP UPDATE</small><h2 id="spaces-setup-title">{welcome.spaces.title}</h2><p>{welcome.spaces.message}</p></div>{showLink && <Link href="/portfolio">How we will use SpacesEDU →</Link>}</aside>;
}

function HomePage() {
  return <main className="public-home">
    <section className="current-hero">
      <figure data-fit={isDiscoveryWindow ? "contain" : "cover"}><Image unoptimized src={current.shared.visual.src} alt={current.shared.visual.alt} fill priority sizes="(max-width: 1050px) 100vw, 55vw" /><figcaption>{current.shared.visual.caption}</figcaption></figure>
      <div className="current-hero-copy">
        <p className="eyebrow">{windowStateLabel()} · {formatWindowDates()}</p>
        <h1>{welcome.title}</h1>
        <p className="welcome-class">{welcome.classLabel} · {welcome.location}</p>
        <p>{welcome.intro}</p>
        <div className="first-action"><small>OUR CURRENT FOCUS</small><p>{current.shared.title}</p></div>
        <div className="status-pills" aria-label="Quick facts">
          <span>{current.student.duration}</span><span>{compactGrouping()}</span><span>{homeworkStatus()}</span>
        </div>
        <div className="hero-buttons">
          <Link href="/families">Start here, families →</Link>
          <Link href="/students" className="secondary">Student page</Link>
          <a href={emailUrl} className="secondary">Email Mr. Wyatt</a>
          <ResourceDownload compact />
        </div>
      </div>
    </section>

    <HomeworkDoorway />
    <WelcomeUpdate />
    <FamilyReminders />
    <FamilyLinks />
    <SchoolDates />
    <SpacesStatus />

    <section className="home-glance" aria-label="At a glance">
      <div className="key-dates-card">
        <header><small>DATES</small><h2>Learning dates</h2></header>
        <ol>{familyMilestones.map(item => <li key={item.date}><strong>{item.date}</strong><span>{item.shortLabel ?? item.label}</span></li>)}</ol>
      </div>
      <NewsroomDoorway />
    </section>

    {newsroom?.election && <SurreyElectionStrip election={newsroom.election} detailsHref="/newsroom#surrey-election" />}

    <section className="official-link-row" aria-label="Useful official links">
      {spacesPending ? <Link href="/portfolio"><small>PORTFOLIO</small><strong>SpacesEDU · setup update →</strong></Link> : <a href={spacesUrl} target="_blank" rel="noreferrer"><small>PORTFOLIO</small><strong>SpacesEDU Canada ↗</strong></a>}
      <a href={schoolUrl} target="_blank" rel="noreferrer"><small>SCHOOL</small><strong>Walnut Road Elementary ↗</strong></a>
      <a href={emailUrl}><small>CONTACT</small><strong>Email Mr. Wyatt</strong></a>
    </section>
  </main>;
}

function StudentPage() {
  return <main className="content-page audience-page student-page">
    <section className="student-task-hero">
      <figure data-fit={isDiscoveryWindow ? "contain" : "cover"}><Image unoptimized src={current.shared.visual.src} alt={current.shared.visual.alt} fill priority sizes="(max-width: 1050px) 100vw, 53vw" /><figcaption>{current.shared.visual.caption}</figcaption></figure>
      <div>
        <p className="eyebrow">{windowStateLabel()} · FOR STUDENTS</p>
        <h1>{current.student.title}</h1>
        <div className="first-action student-first-action"><small>{studentActionLabel()}</small><p>{current.student.quickReference.firstMove}</p></div>
        <div className="hero-buttons"><ResourceDownload compact /><Link href="/newsroom" className="secondary">Open Newsroom →</Link></div>
      </div>
    </section>

    <HomeworkDoorway />
    <TruthLearningLink />
    <RightsEntry href="#/rights" />
    <section className="student-task-facts" aria-label="Lesson quick facts">
      <article><small>TIME</small><strong>{current.student.duration}</strong></article>
      <article><small>WORK WITH</small><strong>{compactGrouping()}</strong></article>
      <article><small>BRING</small><strong>{compactBring()}</strong></article>
      <article><small>MAKE / SHOW</small><strong>{current.student.product}</strong></article>
    </section>

    <section className="student-purpose-grid" aria-label="Purpose and finish check">
      <article><small>WHY THIS MATTERS</small><h2>Why are we doing this?</h2><p>{current.student.why}</p></article>
      <article><small>FINISH CHECK</small><h2>Before you stop.</h2><p>{current.student.finish}</p></article>
    </section>

    <aside className="student-choice-note" aria-labelledby="student-choice-title">
      <h2 id="student-choice-title">Need another way?</h2>
      <p>{current.student.choices[1]}</p>
      <details><summary>More ways to do the work</summary><ul>{current.student.choices.filter((_, index) => index !== 1).map(choice => <li key={choice}>{choice}</li>)}</ul></details>
    </aside>

    <details className="student-visual-path" aria-labelledby="student-path-title">
      <summary><small>STEPS</small><strong id="student-path-title">See all {studentPathSteps.length} steps</strong></summary>
      <ol>{studentPathSteps.map(step => <li key={step.number}><b>{step.number}</b><div><strong>{step.label}</strong><span>{step.detail}</span></div></li>)}</ol>
    </details>

    {isDiscoveryWindow && <section className="discovery-organizer-map" aria-labelledby="discovery-organizer-title">
      <header><small>YOUR TEACHER CHOOSES ONE</small><h2 id="discovery-organizer-title">Five pages, five ways to begin</h2><p>Work on the whole page your teacher chooses for this visit, including drawing and decoration to show your ideas. You do not have to do all five pages. Each visit lasts 45, 60, or 75 minutes.</p></header>
      <ol>{current.shared.learningArc.map((organizer, index) => <li key={organizer.label}><b>{index + 1}</b><div><strong>{organizer.label}</strong><span>{organizer.studentAction}</span><small>{organizer.timing}</small></div></li>)}</ol>
      <footer><strong>You choose what stays private.</strong><span>Use words, pictures, symbols, a fictional character, or a made-up example. You may skip any question without giving a reason. Ask an adult to write your words or agree on shorter work with your teacher; it does not become catch-up work.</span></footer>
    </section>}

    {isLegacyAiOpeningWindow && <section className="technology-decision-map" aria-labelledby="decision-map-title">
      <header><small>FAST DECISION MAP</small><h2 id="decision-map-title">What kind of moment is this?</h2></header>
      <div>
        <article className="helps"><strong>HELPS LEARNING</strong><p>Practise · organize · question · create · communicate</p></article>
        <article className="check"><strong>CHECK IT</strong><p>Claims · numbers · sources · who made it and how · tool help</p></article>
        <article className="stop"><strong>STOP + ASK</strong><p>Private information · accounts · photos · unsafe content · the tool doing the whole task</p></article>
      </div>
      <footer>Student decides · student explains · help is named</footer>
    </section>}

    <section className="student-next-grid">
      <article><small>HAND IN / SAVE</small><h2>Where your work goes.</h2><p>{current.student.quickReference.handIn}</p></article>
      <article><small>MISSED IT?</small><h2>Ask where to begin.</h2><p>{current.student.quickReference.missed}</p></article>
    </section>

    <p className="student-save-boundary">{current.student.spacesNote}</p>
    <section className="student-launch-row single" aria-label="Student launch point">
      {spacesPending ? <Link href="/portfolio"><div><small>NO UPLOAD DUE</small><strong>SpacesEDU class setup is in progress →</strong></div></Link> : <a href={spacesUrl} target="_blank" rel="noreferrer"><span>↗</span><div><small>FOR WORK YOU CHOOSE TO SHARE · NOT PRIVATE PAGES</small><strong>Open SpacesEDU Canada</strong></div></a>}
    </section>
  </main>;
}

function FamilyPage() {
  return <main className="content-page audience-page family-page">
    <section className="family-dashboard-hero">
      <div>
        <p className="eyebrow">{windowStateLabel()} · FOR FAMILIES</p>
        <h1>{current.family.title}</h1>
        <p className="welcome-class">{welcome.classLabel} · {welcome.location}</p>
        <div className="status-pills"><span>{homeworkStatus()}</span><span>{assessmentStatus()}</span><span>{current.student.duration}</span></div>
      </div>
      <ResourceDownload />
    </section>

    <FamilyReminders />
    <FamilyLinks />
    <SchoolDates />
    <SpacesStatus />
    <HomeworkDoorway />
    <WelcomeUpdate />
    <section className="family-priority-grid">
      <article className="family-dates"><small>DATES</small><h2>Learning dates</h2><ol>{familyMilestones.map(item => <li key={item.date}><strong>{item.date}</strong><span>{item.shortLabel ?? item.label}</span></li>)}</ol></article>
      <article><small>AT SCHOOL</small><h2>Our classroom focus</h2><p>{current.family.quickReference.atSchool}</p></article>
      <article><small>AT HOME</small><h2>How to help</h2><p>{current.family.quickReference.home}</p></article>
      <article><small>ASSESSMENT</small><h2>{assessmentStatus()}</h2><p>{current.family.quickReference.assessment}</p></article>
      <article className="family-product"><small>WHAT STUDENTS MAKE OR SHOW</small><h2>What students make</h2><p>{current.family.product}</p></article>
    </section>

    {isDiscoveryWindow ? <section className="discovery-family-summary" aria-labelledby="discovery-family-title">
      <figure data-fit="contain"><Image unoptimized src={current.shared.visual.src} alt={current.shared.visual.alt} fill sizes="(max-width: 900px) 100vw, 42vw" /><figcaption>ONE OF FIVE DISCOVERY PAGES</figcaption></figure>
      <div><small>THE SHORT VERSION</small><h2 id="discovery-family-title">One whole page, handed in privately</h2><p>{current.family.quickReference.atSchool}</p><ol>{current.shared.learningArc.map((organizer, index) => <li key={organizer.label}><b>{index + 1}</b><span>{organizer.label}</span></li>)}</ol><div className="family-answer-chips"><span>Not homework</span><span>Not graded</span><span>No private story required</span><span>One page per group visit</span></div><ResourceDownload compact /></div>
    </section> : isLegacyAiOpeningWindow ? <section className="family-visual-summary" aria-labelledby="family-flow-title">
      <figure><Image unoptimized src="/images/public-family-artifact-conversation-v1.webp" alt="Illustrated family looking together at a student's paper learning agreement and discussing one question" width={1792} height={1008} sizes="(max-width: 900px) 100vw, 42vw" /><figcaption>ILLUSTRATION · THE PAGE STARTS A CONVERSATION</figcaption></figure>
      <div><small>THE SHORT VERSION</small><h2 id="family-flow-title">Talk → write → follow up</h2><ol><li><b>1</b><span>Pairs and tables reason through realistic choices.</span></li><li><b>2</b><span>Each student writes an agreement in their own words.</span></li><li><b>3</b><span>The teacher uses it for a private follow-up conversation.</span></li></ol><div className="family-answer-chips"><span>No account needed</span><span>No supplies</span><span>Not homework</span><span>Not graded</span></div><ResourceDownload compact /></div>
    </section> : <section className="family-question-card"><div><small>WHY THIS MATTERS</small><blockquote>{current.family.whyThisMatters}</blockquote></div><p><strong>Ask at home:</strong> “{current.family.conversationPrompts[0]}”</p></section>}

    {(isDiscoveryWindow || isLegacyAiOpeningWindow) && <section className="family-question-card"><div><small>ASK AT HOME</small><blockquote>“{current.family.conversationPrompts[0]}”</blockquote></div><p><strong>Privacy and support:</strong> {current.family.agreementNote}</p></section>}

    <TruthLearningLink />
    <RightsEntry href="#/rights" />
    <section className="family-artifact-conversation" aria-label="Family conversation about learning">
      <figure><Image unoptimized src="/images/public-family-artifact-conversation-v1.webp" alt="Illustrated family looking at work a student has chosen to share and asking a supportive question" width={1792} height={1008} /></figure>
      <div><small>WHEN A STUDENT CHOOSES WORK TO SHARE</small><h2>Ask about ideas, not neatness.</h2><p>If your child wants to share, ask what they tried, changed, or learned. Private original pages stay private. Only a safe part the student chooses may be copied separately for sharing, after the teacher asks permission again. Do not upload private Discovery pages to SpacesEDU. The How I Learn Best page is never copied for display.</p></div>
    </section>

    <section className="family-utilities">
      <div><small>STAY IN TOUCH</small><h2>Planners and school email</h2><p>Use the planner for take-home reminders and email Mr. Wyatt with questions or to arrange a conversation. School dates are listed above; check the planner for additional class reminders.</p><p>{spacesPending ? welcome.spaces.message : current.family.quickReference.spaces}</p></div>
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

    <figure className="learning-mosaic"><Image unoptimized src="/images/public-student-learning-mosaic-v1.webp" alt="Fictional classroom panorama of Grade 6 students observing an object and photograph, discussing ideas, building a model, moving, and reading together" width={1792} height={1008} sizes="(max-width: 1180px) 100vw, 1180px" /><figcaption>ILLUSTRATION · OBSERVATION, DISCUSSION, MODEL-MAKING, MOVEMENT, AND READING</figcaption></figure>

    <TruthLearningLink />
    <RightsEntry href="#/rights" />
    <section className="subject-now-grid" aria-labelledby="subject-now-title">
      <header><small>RIGHT NOW</small><h2 id="subject-now-title">Learning by subject</h2></header>
      <div>{current.shared.subjectSnapshot.map(item => <article key={item.subject}><small>{item.subject}</small><h3>{item.now}</h3></article>)}</div>
    </section>

    <ExplorationRevisits />

    <section className="year-at-a-glance" aria-labelledby="year-title">
      <header><small>YEAR AT A GLANCE</small><h2 id="year-title">A look at each of the ten months</h2><p>Plans stay flexible when students need more time or a strong question deserves attention.</p></header>
      <div>{publicWindowManifest.yearMonths.map((item, index) => <article key={item.month}><b>{String(index + 1).padStart(2, "0")}</b><div><small>{item.month}</small><h3>{item.focus}</h3><span>{item.phase}</span></div></article>)}</div>
    </section>

    <section className="simple-callout"><div><small>STUDENTS</small><h2>Need today&apos;s starting point?</h2></div><Link href="/students">Open Student page →</Link></section>
  </main>;
}

function PortfolioPage() {
  return <main className="content-page portfolio-page compact-content-page">
    <SpacesStatus showLink={false}/>
    <section className="portfolio-action-hero">
      <div><p className="eyebrow">PROJECTS &amp; SPACES EDU</p><h1>{spacesPending ? "Getting our portfolios ready" : "Choose. Explain. Reflect."}</h1><p>{welcome.spaces.purpose} Private classroom pages and Discovery originals are not uploaded.</p></div>
      {!spacesPending && <a href={spacesUrl} target="_blank" rel="noreferrer"><small>OFFICIAL CANADIAN SITE</small><strong>Open SpacesEDU Canada ↗</strong></a>}
    </section>

    <h2>{spacesPending ? "Once class access is ready" : "How to make a useful post"}</h2>
    <section className="portfolio-steps" aria-label="How to make a useful post">
      <article><b>1</b><h2>Choose</h2><p>Select work that shows important learning or progress.</p></article>
      <article><b>2</b><h2>Explain</h2><p>Describe something you tried, a problem you worked on, how you helped, or a change you made.</p></article>
      <article><b>3</b><h2>Reflect</h2><p>Say what changed and what you will try next.</p></article>
    </section>

    <section className="portfolio-current"><div><small>CURRENT LEARNING</small><h2>{current.student.title}</h2></div><p>{current.student.spacesNote}</p></section>

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
      {guideSections.map((section, index) => <article key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{section.title.toUpperCase()}</small><h2>{section.lead}</h2>{section.items.map(item => <p key={item}>{publicGuideItem(item)}</p>)}</div></article>)}
    </section>

    <section className="contact-action-card"><div><small>CONTACT MR. WYATT</small><h2>Questions or concerns?</h2><p>Use school email to arrange a conversation or ask what matters most after an absence.</p></div><a href={emailUrl}>{emailAddress}</a></section>

    <section className="official-link-row" aria-label="Official links">
      <a href={schoolUrl} target="_blank" rel="noreferrer"><small>SCHOOL</small><strong>Walnut Road Elementary ↗</strong></a>
      <a href={schoolCalendarUrl} target="_blank" rel="noreferrer"><small>DATES</small><strong>Surrey Schools calendar ↗</strong></a>
      {spacesPending ? <Link href="/portfolio"><small>PORTFOLIO</small><strong>SpacesEDU · setup update →</strong></Link> : <a href={spacesUrl} target="_blank" rel="noreferrer"><small>PORTFOLIO</small><strong>SpacesEDU Canada ↗</strong></a>}
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
  if (state === "up-next") return "UP NEXT · HOW WE WILL START";
  if (state === "finished") return "RECENT LEARNING · HOW WE STARTED";
  return "STUDENTS START HERE";
}

function studentActionLabel() {
  const state = currentWindowState();
  if (state === "up-next") return "HOW WE WILL START";
  if (state === "finished") return "HOW WE STARTED";
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
  return /^no\b/i.test(current.family.homework) ? "No routine homework" : "Check family reminders";
}

function assessmentStatus() {
  return /not graded/i.test(current.family.assessment) ? "Practice · not graded" : "Feedback to help learning";
}

function publicGuideItem(item: string) {
  if (spacesPending && /Check (Now|This week) and SpacesEDU/.test(item)) return "Check the planner and this hub, then ask Mr. Wyatt where to begin after an absence. No SpacesEDU upload is due while class setup is in progress.";
  return item.replace("Check This week and SpacesEDU", "Check Now and SpacesEDU");
}
