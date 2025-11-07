import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ChatLeftText, ChatDots, PlusCircle } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ForumSub() {
  const { subForumId } = useParams();
  const [subForum, setSubForum] = useState(null);
  const [topicos, setTopicos] = useState([]);

  useEffect(() => {
    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui futuramente entrará a chamada real:
    // axios.get(`/api/forum/subforum/${subForumId}`)
    setSubForum({
      _id: subForumId,
      nome: "Decks Competitivos",
      descricao: "Táticas e estratégias para quem busca jogar em torneios.",
    });

    setTopicos([
      {
        _id: "t1",
        titulo: "Melhores combinações de cartas raras",
        autor: "ProDeckMaster",
        dataCriacao: "2025-11-03T18:25:00Z",
        respostas: 5,
        visualizacoes: 138,
      },
      {
        _id: "t2",
        titulo: "Meta atual dos campeonatos 2025",
        autor: "CardGuru",
        dataCriacao: "2025-11-02T14:12:00Z",
        respostas: 12,
        visualizacoes: 420,
      },
      {
        _id: "t3",
        titulo: "Decks de controle vs aggro — o que está dominando?",
        autor: "TheStrategist",
        dataCriacao: "2025-11-01T10:45:00Z",
        respostas: 8,
        visualizacoes: 312,
      },
    ]);
    // ==================================================================
  }, [subForumId]);

  if (!subForum)
    return <p className="text-center mt-5">Carregando subfórum...</p>;

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: "/forum" },
                { label: "Forum Categoria", to: "/forum/categorias" },
                { label: "Forum SubCategoria", to: "/forum/categorias/subcategorias" },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <ChatLeftText className="me-2" /> {subForum.nome}
              </h3>
              <p className="text-muted">{subForum.descricao}</p>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col className="text-end">
              <Link
                to={`/forum/subforum/${subForumId}/criar-topico`}
                className="btn btn-primary d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", width: "fit-content", float: "right" }}
              >
                <PlusCircle /> Novo tópico
              </Link>
            </Col>
          </Row>

          {/* Lista de tópicos */}
          {topicos.length > 0 ? (
            <Row className="gy-3">
              {topicos.map((topico) => (
                <Col xs={12} key={topico._id}>
                  <Card className="border-0 shadow-sm rounded-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Link
                            to={`/forum/topico/${topico._id}`}
                            className="text-decoration-none text-dark fw-semibold fs-5"
                          >
                            {topico.titulo}
                          </Link>
                          <div className="text-muted small mt-1">
                            Criado por <strong>{topico.autor}</strong> em{" "}
                            {new Date(topico.dataCriacao).toLocaleDateString(
                              "pt-BR"
                            )}{" "}
                            • {topico.respostas} respostas •{" "}
                            {topico.visualizacoes} visualizações
                          </div>
                        </div>
                        <ChatDots size={20} className="text-primary" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p className="text-center text-muted mt-4">
              Nenhum tópico criado neste subfórum ainda.
            </p>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
