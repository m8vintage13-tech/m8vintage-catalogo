import { supabase, supabaseEnabled, BUCKET } from "./supabase";
import { SEED } from "../data/seed";

export type Categoria = "VINTAGE" | "NUEVO" | "USADO";

export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  talle: string;
  categoria: Categoria;
  descripcion: string;
  /** Fotos del producto; la primera es la portada (card + imagen principal). */
  imagenes: string[];
  vendido: boolean;
  /** Puntaje de estado de la prenda, 1 (muy gastada) a 10 (como nueva). */
  estado: number;
  orden: number;
  creado_en: string;
}

// "orden" ya no se completa a mano en el form: se autoasigna al crear
// (siguiente número de la lista) y se mantiene fijo al editar. "imagenes"
// tampoco viaja en el objeto de datos: createProducto/updateProducto la
// arman a partir de los archivos subidos (ver más abajo).
export type NuevoProducto = Omit<Producto, "id" | "creado_en" | "imagenes" | "orden">;

// Store para el modo demo (sin Supabase). Permite ver/probar el panel admin
// interactivo. Se respalda en localStorage para que sobreviva a recargas de
// página y a hot-reloads del dev server mientras no haya Supabase configurado.
const DEMO_KEY = "m8_demo_productos";

function loadDemoData(): Producto[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Producto[];
      // Datos guardados con el esquema viejo (imagen_url en vez de
      // imagenes[]): se descartan y se vuelve a arrancar del seed.
      if (parsed.every((p) => Array.isArray(p.imagenes))) return parsed;
    }
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

// Vendidos al final (en catálogo y admin), y dentro de cada grupo por orden.
function sortByOrden(a: Producto, b: Producto) {
  if (a.vendido !== b.vendido) return a.vendido ? 1 : -1;
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
    .order("vendido", { ascending: true })
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

async function uploadImagenes(files: File[]): Promise<string[]> {
  return Promise.all(files.map(uploadImagen));
}

// Borra archivos del bucket a partir de sus URLs públicas. Se usa al eliminar
// un producto o al sacarle una foto en edición, para que no queden huérfanos
// ocupando espacio de Storage. No es crítico si falla (el producto/edición ya
// se guardó igual), así que solo lo logueamos.
function urlToStoragePath(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

async function deleteImagenes(urls: string[]): Promise<void> {
  const paths = urls.map(urlToStoragePath).filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error("No se pudieron borrar fotos del storage:", error);
}

export async function createProducto(
  data: NuevoProducto,
  files: File[]
): Promise<void> {
  if (!supabaseEnabled) {
    const orden = demoData.length ? Math.max(...demoData.map((p) => p.orden)) + 1 : 1;
    const imagenes = await Promise.all(files.map(readAsDataUrl));
    demoData.push({
      ...data,
      orden,
      imagenes,
      id: crypto.randomUUID(),
      creado_en: new Date().toISOString(),
    });
    saveDemoData();
    return;
  }
  const { data: ultimo, error: ordenError } = await supabase
    .from("productos")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1);
  if (ordenError) throw ordenError;
  const orden = ultimo && ultimo.length ? (ultimo[0] as { orden: number }).orden + 1 : 1;
  const imagenes = await uploadImagenes(files);
  const { error } = await supabase.from("productos").insert({ ...data, orden, imagenes });
  if (error) throw error;
}

// "keepImagenes" son las fotos existentes que el admin no sacó al editar;
// "newFiles" son las fotos nuevas que suma. El resultado final es la unión
// de ambas, en ese orden (existentes primero, nuevas al final).
export async function updateProducto(
  id: string,
  data: Partial<NuevoProducto>,
  newFiles: File[] = [],
  keepImagenes: string[] = []
): Promise<void> {
  if (!supabaseEnabled) {
    const nuevas = await Promise.all(newFiles.map(readAsDataUrl));
    const imagenes = [...keepImagenes, ...nuevas];
    demoData = demoData.map((p) => (p.id === id ? { ...p, ...data, imagenes } : p));
    saveDemoData();
    return;
  }
  const { data: actual } = await supabase
    .from("productos")
    .select("imagenes")
    .eq("id", id)
    .maybeSingle();
  const anteriores = ((actual as { imagenes?: string[] } | null)?.imagenes ?? []) as string[];

  const nuevas = newFiles.length ? await uploadImagenes(newFiles) : [];
  const imagenes = [...keepImagenes, ...nuevas];
  const { error } = await supabase.from("productos").update({ ...data, imagenes }).eq("id", id);
  if (error) throw error;

  const removidas = anteriores.filter((url) => !keepImagenes.includes(url));
  if (removidas.length) await deleteImagenes(removidas);
}

export async function deleteProducto(id: string): Promise<void> {
  if (!supabaseEnabled) {
    demoData = demoData.filter((p) => p.id !== id);
    saveDemoData();
    return;
  }
  const { data: actual } = await supabase
    .from("productos")
    .select("imagenes")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw error;

  const imagenes = (actual as { imagenes?: string[] } | null)?.imagenes ?? [];
  if (imagenes.length) await deleteImagenes(imagenes);
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
