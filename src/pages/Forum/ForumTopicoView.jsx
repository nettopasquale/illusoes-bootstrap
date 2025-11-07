import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ForumPost from "../../components/ForumComponentes/ForumPost";
import ForumPostEditor from "../../components/ForumComponentes/ForumPostEditor";

export default function ForumTopicoView() {
  const { categoriaId, topicoId } = useParams();

  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // será obtido do contexto futuramente

  // MOCK - simula dados do tópico
  useEffect(() => {
    // TODO: integrar com backend (GET /forum/categorias/:categoriaId/topicos/:topicoId)
    setTimeout(() => {
      setTopic({
        id: topicoId,
        title: "Discussão sobre Dragões Raros",
        author: "MestreDracônico",
        createdAt: "2025-11-02T15:30:00",
        views: 189,
        replies: 12,
      });

      setPosts([
        {
          id: "1",
          authorId: "u123",
          authorName: "MestreDracônico",
          createdAt: "2025-11-02T15:31:00",
          content:
            "<p>Bem-vindos à discussão sobre dragões raros! Quais são os seus favoritos e por quê?</p>",
        },
        {
          id: "2",
          authorId: "u456",
          authorName: "ColecionadorArcano",
          createdAt: "2025-11-02T15:45:00",
          content:
            "<p>Eu gosto dos dragões de fogo, principalmente pelas habilidades lendárias que eles possuem 🔥</p>",
        },
      ]);

      setUser({
        id: "u456",
        username: "ColecionadorArcano",
      });

      setLoading(false);
    }, 800);
  }, [categoriaId, topicoId]);

  // Criar novo post
  const handleCreatePost = (content) => {
    // TODO: integrar com backend (POST /forum/topicos/:topicoId/posts)
    const newPost = {
      id: Date.now().toString(),
      authorId: user?.id,
      authorName: user?.username,
      createdAt: new Date().toISOString(),
      content,
    };
    setPosts((prev) => [...prev, newPost]);
  };

  // Editar post existente
  const handleEditPost = (postId, newContent) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: newContent } : p))
    );
  };

  // Excluir post
  const handleDeletePost = (postId) => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      // TODO: integrar com backend (DELETE /forum/topicos/:topicoId/posts/:postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  // Responder post
  const handleReplyPost = (replyToId, content) => {
    // TODO: integrar com backend (POST /forum/topicos/:topicoId/posts)
    const replyPost = {
      id: Date.now().toString(),
      authorId: user?.id,
      authorName: user?.username,
      createdAt: new Date().toISOString(),
      content: `<blockquote>${
        posts.find((p) => p.id === replyToId)?.content
      }</blockquote>${content}`,
    };
    setPosts((prev) => [...prev, replyPost]);
  };

  if (!topic) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Forum", to: "/forum" },
              { label: "Forum Categoria", to: "/forum/categorias" },
              { label: "Forum Tópico", to: "/forum/categorias/topico" },
            ]}
          />
          <p>Tópico não encontrado.</p>
        </Container>
      </LayoutGeral>
    );
  }

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Forum", to: "/forum" },
            { label: "Forum Categoria", to: "/forum/categorias" },
            { label: "Forum Tópico", to: "/forum/categorias/topico" },
          ]}
        />
        <Row className="justify-content-center">
          <Col md={10}>
            {/* Cabeçalho do tópico */}
            <Card className="p-4 mb-4 shadow-sm">
              <h3>{topic.title}</h3>
              <p className="text-muted mb-0">
                Criado por <strong>{topic.author}</strong> em{" "}
                {new Date(topic.createdAt).toLocaleString("pt-BR")}
              </p>
              <p className="text-muted mt-1">
                {topic.views} visualizações • {posts.length} respostas
              </p>
            </Card>

            {/* Posts */}
            {posts.map((post) => (
              <ForumPost
                key={post.id}
                post={post}
                user={user}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onReply={handleReplyPost}
              />
            ))}

            {/* Editor de novo post */}
            <Card className="mt-4 p-3 shadow-sm">
              <h5>Responder ao tópico</h5>
              <ForumPostEditor onSubmit={handleCreatePost} user={user} />
            </Card>
          </Col>
        </Row>
      </Container>
    </LayoutGeral>
  );
}
