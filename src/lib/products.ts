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

export async function listProductos(): Promise<Producto[]> {
  if (!supabaseEnabled) return [...SEED];
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Producto[];
}

export async function getProducto(id: string): Promise<Producto | null> {
  if (!supabaseEnabled) return SEED.find((p) => p.id === id) ?? null;
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
  const imagen_url = await uploadImagen(file);
  const { error } = await supabase.from("productos").insert({ ...data, imagen_url });
  if (error) throw error;
}

export async function updateProducto(
  id: string,
  data: Partial<NuevoProducto>,
  file?: File
): Promise<void> {
  const patch: Record<string, unknown> = { ...data };
  if (file) patch.imagen_url = await uploadImagen(file);
  const { error } = await supabase.from("productos").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteProducto(id: string): Promise<void> {
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleVendido(id: string, vendido: boolean): Promise<void> {
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
