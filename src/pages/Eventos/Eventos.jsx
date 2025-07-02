import { Container, Col, Image } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";

export default function Eventos() {
  const { conteudo, erro } = useConteudo("http://localhost:8080/eventos");
  
  if (erro) return <div className="text-center text-danger mt-5">{erro}</div>;
  if (!conteudo) return <div className="text-center mt-5">Carregando...</div>;

  return (
    <LayoutGeral>
      <section id="artigo" className="block evento-block">
        <Container fluid className="mt-3">
          <div className="text-start mt-5">
            <h1 className="fs-1 fw-bold">{conteudo.titulo}</h1>
            <p className="fs-4">{conteudo.subTitulo}</p>
          </div>
          <div className="text-start mt-3">
            <span>{conteudo.autor?.nome || "Autor desconhecido"}</span>
            <span>
              {new Date(conteudo.dataPublicacao).toLocaleDateString("pt-BR")}
            </span>
          </div>
          0
        </Container>
        <Container>
          <Col>
            {conteudo.imagem ?? (
              <Image
                src={conteudo.imagem}
                width={700}
                height={200}
                className="img-fluid rounded"
                alt="imagem do evento"
              />
            )}
          </Col>
          <Col>
            <div className="mt-5 text-muted">
              Tipo: <strong>{conteudo.tipo}</strong>
            </div>
            <div className="lead" style={{ whiteSpace: "pre-line" }}>
              {conteudo.conteudo}
            </div>
          </Col>
        </Container>
      </section>
    </LayoutGeral>
  );
}
