import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useListarConteudo } from "../../hooks/useListarConteudo";
import LayoutGeral from "../LayoutGeral/LayoutGeral";
import { useParams } from "react-router-dom";
import { Navegacao } from "../Navegacao/Navegacao";

export const ListarNoticias = ({
  tipo: tipoProp,
  modoListaCompleta = false,
}) => {
  //controle dos tipos da noticia para o carosel ou a Home
  const { tipo: tipoParams } = useParams();
  const tipo = tipoProp || tipoParams; // se tipo prop existir, vai ser modo carosel
  const {
    conteudos: noticias,
    erro,
    carregando,
    navigate,
  } = useListarConteudo("https://illusoes-bootstrap.onrender.com/noticias", tipo);

  console.log(`https://illusoes-bootstrap.onrender.com/noticias tipo = ${tipo}`);

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

  // PARA LISTAR TUDO!
  if (modoListaCompleta) {
    return (
      <LayoutGeral>
        <Container fluid className="my-4">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Noticias e Artigos" },
            ]}
          />
          <h2 className="mb-4 text-center">
            {tipo === "artigo" ? "Todos os artigos" : "Todas as notícias"}
          </h2>
          <hr />
          <Row xs={1} md={2} lg={3} className="g-4">
            {noticias.map((noticia) => (
              <Col key={noticia._id}>
                <Card
                  onClick={() => navigate(`/noticias/${tipo}/${noticia._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {noticia.imagem && (
                    <Card.Img
                      variant="top"
                      src={`https://illusoes-bootstrap.onrender.com${noticia.imagem}`}
                    />
                  )}
                  <Card.Body className="bg-white">
                    <Card.Title>{noticia.titulo}</Card.Title>
                    <Card.Text className="text-truncate">
                      {noticia.subTitulo}
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
            dotListClass="mt-4 text-center"
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
                    src={`https://illusoes-bootstrap.onrender.com${noticia.imagem}`}
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
