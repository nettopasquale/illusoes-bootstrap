import { Container, Col, Row, Image } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";
import { Navegacao } from "../../components/Navegacao/Navegacao";

export default function Eventos() {
  const { conteudo, erro } = useConteudo("http://localhost:8080/eventos");
  console.log("Conteúdo pego: ", conteudo);

  if (erro) return <div className="text-center text-danger mt-5">{erro}</div>;
  if (!conteudo) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <LayoutGeral>
      <section id="conteudo" className="block evento-block">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todos os Eventos", to: "/eventos/evento" },
                { label: "Evento" },
              ]}
            />
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

              <Col md={10}>
                <div className="d-flex flex-wrap gap-3 align-items-center text-secondary mb-4 text-secondary">
                  {conteudo.dataEvento && (
                    <div>
                      <p>
                        <strong>Data do Evento: </strong>
                        {new Date(conteudo.dataEvento).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  )}

                  {conteudo.valorEntrada !== undefined && (
                    <div>
                      <strong>Entrada:</strong>{" "}
                      {conteudo.valorEntrada === 0 ||
                      conteudo.valorEntrada === "0"
                        ? "Entrada gratuita"
                        : `R$ ${parseFloat(conteudo.valorEntrada).toFixed(2)}`}
                    </div>
                  )}
                </div>
              </Col>

              <div className="my-3 text-muted text-start">
                Tags: <strong>{conteudo.tipo}</strong>
              </div>
              {conteudo.imagem && (
                <Image
                  src={`http://localhost:8080${conteudo.imagem}`}
                  width={700}
                  height={200}
                  className="img-fluid rounded mb-3"
                  alt="imagem do evento"
                />
              )}

              <div
                className="lead conteudo-html"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: conteudo.conteudo }}
              ></div>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
