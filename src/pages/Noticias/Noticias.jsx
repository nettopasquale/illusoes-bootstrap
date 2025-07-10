import { Container, Col, Row, Image } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";
import { Navegacao } from "../../components/Navegacao/Navegacao";

export default function Noticias() {
  const { id, conteudo, erro } = useConteudo(`http://localhost:8080/noticias`);

  console.log("Conteúdo pego: ", conteudo);

  if (erro) {
    return <div className="text-center text-danger mt-5">{erro}</div>;
  }

  if (!conteudo) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  console.log(conteudo.imagem);

  return (
    <LayoutGeral>
      <section id="conteudo" className="block conteudo-block">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Navegacao itens={[{ label: "Home", to: "/" } , { label: "Todas as Notícias", to: "/noticias/noticia" }, {label: "Notícia"}]} />
            <Col md={10}>
              <h1 className="fw-bold mb-2 text-start">{conteudo.titulo}</h1>
              <h5 className="text-muted mb-4 text-start">
                {conteudo.subTitulo}
              </h5>
              <div className="d-flex flex-wrap gap-3 align-items-center text-secondary mb-4">
                <span>
                  <strong>Autor:</strong>{" "}
                  {conteudo.autor?.usuario ||
                    conteudo.autor?.nome ||
                    "Desconhecido"}
                </span>
                <span className="text-muted">•</span>
                <span>
                  <strong>Publicado em:</strong>{" "}
                  {new Date(conteudo.dataPublicacao).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
              {conteudo.imagem && (
                <div className="mb-4 text-center">
                  <Image
                    src={`http://localhost:8080${conteudo.imagem}`}
                    width={700}
                    height={200}
                    className="img-fluid rounded shadow"
                    alt="imagem da noticia"
                  />
                </div>
              )}

              <div
                className="conteudo-html mt-3"
                dangerouslySetInnerHTML={{ __html: conteudo.conteudo }}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
