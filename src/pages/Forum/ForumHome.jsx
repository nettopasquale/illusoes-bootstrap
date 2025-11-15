import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { ChatLeftText, Folder } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ForumHome() {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // ========================= MOCK TEMPORÁRIO =========================
    // Futuramente aqui entrará a chamada:
    // axios.get("/api/forum")

    setCategorias([
      {
        _id: "1",
        nome: "Discussões Gerais",
        descricao: "Converse sobre qualquer assunto relacionado a card games.",
        subforuns: [
          {
            _id: "1a",
            nome: "Apresentações",
            descricao: "Novo por aqui? Apresente-se à comunidade!",
          },
          {
            _id: "1b",
            nome: "Off-topic",
            descricao: "Fale sobre qualquer outro tema fora dos jogos.",
          },
        ],
      },
      {
        _id: "2",
        nome: "Estratégias e Decks",
        descricao: "Compartilhe táticas e criações de decks poderosos.",
        subforuns: [
          {
            _id: "2a",
            nome: "Decks Iniciantes",
            descricao: "Guias para novos jogadores começarem com o pé direito.",
          },
          {
            _id: "2b",
            nome: "Decks Competitivos",
            descricao: "Discussões e builds para torneios.",
          },
        ],
      },
      {
        _id: "3",
        nome: "Suporte Técnico",
        descricao: "Problemas com o site ou o jogo? Peça ajuda aqui.",
        subforuns: [],
      },
    ]);
    // ==================================================================
  }, []);

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: "/forum" },
              ]}
            />
            <Col>
              <h2 className="fw-bold text-primary d-flex align-items-center">
                <ChatLeftText className="me-2" /> Fórum Ilusões Industriais
              </h2>
              <p className="text-muted">
                Participe das discussões, compartilhe estratégias e conecte-se
                com outros duelistas.
              </p>
            </Col>
          </Row>

          {/* Lista de Categorias */}
          {categorias.map((categoria) => (
            <Row key={categoria._id} className="mb-4">
              <Col>
                <Card className="border-0 shadow-sm rounded-3">
                  <Card.Header className="bg-light border-0 py-3">
                    <h5 className="fw-bold mb-0 d-flex align-items-center">
                      <Folder className="me-2 text-secondary" />
                      {categoria.nome}
                    </h5>
                    <small className="text-muted">{categoria.descricao}</small>
                  </Card.Header>

                  {/* Subfóruns */}
                  {categoria.subforuns.length > 0 ? (
                    <Card.Body className="py-2">
                      {categoria.subforuns.map((sub) => (
                        <Link
                          to={`/forum/categoria/:categoriaId/subforum/${sub._id}`}
                          className="flex-grow-1"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <div
                            key={sub._id}
                            className="d-flex justify-content-between align-items-start border-bottom py-3"
                          >
                            <div>
                              <h6 className="fw-bold mb-1">{sub.nome}</h6>
                              <p className="mb-0 text-muted small">
                                {sub.descricao}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </Card.Body>
                  ) : (
                    <Card.Body className="py-3">
                      <p className="text-muted mb-0">
                        Nenhum subfórum nesta categoria.
                      </p>
                    </Card.Body>
                  )}
                </Card>
              </Col>
            </Row>
          ))}

          {/* Botão criar categoria (para admin futuramente) */}
          {/* ========================= MOCK TEMPORÁRIO =========================
          Exemplo: Mostrar apenas se user.role === 'admin'
      ================================================================== */}
          <div className="text-center mt-4">
            <Button variant="primary" disabled>
              + Criar nova categoria (admin)
            </Button>
          </div>
        </Container>
      </section>
    </LayoutGeral>
  );
}
