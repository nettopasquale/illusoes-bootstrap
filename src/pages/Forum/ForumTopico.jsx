import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChatDots } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumPost from "../../components/ForumComponentes/ForumPost";

export default function ForumTopico() {
  const { id } = useParams(); // ID do tópico
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui futuramente será feita uma chamada ao backend, ex:
    // axios.get(`/api/forum/topicos/${id}`)
    setTopic({
      id,
      titulo: "Estratégias avançadas de decks",
      autor: "MestreDasCartas",
      dataCriacao: "",
      dataModificacao: "",
      visualizacoes: "",
      posts: [""],
      totalPosts: 0,
      ultimoPost: { usuario: autor, data: "" },
      status: ativo,
      fixado: true,
    });

    setPosts([
      {
        id: 1,
        autor: "MestreDasCartas",
        data: "05-11-2025",
        conteudo:
          "Bem-vindo ao tópico! Aqui discutiremos as melhores estratégias para montar decks competitivos. Alguém poderia explicar como otimizar o uso de cartas de suporte? Ainda estou aprendendo.",
        anexos: "",
        cutidas: 0,
        curtidasTotais: 0,
        visualizacoes: 0,
        editado: false,
      },
      {
        id: 2,
        autor: "Novato",
        data: "05-11-2025",
        conteudo:
          "Alguém poderia explicar como otimizar o uso de cartas de suporte? Ainda estou aprendendo.",
        anexos: "",
        cutidas: 0,
        curtidasTotais: 0,
        visualizacoes: 0,
        editado: false,
      },
    ]);
    // ==================================================================
  }, [id]);

  const handleSendPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui será um POST para o backend: axios.post(`/api/forum/topicos/${id}/posts`, {...})
    const mockNewPost = {
      id: posts.length + 1,
      autor: "UsuárioLogado",
      data: new Date().toISOString(),
      conteudo: newPost,
      anexos,
      curtidas,
      curtidasTotais,
      visualizacoes,
      editado,
    };
    setPosts([...posts, mockNewPost]);
    setNewPost("");
    // ==================================================================
  };

  const handleEditPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui será um PUT para o backend: axios.post(`/api/forum/topicos/${id}/posts`, {...})
    const mockNewPost = {
      id: posts.length + 1,
      autor: "UsuárioLogado",
      data: new Date().toISOString(),
      conteudo: newPost,
      anexos,
      curtidas,
      curtidasTotais,
      visualizacoes,
      editado,
    };
    setPosts([...posts, mockNewPost]);
    setNewPost("");
    // ==================================================================
  };

  const handleReplyPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui será um DELETE para o backend: axios.post(`/api/forum/topicos/${id}/posts`, {...})
    const mockNewPost = {
      id: posts.length + 1,
      autor: "UsuárioLogado",
      data: new Date().toISOString(),
      conteudo: newPost,
      anexos,
      curtidas,
      curtidasTotais,
      visualizacoes,
      editado,
    };
    setPosts([...posts, mockNewPost]);
    setNewPost("");
    // ==================================================================
  };
  const handleDeletePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    // ========================= MOCK TEMPORÁRIO =========================
    // Aqui será um DELETE para o backend: axios.post(`/api/forum/topicos/${id}/posts`, {...})
    const mockNewPost = {
      id: posts.length + 1,
      autor: "UsuárioLogado",
      data: new Date().toISOString(),
      conteudo: newPost,
      anexos,
      curtidas,
      curtidasTotais,
      visualizacoes,
      editado,
    };
    setPosts([...posts, mockNewPost]);
    setNewPost("");
    // ==================================================================
  };

  if (!topic) return <p className="text-center mt-5">Carregando tópico...</p>;
  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          {/* Cabeçalho do Tópico */}
          <Row className="mb-4">
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
                  to: "/forum/categoria/:categoriaId/subforum/:subforumId",
                },
                { label: "Forum Topicos", to: "/forum/topico/:topicoId" },
              ]}
            />
            <Col>
              <Card className="border-0 shadow-sm rounded-3">
                <Card.Body>
                  <h3 className="fw-bold text-primary mb-0">
                    <ChatDots className="me-2" />
                    {topic.titulo}
                  </h3>
                  <small className="text-muted">
                    Criado por {topic.autor} • {posts.length} respostas
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Lista de Posts */}
          <Row className="gy-3">
            {posts.map((post) => (
              <ForumPost
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onReply={handleReplyPost}
              />
            ))}
          </Row>

          {/* Formulário de Resposta */}
          {!topic.bloqueado && (
            <Row className="mt-4">
              <Col>
                <Card className="border-0 shadow-sm rounded-3">
                  <Card.Body>
                    <Form onSubmit={handleSendPost}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                          Responder ao tópico
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Digite sua resposta..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end">
                        <Button type="submit" variant="primary">
                          Enviar resposta
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {topic.bloqueado && (
            <div className="text-center mt-4 text-muted">
              <em>Este tópico foi trancado por um administrador.</em>
            </div>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
