import { C, display, font, maxW } from "../theme";
import { IconArrowLeft, IconChat } from "../components/Icons";
import { Link, useParams, useViewTransitionState } from "react-router-dom";
import { formatPrecio, whatsappUrl } from "../lib/format";
import { useEffect, useState } from "react";

import { Grain } from "../components/Grain";
import { HangTag } from "../components/HangTag";
import type { Producto } from "../lib/products";
import { SizeSelector } from "../components/SizeSelector";
import { getProducto } from "../lib/products";

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activa, setActiva] = useState<string>("");
  const isTransitioning = useViewTransitionState(`/producto/${id}`);
  // El morph solo aplica a la imagen original del producto, no a las miniaturas.
  const morphName = isTransitioning && p && activa === p.imagen_url ? `product-${id}` : undefined;

  useEffect(() => {
    if (!id) return;
    getProducto(id)
      .then((prod) => {
        setP(prod);
        if (prod) setActiva(prod.imagen_url);
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  const backLink = (
    <Link
      to="/#catalogo"
      viewTransition
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: C.MUTED_L,
        textDecoration: "none",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        padding: "13px 4px",
        margin: "-13px -4px",
      }}
    >
      <IconArrowLeft size={17} color={C.MUTED_L} /> Volver
    </Link>
  );

  const shell = (children: React.ReactNode) => (
    <div style={{ fontFamily: font, background: C.INK, minHeight: "100vh", position: "relative" }}>
      <Grain />
      <div style={{ position: "relative", zIndex: 2, maxWidth: maxW, margin: "0 auto", padding: "22px 16px 64px" }}>
        {children}
      </div>
    </div>
  );

  if (loading) return shell(<p style={{ color: C.MUTED }}>Cargando…</p>);

  if (!p)
    return shell(
      <>
        {backLink}
        <p style={{ color: C.CREAM, marginTop: 28, ...display, fontSize: 22 }}>
          Producto no encontrado.
        </p>
      </>
    );

  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : C.SAGE;
  const ref = `M8-${String(p.orden).padStart(2, "0")}`;
  const miniaturas = [p.imagen_url, p.imagen_url, p.imagen_url];

  return shell(
    <>
      <style>{`
        .m8-detail { display: grid; grid-template-columns: 1fr; gap: 26px; }
        @media (min-width: 900px) {
          .m8-detail { grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: start; }
          .m8-detail .m8-gallery { position: sticky; top: 24px; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${C.LINE}`,
          paddingBottom: 16,
          marginBottom: 26,
        }}
      >
        {backLink}
        <span style={{ ...display, color: C.MUTED, fontSize: 13, letterSpacing: "0.1em" }}>#{ref}</span>
      </div>

      <div className="m8-detail">
        {/* Galería */}
        <div className="m8-gallery">
          <div
            style={{
              background: C.CARD,
              borderRadius: 6,
              overflow: "hidden",
              aspectRatio: "4 / 5",
              border: `1px solid ${C.LINE}`,
            }}
          >
            <img
              src={activa}
              alt={p.nombre}
              style={{ width: "100%", height: "100%", objectFit: "cover", viewTransitionName: morphName }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {miniaturas.map((src, i) => {
              const on = src === activa;
              return (
                <button
                  key={i}
                  onClick={() => setActiva(src)}
                  style={{
                    width: 76,
                    height: 76,
                    padding: 0,
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: C.CARD,
                    border: `2px solid ${on ? C.BEIGE : C.LINE}`,
                    opacity: on ? 1 : 0.6,
                    transition: "opacity .2s ease, border-color .2s ease",
                  }}
                >
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div className="m8-rise">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <HangTag w={88} h={30} holeR={2.8} fill={tagFill} holeColor={C.INK} />
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 27,
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  whiteSpace: "nowrap",
                  color: C.INK,
                }}
              >
                {p.categoria}
              </span>
            </span>
          </div>

          <h1
            style={{
              ...display,
              fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
              color: C.CREAM,
              margin: "0 0 14px",
              textWrap: "balance",
            }}
          >
            {p.nombre}
          </h1>

          <p style={{ color: C.MUTED_L, fontSize: 15, lineHeight: 1.7, maxWidth: "60ch", margin: 0 }}>
            {p.descripcion}
          </p>

          <div style={{ ...display, fontSize: "clamp(1.8rem, 5vw, 2.6rem)", color: C.BEIGE, marginBottom: 22 }}>
            {formatPrecio(p.precio)}
          </div>

          <div style={{ margin: "30px 0", paddingTop: 24, borderTop: `1px solid ${C.LINE}` }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.MUTED,
                marginBottom: 12,
              }}
            >
              Talle
            </div>
            <SizeSelector talle={p.talle} />
          </div>

          <a
            href={whatsappUrl(p.nombre, formatPrecio(p.precio))}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              width: "100%",
              boxSizing: "border-box",
              background: C.BEIGE,
              color: C.INK,
              textDecoration: "none",
              ...display,
              fontSize: 16,
              padding: "18px 24px",
              borderRadius: 4,
              transition: "transform .2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
          >
            <IconChat size={21} color={C.INK} /> Consultar por WhatsApp
          </a>

          {p.vendido && (
            <p style={{ color: C.MUTED, fontSize: 16, marginTop: 15, textAlign: "center" }}>
              Esta pieza figura como vendida — consultá por disponibilidad.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
