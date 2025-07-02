import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";

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
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
<div className="my-5 px-4">
  {eventos.length > 0 ? (
    <div className="bg-dark bg-opacity-75 rounded p-4">
      <h2 className="text-white fs-3 fw-bold mb-4 text-capitalize">
        {tipo === "artigo" ? "Artigos" : "Notícias"} Recentes
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
        itemClass="px-2"
      >
        {eventos.map((evento) => (
          <div
            key={evento._id}
            className="bg-white rounded overflow-hidden shadow-sm cursor-pointer"
            onClick={() => navigate(`/eventos/${tipo}/${evento._id}`)}
            style={{ width: "100%", maxWidth: "350px", margin: "0 auto" }}
          >
            {evento.imagem && (
              <img
                src={evento.imagem}
                alt={evento.titulo}
                className="d-block w-100"
                style={{ height: "200px", objectFit: "cover" }}
              />
            )}
            <div className="p-3">
              <h3 className="fs-5 fw-bold">{evento.titulo}</h3>
              <p className="text-secondary">{evento.subTitulo}</p>
              <small className="text-muted">
                Publicado em:{" "}
                {new Date(evento.dataPublicacao).toLocaleDateString("pt-BR")}
              </small>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  ) : (
    <p className="text-center fs-5 mt-4 fw-semibold">
      Nenhum {tipo === "evento" ? "evento" : "campeonato"} cadastrado ainda.
    </p>
  )}
</div>

  );
};

export default ListaEventos;
