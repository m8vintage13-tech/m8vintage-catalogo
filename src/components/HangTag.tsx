export function HangTag({
  w = 46,
  h = 20,
  fill,
  holeColor,
  rotate = 0,
  holeR = 3.2,
}: {
  w?: number;
  h?: number;
  fill: string;
  holeColor: string;
  rotate?: number;
  /** Radio del ojal en píxeles reales (no en unidades del viewBox). */
  holeR?: number;
}) {
  // El viewBox (46x20) casi nunca comparte proporción con el w/h pedido por
  // cada uso (watermark, card, detalle...), así que con preserveAspectRatio
  // "none" el SVG estira x e y con factores distintos. Un <circle> sufre esa
  // distorsión y sale ovalado. Para que el ojal se vea SIEMPRE redondo,
  // calculamos su rx/ry en unidades del viewBox a partir del radio en
  // píxeles reales deseado, compensando cada eje por separado.
  const scaleX = w / 46;
  const scaleY = h / 20;
  const rx = holeR / scaleX;
  const ry = holeR / scaleY;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 46 20"
      preserveAspectRatio="none"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      <path
        d="M1.5 2 H33 L44.5 10 L33 18 H1.5 Z"
        fill={fill}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.5"
      />
      <ellipse cx="9" cy="10" rx={rx} ry={ry} fill={holeColor} opacity="0.85" />
    </svg>
  );
}
