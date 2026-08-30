import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; unoptimized?: boolean };

export default function Image({ fill, priority, unoptimized, style, src, ...props }: ImageProps) {
  const resolved = typeof src === "string" && src.startsWith(import.meta.env.BASE_URL)
    ? src
    : typeof src === "string" && src.startsWith("/")
      ? `${import.meta.env.BASE_URL}${src.slice(1)}`
      : src;
  return <img {...props} src={resolved} loading={priority ? "eager" : props.loading} style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style} />;
}
