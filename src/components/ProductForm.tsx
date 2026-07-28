import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Producto, NuevoProducto, Categoria } from "../lib/products";
import { createProducto, updateProducto } from "../lib/products";
import { parseTalles } from "../lib/format";
import { C, font, eyebrow } from "../theme";
import { IconTrash } from "./Icons";

const TALLES_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "ÚNICO"];

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
  const [precio, setPrecio] = useState(initial ? String(initial.precio) : "");
  const [talles, setTalles] = useState<string[]>(
    initial ? parseTalles(initial.talle) : []
  );
  const [categoria, setCategoria] = useState<Categoria>(initial?.categoria ?? "VINTAGE");
  const [estado, setEstado] = useState(initial?.estado ?? 10);
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  // Fotos existentes que se conservan (el admin puede sacar alguna) + fotos
  // nuevas a subir. El resultado final es la unión de ambas listas.
  const [keepImagenes, setKeepImagenes] = useState<string[]>(initial?.imagenes ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = Boolean(initial);
  const totalFotos = keepImagenes.length + newFiles.length;

  function toggleTalle(t: string) {
    setTalles((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setNewFiles((prev) => [...prev, ...picked]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (totalFotos === 0) {
      setError("Subí al menos una foto del producto.");
      return;
    }
    if (talles.length === 0) {
      setError("Elegí al menos un talle.");
      return;
    }
    const precioNum = Number(precio);
    if (!precio || Number.isNaN(precioNum) || precioNum <= 0) {
      setError("Ingresá un precio.");
      return;
    }
    setSaving(true);
    try {
      const data: NuevoProducto = {
        nombre,
        precio: precioNum,
        talle: talles.join(", "),
        categoria,
        estado,
        descripcion,
        vendido: initial?.vendido ?? false,
      };
      if (isEdit && initial) {
        await updateProducto(initial.id, data, newFiles, keepImagenes);
      } else {
        await createProducto(data, newFiles);
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

  const thumbStyle = {
    position: "relative" as const,
    width: 72,
    height: 72,
    borderRadius: 8,
    overflow: "hidden",
    background: C.CARD2,
    border: `1px solid ${C.LINE}`,
    flexShrink: 0,
  };
  const removeBtnStyle = {
    position: "absolute" as const,
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.65)",
    cursor: "pointer",
  };

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
          <label style={label}>Fotos (la primera es la portada)</label>

          {totalFotos > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
              {keepImagenes.map((url, i) => (
                <div key={url + i} style={thumbStyle}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    type="button"
                    title="Sacar foto"
                    onClick={() => setKeepImagenes((prev) => prev.filter((_, idx) => idx !== i))}
                    style={removeBtnStyle}
                  >
                    <IconTrash size={11} color={C.CREAM} />
                  </button>
                </div>
              ))}
              {newFiles.map((f, i) => (
                <div key={f.name + f.lastModified + i} style={thumbStyle}>
                  <img
                    src={URL.createObjectURL(f)}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    title="Sacar foto"
                    onClick={() => setNewFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    style={removeBtnStyle}
                  >
                    <IconTrash size={11} color={C.CREAM} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            style={{ ...inputStyle, padding: 8, marginTop: totalFotos > 0 ? 10 : 5 }}
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

          <div style={{ marginTop: 14 }}>
            <label style={label}>Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0"
              required
              min={0}
              style={inputStyle}
            />
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={label}>Talle (elegí uno o varios)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 7 }}>
              {TALLES_DISPONIBLES.map((t) => {
                const on = talles.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTalle(t)}
                    style={{
                      padding: "6px 11px",
                      borderRadius: 6,
                      border: `1px solid ${on ? C.BEIGE : C.LINE}`,
                      background: on ? C.BEIGE : "transparent",
                      color: on ? C.INK : C.MUTED_L,
                      fontWeight: 800,
                      fontSize: 12,
                      fontFamily: font,
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
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
                <option value="USADO">USADO</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={label}>Estado (1-10)</label>
              <input
                type="number"
                value={estado}
                onChange={(e) => setEstado(Math.min(10, Math.max(1, Number(e.target.value))))}
                required
                min={1}
                max={10}
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
