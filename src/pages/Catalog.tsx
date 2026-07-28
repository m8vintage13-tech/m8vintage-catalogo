import { C, display, font, grainUrl, maxW } from "../theme";
import {
  INSTAGRAM_URL,
  INSTAGRAM_USER,
  LOCATION,
  WHATSAPP_NUMBER,
} from "../config";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Grain } from "../components/Grain";
import { HangTag } from "../components/HangTag";
import { Marquee } from "../components/Marquee";
import { ProductCard } from "../components/ProductCard";
import type { Producto } from "../lib/products";
import { listProductos } from "../lib/products";

// Borde dentado tipo "ticket arrancado de un rollo": clip-path en % para que
// escale con el ancho real del footer sin depender de cálculos en píxeles.
const TICKET_TEETH = 26;
const TICKET_ZIGZAG = (() => {
  const pts: string[] = [];
  for (let i = 0; i < TICKET_TEETH; i++) {
    pts.push(`${(((i + 0.5) / TICKET_TEETH) * 100).toFixed(2)}% 0%`);
    pts.push(`${(((i + 1) / TICKET_TEETH) * 100).toFixed(2)}% 100%`);
  }
  return `polygon(0% 100%, ${pts.join(", ")})`;
})();

// Ancho de barras del "código de barras" decorativo, patrón fijo (no random)
// para que el render sea siempre idéntico.
const BARCODE = [
  2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1,
  3, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1,
];

export default function Catalog() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    listProductos()
      .then(setProductos)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // Al volver desde el detalle (link con #catalogo), saltar a la grilla
  // de productos en vez de arrancar de nuevo en el hero.
  useEffect(() => {
    if (loading || location.hash !== "#catalogo") return;
    const el = document.getElementById("catalogo");
    el?.scrollIntoView({ block: "start" });
  }, [loading, location.hash]);

  const waGeneric = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div style={{ fontFamily: font, background: C.INK, minHeight: "100vh", position: "relative" }}>
      <Grain />
      <style>{`
        .m8-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; align-items: stretch; }
        @media (min-width: 768px) {
          .m8-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        .m8-hero-h1 { font-size: clamp(2.2rem, 8vw, 4.5rem); }
        /* Contenedor del catálogo: ancho fijo hasta laptop, y a partir de
           monitores grandes se ensancha para que las cards/imágenes no
           queden diminutas contra un montón de margen vacío. */
        .m8-catalog-main { max-width: ${maxW}px; margin: 0 auto; }
        @media (min-width: 1300px) {
          .m8-catalog-main { max-width: min(88vw, 1560px); }
        }
      `}</style>

      {/* HERO */}
      <header
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(48px, 9vw, 96px) 20px clamp(40px, 7vw, 72px)",
          zIndex: 2,
        }}
      >
        {/* Watermark hang-tag */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0.045,
            pointerEvents: "none",
          }}
        >
          <HangTag w={720} h={320} fill={C.BEIGE} holeColor={C.INK} rotate={-14} />
        </div>

        <div style={{ position: "relative", maxWidth: maxW, margin: "0 auto", textAlign: "center" }}>
          <img
            src="/logo.png"
            alt="M8"
            className="m8-rise"
            style={{
              width: "clamp(120px, 22vw, 200px)",
              height: "clamp(120px, 22vw, 200px)",
              borderRadius: "50%",
              border: `3px solid ${C.BEIGE}`,
              objectFit: "cover",
              background: C.INK,
              boxShadow: "0 0 0 8px rgba(227,208,172,0.06), 0 24px 60px -20px rgba(0,0,0,0.9)",
            }}
          />

          <h1
            className="m8-hero-h1 m8-rise"
            style={{
              ...display,
              margin: "clamp(20px, 4vw, 34px) 0 0",
              color: C.CREAM,
              textWrap: "balance",
              animationDelay: "80ms",
            }}
          >
            Vintage
            <br />
            <span style={{ color: C.BEIGE }}>&amp; Streetwear</span>
          </h1>

          {/* Meta row */}
          <div
            className="m8-rise"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px 18px",
              marginTop: 22,
              animationDelay: "160ms",
            }}
          >
            {["Prendas seleccionadas 🇺🇸"].map((t, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "10px 18px" }}>
                {i > 0 && <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.MUTED }} />}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.MUTED_L,
                  }}
                >
                  {t}
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <Marquee
        items={["Vintage", "Streetwear", "Basketball", "90s", "M8"]}
        bg={C.BEIGE}
        color={C.INK}
      />

      {/* GRID */}
      <main
        id="catalogo"
        className="m8-catalog-main"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "clamp(36px, 6vw, 64px) 16px clamp(48px, 7vw, 72px)",
          scrollMarginTop: 16,
        }}
      >
        <div
          style={{
            marginBottom: 24,
            borderBottom: `1px solid ${C.LINE}`,
            paddingBottom: 16,
          }}
        >
          <h2 style={{ ...display, color: C.CREAM, fontSize: "clamp(1.6rem, 5vw, 2.6rem)", margin: 0 }}>
            Catálogo
          </h2>
        </div>

        {loading ? (
          <p style={{ color: C.MUTED, textAlign: "center", padding: "40px 0" }}>Cargando…</p>
        ) : productos.length === 0 ? (
          <p style={{ color: C.MUTED, textAlign: "center", padding: "40px 0" }}>
            Todavía no hay productos cargados.
          </p>
        ) : (
          <div className="m8-grid">
            {productos.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER — ticket / comprobante vintage */}
      <footer style={{ position: "relative", zIndex: 2, background: C.BEIGE, color: C.INK, overflow: "hidden" }}>
        {/* Borde arrancado tipo rollo de ticket */}
        <div aria-hidden style={{ height: 14, background: C.INK, clipPath: TICKET_ZIGZAG }} />

        <div style={{ position: "relative" }}>
          {/* Textura de grano + rayado fino, solo dentro del footer */}
          <div
            aria-hidden
            style={{ position: "absolute", inset: 0, backgroundImage: grainUrl, opacity: 0.1, mixBlendMode: "multiply", pointerEvents: "none" }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `repeating-linear-gradient(115deg, rgba(11,11,11,0.05) 0px, rgba(11,11,11,0.05) 1px, transparent 1px, transparent 6px)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", maxWidth: 460, margin: "0 auto", padding: "clamp(28px, 5vw, 44px) 24px clamp(32px, 5vw, 48px)", textAlign: "center" }}>

            {/* Encabezado tipo comprobante */}
            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.45 }}>
              ✦ Comprobante ✦
            </p>

            {/* Brand name */}
            <h2 style={{ ...display, fontSize: "clamp(2.6rem, 11vw, 4.6rem)", margin: "8px 0 0", lineHeight: 0.9 }}>
              M8 VINTAGE
            </h2>

            {/* Tagline */}
            <p style={{ margin: "10px 0 0", fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.45 }}>
              Streetwear · Rosario · Est. 2026
            </p>

            {/* Regla punteada */}
            <div style={{ borderTop: `2px dashed rgba(11,11,11,0.3)`, margin: "26px 0" }} />

            {/* Líneas de detalle, estilo renglón de recibo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {[
                {
                  label: "Instagram",
                  node: (
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
                      style={{ color: C.INK, textDecoration: "none", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>
                      {INSTAGRAM_USER}
                    </a>
                  ),
                },
                {
                  label: "WhatsApp",
                  node: (
                    <a href={waGeneric} target="_blank" rel="noopener noreferrer"
                      style={{ color: C.INK, textDecoration: "none", fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>
                      Consultá aquí
                    </a>
                  ),
                },
                {
                  label: "Ubicación",
                  node: (
                    <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>
                      Rosario, SF
                    </span>
                  ),
                },
                {
                  label: "Envíos",
                  node: <span style={{ fontWeight: 800, fontSize: 13, whiteSpace: "nowrap" }}>Todo el país 🇦🇷</span>,
                },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5, whiteSpace: "nowrap" }}>
                    {row.label}
                  </span>
                  <span style={{ flex: 1, borderBottom: "1px dotted rgba(11,11,11,0.35)", transform: "translateY(-3px)" }} />
                  {row.node}
                </div>
              ))}
            </div>

            {/* Regla punteada */}
            <div style={{ borderTop: `2px dashed rgba(11,11,11,0.3)`, margin: "26px 0 20px" }} />

            {/* Código de barras decorativo */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch", gap: 2, height: 34 }}>
              {BARCODE.map((wUnit, i) => (
                <span key={i} style={{ width: wUnit * 2, background: C.INK, opacity: i % 7 === 0 ? 0.55 : 0.9 }} />
              ))}
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", opacity: 0.4 }}>
              M8-VNTG-{new Date().getFullYear()}
            </p>

            {/* Cierre */}
            <p style={{ margin: "18px 0 0", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.45 }}>
              Gracias por tu visita &nbsp;·&nbsp; © {new Date().getFullYear()} M8 Vintage
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
