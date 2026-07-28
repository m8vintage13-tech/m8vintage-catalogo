import { WHATSAPP_NUMBER } from "../config";

export function formatPrecio(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

export function whatsappUrl(nombre: string, precioTxt: string): string {
  const text = `Hola! Te consulto por ${nombre} (${precioTxt})`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// El campo "talle" es texto libre; admite varios talles separados por
// coma o barra (ej. "M, L" o "S/M/L") para prendas con más de un talle.
export function parseTalles(talle: string): string[] {
  return talle
    .split(/[,/]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
