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
  // El morph solo aplica a la foto de portada, no a las demás fotos.
  const morphName = isTransitioning && p && activa === p.imagenes[0] ? `product-${id}` : undefined;

  useEffect(() => {
    if (!id) return;
    getProducto(id)
      .then((prod) => {
        setP(prod);
        if (prod) setActiva(prod.imagenes[0]);
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
      <style>{`
        /* Mobile-first: compacto por defecto para que el detalle entre en
           una pantalla de celular sin scroll (botón de WhatsApp visible).
           Desde 640px hay espacio de sobra y se vuelve más espacioso. */
        .m8-shell-inner { padding: 16px 16px 28px; max-width: ${maxW}px; margin: 0 auto; }
        .m8-header-row { padding-bottom: 12px; margin-bottom: 16px; }
        .m8-detail { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .m8-gallery-frame { height: auto; aspect-ratio: 4 / 3; }
        .m8-gallery:has(.m8-thumb-row) .m8-gallery-frame { height: auto; aspect-ratio: 4 / 3; }
        .m8-tags-row { margin-bottom: 14px; }
        .m8-name { font-size: clamp(1.7rem, 8vw, 3.6rem); margin: 0 0 8px; }
        .m8-desc {
          font-size: 13.5px;
          line-height: 1.55;
          margin: 0 0 20px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .m8-talle-block { margin-bottom: 16px; }
        .m8-price { font-size: clamp(1.6rem, 7vw, 2.6rem); margin-bottom: 18px; }
        .m8-cta { padding: 16px 22px; font-size: 15.5px; }
        .m8-size-chip { min-width: 42px; height: 42px; padding: 0 11px; font-size: 13px; }
        .m8-thumb-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .m8-thumb { width: 52px; height: 52px; }

        @media (min-width: 640px) {
          .m8-shell-inner { padding: 22px 16px 64px; }
          .m8-header-row { padding-bottom: 16px; margin-bottom: 26px; }
          .m8-detail { gap: 26px; }
          .m8-gallery-frame { height: auto; aspect-ratio: 4 / 3; }
          .m8-gallery:has(.m8-thumb-row) .m8-gallery-frame { height: auto; aspect-ratio: 4 / 3; }
          .m8-tags-row { margin-bottom: 18px; }
          .m8-name { margin-bottom: 14px; }
          .m8-desc { font-size: 15px; line-height: 1.7; margin-bottom: 24px; -webkit-line-clamp: unset; display: block; overflow: visible; }
          .m8-talle-block { margin-bottom: 22px; }
          .m8-price { margin-bottom: 22px; }
          .m8-cta { padding: 18px 24px; font-size: 16px; }
          .m8-size-chip { min-width: 46px; height: 46px; padding: 0 14px; font-size: 14px; }
          .m8-thumb { width: 72px; height: 72px; }
        }
        @media (min-width: 900px) {
          .m8-detail { grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: start; }
          .m8-detail .m8-gallery { position: sticky; top: 24px; }
        }
        /* Monitores grandes: el contenedor se ensancha para que la galería
           y las cards no queden chicas contra un margen enorme vacío. */
        @media (min-width: 1300px) {
          .m8-shell-inner { max-width: min(88vw, 1560px); }
        }
      `}</style>
      <div className="m8-shell-inner" style={{ position: "relative", zIndex: 2 }}>
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

  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : p.categoria === "USADO" ? C.RUST : C.SAGE;
  const ref = `M8-${String(p.orden).padStart(2, "0")}`;

  return shell(
    <>
      <div
        className="m8-header-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${C.LINE}`,
        }}
      >
        {backLink}
        <span style={{ ...display, color: C.MUTED, fontSize: 13, letterSpacing: "0.1em" }}>#{ref}</span>
      </div>

      <div className="m8-detail">
        {/* Galería */}
        <div className="m8-gallery">
          <div
            className="m8-gallery-frame"
            style={{
              background: C.CARD,
              borderRadius: 6,
              overflow: "hidden",
              border: `1px solid ${C.LINE}`,
            }}
          >
            <img
              src={activa}
              alt={p.nombre}
              style={{ width: "100%", height: "100%", objectFit: "cover", viewTransitionName: morphName }}
            />
          </div>

          {p.imagenes.length > 1 && (
            <div className="m8-thumb-row">
              {p.imagenes.map((src, i) => {
                const on = src === activa;
                return (
                  <button
                    key={src + i}
                    className="m8-thumb"
                    onClick={() => setActiva(src)}
                    style={{
                      padding: 0,
                      borderRadius: 4,
                      overflow: "hidden",
                      cursor: "pointer",
                      background: C.CARD,
                      border: `2px solid ${on ? C.BEIGE : C.LINE}`,
                      opacity: on ? 1 : 0.6,
                      transition: "opacity .2s ease, border-color .2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="m8-rise">
          <div className="m8-tags-row" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
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

            <span
              title="Estado de la prenda"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 13px",
                borderRadius: 20,
                border: `1px solid ${C.LINE}`,
                color: C.MUTED_L,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Estado
              <span style={{ color: C.CREAM }}>{p.estado}/10</span>
            </span>
          </div>

          <h1
            className="m8-name"
            style={{
              ...display,
              color: C.CREAM,
              textWrap: "balance",
            }}
          >
            {p.nombre}
          </h1>

          <p className="m8-desc" style={{ color: C.MUTED_L, maxWidth: "60ch" }}>
            {p.descripcion}
          </p>

          <div className="m8-talle-block">
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.MUTED,
                marginBottom: 8,
              }}
            >
              Talle
            </div>
            <SizeSelector talle={p.talle} />
          </div>

          <div className="m8-price" style={{ ...display, color: C.BEIGE }}>
            {formatPrecio(p.precio)}
          </div>

          <a
            className="m8-cta"
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
