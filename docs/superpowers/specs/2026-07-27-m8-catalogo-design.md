# M8 — Catálogo Digital · Design Spec

**Fecha:** 2026-07-27
**Estado:** Aprobado para implementación

M8 es una marca de streetwear/ropa vintage con temática de basketball (Rosario, Santa Fe, Argentina). Este spec define el catálogo digital funcional y productivo: catálogo público + panel admin con persistencia real en Supabase. Prototipo visual ya aprobado por el cliente; este proyecto lo lleva a versión funcional.

## 1. Stack técnico

- **Frontend:** React + Vite + TypeScript
- **Estilos:** CSS-in-JS con inline styles + archivo central de tokens (`theme.ts`). Sin Tailwind, sin librerías de íconos.
- **Ruteo:** React Router v6 — `/` (catálogo), `/producto/:id`, `/admin` (protegida).
- **Backend:** Supabase (plan gratuito) — DB `productos` + Storage para fotos + Auth email/password (una cuenta).
- **Sin deployment.** Solo local: `npm install && npm run dev`.

### Dependencias
`react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js`, y dev deps de Vite+TS. **Ninguna** librería de íconos ni de UI.

## 2. Sistema de diseño (exacto)

### Paleta (`theme.ts`)
```
INK      #0B0B0B   BEIGE    #E3D0AC   CREAM   #F4F1EA
CARD     #161616   CARD2    #1F1F1F   MUTED   #8A8477
MUTED_L  #9C968A   LINE     #2A2A2A   SAGE    #7FA383
```

### Tipografía
- Familia: `Arial, Helvetica, sans-serif`.
- Headlines: peso 900, tracking `-0.5px` en títulos grandes.
- Eyebrows/labels: peso 800, `letter-spacing: 0.16em–0.22em`, mayúsculas, 10–11px.
- Cuerpo: peso 400–700, 11–15px.

### HangTag (firma visual)
Componente `HangTag({ w, h, fill, holeColor, rotate })` — cartelito con muesca + ojal. Path exacto del prototipo:
```jsx
<path d="M1.5 2 H33 L44.5 10 L33 18 H1.5 Z" fill={fill} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" />
<circle cx="9" cy="10" r="2.1" fill={holeColor} opacity="0.85" />
```
Usos: (1) etiqueta VINTAGE/NUEVO en tarjetas, (2) marcador antes de cada eyebrow de sección, (3) watermark grande (5% opacidad, rotado ~18°) detrás del logo en el hero.

### Íconos
SVG inline stroke-based (estilo lucide/feather: `strokeWidth 2`, `strokeLinecap round`, `strokeLinejoin round`, viewBox 24×24) en `components/Icons.tsx`. Mínimo: flecha atrás, chat/WhatsApp, +, lápiz, tacho, check, celular, monitor, Instagram, pin de ubicación.

## 3. Páginas

### A) Catálogo `/`
- Hero fondo INK: logo M8 circular (imagen real `public/logo.png`, borde beige 3px), watermark HangTag detrás; eyebrow "M8 · BUENOS AIRES", título "Vintage & Streetwear" (900, grande), subtítulo "Prendas Seleccionadas 🇺🇸".
- Grid productos: 2 col mobile / 3 col desktop (breakpoint 768px). Tarjeta: imagen (fondo oscuro siempre), etiqueta HangTag VINTAGE/NUEVO, talle, nombre, precio.
- **Hover tarjeta:** contenedor pasa a BEIGE con transición suave + `translateY(-3px)`. La imagen del producto mantiene su fondo oscuro.
- Footer dos bloques: (1) fondo CREAM "Consultá disponibilidad por WhatsApp"; (2) fondo BEIGE: ícono + `@m8vintage` (link Instagram real), separador, 📍 "Rosario, Santa Fe - Argentina" y "Envíos a todo el país 🇦🇷".

### B) Producto `/producto/:id`
- Botón "Volver al catálogo" + flecha.
- Imagen grande + galería 3 miniaturas clickeables (cambian la principal). Si el producto tiene 1 sola imagen, las miniaturas repiten esa imagen.
- Etiqueta HangTag + referencia `#M8-0X` (derivada del `orden`).
- Nombre, precio grande, descripción.
- Selector visual de talle XS S M L XL — **solo informativo**, resalta el disponible. Si `talle ∈ {XS,S,M,L,XL}` se muestra el selector con ese resaltado; si `talle` es otro (ej "Único"), se muestra un badge "Talle único" en lugar del selector.
- Botón "Consultar por WhatsApp" (fondo INK, texto BEIGE): abre `https://wa.me/{WHATSAPP_NUMBER}?text=Hola! Te consulto por {nombre} ({precio})` (texto URL-encoded).

### C) Admin `/admin` (protegida)
- Login email/password (Supabase Auth) si no hay sesión.
- Dos stats: "Productos activos" = `count(vendido=false)`; "Vendidos este mes" = `count(vendido=true AND creado_en >= inicio_de_mes_actual)`.
- Tabla: miniatura, nombre, precio, estado (Disponible/Vendido), botón editar (lápiz), botón eliminar (tacho).
- Botón "+ Nuevo": formulario (modal) — foto (subida real a Supabase Storage), nombre, precio, talle, categoría VINTAGE/NUEVO, descripción.
- Marcar vendido: toggle/botón por fila.
- Toda carga/edición/eliminación se refleja en el catálogo público (mismos datos Supabase).

### D) Fuera de scope (NO incluir)
Buscador, filtros por categoría/talle/precio, compartir producto por link, meta tags SEO avanzado / structured data, animaciones más allá de las transiciones de hover descritas.

## 4. Responsive
Layout fluido estándar, sin marco de celular/browser. Breakpoint 768px. Grid 2→3 columnas. Todo usable en mobile y desktop.

## 5. Datos

### Config (`src/config.ts`)
Constantes en un solo archivo (leen de `import.meta.env` con fallback):
- `WHATSAPP_NUMBER = "5493415447504"`
- `INSTAGRAM_USER = "@m8vintage"`, `INSTAGRAM_URL = "https://instagram.com/m8vintage"`
- `LOCATION = "Rosario, Santa Fe - Argentina"`

### Tabla `productos`
| col | tipo |
|---|---|
| id | uuid PK default gen_random_uuid() |
| nombre | text not null |
| precio | integer not null (pesos, sin decimales) |
| talle | text not null |
| categoria | text check in ('VINTAGE','NUEVO') |
| descripcion | text |
| imagen_url | text |
| vendido | boolean not null default false |
| orden | integer not null default 0 |
| creado_en | timestamptz not null default now() |

- Índice por `orden` (ordenamiento del catálogo).
- RLS: lectura pública (select para `anon`); insert/update/delete solo `authenticated`.
- Storage bucket `productos` público para lectura; subida solo autenticado.

### Capa de datos (`src/lib/products.ts`)
API: `listProductos()`, `getProducto(id)`, `createProducto(data, file)`, `updateProducto(id, data, file?)`, `deleteProducto(id)`, `toggleVendido(id, vendido)`, `statsAdmin()`, `uploadImagen(file)`.
**Modo demo:** si no hay `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` configurados, las lecturas caen a `src/data/seed.ts` (solo lectura) para que el catálogo renderice con los 6 productos demo sin setup. Escrituras/admin requieren Supabase real.

### Seed (`supabase/seed.sql` + `src/data/seed.ts`)
6 productos demo, editables fácil, con imágenes del rubro (basketball/vintage streetwear):
| orden | Nombre | Precio | Talle | Tag | Descripción |
|---|---|---|---|---|---|
| 1 | Campera Bomber Vintage | 45000 | M | VINTAGE | Campera bomber de colección, tela resistente y forro térmico. |
| 2 | Jersey Retro Bulls 23 | 38000 | L | VINTAGE | Jersey de basketball estilo 90s, bordado original. |
| 3 | Buzo Champion 90s | 32000 | M | VINTAGE | Buzo con logo bordado, algodón grueso. |
| 4 | Remera NBA Classic | 21000 | S | NUEVO | Remera 100% algodón con estampa NBA. |
| 5 | Gorra Snapback Retro | 18000 | Único | VINTAGE | Gorra snapback de colección, visera plana. |
| 6 | Short Basketball Vintage | 24000 | L | VINTAGE | Short de basketball original de los 90, tela liviana y transpirable. |

Precio se muestra formateado `$45.000` (separador de miles es-AR); se guarda como integer `45000`.

## 6. Logo
`public/logo.png` — imagen real provista por el cliente (círculo negro, skyline, cancha, "M8" beige). Se usa tal cual, no se regenera. Hasta recibir el archivo definitivo: placeholder circular con "M8" en la misma ruta.

## 7. Auth
Supabase Auth email/password, una sola cuenta (dueño M8). Sin roles ni multiusuario. `/admin` protegida por guard que verifica sesión; sin sesión muestra el login. Logout disponible en el panel.

## Estructura de archivos
```
src/
  main.tsx, App.tsx
  config.ts, theme.ts
  lib/supabase.ts, lib/products.ts, lib/format.ts
  data/seed.ts
  components/HangTag.tsx, Icons.tsx, ProductCard.tsx, SizeSelector.tsx,
             ProductForm.tsx, ProtectedRoute.tsx
  pages/Catalog.tsx, Product.tsx, Admin.tsx, Login.tsx
public/logo.png
supabase/seed.sql
.env.example, index.html, vite.config.ts, tsconfig.json, package.json
```
