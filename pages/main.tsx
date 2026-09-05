import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import ClassroomPortal from "../app/classroom-portal";
import "../app/globals.css";
import "../app/classroom-portal-v2.css";
import "../app/newsroom-public.css";

type Route = "home" | "students" | "families" | "learning" | "portfolio" | "newsroom" | "guide";
const routes = new Set<Route>(["home", "students", "families", "learning", "portfolio", "newsroom", "guide"]);
const routeLabels: Record<Route, string> = {
  home: "Now",
  students: "Students",
  families: "Families",
  learning: "Learning",
  portfolio: "Portfolio",
  newsroom: "Newsroom",
  guide: "Classroom help",
};

function routeFromHash(): Route {
  const candidate = (window.location.hash.replace(/^#\/?/, "") || "home").split("?", 1)[0];
  return routes.has(candidate as Route) ? candidate as Route : "home";
}

function anchorFromHash() {
  const query = window.location.hash.split("?", 2)[1] ?? "";
  return new URLSearchParams(query).get("anchor");
}

function focusRouteDestination(anchor: string | null) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    const target = document.getElementById(anchor ?? "public-main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: "auto" });
  }));
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [announcement, setAnnouncement] = useState("");
  const currentRoute = useRef(route);

  useEffect(() => {
    let initialLoad = true;
    const update = () => {
      const nextRoute = routeFromHash();
      const anchor = anchorFromHash();
      const routeChanged = nextRoute !== currentRoute.current;

      currentRoute.current = nextRoute;
      setRoute(nextRoute);
      document.title = `${routeLabels[nextRoute]} | Mr. Wyatt's Grade 6`;

      if (!initialLoad && routeChanged) setAnnouncement(`${routeLabels[nextRoute]} page loaded.`);
      if (!initialLoad || anchor) focusRouteDestination(anchor);
      initialLoad = false;
    };

    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return <>
    <div className="route-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</div>
    <ClassroomPortal route={route} />
  </>;
}

document.documentElement.style.setProperty("--font-geist-sans", "Inter, ui-sans-serif, system-ui, sans-serif");
document.documentElement.style.setProperty("--font-geist-mono", "ui-monospace, SFMono-Regular, Menlo, monospace");

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
