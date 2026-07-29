import { C, display, font } from "../theme";
import { Link, useViewTransitionState } from "react-router-dom";

import { HangTag } from "./HangTag";
import type { Producto } from "../lib/products";
import { formatPrecio, parseTalles } from "../lib/format";
import { useState } from "react";

export function ProductCard({ p, index = 0 }: { p: Producto; index?: number }) {
  const [hover, setHover] = useState(false);
  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : p.categoria === "USADO" ? C.RUST : C.SAGE;
  const ink = C.INK;
  const to = `/producto/${p.id}`;
  const isTransitioning = useViewTransitionState(to);

  return (
    <Link
      to={to}
      viewTransition
      className="m8-rise"
      style={{ textDecoration: "none", animationDelay: `${index * 70}ms`, display: "block", height: "100%" }}
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
          border: `1px solid ${hover ? C.BEIGE : "rgba(227,208,172,0.22)"}`,
          boxShadow: hover ? "0 18px 40px -18px rgba(0,0,0,0.8)" : "none",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Imagen */}
        <div
          style={{
            position: "relative",
            background: ink,
            aspectRatio: "4 / 5",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <img
            src={p.imagenes[0]}
            alt={p.nombre}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: p.vendido ? 0.4 : 1,
              transform: hover ? "scale(1.06)" : "scale(1)",
              transition: "transform .6s cubic-bezier(0.16,1,0.3,1)",
              viewTransitionName: isTransitioning ? `product-${p.id}` : undefined,
            }}
          />

          {/* Etiqueta hang-tag */}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <HangTag w={76} h={26} holeR={2.6} fill={tagFill} holeColor={ink} />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 22,
                  fontSize: 8,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  color: ink,
                }}
              >
                {p.categoria}
              </span>
            </span>
          </div>

          {/* Puntaje de estado */}
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <span
              title="Estado de la prenda"
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 2,
                background: "rgba(11,11,11,0.55)",
                color: C.CREAM,
                fontWeight: 800,
                fontSize: 11,
                padding: "5px 8px",
                borderRadius: 20,
                lineHeight: 1,
              }}
            >
              {p.estado}
              <span style={{ fontSize: 8, opacity: 0.7 }}>/10</span>
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

        {/* Info: nombre, descripción, talle, precio */}
        <div
          style={{
            padding: "13px 14px 15px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
          }}
        >
          <div
            style={{
              ...display,
              fontSize: 18,
              lineHeight: 1.5,
              color: hover ? ink : C.CREAM,
            }}
          >
            {p.nombre}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 13,

              color: hover ? "rgba(11,11,11,0.65)" : C.MUTED_L,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {p.descripcion}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 5,
              marginTop: "auto",
              paddingTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: hover ? "rgba(11,11,11,0.55)" : C.MUTED_L,
              }}
            >
              Talle
            </span>
            {parseTalles(p.talle).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 3,
                  border: `1px solid ${hover ? "rgba(11,11,11,0.3)" : "rgba(227,208,172,0.35)"}`,
                  color: hover ? ink : C.CREAM,
                }}
              >
                {t}
              </span>
            ))}
          </div>

          <span
            style={{
              ...display,
              fontSize: 18,
              lineHeight: 1.5,
              color: hover ? ink : C.BEIGE,
            }}
          >
            {formatPrecio(p.precio)}
          </span>
        </div>
      </div>
    </Link>
  );
}
