
export function Avatar({ nome = "", size = 44, img = null }) {
  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Se tiver URL de imagem, renderiza com <img> em vez do div colorido
  if (img) {
    return (
      <img
        src={img}
        alt={nome}
        className="rounded-circle flex-shrink-0"
        style={{
          width: size,
          height: size,
          objectFit: "cover", // garante que a foto não distorce
        }}
        onError={(e) => {
          // se a URL quebrar, some com a imagem
          e.target.style.display = "none";
        }}
      />
    );
  }

  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${[...nome].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 55%, 42%)`,
      }}
    >
      {iniciais || "?"}
    </div>
  );
}
