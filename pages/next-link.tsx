import React from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Link({ href, ...props }: LinkProps) {
  const target = href.startsWith("/") && !href.startsWith("//") ? `#${href}` : href;
  return <a {...props} href={target} />;
}
