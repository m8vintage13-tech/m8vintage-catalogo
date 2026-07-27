import { useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../lib/products";
import { C, font, display } from "../theme";
import { formatPrecio } from "../lib/format";
import { HangTag } from "./HangTag";

export function ProductCard({
  p,
  index = 0,
  featured = false,
}: {
  p: Producto;
  index?: number;
  featured?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : C.SAGE;
  const num = String(p.orden).padStart(2, "0");
  const ink = C.INK;

  return (
    <Link
      to={`/producto/${p.id}`}
      className={`m8-rise${featured ? " feat" : ""}`}
      style={{ textDecoration: "none", animationDelay: `${index * 70}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          background: hover ? C.BEIGE : C.CARD,
          borderRadius: 4,
          overflow: "hidden",
          fontFamily: font,
          transform: hover ? "translateY(-4px)" : "none",
          transition: "background .25s ease, transform .25s cubic-bezier(0.16,1,0.3,1), box-shadow .25s ease",
          border: `1px solid ${hover ? C.BEIGE : C.LINE}`,
          boxShadow: hover ? "0 18px 40px -18px rgba(0,0,0,0.8)" : "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            position: "relative",
            background: ink,
            aspectRatio: featured ? "16 / 10" : "4 / 5",
            overflow: "hidden",
          }}
        >
          <img
            src={p.imagen_url}
            alt={p.nombre}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: p.vendido ? 0.4 : 1,
              transform: hover ? "scale(1.06)" : "scale(1)",
              transition: "transform .6s cubic-bezier(0.16,1,0.3,1)",
            }}
          />

          {/* Número editorial */}
          <span
            style={{
              ...display,
              position: "absolute",
              top: 6,
              right: 12,
              fontSize: featured ? 60 : 42,
              color: hover ? ink : "#fff",
              opacity: hover ? 0.22 : 0.14,
              transition: "color .25s ease, opacity .25s ease",
              lineHeight: 1,
              pointerEvents: "none",
            }}
          >
            {num}
          </span>

          {/* Etiqueta hang-tag */}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <HangTag w={72} h={28} fill={tagFill} holeColor={ink} />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 23,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: ink,
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
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgba(11,11,11,0.55)",
              }}
            >
              <span
                style={{
                  ...display,
                  color: C.BEIGE,
                  fontSize: 20,
                  border: `2px solid ${C.BEIGE}`,
                  padding: "6px 16px",
                  transform: "rotate(-6deg)",
                }}
              >
                Vendido
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            padding: featured ? "16px 18px 18px" : "12px 14px 15px",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: hover ? "rgba(11,11,11,0.6)" : C.MUTED_L,
            }}
          >
            Talle {p.talle}
          </div>
          <div
            style={{
              ...display,
              fontSize: featured ? 24 : 16,
              color: hover ? ink : C.CREAM,
              marginTop: 2,
            }}
          >
            {p.nombre}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <span
              style={{
                ...display,
                fontSize: featured ? 26 : 18,
                color: hover ? ink : C.BEIGE,
              }}
            >
              {formatPrecio(p.precio)}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: ink,
                opacity: hover ? 1 : 0,
                transform: hover ? "translateX(0)" : "translateX(-6px)",
                transition: "opacity .25s ease, transform .25s ease",
              }}
            >
              Ver →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
