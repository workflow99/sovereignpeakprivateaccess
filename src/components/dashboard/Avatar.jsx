export default function Avatar({ name, avatarUrl, size = 28, className = "" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B11226] to-[#D62839] font-semibold text-white ${className}`}
    >
      {initials}
    </span>
  );
}
