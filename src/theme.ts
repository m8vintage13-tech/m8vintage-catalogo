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
} as const;

export const font = "Arial, Helvetica, sans-serif";

export const eyebrow: CSSProperties = {
  fontWeight: 800,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  fontSize: 11,
};
