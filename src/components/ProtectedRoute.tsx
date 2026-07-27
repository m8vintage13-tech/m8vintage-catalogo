import type { JSX } from "react";
import { useSession } from "../lib/auth";
import { supabaseEnabled } from "../lib/supabase";
import Login from "../pages/Login";
import { C, font } from "../theme";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, loading } = useSession();

  // Modo demo (sin Supabase): panel abierto sin login para ver el diseño.
  if (!supabaseEnabled) return children;
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.INK,
          color: C.MUTED_L,
          fontFamily: font,
          display: "grid",
          placeItems: "center",
        }}
      >
        Cargando…
      </div>
    );
  }
  if (!session) return <Login />;
  return children;
}
