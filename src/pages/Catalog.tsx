import { useEffect, useState } from "react";
import type { Producto } from "../lib/products";
import { listProductos } from "../lib/products";
import { C, font, eyebrow } from "../theme";
import { INSTAGRAM_USER, INSTAGRAM_URL, LOCATION } from "../config";
import { HangTag } from "../components/HangTag";
import { IconInstagram, IconPin } from "../components/Icons";
import { ProductCard } from "../components/ProductCard";

export default function Catalog() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProductos()
      .then(setProductos)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: font, background: C.CREAM, minHeight: "100vh" }}>
      <style>{`
        .m8-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        @media (min-width: 768px) { .m8-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      {/* HERO */}
      <header
        style={{
          background: C.INK,
          color: C.CREAM,
          padding: "56px 20px 60px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        >
          <HangTag w={520} h={230} fill={C.BEIGE} holeColor={C.INK} rotate={18} />
        </div>

        <div style={{ position: "relative" }}>
          <img
            src="/logo.png"
            alt="M8"
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: `3px solid ${C.BEIGE}`,
              objectFit: "cover",
              background: C.INK,
            }}
          />
          <div
            style={{
              ...eyebrow,
              color: C.BEIGE,
              marginTop: 18,
              letterSpacing: "0.22em",
            }}
          >
            M8 · Buenos Aires
          </div>
          <h1
            style={{
              fontWeight: 900,
              fontSize: 40,
              letterSpacing: "-0.5px",
              margin: "10px 0 6px",
              color: C.CREAM,
            }}
          >
            Vintage &amp; Streetwear
          </h1>
          <p style={{ color: C.MUTED_L, margin: 0, fontSize: 14, fontWeight: 600 }}>
            Prendas Seleccionadas 🇺🇸
          </p>
        </div>
      </header>

      {/* GRID */}
      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "28px 16px 48px" }}>
        {loading ? (
          <p style={{ color: C.MUTED, textAlign: "center" }}>Cargando productos…</p>
        ) : productos.length === 0 ? (
          <p style={{ color: C.MUTED, textAlign: "center" }}>
            Todavía no hay productos cargados.
          </p>
        ) : (
          <div className="m8-grid">
            {productos.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer>
        <div
          style={{
            background: C.CREAM,
            borderTop: `1px solid #e0dccf`,
            padding: "28px 20px",
            textAlign: "center",
          }}
        >
          <div style={{ ...eyebrow, color: C.MUTED, marginBottom: 6 }}>Consultas</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: C.INK }}>
            Consultá disponibilidad por WhatsApp
          </div>
        </div>

        <div
          style={{
            background: C.BEIGE,
            color: C.INK,
            padding: "26px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            textAlign: "center",
          }}
        >
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: C.INK,
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            <IconInstagram size={20} color={C.INK} /> {INSTAGRAM_USER}
          </a>

          <span style={{ width: 1, height: 22, background: "rgba(11,11,11,0.25)" }} />

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 700,
            }}
          >
            <IconPin size={18} color={C.INK} /> {LOCATION}
          </span>

          <span style={{ width: 1, height: 22, background: "rgba(11,11,11,0.25)" }} />

          <span style={{ fontWeight: 700 }}>Envíos a todo el país 🇦🇷</span>
        </div>
      </footer>
    </div>
  );
}
