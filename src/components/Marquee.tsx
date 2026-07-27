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
  // Se duplica el contenido para un loop sin costura (-50% de traslación).
  const seq = [...items, ...items];
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
