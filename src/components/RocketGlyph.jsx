export default function RocketGlyph({ width = 42, height = 72 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 42 72" fill="none">
      <path
        d="M21 3C27 11 30 22 30 34H12C12 22 15 11 21 3Z"
        fill="#131318"
        stroke="#D62839"
        strokeWidth="1.4"
      />
      <path d="M12 34H30V46H12V34Z" fill="#131318" stroke="#D62839" strokeWidth="1.4" />
      <path d="M12 40L3 52H12V40Z" fill="#131318" stroke="#D62839" strokeWidth="1.2" />
      <path d="M30 40L39 52H30V40Z" fill="#131318" stroke="#D62839" strokeWidth="1.2" />
      <circle cx="21" cy="20" r="4" fill="#0d0d10" stroke="#EF4444" strokeWidth="1.2" />
    </svg>
  );
}
