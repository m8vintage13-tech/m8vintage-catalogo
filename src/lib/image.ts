// Comprime/redimensiona una foto en el navegador antes de subirla a Supabase
// Storage. Las fotos de Instagram sin optimizar pesan 1-3MB c/u y con varios
// productos x varias fotos eso agota rápido el egress del plan gratis. Esto
// baja el peso 50-90% sin pérdida visible (el sitio nunca muestra más de
// ~800px de ancho).
const MAX_DIM = 1600;
const QUALITY = 0.8;

export async function compressImage(file: File): Promise<File> {
  // Si no es imagen (no debería pasar, el input ya filtra) devolvemos tal cual.
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;

    if (width > MAX_DIM || height > MAX_DIM) {
      const scale = MAX_DIM / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY)
    );
    if (!blob) return file;

    // Si por algún motivo el resultado no achica nada, nos quedamos con el original.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // Si algo falla (formato raro, navegador viejo, etc.) subimos el original
    // en vez de romper el flujo de carga.
    return file;
  }
}

export async function compressImages(files: File[]): Promise<File[]> {
  return Promise.all(files.map(compressImage));
}
