import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";

const ListaNoticias = ({ tipo }) => {
  const [noticias, setNoticias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/noticias?tipo=${tipo}`
        );
        setNoticias(response.data);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNoticias();
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
    <div className="my-10 px-4">
      {noticias.length > 0 ? (
        <div className="bg-black bg-opacity-80 rounded-xl p-4">
          <h2 className="text-white text-2xl mb-4 capitalize">
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
            {noticias.map((noticia) => (
              <div
                key={noticia._id}
                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition duration-300"
                onClick={() => navigate(`/noticias/${tipo}/${noticia._id}`)}
              >
                {noticia.imagem && (
                  <img
                    src={noticia.imagem}
                    alt={noticia.titulo}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{noticia.titulo}</h3>
                  <p className="text-sm text-gray-600">{noticia.subTitulo}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Publicado em:{" "}
                    {new Date(noticia.dataPublicacao).toLocaleDateString(
                      "pt-BR"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <p className="text fw-bold text-center text-lg mt-8">
          Nenhuma {tipo === "artigo" ? "artigo" : "notícia"} cadastrada ainda.
        </p>
      )}
    </div>
  );
};

export default ListaNoticias;
