import { C, display } from "../theme";
import { parseTalles } from "../lib/format";

// Tamaño del chip vive en la clase .m8-size-chip (ver <style> en Product.tsx):
// compacto en mobile, más grande desde 640px, así el detalle entra sin scroll.
export function SizeSelector({ talle }: { talle: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {parseTalles(talle).map((t) => (
        <div
          key={t}
          className="m8-size-chip"
          style={{
            ...display,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
            background: C.BEIGE,
            color: C.INK,
            borderRadius: 4,
          }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}
