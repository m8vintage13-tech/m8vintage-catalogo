import { WHATSAPP_NUMBER } from "../config";

export function formatPrecio(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

export function whatsappUrl(nombre: string, precioTxt: string): string {
  const text = `Hola! Te consulto por ${nombre} (${precioTxt})`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
