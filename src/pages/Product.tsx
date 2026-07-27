import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Producto } from "../lib/products";
import { getProducto } from "../lib/products";
import { C, font, eyebrow } from "../theme";
import { formatPrecio, whatsappUrl } from "../lib/format";
import { HangTag } from "../components/HangTag";
import { SizeSelector } from "../components/SizeSelector";
import { IconArrowLeft, IconChat } from "../components/Icons";

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activa, setActiva] = useState<string>("");

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
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        color: C.INK,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      <IconArrowLeft size={18} color={C.INK} /> Volver al catálogo
    </Link>
  );

  if (loading) {
    return (
      <div style={{ fontFamily: font, background: C.CREAM, minHeight: "100vh", padding: 24 }}>
        <p style={{ color: C.MUTED }}>Cargando…</p>
      </div>
    );
  }

  if (!p) {
    return (
      <div style={{ fontFamily: font, background: C.CREAM, minHeight: "100vh", padding: 24 }}>
        {backLink}
        <p style={{ color: C.INK, marginTop: 24, fontWeight: 700 }}>Producto no encontrado.</p>
      </div>
    );
  }

  const tagFill = p.categoria === "VINTAGE" ? C.BEIGE : C.SAGE;
  const ref = `#M8-${String(p.orden).padStart(2, "0")}`;
  const miniaturas = [p.imagen_url, p.imagen_url, p.imagen_url];

  return (
    <div style={{ fontFamily: font, background: C.CREAM, minHeight: "100vh" }}>
      <style>{`
        .m8-detail { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 768px) { .m8-detail { grid-template-columns: 1fr 1fr; gap: 40px; } }
      `}</style>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px 56px" }}>
        {backLink}

        <div className="m8-detail" style={{ marginTop: 20 }}>
          {/* Galería */}
          <div>
            <div
              style={{
                background: C.INK,
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "3/4",
              }}
            >
              <img
                src={activa}
                alt={p.nombre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                      width: 72,
                      height: 72,
                      padding: 0,
                      borderRadius: 10,
                      overflow: "hidden",
                      cursor: "pointer",
                      background: C.INK,
                      border: `2px solid ${on ? C.INK : "transparent"}`,
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ position: "relative", display: "inline-block" }}>
                <HangTag w={72} h={28} fill={tagFill} holeColor={C.INK} />
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
              <span style={{ ...eyebrow, color: C.MUTED }}>{ref}</span>
            </div>

            <h1
              style={{
                fontWeight: 900,
                fontSize: 30,
                letterSpacing: "-0.5px",
                color: C.INK,
                margin: "16px 0 8px",
              }}
            >
              {p.nombre}
            </h1>

            <div
              style={{
                fontWeight: 900,
                fontSize: 32,
                letterSpacing: "-0.5px",
                color: C.INK,
                marginBottom: 16,
              }}
            >
              {formatPrecio(p.precio)}
            </div>

            <p style={{ color: C.MUTED, fontSize: 15, lineHeight: 1.6, maxWidth: 460 }}>
              {p.descripcion}
            </p>

            <div style={{ margin: "24px 0" }}>
              <div style={{ ...eyebrow, color: C.MUTED, marginBottom: 10 }}>Talle</div>
              <SizeSelector talle={p.talle} />
            </div>

            <a
              href={whatsappUrl(p.nombre, formatPrecio(p.precio))}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: C.INK,
                color: C.BEIGE,
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 15,
                padding: "14px 24px",
                borderRadius: 12,
              }}
            >
              <IconChat size={20} color={C.BEIGE} /> Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
