import { useState } from "react";
import type { FormEvent } from "react";
import { C, font, eyebrow } from "../theme";
import { signIn } from "../lib/auth";
import { supabaseEnabled } from "../lib/supabase";
import { HangTag } from "../components/HangTag";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError("Credenciales inválidas. Revisá email y contraseña.");
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${C.LINE}`,
    background: C.CARD2,
    color: C.CREAM,
    fontFamily: font,
    fontSize: 14,
  };

  return (
    <div
      style={{
        fontFamily: font,
        background: C.INK,
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: C.CARD,
          border: `1px solid ${C.LINE}`,
          borderRadius: 18,
          padding: 28,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <HangTag w={30} h={14} fill={C.BEIGE} holeColor={C.INK} />
          <span style={{ ...eyebrow, color: C.BEIGE }}>Panel de administración</span>
        </div>

        {!supabaseEnabled ? (
          <p style={{ color: C.MUTED_L, fontSize: 14, lineHeight: 1.6 }}>
            Configurá Supabase (copiá <code>.env.example</code> a <code>.env</code> y
            completá <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>)
            para habilitar el panel admin.
          </p>
        ) : (
          <form onSubmit={onSubmit}>
            <label style={{ ...eyebrow, color: C.MUTED_L, fontSize: 10 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ ...inputStyle, margin: "6px 0 14px" }}
            />
            <label style={{ ...eyebrow, color: C.MUTED_L, fontSize: 10 }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...inputStyle, margin: "6px 0 4px" }}
            />
            {error && (
              <p style={{ color: "#e57373", fontSize: 13, margin: "10px 0 0" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 18,
                padding: "13px 0",
                borderRadius: 10,
                border: "none",
                background: C.BEIGE,
                color: C.INK,
                fontWeight: 800,
                fontSize: 14,
                fontFamily: font,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Ingresando…" : "Ingresar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
