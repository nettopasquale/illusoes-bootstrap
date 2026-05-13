import { useState, useEffect } from "react";
import { Carousel, Image, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { listarDestaques } from "../../services/destaquesService";
import liliana from "../../assets/imgs/Magic/liliana-vess-1920_jpg.jpg";
import yug25 from "../../assets/imgs/Yugioh/25thniv.jpg";
import SVPok from "../../assets/imgs/Pokemon/Scarlet-Violet-English-1.jpg";

const TIPO_META = {
  noticia: { label: "Notícia", bg: "primary" },
  artigo: { label: "Artigo", bg: "secondary" },
  evento: { label: "Evento", bg: "success" },
  campeonato: { label: "Campeonato", bg: "warning" },
};

// Formata data de evento se existir
function formatarDataEvento(data) {
  if (!data) return null;
  return new Date(data).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Carrossel(){
  const [index, setIndex] = useState(0);
  const [destaques, setDestaques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarDestaques(5)
      .then(({ data }) => setDestaques(data))
      .catch(() => setErro("Não foi possível carregar os destaques."))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  // Estados de carregamento e erro
  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center bg-light"
        style={{ height: 400 }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (erro || destaques.length === 0) {
    return (
      <div
        className="d-flex align-items-center justify-content-center bg-light text-muted"
        style={{ height: 400 }}
      >
        {erro || "Nenhum destaque disponível."}
      </div>
    );
  }

  return (
    <Carousel
      className="w-100 mt-1"
      slide={false}
      activeIndex={index}
      onSelect={handleSelect}
      data-bs-theme="dark"
      style={{ maxWidth: "1280px", maxHeight: "694px", margin: "0 auto" }}
      controls={true}
      indicators={true}
    >
      {destaques.map((conteudo) => {
        const tipometa = TIPO_META[conteudo.tipo] || TIPO_META.noticia;
        // Link para a página correta baseado no tipo
        const linkDestino = `/conteudos/${conteudo.tipo}/${conteudo._id}`;

        return (
          <Carousel.Item key={conteudo._id} interval={10000}>
            {/* Imagem de capa — usa thumbs se existir, senão placeholder */}
            {conteudo.thumbs ? (
              <Image
                src={conteudo.thumbs}
                className="d-block w-100 carousel-image"
                fluid
                alt={conteudo.titulo}
                style={{ objectFit: "cover", maxHeight: 694 }}
              />
            ) : (
              <div
                className="d-block w-100 carousel-image bg-secondary"
                style={{ height: 400 }}
              />
            )}

            <Carousel.Caption
              className="bg-dark bg-opacity-50 rounded p-3 mx-auto"
              style={{ maxWidth: "1280px" }}
            >
              {/* Badge do tipo */}
              <div className="mb-2">
                <Badge bg={tipometa.bg}>{tipometa.label}</Badge>
              </div>

              <h3 className="fw-bold text-white text-center fs-3">
                {conteudo.titulo}
              </h3>

              <p className="fw-bold text-white text-center">
                {conteudo.subTitulo}
              </p>

              {/* Data do evento se for evento/campeonato */}
              {conteudo.dataEvento && (
                <p
                  className="text-white text-center mb-1"
                  style={{ fontSize: "0.85rem" }}
                >
                  📅 {formatarDataEvento(conteudo.dataEvento)}
                </p>
              )}

              {/* Métricas de engajamento */}
              <div className="d-flex justify-content-center gap-3 mb-2">
                <span className="text-white" style={{ fontSize: "0.82rem" }}>
                  ❤️ {conteudo.totalLikes}
                </span>
                <span className="text-white" style={{ fontSize: "0.82rem" }}>
                  💬 {conteudo.totalComentarios}
                </span>
              </div>

              {/* Link para o conteúdo completo */}
              <div className="text-center">
                <Link
                  to={linkDestino}
                  className="btn btn-sm btn-light fw-semibold"
                >
                  Ver mais →
                </Link>
              </div>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};
