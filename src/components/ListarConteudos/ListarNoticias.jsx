import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useListarConteudo } from "../../hooks/useListarConteudo";

const ListaNoticias = ({tipo}) => {
  const {
    conteudos: noticias,
    erro,
    carregando,
    navigate,
  } = useListarConteudo("http://localhost:8080/noticias", tipo);

  const responsive = {
    desktop: {
      breakpoint: { max: 3840, min: 1024 },
      items: 5,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <Container fluid className="my-5">
      {noticias.length > 0 ? (
        <div
          className="bg-opacity-80 rounded-5 p-4 mx-auto"
          style={{ maxWidth: "1200px" }}
        >
          <h2 className="text fw-bold text-start fs-3 mb-4">
            {tipo === "artigo" ? "Artigos" : "Notícias"} Recentes
          </h2>
          <hr></hr>
          <Carousel
            responsive={responsive}
            draggable
            swipeable
            showDots
            infinite={false}
            arrows
            keyBoardControl
            containerClass="carousel-container"
            itemClass="px-3" // padding lateral por card
            removeArrowOnDeviceType={["mobile"]}
          >
            {noticias.map((noticia) => (
              <div
                key={noticia._id}
                className="rounded overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
                style={{
                  maxWidth: "300px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/noticias/${tipo}/${noticia._id}`)}
              >
                {noticia.imagem && (
                  <img
                    src={`http://localhost:8080${noticia.imagem}`}
                    alt={noticia.titulo}
                    className="card-img-top"
                    style={{
                      height: "88px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                )}
                <div className="card-body bg-white rounded-bottom-3 p-3">
                  <h5 className="card-title fw-bold text-start">
                    {noticia.titulo}
                  </h5>
                  <p className="card-text text-multiline-truncate">
                    {noticia.subTitulo}
                  </p>
                  <small className="text-muted">
                    Publicado em:{" "}
                    {new Date(noticia.dataPublicacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </small>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <p className="text-center text fw-bold">
          {tipo === "artigo"
            ? "Nenhum artigo cadastrado ainda."
            : " Nenhuma noticia cadastrada ainda."}
        </p>
      )}
    </Container>
  );
};

export default ListaNoticias;
