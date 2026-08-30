"use client";

import { useState } from "react";
import Image from "next/image";

function KickSequence({ reveal = "none", focus = 1 }: { reveal?: "none" | "ball" | "pair"; focus?: number }) {
  return <figure className={`public-kick-sequence focus-${focus}`}>
    <Image unoptimized src="/images/forces-kick-sequence.png" width={1774} height={887} alt="Three side-view frames show the same student before touching a soccer ball, during foot-to-ball contact, and after the ball moves away." />
    <figcaption><span>BEFORE CONTACT</span><span>DURING CONTACT</span><span>AFTER CONTACT</span></figcaption>
    {reveal !== "none" && <div className="public-kick-force force-on-ball"><i></i><b>force on ball from foot</b></div>}
    {reveal === "pair" && <div className="public-kick-force force-on-foot"><i></i><b>force on foot from ball</b></div>}
    {reveal !== "none" && <div className="public-kick-motion"><i></i><b>motion after contact</b></div>}
    {reveal === "pair" && <p className="public-kick-note">The pair acts during contact on two different objects.</p>}
  </figure>;
}

const readiness = [
  { title: "Which object receives the push?", prompt: "A foot kicks a soccer ball.", choices: ["Foot", "Ball", "Field", "Goal"], answer: 1, why: "The foot applies the force; the ball receives the push that changes its motion.", visual: "kick" },
  { title: "How should the force arrow be drawn?", prompt: "Show the force on the ball from the foot.", choices: ["Beside the ball, pointing with its motion", "Start on the ball, point in the force direction, and label the interaction", "Start on the foot and point backward", "Always point downward"], answer: 1, why: "Begin on the receiving object, point in the force direction, and name the interaction.", visual: "pair" },
  { title: "Motion right; friction left", prompt: "What happens next to the rolling skateboard?", choices: ["Instantly moves left", "Keeps the same speed", "Slows while still moving right", "Speeds up right"], answer: 2, why: "A leftward force can slow an object that is still moving right. Motion and force need not point the same way." },
  { title: "Equal pulls in opposite directions", prompt: "What do equal opposite forces predict?", choices: ["Change left", "Change right", "No change in motion", "No forces act"], answer: 2, why: "The net force is zero, so motion does not change. Forces can still be present." },
  { title: "A book rests on a table", prompt: "Which description is most complete?", choices: ["No forces act", "Only gravity acts", "Gravity down and support up", "The table pushes sideways"], answer: 2, why: "Earth pulls down and the table supports up. Those forces balance." },
  { title: "Same push; different mass", prompt: "Which cart changes speed more?", choices: ["Empty cart", "Loaded cart", "They must change equally", "Neither"], answer: 0, why: "For the same applied force, the lower-mass cart has the larger change in motion." },
];

function ForceReadiness({ scene }: { scene: number }) {
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const item = readiness[question];
  const selected = answers[question];
  const score = readiness.reduce((sum, current, index) => sum + (answers[index] === current.answer ? 1 : 0), 0);
  if (scene === 1) return <section className="public-force-lab"><header><small>TARGETED REVIEW</small><h3>Review only the ideas your evidence shows you need.</h3></header><div className="review-grid">{readiness.map((current, index) => <article key={current.title} className={answers[index] === undefined ? "unfinished" : answers[index] === current.answer ? "secure" : "review"}><b>{answers[index] === undefined ? "?" : answers[index] === current.answer ? "✓" : "↺"}</b><span><strong>{current.title}</strong><small>{answers[index] === undefined ? "Finish the check first" : answers[index] === current.answer ? "Secure—create a new example" : current.why}</small></span></article>)}</div></section>;
  if (scene === 2) return <section className="public-force-lab readiness-summary"><header><small>DECIDE THE NEXT MOVE</small><h3>{Object.keys(answers).length < 6 ? "Finish all six questions" : score >= 5 ? "Ready to investigate" : score >= 3 ? "Review, then investigate" : "Pause for a foundations clinic"}</h3></header><strong>{score}<span>/6</span></strong><p>Create one new case for a classmate: draw an object, add a labelled force arrow, and predict whether its motion changes.</p></section>;
  return <section className="public-force-lab"><header><small>QUESTION {question + 1} OF 6 · VOTE BEFORE CLICKING</small><h3>{item.title}</h3><p>{item.prompt}</p></header>{item.visual && <KickSequence reveal={selected === undefined ? "none" : item.visual === "pair" ? "pair" : "ball"} />}<div className="choice-grid">{item.choices.map((choice, index) => <button key={choice} disabled={selected !== undefined} className={selected === index ? index === item.answer ? "correct" : "incorrect" : selected !== undefined && index === item.answer ? "answer" : ""} onClick={() => setAnswers(current => ({ ...current, [question]: index }))}><b>{String.fromCharCode(65 + index)}</b>{choice}</button>)}</div>{selected !== undefined && <aside className={selected === item.answer ? "correct" : "incorrect"}><b>{selected === item.answer ? "Supported" : "Revise this idea"}</b><p>{item.why}</p></aside>}<footer><button disabled={question === 0} onClick={() => setQuestion(question - 1)}>← Previous</button><span>{Object.keys(answers).length} / 6 recorded</span><button disabled={selected === undefined || question === 5} onClick={() => setQuestion(question + 1)}>Next →</button></footer></section>;
}

function ForcePatterns({ scene }: { scene: number }) {
  const cases = [
    ["Coin above a cup", "The card moves quickly; the coin drops almost straight down.", "Motion resists changing"],
    ["Same push, loaded cart", "The loaded cart changes speed less than the empty cart.", "Same force + more mass = less change"],
    ["Balloon rocket", "Air moves backward while the balloon moves forward.", "Two objects push in opposite directions"],
    ["Equal tug", "The centre marker remains still while both sides pull.", "Zero net force"],
  ];
  const [open, setOpen] = useState(0);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const current = cases[open];
  if (scene === 0) return <section className="public-force-lab"><header><small>PATTERN BEFORE LAW NUMBER</small><h3>Four events—three connected motion patterns.</h3></header><div className="case-tabs">{cases.map((item, index) => <button key={item[0]} className={open === index ? "selected" : ""} onClick={() => setOpen(index)}>{item[0]}</button>)}</div><article className="evidence-card"><small>OBSERVED EVIDENCE</small><h4>{current[0]}</h4><p>{current[1]}</p><details><summary>Commit to a pattern, then reveal</summary><strong>{current[2]}</strong><p>Name the objects and draw the interaction before attaching a law number.</p></details></article></section>;
  const items = scene === 1 ? ["Coin + card: repeated observation", "Loaded cart: three measurements + graph", "Two surfaces: friction comparison", "Balloon rocket: interaction pair"] : scene === 2 ? ["Balanced PhET case", "Unbalanced PhET case", "Same force, different mass", "Screenshot/sketch + model limitation"] : ["Learners predict first", "Receiving object named", "Interaction-labelled arrows", "Evidence cited", "Model limit visible"];
  return <section className="public-force-lab"><header><small>{scene === 1 ? "HANDS-ON STATIONS" : scene === 2 ? "PHET MODEL CHECK" : "TWO-MINUTE EXPERT TEACH"}</small><h3>{scene === 1 ? "One result is not a pattern." : scene === 2 ? "Can the model reproduce the evidence?" : "Make your audience use the law."}</h3><p>{scene === 2 ? "Predict before touching a control. Record agreement and one simplification." : "Mark complete only when the evidence is visible."}</p></header><div className="check-grid">{items.map((item, index) => <button key={item} className={checks[index] ? "checked" : ""} onClick={() => setChecks(value => ({ ...value, [index]: !value[index] }))}><b>{checks[index] ? "✓" : index + 1}</b>{item}</button>)}</div><footer><strong>{Object.values(checks).filter(Boolean).length} / {items.length} evidenced</strong><span>{scene === 3 ? "Finish: This is the ___ pattern because the evidence shows ___." : "Record a limitation before moving on."}</span></footer></section>;
}

const crashData = [
  { name: "No padding", times: [42, 44, 43], forces: [238, 227, 233] },
  { name: "Thin foam", times: [78, 82, 80], forces: [128, 122, 125] },
  { name: "Thick foam", times: [145, 150, 147], forces: [69, 67, 68] },
];
const average = (values: number[]) => Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);

function CrashLab({ scene }: { scene: number }) {
  const [condition, setCondition] = useState(0);
  const [trials, setTrials] = useState<Record<number, number>>({ 0: 0, 1: 0, 2: 0 });
  const [claim, setClaim] = useState<number | null>(null);
  const allComplete = crashData.every((_, index) => trials[index] === 3);
  if (scene === 0) return <section className="public-force-lab"><header><small>SUDDEN STOP</small><h3>What safely changes the passenger&apos;s motion?</h3><p>Predict first: the car stops, but the passenger continues until an interaction supplies a stopping force.</p></header><div className="stop-cases"><article><b>WITHOUT A BELT</b><p>The passenger continues forward until the dashboard, seat, or another object exerts a force.</p></article><article><b>WITH A BELT</b><p>The belt stretches slightly and changes the passenger&apos;s motion over more time.</p></article></div><aside><b>Draw it:</b><p>Put the stopping-force arrow on the passenger—the object receiving the force.</p></aside></section>;
  if (scene === 1) { const current = crashData[condition]; const count = trials[condition]; return <section className="public-force-lab"><header><small>SIMULATED MODEL OUTPUT · NOT PHYSICAL SENSOR DATA</small><h3>Keep mass and speed locked.</h3><p>The numbers form an illustrative dataset generated by this model. Treat the pattern as evidence within the model—not as measurements from a real cart.</p></header><div className="case-tabs">{crashData.map((item, index) => <button key={item.name} className={condition === index ? "selected" : ""} onClick={() => setCondition(index)}>{item.name} · {trials[index]}/3</button>)}</div><div className="trial-table"><span>TRIAL</span><span>STOPPING TIME</span><span>PEAK FORCE</span>{[0,1,2].map(index => <><b key={`n-${index}`}>{index + 1}</b><strong key={`t-${index}`}>{index < count ? `${current.times[index]} ms` : "—"}</strong><strong key={`f-${index}`}>{index < count ? `${current.forces[index]} N` : "—"}</strong></>)}</div><button className="run-trial" disabled={count === 3} onClick={() => setTrials(value => ({ ...value, [condition]: Math.min(3, count + 1) }))}>{count === 3 ? "Three model trials complete" : `Run model trial ${count + 1}`}</button><footer><strong>{allComplete ? "Nine simulated trials complete" : "Collect all conditions before concluding"}</strong><span>Write every value and the model limitation in your own table.</span></footer></section>; }
  if (scene === 2) return <section className="public-force-lab"><header><small>COMPARE TWO VARIABLES TOGETHER</small><h3>Longer stopping time; lower largest force.</h3></header><div className="crash-bars">{crashData.map(item => <article key={item.name}><strong>{item.name}</strong><span><small>Stopping time</small><i style={{ width: `${average(item.times) / 1.6}%` }}></i><b>{average(item.times)} ms</b></span><span><small>Peak force</small><i className="force" style={{ width: `${average(item.forces) / 2.5}%` }}></i><b>{average(item.forces)} N</b></span></article>)}</div><aside><b>Mechanism:</b><p>Foam can squash farther, spreading the change in motion over more distance and time. Padding does not remove force.</p></aside></section>;
  const claims = ["Thick foam removed the force.", "In this model, thicker foam increased stopping time and reduced peak force.", "One successful trial proves every real helmet is safe."];
  return <section className="public-force-lab"><header><small>CLAIM · EVIDENCE · REASONING · LIMIT</small><h3>Make the data do the talking.</h3></header><div className="choice-grid">{claims.map((item, index) => <button key={item} className={claim === index ? index === 1 ? "correct" : "incorrect" : ""} onClick={() => setClaim(index)}><b>{String.fromCharCode(65 + index)}</b>{item}</button>)}</div>{claim !== null && <aside className={claim === 1 ? "correct" : "incorrect"}><b>{claim === 1 ? "Supported by all three conditions" : "The evidence cannot support that claim"}</b><p>Cite two averages, explain the mechanism, then name one simplification of this model.</p></aside>}</section>;
}

function MovementLab({ scene }: { scene: number }) {
  const [frame, setFrame] = useState(0);
  const [route, setRoute] = useState(0);
  const [claim, setClaim] = useState<number | null>(null);
  const frames = ["Before contact", "During contact", "After contact"];
  if (scene === 0) return <section className="public-force-lab"><header><small>OBSERVATION BEFORE EXPLANATION</small><h3>Freeze the instant when motion changes.</h3></header><div className="case-tabs">{frames.map((item, index) => <button key={item} className={frame === index ? "selected" : ""} onClick={() => setFrame(index)}>{item}</button>)}</div><KickSequence focus={frame} /><aside><b>Record only what the image shows:</b><p>_____ changed from _____ to _____. What cannot a still image tell you?</p></aside></section>;
  if (scene === 1) return <section className="public-force-lab"><header><small>CONTACT FORCE PAIR</small><h3>Which object receives each force?</h3><p>The forces are equal and opposite during contact, but they act on different objects.</p></header><KickSequence focus={1} reveal="pair" /><aside><b>Add gravity separately:</b><p>Gravity acts downward on the ball and on the person before, during, and after contact.</p></aside></section>;
  if (scene === 2) { const routes = ["Video annotation", "Object roll/stop test", "Seated safe push/stop", "Low-intensity standing comparison"]; return <section className="public-force-lab"><header><small>FOUR EQUALLY VALID ROUTES</small><h3>Choose evidence—not performance.</h3></header><div className="route-grid">{routes.map((item,index) => <button key={item} className={route === index ? "selected" : ""} onClick={() => setRoute(index)}><b>{index + 1}</b>{item}</button>)}</div><aside><b>Fair comparison:</b><p>Change _____; observe or measure _____; keep _____ the same; stop if _____.</p></aside></section>; }
  const claims = ["Bend your knees because that is the right way.", "A longer, controlled landing can increase stopping time; compare the frames and name the body–ground forces.", "Good athletes always land the same way."];
  return <section className="public-force-lab"><header><small>REPAIR THE COACHING SLOGAN</small><h3>Use evidence without judging bodies.</h3></header><div className="choice-grid">{claims.map((item,index) => <button key={item} className={claim === index ? index === 1 ? "correct" : "incorrect" : ""} onClick={() => setClaim(index)}><b>{String.fromCharCode(65 + index)}</b>{item}</button>)}</div>{claim !== null && <aside className={claim === 1 ? "correct" : "incorrect"}><b>{claim === 1 ? "Mechanism + evidence + respectful limits" : "This claim is vague, unsupported, or exclusionary"}</b><p>Write a stronger cue that names the interaction and allows for different bodies, equipment, surfaces, and needs.</p></aside>}</section>;
}

function DeliveryPod({ scene }: { scene: number }) {
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [height, setHeight] = useState(0);
  const items = scene === 0 ? ["Common material kit only", "Sealed egg; nothing taped to shell", "Agreed size and mass limits", "Release without throwing or pushing", "Mechanism named before decoration"] : scene === 1 ? ["Every material has a stated job", "Egg is restrained inside pod", "Padding can deform", "Release point is clear", "Teacher safety check complete"] : scene === 2 ? ["Practice height measured", "Result and deformation recorded", "One feature changed", "Reason cites Crash Lab evidence", "Before/after revision is visible"] : ["Team design photo or Minecraft model", "Results table", "My own feature explanation", "Evidence for the revision", "Limitation and next step"];
  return <section className="public-force-lab"><header><small>{scene === 0 ? "DESIGN BRIEF" : scene === 1 ? "BUILD CONFERENCE" : scene === 2 ? "PRACTICE + REVISION" : "PORTFOLIO HIGHLIGHT"}</small><h3>{scene === 0 ? "A fair challenge—not a mystery craft." : scene === 1 ? "Build the claim into the pod." : scene === 2 ? "One measured test; one visible revision." : "Team product + individual evidence."}</h3></header><div className="check-grid">{items.map((item,index) => <button key={item} className={checks[index] ? "checked" : ""} onClick={() => setChecks(value => ({ ...value, [index]: !value[index] }))}><b>{checks[index] ? "✓" : index + 1}</b>{item}</button>)}</div>{scene === 3 && <div className="height-ladder"><small>MEASURED CHALLENGE RECORD</small><strong>{["0.5 m","1.0 m","1.5 m","2.0 m","Teacher-set maximum"][height]}</strong><span><button disabled={height === 0} onClick={() => setHeight(height - 1)}>←</button><button disabled={height === 4} onClick={() => setHeight(height + 1)}>Next height →</button></span></div>}<footer><strong>{Object.values(checks).filter(Boolean).length} / {items.length} visible</strong><span>{scene === 3 ? "Explain what the evidence supports—and what one drop cannot prove." : "Use evidence before adding decoration."}</span></footer></section>;
}

export default function ForcesStudentLab({ lessonId, scene }: { lessonId: string; scene: number }) {
  if (lessonId === "force-sprint") return <ForceReadiness scene={scene} />;
  if (lessonId === "force-patterns-lab") return <ForcePatterns scene={scene} />;
  if (lessonId === "crash-lab") return <CrashLab scene={scene} />;
  if (lessonId === "movement-forces") return <MovementLab scene={scene} />;
  if (lessonId === "safer-impact-studio") return <DeliveryPod scene={scene} />;
  return null;
}
