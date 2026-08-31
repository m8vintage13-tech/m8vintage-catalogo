import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Producto } from "../lib/products";
import {
  listProductos,
  statsAdmin,
  deleteProducto,
  toggleVendido,
} from "../lib/products";
import { signOut } from "../lib/auth";
import { supabaseEnabled } from "../lib/supabase";
import { C, font, eyebrow } from "../theme";
import { formatPrecio } from "../lib/format";
import { HangTag } from "../components/HangTag";
import { IconPlus, IconPencil, IconTrash, IconCheck } from "../components/Icons";
import { ProductForm } from "../components/ProductForm";

export default function Admin() {
  const [items, setItems] = useState<Producto[]>([]);
  const [stats, setStats] = useState({ activos: 0, vendidosMes: 0 });
  // undefined = form cerrado, null = nuevo, Producto = editar
  const [editing, setEditing] = useState<Producto | null | undefined>(undefined);

  async function reload() {
    setItems(await listProductos());
    setStats(await statsAdmin());
  }

  useEffect(() => {
    reload().catch((e) => console.error(e));
  }, []);

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar producto?")) return;
    await deleteProducto(id);
    await reload();
  }

  async function onToggle(p: Producto) {
    await toggleVendido(p.id, !p.vendido);
    await reload();
  }

  const statCard = (titulo: string, valor: number, accent: string) => (
    <div
      style={{
        background: C.CARD2,
        border: `1px solid ${C.LINE}`,
        borderRadius: 14,
        padding: "18px 20px",
        flex: 1,
        minWidth: 160,
      }}
    >
      <div style={{ ...eyebrow, color: C.MUTED_L, fontSize: 10 }}>{titulo}</div>
      <div style={{ fontWeight: 900, fontSize: 34, color: accent, marginTop: 6, letterSpacing: "-0.5px" }}>
        {valor}
      </div>
    </div>
  );

  const iconBtn = {
    display: "grid",
    placeItems: "center",
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: 8,
    border: `1px solid ${C.LINE}`,
    background: "transparent",
    cursor: "pointer",
  } as const;

  return (
    <div style={{ fontFamily: font, background: C.CARD, minHeight: "100vh", color: C.CREAM }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 16px 56px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HangTag w={30} h={14} fill={C.BEIGE} holeColor={C.INK} />
            <span style={{ ...eyebrow, color: C.BEIGE }}>Panel de administración</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              to="/"
              style={{ color: C.MUTED_L, textDecoration: "none", fontWeight: 700, fontSize: 13, alignSelf: "center" }}
            >
              Ver catálogo
            </Link>
            {supabaseEnabled && (
              <button
                onClick={async () => {
                  await signOut();
                  location.reload();
                }}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.LINE}`,
                  color: C.MUTED_L,
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontWeight: 700,
                  fontFamily: font,
                  cursor: "pointer",
                }}
              >
                Salir
              </button>
            )}
          </div>
        </div>

        {!supabaseEnabled && (
          <div
            style={{
              marginTop: 18,
              background: "rgba(227,208,172,0.10)",
              border: `1px solid ${C.LINE}`,
              borderRadius: 12,
              padding: "12px 16px",
              color: C.MUTED_L,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            <b style={{ color: C.BEIGE }}>Modo demo</b> — panel abierto sin login para
            ver el diseño. Los cambios se guardan en este navegador (localStorage), no
            en una base de datos real. Al configurar Supabase (<code>.env</code>) se
            activa el login y la persistencia real.
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
          {statCard("Productos activos", stats.activos, C.BEIGE)}
          {statCard("Vendidos este mes", stats.vendidosMes, C.SAGE)}
        </div>

        {/* Nuevo */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
          <button
            onClick={() => setEditing(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: C.BEIGE,
              color: C.INK,
              border: "none",
              borderRadius: 10,
              padding: "11px 18px",
              fontWeight: 800,
              fontFamily: font,
              cursor: "pointer",
            }}
          >
            <IconPlus size={18} color={C.INK} /> Nuevo
          </button>
        </div>

        {/* Tabla */}
        <div
          style={{
            marginTop: 16,
            border: `1px solid ${C.LINE}`,
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {items.length === 0 ? (
            <div style={{ padding: 24, color: C.MUTED, textAlign: "center" }}>
              No hay productos cargados.
            </div>
          ) : (
            items.map((p, i) => (
              <div
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  borderTop: i === 0 ? "none" : `1px solid ${C.LINE}`,
                }}
              >
                <img
                  src={p.imagenes[0]}
                  alt=""
                  loading="lazy"
                  style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", background: C.INK }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.CREAM }}>{p.nombre}</div>
                  <div style={{ color: C.MUTED_L, fontSize: 13 }}>{formatPrecio(p.precio)}</div>
                </div>
                <span
                  style={{
                    ...eyebrow,
                    fontSize: 9,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: p.vendido ? C.INK : "rgba(127,163,131,0.15)",
                    color: p.vendido ? C.MUTED_L : C.SAGE,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.vendido ? "Vendido" : "Disponible"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    title={p.vendido ? "Marcar disponible" : "Marcar vendido"}
                    onClick={() => onToggle(p)}
                    style={{
                      ...iconBtn,
                      background: p.vendido ? "transparent" : C.SAGE,
                      borderColor: p.vendido ? C.LINE : C.SAGE,
                    }}
                  >
                    <IconCheck size={16} color={p.vendido ? C.MUTED_L : C.INK} />
                  </button>
                  <button title="Editar" onClick={() => setEditing(p)} style={iconBtn}>
                    <IconPencil size={16} color={C.MUTED_L} />
                  </button>
                  <button title="Eliminar" onClick={() => onDelete(p.id)} style={iconBtn}>
                    <IconTrash size={16} color={C.MUTED_L} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editing !== undefined && (
        <ProductForm
          initial={editing ?? undefined}
          onDone={() => {
            setEditing(undefined);
            reload();
          }}
          onCancel={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
