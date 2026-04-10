import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  Breadcrumb,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ChatDots } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { 
  listarTopicosPorId,
  curtirTopico,
  denunciarTopico,
  publicarPostagem,
  deletarPostagem
 } from "../../services/forumService";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumPostCard from "../../components/ForumComponentes/ForumPostCard";
import ForumPostEdicao from "../../components/ForumComponentes/ForumPostEdicao";
import { toast } from "react-toastify";

//Utilitarios
const CATEGORIA_LABELS = {
  estrategia: "Estratégia",
  iniciante: "Iniciante",
  meta: "Meta",
  trocas: "Trocas",
  regras: "Regras",
  torneio: "Torneio",
  geral: "Geral",
  batepapo: "Bate-papo"
};

const CATEGORIA_VARIANTES = {
  estrategia: "primary",
  iniciante: "success",
  meta: "danger",
  trocas: "warning",
  regras: "info",
  torneio: "secondary",
  geral: "dark",
  batepapo: "secondary"
};

function Avatar({ nome = "", size = 44 }) {
  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${[...nome].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 55%, 42%)`,
      }}
    >
      {iniciais || "?"}
    </div>
  );
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function ForumTopico() {
  const { id } = useParams(); // ID do tópico
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [topico, setTopico] = useState(null);
  const [posts, setPosts] = useState([]);
  const [novoPost, setNovoPost] = useState("");
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [postCitacao, setPostCitacao] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [denunciaMotivo, setDenunciaMotivo] = useState("");
  const [showTopicoDenunciado, setShowTopicoDenunciado] = useState(false);
  const [denunciaLoading, setDenunciaLoading] = useState(false);
  const [successo, setSuccesso] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //carregar topicos existentes
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await listarTopicosPorId(id);
        setTopico(data);
        setCurtidas(data.curtidas);
        setCurtidas(
          data.curtidoPor?.map(String).includes(String(usuario?._id)),
        );
      } catch {
        setError("Tópico não encontrado ou erro ao carregar.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, usuario]);

  const handleCurtirTopico = async () => {
    if (!usuario) return navigate("/login");
    try {
      const { data } = await curtirTopico(id);
      setCurtidas(data.curtidas);
      setCurtiu(data.curtiu);
    } catch {
      /* silencioso */
    }
  };

  const handleDenunciarTopico = async () => {
    if (!reportReason.trim()) return;
    setDenunciaLoading(true);
    try {
      await denunciarTopico(id, denunciaMotivo);
      setShowTopicoDenunciado(false);
      setDenunciaMotivo("");
      setSuccesso(
        "Denúncia enviada. Obrigado por ajudar a manter a comunidade!",
      );
      toast.success(
        "Denúncia enviada. Obrigado por ajudar a manter a comunidade!",
      );
      setTimeout(() => setSuccesso(""), 4000);
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setDenunciaLoading(false);
    }
  };

  const handlePublicarPost = async (postData) => {
    if (!usuario) return navigate("/login");
    setPostLoading(true);
    try {
      const { data } = await publicarPostagem(id, postData);
      setTopico((prev) => ({ ...prev, postagens: [...prev.postagens, data] }));
      // setTopico((prev) => ({ ...prev, posts: [...prev.posts, data] }));
      setPostCitacao(null);
      setSuccesso("Resposta publicada!");
      setTimeout(() => setSuccesso(""), 3000);
      // Scroll para nova resposta
      setTimeout(() => {
        document
          .getElementById(`post-${data._id}`)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch {
      toast.error("Erro ao publicar resposta.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeletarPost = (postId) => {
    setTopico((prev) => ({
      ...prev,
      postagens: prev.postagens.map((r) =>
        r._id === postId
          ? { ...r, deletado: true, content: "[Resposta removida pelo autor]" }
          : r,
      ),
    }));
  };

  // Agrupa posts: top-level e filhos
  const topPosts = topico?.postagens?.filter((r) => !r.parenteResposta) || [];
  const childMap = {};
  topico?.postagens?.forEach((r) => {
    if (r.parenteResposta) {
      const key = String(r.parenteResposta);
      if (!childMap[key]) childMap[key] = [];
      childMap[key].push(r);
    }
  });

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Carregando tópico...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-secondary" onClick={() => navigate("/forum")}>
          ← Voltar ao fórum
        </Button>
      </Container>
    );

  const ehAutor = String(topico.usuario?._id) === String(usuario?._id);

  if (!topico) return <p className="text-center mt-5">Carregando tópico...</p>;
  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container fluid="lg" className="py-4">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: `/forum` },
                { label: "Tópicos", to: `/forum/topicos` },
              ]}
            />
            <div className="text-center text-danger mt-5">{erro}</div>
          </Row>
          {/* Breadcrumb */}
          <Breadcrumb className="mb-3" style={{ fontSize: "0.85rem" }}>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Início
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/forum" }}>
              Fórum
            </Breadcrumb.Item>
            <Breadcrumb.Item
              active
              className="text-truncate"
              style={{ maxWidth: 300 }}
            >
              {topico.titulo}
            </Breadcrumb.Item>
          </Breadcrumb>

          {successo && (
            <Alert variant="success" className="mb-3">
              {successo}
            </Alert>
          )}

          <Row className="g-4">
            {/* ── Coluna principal ── */}
            <Col lg={8}>
              {/* Card do tópico */}
              <Card className="border mb-4">
                <Card.Body className="p-4">
                  {/* Header */}
                  <div className="d-flex gap-2 align-items-center flex-wrap mb-3">
                    <Badge
                      bg={CATEGORIA_VARIANTES[topico.categoria] || "secondary"}
                    >
                      {CATEGORIA_LABELS[topico.categoria] || topico.categoria}
                    </Badge>
                    {topico.destaque && (
                      <Badge bg="light" text="dark">
                        📌 Fixado
                      </Badge>
                    )}
                    {topico.trancado && (
                      <Badge bg="warning" text="dark">
                        🔒 Fechado
                      </Badge>
                    )}
                    {topico.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        bg="light"
                        text="secondary"
                        className="border"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <h1
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: 600,
                      lineHeight: 1.35,
                    }}
                    className="mb-3"
                  >
                    {topico.titulo}
                  </h1>

                  {/* Autor */}
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <Avatar name={topico.autor?.nome} />
                    <div>
                      <p
                        className="mb-0 fw-semibold"
                        style={{ fontSize: "0.95rem" }}
                      >
                        {topico.autor?.nome}
                      </p>
                      <p
                        className="mb-0 text-muted"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {formatarData(topico.createdAt)}
                        {formatarData(topico.criadoEm)}
                      </p>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div
                    className="text-body"
                    style={{
                      fontSize: "0.95rem",
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.75,
                    }}
                  >
                    {topico.conteudo}
                  </div>

                  {/* Ações do tópico */}
                  <div className="d-flex align-items-center gap-3 mt-4 pt-3 border-top flex-wrap">
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        variant={votado ? "success" : "outline-secondary"}
                        size="sm"
                        onClick={handleCurtirTopico}
                        disabled={!usuario}
                      >
                        ▲ {curtidas}
                      </Button>
                    </div>

                    <span
                      className="text-muted"
                      style={{ fontSize: "0.82rem" }}
                    >
                      👁 {topico.visualizacoes} visualizações
                    </span>
                    <span
                      className="text-muted"
                      style={{ fontSize: "0.82rem" }}
                    >
                      💬 {topico.postagens?.length || 0} respostas
                    </span>

                    <div className="ms-auto d-flex gap-2">
                      {ehAutor && (
                        <>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            as={Link}
                            to={`/forum/editar/${topico._id}`}
                          >
                            Editar
                          </Button>
                        </>
                      )}
                      {usuario && !ehAutor && (
                        <Button
                          variant="outline-warning"
                          size="sm"
                          onClick={() => setShowTopicoDenunciado((v) => !v)}
                        >
                          ⚑ Denunciar
                        </Button>
                      )}
                    </div>
                  </div>

                  {showTopicoDenunciado && (
                    <div className="mt-3 d-flex gap-2 align-items-center">
                      <input
                        className="form-control form-control-sm"
                        placeholder="Motivo da denúncia..."
                        value={denunciaMotivo}
                        onChange={(e) => setDenunciaMotivo(e.target.value)}
                        style={{ maxWidth: 320 }}
                      />
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={handleDenunciarTopico}
                        disabled={denunciaLoading}
                      >
                        Enviar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => setShowTopicoDenunciado(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* ── Respostas ── */}
              <h2 className="h5 mb-3 fw-semibold">
                {topico.postagens?.length || 0} Respostas
              </h2>

              {topPosts.length === 0 && (
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Nenhuma resposta ainda. Seja o primeiro a responder!
                </p>
              )}

              {topPosts.map((post) => (
                <div key={post._id}>
                  <ForumPostCard
                    reply={post}
                    threadId={id}
                    currentUserId={usuario?._id}
                    onQuote={setPostCitacao}
                    onDelete={handleDeletarPost}
                    depth={0}
                  />
                  {/* Respostas aninhadas */}
                  {childMap[String(reply._id)]?.map((child) => (
                    <ForumPostCard
                      key={child._id}
                      reply={child}
                      threadId={id}
                      currentUserId={usuario?._id}
                      onQuote={setPostCitacao}
                      onDelete={handleDeletarPost}
                      depth={1}
                    />
                  ))}
                </div>
              ))}

              {/* Editor de resposta */}
              {topico.isLocked ? (
                <Alert variant="warning" className="mt-4">
                  🔒 Este tópico está fechado para novas respostas.
                </Alert>
              ) : usuario ? (
                <ForumPostEdicao
                  onSubmit={handlePublicarPost}
                  quotedReply={postCitacao}
                  onClearQuote={() => setPostCitacao(null)}
                  loading={postLoading}
                />
              ) : (
                <Card className="border mt-4 text-center p-4">
                  <p className="text-muted mb-2">
                    Faça login para responder neste tópico.
                  </p>
                  <Button variant="primary" as={Link} to="/login">
                    Entrar
                  </Button>
                </Card>
              )}
            </Col>

            {/* ── Sidebar ── */}
            <Col lg={4}>
              {/* Info do tópico */}
              <Card className="border mb-3">
                <Card.Body className="p-3">
                  <h6 className="fw-semibold mb-3">Sobre o tópico</h6>
                  <div
                    className="d-flex flex-column gap-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Criado em</span>
                      <span>
                        {new Date(topico.criadoEm).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Última atividade</span>
                      <span>
                        {new Date(topico.dataModificacao).toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Visualizações</span>
                      <span>{topico.visualizacoes}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">curtidas</span>
                      <span>{curtidas}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Respostas</span>
                      <span>{topico.postagens?.length || 0}</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Autor */}
              <Card className="border mb-3">
                <Card.Body className="p-3">
                  <h6 className="fw-semibold mb-3">Autor</h6>
                  <div className="d-flex align-items-center gap-2">
                    <Avatar name={topico.autor?.nome} size={40} />
                    <div>
                      <p
                        className="mb-0 fw-semibold"
                        style={{ fontSize: "0.9rem" }}
                      >
                        {topico.autor?.nome}
                      </p>
                      <Link
                        to={`/perfil/${topico.autor?._id}`}
                        style={{ fontSize: "0.78rem" }}
                        className="text-muted"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Botão voltar */}
              <Button
                variant="outline-secondary"
                className="w-100"
                onClick={() => navigate("/forum")}
              >
                ← Voltar ao fórum
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
