import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const ListaEventos = ({ tipo }) => {
  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventos= async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/eventos?tipo=${tipo}`
        );
        setEventos(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchEventos();
  }, [tipo]);

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

  return (
  <Container fluid className="my-5">
      {eventos.length > 0 ? (
        <div
          className="bg-opacity-80 rounded-5 p-4 mx-auto"
          style={{ maxWidth: "1200px" }}
        >
          <h2 className="text fw-bold fs-3 mb-4">
            {tipo === "campeonato" ? "Campeonatos" : "Eventos"} Recentes
          </h2>
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
            {eventos.map((evento) => (
              <div
                key={evento._id}
                className="rounded overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
                style={{
                  maxWidth: "300px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/eventos/${tipo}/${evento._id}`)}
              >
                {evento.imagem && (
                  <img
                    src={`http://localhost:8080${evento.imagem}`}
                    alt={evento.titulo}
                    className="card-img-top"
                    style={{ height: "88px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body bg-white p-3">
                  <h5 className="card-title">{evento.titulo}</h5>
                  <p className="card-text">{evento.subTitulo}</p>
                  <small className="text-muted">
                    Publicado em:{" "}
                    {new Date(evento.dataPublicacao).toLocaleDateString(
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
          {tipo === "campeonato"
            ? "Nenhum Campeonato cadastrado ainda."
            : " Nenhum Evento cadastrado ainda."}
        </p>
      )}
    </Container>

  );
};

export default ListaEventos;
