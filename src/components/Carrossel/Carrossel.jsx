/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Carousel, Image } from "react-bootstrap";
import liliana from "../../assets/imgs/Magic/liliana-vess-1920_jpg.jpg";
import yug25 from "../../assets/imgs/Yugioh/25thniv.jpg";
import SVPok from "../../assets/imgs/Pokemon/Scarlet-Violet-English-1.jpg";
import "../../customStyle.css";


const Carrossel = () => {
  //controle do carossel
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

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
      <Carousel.Item interval={500000}>
        <Image
          src={yug25}
          className="d-block w-100 carousel-image"
          fluid
        />
        <Carousel.Caption
          className="bg-dark bg-opacity-50 rounded"
          style={{ maxWidth: "1280px" }}
        >
          <h3 className="fw-bold text-white text-center fs-3">
            Lançamento: Set 25th Anniversary Yugioh!
          </h3>
          <p className="fw-bold text-white text-center">
            As cartas clássicas novamente disponíveis
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500000}>
        <Image
          src={SVPok}
          className="d-block w-100 carousel-image"
          fluid
        />
        <Carousel.Caption
          className="bg-dark bg-opacity-50 rounded p-3 mx-auto"
          style={{ maxWidth: "1280px" }}
        >
          <h3 className="fw-bold text-white text-center fs-3">
            Campeonato Scarlet e Violet - Pokémon
          </h3>
          <p className="fw-bold text-white text-center">Para todas as idades</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={500000}>
        <Image
          src={liliana}
          className="d-block w-100 carousel-image"
          fluid
        />
        <Carousel.Caption
          className="bg-dark bg-opacity-50 rounded p-3 mx-auto"
          style={{ maxWidth: "1280px" }}
        >
          <h3 className="fw-bold text-white text-center fs-3">
            Liliana Death Wielder
          </h3>
          <p className="fw-bold text-white text-center">
            Veja como montar um Deck focado em suporte para Liliana
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Carrossel;
