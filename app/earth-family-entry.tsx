import "./earth-family-entry.css";

export default function EarthFamilyEntry() {
  const base=typeof window!=="undefined" && window.location.pathname.startsWith("/learn")?"/learn/":"/";
  return <aside className="earth-family-entry" aria-labelledby="earth-family-heading">
    <h2 id="earth-family-heading">Earth, Stuff &amp; Fairness</h2>
    <p>An optional five-minute conversation about an ordinary object, the people behind it, and a change worth checking. This is not a new assignment or a change to this week’s learning.</p>
    <a href={`${base}earth-stuff-fairness/`}>Open the student and family conversation →</a>
  </aside>;
}
