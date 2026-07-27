import { C, display, font, maxW } from "../theme";
import {
  INSTAGRAM_URL,
  INSTAGRAM_USER,
  LOCATION,
  WHATSAPP_NUMBER,
} from "../config";
import { IconChat, IconInstagram, IconPin } from "../components/Icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Grain } from "../components/Grain";
import { HangTag } from "../components/HangTag";
import { Marquee } from "../components/Marquee";
import { ProductCard } from "../components/ProductCard";
import type { Producto } from "../lib/products";
import { listProductos } from "../lib/products";

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

  const count = String(productos.length).padStart(2, "0");
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
            {["Prendas seleccionadas"].map((t, i) => (
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
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: maxW,
          margin: "0 auto",
          padding: "clamp(36px, 6vw, 64px) 16px clamp(48px, 7vw, 72px)",
          scrollMarginTop: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
            borderBottom: `1px solid ${C.LINE}`,
            paddingBottom: 16,
          }}
        >
          <h2 style={{ ...display, color: C.CREAM, fontSize: "clamp(1.6rem, 5vw, 2.6rem)", margin: 0 }}>
            El catálogo
          </h2>
          <span
            style={{
              ...display,
              color: C.MUTED,
              fontSize: "clamp(1.6rem, 5vw, 2.6rem)",
              whiteSpace: "nowrap",
            }}
          >
            /{count}
          </span>
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

      {/* FOOTER — slab beige */}
      <footer style={{ position: "relative", zIndex: 2, background: C.BEIGE, color: C.INK }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: "clamp(44px, 7vw, 72px) 20px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div>
              <h2
                style={{
                  ...display,
                  fontSize: "clamp(2rem, 7vw, 4rem)",
                  margin: 0,
                }}
              >
                ¿Te gusta
                <br />
                algo?
              </h2>
            </div>
            <a
              href={waGeneric}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: C.INK,
                color: C.BEIGE,
                textDecoration: "none",
                ...display,
                fontSize: 16,
                padding: "18px 28px",
                borderRadius: 4,
              }}
            >
              <IconChat size={22} color={C.BEIGE} /> Consultá por WhatsApp
            </a>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px 22px",
              marginTop: 40,
              paddingTop: 22,
              borderTop: "1px solid rgba(11,11,11,0.2)",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.INK, textDecoration: "none", fontWeight: 800 }}
            >
              <IconInstagram size={19} color={C.INK} /> {INSTAGRAM_USER}
            </a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <IconPin size={17} color={C.INK} /> {LOCATION}
            </span>
            <span style={{ marginLeft: "auto", opacity: 0.75 }}>Envíos a todo el país 🇦🇷</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
