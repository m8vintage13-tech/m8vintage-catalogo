import { useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../lib/products";
import { C, font, eyebrow } from "../theme";
import { formatPrecio } from "../lib/format";
import { HangTag } from "./HangTag";

export function ProductCard({ p }: { p: Producto }) {
  const [hover, setHover] = useState(false);
  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : C.SAGE;

  return (
    <Link
      to={`/producto/${p.id}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          background: hover ? C.BEIGE : C.CARD,
          borderRadius: 14,
          overflow: "hidden",
          fontFamily: font,
          transform: hover ? "translateY(-3px)" : "none",
          transition: "all .18s ease",
          border: `1px solid ${hover ? C.BEIGE : C.LINE}`,
        }}
      >
        <div style={{ position: "relative", background: C.INK, aspectRatio: "3/4" }}>
          <img
            src={p.imagen_url}
            alt={p.nombre}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: p.vendido ? 0.5 : 1,
              background: C.INK,
            }}
          />
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <HangTag w={70} h={28} fill={tagFill} holeColor={C.INK} />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: C.INK,
                }}
              >
                {p.categoria}
              </span>
            </span>
          </div>
          {p.vendido && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: C.INK,
                color: C.BEIGE,
                ...eyebrow,
                fontSize: 9,
                padding: "4px 8px",
                borderRadius: 6,
              }}
            >
              VENDIDO
            </div>
          )}
        </div>
        <div style={{ padding: "10px 12px 14px" }}>
          <div style={{ ...eyebrow, color: hover ? C.INK : C.MUTED_L, fontSize: 10 }}>
            TALLE {p.talle}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: hover ? C.INK : C.CREAM,
              marginTop: 3,
            }}
          >
            {p.nombre}
          </div>
          <div
            style={{
              fontWeight: 900,
              fontSize: 16,
              color: hover ? C.INK : C.BEIGE,
              marginTop: 4,
              letterSpacing: "-0.5px",
            }}
          >
            {formatPrecio(p.precio)}
          </div>
        </div>
      </div>
    </Link>
  );
}
