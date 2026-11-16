// Vercel Cron (ver vercel.json): una vez por día hace una consulta real a la
// base de Supabase para que el plan Free no pause el proyecto por inactividad
// (se pausa tras 7 días sin actividad). Lee 1 sola fila: costo de egress nulo.
export default async function handler(_req, res) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ ok: false, error: "Faltan variables de entorno de Supabase" });
  }

  try {
    const r = await fetch(`${url}/rest/v1/productos?select=id&limit=1`, {
      headers: { apikey: key },
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status });
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) });
  }
}
