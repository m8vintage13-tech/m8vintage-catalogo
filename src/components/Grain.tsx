import { grainUrl } from "../theme";

/** Overlay de grano fijo sobre toda la vista. Muy sutil, textura callejera. */
export function Grain({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: grainUrl,
        opacity,
        pointerEvents: "none",
        mixBlendMode: "overlay",
        zIndex: 1,
      }}
    />
  );
}
