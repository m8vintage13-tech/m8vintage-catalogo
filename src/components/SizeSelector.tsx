import { C, eyebrow } from "../theme";

const TALLES = ["XS", "S", "M", "L", "XL"];

export function SizeSelector({ talle }: { talle: string }) {
  if (!TALLES.includes(talle)) {
    return (
      <div
        style={{
          ...eyebrow,
          display: "inline-block",
          background: C.INK,
          color: C.BEIGE,
          padding: "8px 14px",
          borderRadius: 8,
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
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13,
              background: on ? C.INK : "transparent",
              color: on ? C.BEIGE : C.MUTED,
              border: `1px solid ${on ? C.INK : C.LINE}`,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}
