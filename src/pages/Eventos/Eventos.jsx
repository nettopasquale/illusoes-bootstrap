import { Container, Col, Image } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";

export default function Eventos() {
  const { conteudo, erro } = useConteudo("http://localhost:8080/eventos");
   console.log("Conteúdo pego: ", conteudo);

  if (erro) return <div className="text-center text-danger mt-5">{erro}</div>;
  if (!conteudo) return <div className="text-center mt-5">Carregando...</div>;

  console.log(conteudo.imagem);
  return (
    <LayoutGeral>
      <section id="artigo" className="block evento-block">
        <Container fluid className="mt-3">
          <div className="text-start mt-5">
            <h1 className="fs-1 fw-bold mb-5">{conteudo.titulo}</h1>
            <p className="fs-4">{conteudo.subTitulo}</p>
          </div>
          <div className="text-start mt-3 mx-1">
            <span>{conteudo.criador?.usuario || "Criador desconhecido "}</span>
            <span>
              {new Date(conteudo.dataPublicacao).toLocaleDateString("pt-BR")}
            </span>
          </div>

          <div className="text-start mt-3 mx-1 text-secondary">
            {conteudo.dataEvento && (
              <div>
                <p>
                  <strong>Data do Evento:{" "}</strong>
                  {new Date(conteudo.dataEvento).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}
            {conteudo.valorEntrada !== undefined && (
              <div>
                <strong>Entrada:</strong>{" "}
                {conteudo.valorEntrada === 0 || conteudo.valorEntrada === "0"
                  ? "Entrada gratuita"
                  : `R$ ${parseFloat(conteudo.valorEntrada).toFixed(2)}`}
              </div>
            )}
          </div>
        </Container>
        <Container>
          <Col>
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
          </Col>
          <Col>
            <div className="lead" style={{ whiteSpace: "pre-line" }}>
              {conteudo.conteudo}
            </div>
          </Col>
        </Container>
      </section>
    </LayoutGeral>
  );
}
