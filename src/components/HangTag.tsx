export function HangTag({
  w = 46,
  h = 20,
  fill,
  holeColor,
  rotate = 0,
}: {
  w?: number;
  h?: number;
  fill: string;
  holeColor: string;
  rotate?: number;
}) {
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 46 20"
      style={{ transform: `rotate(${rotate}deg)`, display: "block" }}
    >
      <path
        d="M1.5 2 H33 L44.5 10 L33 18 H1.5 Z"
        fill={fill}
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.5"
      />
      <circle cx="9" cy="10" r="2.1" fill={holeColor} opacity="0.85" />
    </svg>
  );
}
