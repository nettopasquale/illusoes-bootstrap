import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useListarConteudo } from "../../hooks/useListarConteudo";
import LayoutGeral from "../LayoutGeral/LayoutGeral";
import { useParams } from "react-router-dom";
import { Navegacao } from "../Navegacao/Navegacao";
import eldlich from "../../assets/imgs/Yugioh/eldlich_the_golden_lord.jpg";
import dmg from "../../assets/imgs/Yugioh/dark_magician_girl.jpg";
import bwvk from "../../assets/imgs/Yugioh/blackwing___vata_the_knave.jpg";

//MOCKUP TEMPORARIO
const imgsThumb = [eldlich, dmg, bwvk];

export const ListarConteudos = ({
  tipo: tipoProp,
  modoListaCompleta = false,
}) => {
  //controle dos tipos do evento para o carosel ou a Home
  const { tipo: tipoParams } = useParams();
  const tipo = tipoProp || tipoParams; // se tipo prop existir, vai ser modo carosel
  const {
    conteudos: conteudos,
    erro,
    carregando,
    navigate,
  } = useListarConteudo(`http://localhost:8080/conteudos`, tipo);

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

  const TITULOS = {
    noticia: "Todas as notícias",
    artigo: "Todos os artigos",
    evento: "Todos os eventos",
    campeonato: "Todos os campeonatos",
  };

  const TITULOS_HOME = {
    noticia: "Notícias Recentes",
    artigo: "Artigos Recentes",
    evento: "Eventos Recentes",
    campeonato: "Campeonatos Recentes",
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  //PARA LISTAR TUDO
  if (modoListaCompleta) {
    return (
      <LayoutGeral>
        <Container fluid className="my-4">
          <Navegacao
            itens={[{ label: "Home", to: "/" }, { label: "Conteúdos" }]}
          />
          <h2 className="mb-4 text-start fw-bold ">
            {TITULOS[tipo] || "Todos os conteúdos"}
          </h2>
          <hr />
          <Row xs={1} md={2} lg={3} className="g-4">
            {conteudos.map((conteudo) => (
              <Col key={conteudo._id}>
                <Card
                  onClick={() => navigate(`/conteudos/${tipo}/${conteudo._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* {conteudo.thumbs && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080${conteudo.thumbs}`}
                    />
                  )} */}
                  <Card.Img
                    variant="top"
                    src={eldlich}
                  />

                  <Card.Body className="bg-white">
                    <Card.Title>{conteudo.titulo}</Card.Title>
                    <Card.Text className="text-truncate">
                      {conteudo.subTitulo}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </LayoutGeral>
    );
  }

  //HomePage
  return (
    <Container fluid className="my-4">
      {conteudos.length > 0 ? (
        <div
          className="bg-opacity-80 rounded-5 p-4 mx-auto"
          style={{ maxWidth: "1200px" }}
        >
          <h2 className="text fw-bold text-start fs-3 mb-4">
            {TITULOS_HOME[tipo] || "Conteúdos Recentes"}
          </h2>
          <hr></hr>
          <Carousel
            responsive={responsive}
            draggable
            swipeable
            showDots
            dotListClass="mt-4 text-center"
            infinite={false}
            arrows
            keyBoardControl
            containerClass="carousel-container"
            itemClass="px-3" // padding lateral por card
            removeArrowOnDeviceType={["mobile"]}
          >
            {conteudos.map((conteudo) => (
              <div
                key={conteudo._id}
                className="rounded overflow-hidden cursor-pointer hover:shadow-xl transition duration-300"
                style={{
                  maxWidth: "300px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/conteudos/${tipo}/${conteudo._id}`)}
              >
                {/* {conteudo.thumbs && (
                  <img
                    src={`http://localhost:8080${conteudo.thumbs}`}
                    alt={conteudo.titulo}
                    className="card-img-top"
                    style={{ height: "88px", objectFit: "cover" }}
                  />
                )} */}
                <img
                  className="card-img-top"
                  style={{ height: "88px", objectFit: "cover" }}
                  src={eldlich}
                />
                <div className="card-body bg-white p-3 rounded-bottom-3 ">
                  <h5 className="card-title fw-bold text-start">
                    {conteudo.titulo}
                  </h5>
                  <p className="card-text text-multiline-truncate">
                    {conteudo.subTitulo}
                  </p>
                  <small className="text-muted">
                    Publicado em:{" "}
                    {new Date(conteudo.dataPublicacao).toLocaleDateString(
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
          {TITULOS[tipo] || "Conteúdos não cadastrados ainda."}
        </p>
      )}
    </Container>
  );
};
