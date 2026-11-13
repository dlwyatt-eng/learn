import React from "react";
import { focusRouteDestination } from "./route-focus";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Link({ href, onClick, ...props }: LinkProps) {
  const target = href.startsWith("/") && !href.startsWith("//")
    ? (() => {
        const [route, anchor] = href.split("#", 2);
        return `#${route}${anchor ? `?anchor=${encodeURIComponent(anchor)}` : ""}`;
      })()
    : href;
  const activate: React.MouseEventHandler<HTMLAnchorElement> = event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (props.download != null || (props.target && props.target !== "_self")) return;
    // Repeating the current hash does not fire hashchange. Still honour the
    // visitor's request to return to this section (or to the top of the page).
    if (!target.startsWith("#/") || target !== window.location.hash) return;
    event.preventDefault();
    const query = target.split("?", 2)[1] ?? "";
    focusRouteDestination(new URLSearchParams(query).get("anchor"));
  };
  return <a {...props} href={target} onClick={activate} />;
}
