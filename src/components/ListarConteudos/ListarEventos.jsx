import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useListarConteudo } from "../../hooks/useListarConteudo";
import LayoutGeral from "../LayoutGeral/LayoutGeral";
import { useParams } from "react-router-dom";
import { Navegacao } from "../Navegacao/Navegacao";

export const ListarEventos = ({
  tipo: tipoProp,
  modoListaCompleta = false,
}) => {
  //controle dos tipos do evento para o carosel ou a Home
  const { tipo: tipoParams } = useParams();
  const tipo = tipoProp || tipoParams; // se tipo prop existir, vai ser modo carosel
  const {
    conteudos: eventos,
    erro,
    carregando,
    navigate,
  } = useListarConteudo("http://localhost:8080/eventos", tipo);

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

  //PARA LISTAR TUDO
  if (modoListaCompleta) {
    return (
      <LayoutGeral>
        <Container fluid className="my-4">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Eventos e Campeonatos" },
            ]}
          />
          <h2 className="mb-4 text-start fw-bold ">
            {tipo === "campeonato"
              ? "Todos os campeonatos"
              : "Todos os eventos"}
          </h2>
          <hr />
          <Row xs={1} md={2} lg={3} className="g-4">
            {eventos.map((evento) => (
              <Col key={evento._id}>
                <Card
                  onClick={() => navigate(`/eventos/${tipo}/${evento._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {evento.imagem && (
                    <Card.Img
                      variant="top"
                      src={`http://localhost:8080${evento.imagem}`}
                    />
                  )}
                  <Card.Body className="bg-white">
                    <Card.Title>{evento.titulo}</Card.Title>
                    <Card.Text className="text-truncate">
                      {evento.subTitulo}
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
      {eventos.length > 0 ? (
        <div
          className="bg-opacity-80 rounded-5 p-4 mx-auto"
          style={{ maxWidth: "1200px" }}
        >
          <h2 className="text fw-bold text-start fs-3 mb-4">
            {tipo === "campeonato" ? "Campeonatos" : "Eventos"} Recentes
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
                <div className="card-body bg-white p-3 rounded-bottom-3 ">
                  <h5 className="card-title fw-bold text-start">
                    {evento.titulo}
                  </h5>
                  <p className="card-text text-multiline-truncate">
                    {evento.subTitulo}
                  </p>
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
