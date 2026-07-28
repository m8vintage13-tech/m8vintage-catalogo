import type { CSSProperties } from "react";

export const C = {
  INK: "#0B0B0B",
  BEIGE: "#E3D0AC",
  CREAM: "#F4F1EA",
  CARD: "#161616",
  CARD2: "#1F1F1F",
  MUTED: "#8A8477",
  MUTED_L: "#9C968A",
  LINE: "#2A2A2A",
  SAGE: "#7FA383",
  RUST: "#B5654A",
} as const;

export const font = "Arial, Helvetica, sans-serif";

export const eyebrow: CSSProperties = {
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontSize: 11,
};

// Titulares tipo streetwear: Arial ultra-black, mayúsculas, tracking negativo.
export const display: CSSProperties = {
  fontWeight: 900,
  textTransform: "uppercase",
  letterSpacing: "-0.03em",
  lineHeight: 0.9,
};

// Grano sutil (textura callejera, hace juego con el logo). SVG fractal noise inline.
export const grainUrl =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const maxW = 1120;
