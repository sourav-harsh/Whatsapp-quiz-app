export default function Avatar({ name = "?", initials, color = "#128C7E", size = 44, src }) {
  const label = initials || name.slice(0, 2).toUpperCase();
  const style = { width: size, height: size, backgroundColor: color, fontSize: size / 2.6 };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      style={style}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold uppercase text-white"
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
