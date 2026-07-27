import { C, display } from "../theme";

const TALLES = ["XS", "S", "M", "L", "XL"];

export function SizeSelector({ talle }: { talle: string }) {
  if (!TALLES.includes(talle)) {
    return (
      <div
        style={{
          ...display,
          display: "inline-block",
          background: C.BEIGE,
          color: C.INK,
          padding: "10px 16px",
          fontSize: 14,
          borderRadius: 4,
        }}
      >
        Talle único
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {TALLES.map((t) => {
        const on = t === talle;
        return (
          <div
            key={t}
            title={on ? "Disponible" : undefined}
            style={{
              width: 46,
              height: 46,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              fontWeight: 900,
              fontSize: 14,
              background: on ? C.BEIGE : "transparent",
              color: on ? C.INK : C.MUTED,
              border: `1px solid ${on ? C.BEIGE : C.LINE}`,
              opacity: on ? 1 : 0.55,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}
