import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useState } from "react";
import { ChatDots, PlusCircle } from "react-bootstrap-icons";
import { useParams, useNavigate } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ForumCriarTopico() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [alerta, setAlerta] = useState({ tipo: "", mensagem: "" });
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !conteudo.trim()) {
      setAlerta({
        tipo: "danger",
        mensagem:
          "Por favor, preencha o título e o conteúdo antes de criar o tópico.",
      });
      return;
    }

    setCarregando(true);
    setAlerta({ tipo: "", mensagem: "" });

    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui entrará a chamada real ao backend:
    // axios.post(`/api/forum/categorias/${categoriaId}/topicos`, { titulo, conteudo })
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simula delay
    console.log("Novo tópico criado:", { categoriaId, titulo, conteudo });
    // ==================================================================

    setCarregando(false);
    setAlerta({
      tipo: "success",
      mensagem: "Tópico criado com sucesso! Redirecionando...",
    });

    setTimeout(() => navigate(`/forum/categorias/${categoriaId}`), 1500);
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: "/forum" },
                { label: "Forum Categoria", to: "/forum/categoria" },
                {
                  label: "Forum Categoria Item",
                  to: "/forum/categoria/:categoriaId",
                },
                {
                  label: "Forum SubForum ",
                  to: "/forum/categoria/subForum/:subForumId",
                },
                {
                  label: "Criar Tópico",
                  to: "/forum/categoria/subForum/:subForumId/criar-topico",
                },
              ]}
            />
            <Col xs={12} md={8} lg={7}>
              <Card className="shadow-sm border-0 rounded-3">
                <Card.Header className="bg-light border-0 py-3">
                  <h4 className="fw-bold text-primary mb-0 d-flex align-items-center">
                    <PlusCircle className="me-2" /> Criar novo tópico
                  </h4>
                  <small className="text-muted">
                    Categoria selecionada: <strong>{categoriaId}</strong>
                  </small>
                </Card.Header>

                <Card.Body>
                  {alerta.mensagem && (
                    <Alert variant={alerta.tipo}>{alerta.mensagem}</Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Título do tópico
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite um título claro e descritivo..."
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Mensagem inicial
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={6}
                        placeholder="Escreva o conteúdo inicial do seu tópico..."
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={carregando}
                        className="d-flex align-items-center"
                      >
                        {carregando ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            ></span>
                            Criando...
                          </>
                        ) : (
                          <>
                            <ChatDots className="me-2" /> Criar Tópico
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
