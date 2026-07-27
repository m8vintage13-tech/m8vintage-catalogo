import { useState } from "react";
import type { FormEvent } from "react";
import type { Producto, NuevoProducto, Categoria } from "../lib/products";
import { createProducto, updateProducto } from "../lib/products";
import { C, font, eyebrow } from "../theme";

export function ProductForm({
  initial,
  onDone,
  onCancel,
}: {
  initial?: Producto;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [precio, setPrecio] = useState(initial?.precio ?? 0);
  const [talle, setTalle] = useState(initial?.talle ?? "");
  const [categoria, setCategoria] = useState<Categoria>(initial?.categoria ?? "VINTAGE");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [orden, setOrden] = useState(initial?.orden ?? 0);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isEdit && !file) {
      setError("Subí una foto del producto.");
      return;
    }
    setSaving(true);
    try {
      const data: NuevoProducto = {
        nombre,
        precio,
        talle,
        categoria,
        descripcion,
        orden,
        vendido: initial?.vendido ?? false,
      };
      if (isEdit && initial) {
        await updateProducto(initial.id, data, file ?? undefined);
      } else {
        await createProducto(data, file!);
      }
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${C.LINE}`,
    background: C.CARD2,
    color: C.CREAM,
    fontFamily: font,
    fontSize: 14,
    marginTop: 5,
  };
  const label = { ...eyebrow, color: C.MUTED_L, fontSize: 10 };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
        fontFamily: font,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.CARD,
          border: `1px solid ${C.LINE}`,
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 460,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ color: C.CREAM, fontWeight: 900, fontSize: 20, margin: "0 0 18px" }}>
          {isEdit ? "Editar producto" : "Nuevo producto"}
        </h2>

        <form onSubmit={onSubmit}>
          <label style={label}>
            Foto {isEdit && "(dejar vacío para mantener la actual)"}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={{ ...inputStyle, padding: 8 }}
          />

          <div style={{ marginTop: 14 }}>
            <label style={label}>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                required
                min={0}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Talle</label>
              <input
                value={talle}
                onChange={(e) => setTalle(e.target.value)}
                required
                placeholder="M, L, Único…"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as Categoria)}
                style={inputStyle}
              >
                <option value="VINTAGE">VINTAGE</option>
                <option value="NUEVO">NUEVO</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Orden</label>
              <input
                type="number"
                value={orden}
                onChange={(e) => setOrden(Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={label}>Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {error && (
            <p style={{ color: "#e57373", fontSize: 13, margin: "12px 0 0" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                border: `1px solid ${C.LINE}`,
                background: "transparent",
                color: C.MUTED_L,
                fontWeight: 700,
                fontFamily: font,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: 10,
                border: "none",
                background: C.BEIGE,
                color: C.INK,
                fontWeight: 800,
                fontFamily: font,
                cursor: saving ? "default" : "pointer",
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
