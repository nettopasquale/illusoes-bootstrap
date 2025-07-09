import { Container, Col, Image } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";

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
        <Container fluid className="mt-3">
          <div className="text-start mt-5">
            <h1 className="fs-1 fw-bold mb-5">{conteudo.titulo}</h1>
            <p className="fs-4">{conteudo.subTitulo}</p>
          </div>
          <div className="text-start mt-3 mx-1">
            <span>{conteudo.autor?.usuario || "Autor desconhecido "}</span>
            <span>
              {new Date(conteudo.dataPublicacao).toLocaleDateString()}
            </span>
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
                alt="imagem da notícia"
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
