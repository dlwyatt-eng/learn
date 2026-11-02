import Link from 'next/link';
import manifest from './generated/public-window-v2.json';

export const learningUpdates = manifest.learningUpdates;

export function LearningUpdateSummary() {
 return <section className="learning-update-summary">
  <p className="eyebrow">CLASSROOM UPDATE · {learningUpdates.updatedOn}</p>
  <h2>{learningUpdates.title}</h2><p>{learningUpdates.summary}</p>
  <p>{learningUpdates.note}</p>
  <Link href="/learning#subject-now-title">See what we’re learning →</Link>
 </section>;
}

export default function SubjectLearningUpdates() {
 return <section className="subject-now-grid" aria-labelledby="subject-now-title">
  <header><small>LATEST CLASSROOM UPDATE · {learningUpdates.updatedOn}</small><h2 id="subject-now-title">Learning by subject</h2><p>{learningUpdates.note}</p></header>
  <div>{learningUpdates.subjects.map(item=><article key={item.subject} data-subject={item.subject}>
   <small>{item.subject}</small><p className="subject-learning-status">{item.status}</p><h3>{item.focus}</h3><p>{item.detail}</p>
  </article>)}</div>
 </section>;
}
