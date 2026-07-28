import type { Producto } from "../lib/products";

// 6 productos demo. Editá libremente. Se usan como fallback de solo lectura
// cuando no hay Supabase configurado (modo demo).
const now = new Date().toISOString();

export const SEED: Producto[] = [
  {
    id: "seed-1",
    orden: 1,
    nombre: "Campera Bomber Vintage",
    precio: 45000,
    talle: "M",
    categoria: "VINTAGE",
    estado: 8,
    descripcion: "Campera bomber de colección, tela resistente y forro térmico.",
    imagenes: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
  {
    id: "seed-2",
    orden: 2,
    nombre: "Jersey Retro Bulls 23",
    precio: 38000,
    talle: "L",
    categoria: "VINTAGE",
    estado: 9,
    descripcion: "Jersey de basketball estilo 90s, bordado original.",
    imagenes: [
      "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80",
      "https://images.unsplash.com/photo-1580087433620-46c6bfd4b3f7?w=800&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
  {
    id: "seed-3",
    orden: 3,
    nombre: "Buzo Champion 90s",
    precio: 32000,
    talle: "M",
    categoria: "VINTAGE",
    estado: 7,
    descripcion: "Buzo con logo bordado, algodón grueso.",
    imagenes: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
  {
    id: "seed-4",
    orden: 4,
    nombre: "Remera NBA Classic",
    precio: 21000,
    talle: "S",
    categoria: "NUEVO",
    estado: 10,
    descripcion: "Remera 100% algodón con estampa NBA.",
    imagenes: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
  {
    id: "seed-5",
    orden: 5,
    nombre: "Gorra Snapback Retro",
    precio: 18000,
    talle: "Único",
    categoria: "VINTAGE",
    estado: 8,
    descripcion: "Gorra snapback de colección, visera plana.",
    imagenes: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
  {
    id: "seed-6",
    orden: 6,
    nombre: "Short Basketball Vintage",
    precio: 24000,
    talle: "L",
    categoria: "VINTAGE",
    estado: 9,
    descripcion:
      "Short de basketball original de los 90, tela liviana y transpirable.",
    imagenes: [
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80",
    ],
    vendido: false,
    creado_en: now,
  },
];
