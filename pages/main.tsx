import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import ClassroomPortal from "../app/classroom-portal";
import "../app/globals.css";
import "../app/classroom-portal-v2.css";
import "../app/newsroom-public.css";

type Route = "home" | "students" | "families" | "learning" | "portfolio" | "newsroom" | "guide";
const routes = new Set<Route>(["home", "students", "families", "learning", "portfolio", "newsroom", "guide"]);

function routeFromHash(): Route {
  const candidate = window.location.hash.replace(/^#\/?/, "") || "home";
  return routes.has(candidate as Route) ? candidate as Route : "home";
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  useEffect(() => {
    const update = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return <ClassroomPortal route={route} />;
}

document.documentElement.style.setProperty("--font-geist-sans", "Inter, ui-sans-serif, system-ui, sans-serif");
document.documentElement.style.setProperty("--font-geist-mono", "ui-monospace, SFMono-Regular, Menlo, monospace");

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
