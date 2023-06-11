function Logo({ size = 124, bg = "#fff", color = "#111" }) {
  return (
    <svg
      style={{
        width: size + "px",
        height: size + "px",
      }}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path fill={bg} d="M0 0h128v128H0z" />
      <path
        fill={color}
        d="M73.036 87.115A1.884 1.884 0 0 1 71.15 89H56.074a1.885 1.885 0 0 1 0-3.77h15.077a1.884 1.884 0 0 1 1.885 1.885Zm12.676-11.321c-1.31-2.253-3.253-8.625-3.253-16.948a18.846 18.846 0 0 0-37.693 0c0 8.325-1.945 14.695-3.253 16.948a3.77 3.77 0 0 0 3.254 5.668h37.692a3.77 3.77 0 0 0 3.25-5.668h.003Z"
      />
    </svg>
  );
}

export default Logo;
