import { supabase, supabaseEnabled, BUCKET } from "./supabase";
import { SEED } from "../data/seed";

export type Categoria = "VINTAGE" | "NUEVO";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  talle: string;
  categoria: Categoria;
  descripcion: string;
  imagen_url: string;
  vendido: boolean;
  orden: number;
  creado_en: string;
}

export type NuevoProducto = Omit<Producto, "id" | "creado_en" | "imagen_url"> & {
  imagen_url?: string;
};

// Store para el modo demo (sin Supabase). Permite ver/probar el panel admin
// interactivo. Se respalda en localStorage para que sobreviva a recargas de
// página y a hot-reloads del dev server mientras no haya Supabase configurado.
const DEMO_KEY = "m8_demo_productos";

function loadDemoData(): Producto[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) return JSON.parse(raw) as Producto[];
  } catch {
    // localStorage corrupto o inaccesible: arranca del seed.
  }
  return [...SEED];
}

let demoData: Producto[] = loadDemoData();

function saveDemoData() {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(demoData));
  } catch {
    // Sin espacio o localStorage inaccesible: el cambio queda solo en memoria.
  }
}

function sortByOrden(a: Producto, b: Producto) {
  return a.orden - b.orden;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function listProductos(): Promise<Producto[]> {
  if (!supabaseEnabled) return [...demoData].sort(sortByOrden);
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Producto[];
}

export async function getProducto(id: string): Promise<Producto | null> {
  if (!supabaseEnabled) return demoData.find((p) => p.id === id) ?? null;
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Producto) ?? null;
}

async function uploadImagen(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createProducto(
  data: NuevoProducto,
  file: File
): Promise<void> {
  if (!supabaseEnabled) {
    demoData.push({
      ...data,
      id: crypto.randomUUID(),
      imagen_url: await readAsDataUrl(file),
      creado_en: new Date().toISOString(),
    });
    saveDemoData();
    return;
  }
  const imagen_url = await uploadImagen(file);
  const { error } = await supabase.from("productos").insert({ ...data, imagen_url });
  if (error) throw error;
}

export async function updateProducto(
  id: string,
  data: Partial<NuevoProducto>,
  file?: File
): Promise<void> {
  if (!supabaseEnabled) {
    const imagen_url = file ? await readAsDataUrl(file) : undefined;
    demoData = demoData.map((p) =>
      p.id === id ? { ...p, ...data, imagen_url: imagen_url ?? p.imagen_url } : p
    );
    saveDemoData();
    return;
  }
  const patch: Record<string, unknown> = { ...data };
  if (file) patch.imagen_url = await uploadImagen(file);
  const { error } = await supabase.from("productos").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProducto(id: string): Promise<void> {
  if (!supabaseEnabled) {
    demoData = demoData.filter((p) => p.id !== id);
    saveDemoData();
    return;
  }
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleVendido(id: string, vendido: boolean): Promise<void> {
  if (!supabaseEnabled) {
    demoData = demoData.map((p) => (p.id === id ? { ...p, vendido } : p));
    saveDemoData();
    return;
  }
  const { error } = await supabase
    .from("productos")
    .update({ vendido })
    .eq("id", id);
  if (error) throw error;
}

export async function statsAdmin(): Promise<{ activos: number; vendidosMes: number }> {
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  if (!supabaseEnabled) {
    const activos = demoData.filter((p) => !p.vendido).length;
    const vendidosMes = demoData.filter(
      (p) => p.vendido && new Date(p.creado_en) >= inicioMes
    ).length;
    return { activos, vendidosMes };
  }

  const { count: activos } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })
    .eq("vendido", false);

  const { count: vendidosMes } = await supabase
    .from("productos")
    .select("*", { count: "exact", head: true })
    .eq("vendido", true)
    .gte("creado_en", inicioMes.toISOString());

  return { activos: activos ?? 0, vendidosMes: vendidosMes ?? 0 };
}
