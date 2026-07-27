# M8 — Catálogo Digital

Catálogo de streetwear/vintage (basketball) para **M8** — Rosario, Santa Fe.
Catálogo público + panel de administración con persistencia real en Supabase.

## Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

### Modo demo (sin configurar nada)
Si no configurás Supabase, el catálogo funciona igual: muestra los **6 productos de ejemplo** (`src/data/seed.ts`) en modo solo lectura. Ideal para ver el diseño. El panel `/admin` pide configurar Supabase.

## Activar persistencia real (Supabase)

1. Creá un proyecto gratis en [supabase.com](https://supabase.com).
2. En el **SQL Editor**, pegá y ejecutá `supabase/seed.sql` (crea la tabla `productos`, las policies, el bucket de Storage y carga los 6 productos demo).
3. Copiá `.env.example` a `.env` y completá:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   (Los valores están en **Project Settings → API**.)
4. Creá el usuario admin: **Authentication → Users → Add user** (email + password). Esa es la única cuenta del panel.
5. Reiniciá `npm run dev`.

Ahora `/admin` permite login y todo lo que cargues/edites/elimines se refleja en el catálogo público. Las fotos se suben al Storage de Supabase.

## Cosas fáciles de cambiar

| Qué | Dónde |
|---|---|
| Número de WhatsApp | `src/config.ts` (`WHATSAPP_NUMBER`) o `.env` (`VITE_WHATSAPP_NUMBER`) |
| Usuario / link de Instagram | `src/config.ts` (`INSTAGRAM_USER`, `INSTAGRAM_URL`) |
| Ubicación | `src/config.ts` (`LOCATION`) |
| Paleta de colores | `src/theme.ts` |
| Logo | reemplazá `public/logo.png` (actualmente es un placeholder) |
| Productos demo | `src/data/seed.ts` y/o `supabase/seed.sql` |

## Rutas

- `/` — catálogo público
- `/producto/:id` — detalle de producto
- `/admin` — panel (protegido con login)

## Stack

React + Vite + TypeScript · React Router · Supabase (DB + Storage + Auth).
Sin Tailwind y sin librerías de íconos: estilos inline con tokens en `src/theme.ts`, íconos SVG inline en `src/components/Icons.tsx`.
