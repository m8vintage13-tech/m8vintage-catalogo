import { display } from "../theme";

/** Cinta horizontal en loop (staple del streetwear). Movimiento en CSS. */
export function Marquee({
  items,
  bg,
  color,
  sep = "✦",
}: {
  items: string[];
  bg: string;
  color: string;
  sep?: string;
}) {
  // Loop sin costura vía translateX(-50%): el track son dos mitades
  // idénticas. Cada mitad se repite varias veces para que su ancho supere
  // el de cualquier viewport realista — si una mitad fuera más angosta que
  // la pantalla, al final del ciclo no quedaría contenido para llenarla y
  // aparecería un hueco en blanco antes de reiniciar.
  const REPEAT = 6;
  const half = Array.from({ length: REPEAT }, () => items).flat();
  const seq = [...half, ...half];
  return (
    <div
      style={{
        background: bg,
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid rgba(0,0,0,0.14)",
        borderBottom: "1px solid rgba(0,0,0,0.14)",
      }}
    >
      <div
        className="m8-marquee-track"
        style={{ display: "inline-flex", willChange: "transform" }}
      >
        {seq.map((t, i) => (
          <span
            key={i}
            style={{
              ...display,
              color,
              fontSize: 15,
              letterSpacing: "0.04em",
              padding: "11px 0",
              display: "inline-flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            {t}
            <span style={{ opacity: 0.5, fontSize: 12 }}>{sep}</span>
            <span style={{ display: "inline-block", width: 22 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
