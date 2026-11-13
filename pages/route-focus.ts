/** Put both reading position and keyboard focus at a route destination. */
export function focusRouteDestination(anchor: string | null) {
  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    const target = document.getElementById(anchor ?? "public-main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: "auto" });
  }));
}
