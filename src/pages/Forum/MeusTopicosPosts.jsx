import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Spinner, Badge, Nav, Alert, Row, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { fetchMeusTopicos, fetchMinhasPostagens} from "../../services/userService";
import { deletarTopico, deletarPostagem } from "../../services/forumService";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Avatar } from "../../components/ForumComponentes/Avatar";
import "./MeusTopicosPosts.css";

const CATEGORIA_META = {
  estrategia: { label: "Estratégia", color: "#0d6efd" },
  iniciante: { label: "Iniciante", color: "#198754" },
  meta: { label: "Meta", color: "#dc3545" },
  trocas: { label: "Trocas & Vendas", color: "#856404" },
  regras: { label: "Regras", color: "#055160" },
  torneio: { label: "Torneios", color: "#495057" },
  geral: { label: "Geral", color: "#212529" },
  batepapo: { label: "Bate-papo", color: "#6f42c1" },
};

function timeAgo(data) {
  if (!data) return "—";
  const diff = (Date.now() - new Date(data)) / 1000;
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function MeusTopicosPosts() {
  const [tab, setTab] = useState("topicos");
  const [topicos, setTopicos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [removendoId, setRemovendoId] = useState(null);

  // Modal de confirmação de remoção
  const [itemParaRemover, setItemParaRemover] = useState(null);
  const [removendo, setRemovendo] = useState(false);

  //traz os tópicos se já existirem
  useEffect(() => {
    fetchMeusTopicos()
      .then(({ data }) => {
        setTopicos(data);
      })
      .catch(() => setError("Erro ao carregar Tópicos."))
      .finally(() => setLoading(false));
  }, []);

  //traz os posts se já existirem
  useEffect(() => {
    fetchMinhasPostagens()
      .then(({ data }) => {
        setPosts(data);
      })
      .catch(() => setError("Erro ao carregar postagens."))
      .finally(() => setLoading(false));
  }, []);

  // ── Remoção ──────────────────────────────────
  const confirmarRemocao = async () => {
    if (!itemParaRemover) return;
    setRemovendo(true);
    try {
      if (itemParaRemover.tipo === "topico") {
        await deletarTopico(itemParaRemover.dados._id);
        setTopicos((prev) =>
          prev.filter((t) => t._id !== itemParaRemover.dados._id),
        );
        toast.success("Tópico removido com sucesso.");
      } else {
        await deletarPostagem(
          itemParaRemover.dados.topicoId,
          itemParaRemover.dados._id,
        );
        setPosts((prev) =>
          prev.filter((p) => p._id !== itemParaRemover.dados._id),
        );
        toast.success("Postagem removida com sucesso.");
      }
      setItemParaRemover(null);
    } catch {
      toast.error("Erro ao remover.");
    } finally {
      setRemovendo(false);
    }
  };

  return (
    <LayoutGeral>
      <section className="pagina-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Dashboard", to: "/dashboard" },
              { label: "Meus Tópicos e Posts", to: "/userProfile/me/topicos" },
            ]}
          />

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h1 className="pagina-titulo mb-4">Meus Tópicos e Posts</h1>
              <p className="pagina-subtitulo mb-0">
                {topicos.length} tópico{topicos.length !== 1 ? "s" : ""} ·{" "}
                {posts.length} post{posts.length !== 1 ? "s" : ""} publicados
              </p>
            </div>
            <Button
              as={Link}
              to="/forum/topicos/criar"
              variant="primary"
              size="sm"
              className="px-3"
            >
              + Novo tópico
            </Button>
          </div>

          {/* Tabs */}
          <Nav
            variant="tabs"
            activeKey={tab}
            onSelect={setTab}
            className="mb-3"
          >
            <Nav.Item>
              <Nav.Link eventKey="topicos" style={{ fontSize: "0.88rem" }}>
                Tópicos{" "}
                <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                  {topicos.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="posts" style={{ fontSize: "0.88rem" }}>
                Posts{" "}
                <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                  {posts.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {erro && (
            <Alert variant="danger" style={{ fontSize: "0.85rem" }}>
              {erro}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : (
            <>
              {/* ── Tópicos ── */}
              {tab === "topicos" &&
                (topicos.length === 0 ? (
                  <div
                    className="text-center py-5 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <p className="mb-2">
                      Você ainda não publicou nenhum tópico.
                    </p>
                    <Button
                      as={Link}
                      to="/forum/topicos/criar"
                      variant="outline-primary"
                      size="sm"
                    >
                      Criar primeiro tópico
                    </Button>
                  </div>
                ) : (
                  <div className="pagina-card p-0 overflow-hidden">
                    {/* Cabeçalho */}
                    <div
                      className="d-flex align-items-center px-3 py-2 border-bottom"
                      style={{
                        background: "#f8f9fa",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: "var(--cor-texto-suave)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <div className="flex-grow-1">Tópico</div>
                      <div
                        className="d-none d-sm-block"
                        style={{ width: 70, textAlign: "center" }}
                      >
                        Curtidas
                      </div>
                      <div
                        className="d-none d-md-block"
                        style={{ width: 70, textAlign: "center" }}
                      >
                        Posts
                      </div>
                      <div
                        className="d-none d-lg-block"
                        style={{ width: 110, textAlign: "right" }}
                      >
                        Criado em
                      </div>
                      <div style={{ width: 80, textAlign: "right" }}>Ação</div>
                    </div>

                    {topicos.map((topico) => {
                      const catColor =
                        CATEGORIA_META[topico.categoria]?.color || "#6c757d";
                      const catLabel =
                        CATEGORIA_META[topico.categoria]?.label ||
                        topico.categoria;
                      return (
                        <div
                          key={topico._id}
                          className="d-flex align-items-center px-3 py-3 border-bottom gap-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {/* Info */}
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <Badge
                                bg="light"
                                className="border"
                                style={{ color: catColor, fontSize: "0.67rem" }}
                              >
                                {catLabel}
                              </Badge>
                              {topico.destaque && (
                                <Badge
                                  bg="light"
                                  text="dark"
                                  style={{ fontSize: "0.67rem" }}
                                >
                                  📌
                                </Badge>
                              )}
                              {topico.trancado && (
                                <Badge
                                  bg="warning"
                                  text="dark"
                                  style={{ fontSize: "0.67rem" }}
                                >
                                  🔒
                                </Badge>
                              )}
                            </div>
                            <Link
                              to={`/forum/categorias/topicos/${topico._id}`}
                              className="text-decoration-none text-body fw-medium d-block text-truncate"
                              style={{ fontSize: "0.88rem" }}
                            >
                              {topico.titulo}
                            </Link>
                          </div>

                          {/* Curtidas */}
                          <div
                            className="d-none d-sm-block text-center flex-shrink-0"
                            style={{ width: 70 }}
                          >
                            <span className="fw-semibold">
                              {topico.curtidas ?? 0}
                            </span>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.65rem" }}
                            >
                              curtidas
                            </div>
                          </div>

                          {/* Posts */}
                          <div
                            className="d-none d-md-block text-center flex-shrink-0"
                            style={{ width: 70 }}
                          >
                            <span className="fw-semibold">
                              {topico.postagensContador ?? 0}
                            </span>
                            <div
                              className="text-muted"
                              style={{ fontSize: "0.65rem" }}
                            >
                              posts
                            </div>
                          </div>

                          {/* Data */}
                          <div
                            className="d-none d-lg-block text-muted text-end flex-shrink-0"
                            style={{ width: 110, fontSize: "0.73rem" }}
                          >
                            {timeAgo(topico.createdAt)}
                          </div>

                          {/* Ação */}
                          <div
                            className="flex-shrink-0 text-end"
                            style={{ width: 80 }}
                          >
                            <Button
                              variant="outline-danger"
                              size="sm"
                              style={{
                                fontSize: "0.72rem",
                                padding: "2px 8px",
                              }}
                              onClick={() =>
                                setItemParaRemover({
                                  tipo: "topico",
                                  dados: topico,
                                })
                              }
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}

              {/* ── Posts ── */}
              {tab === "posts" &&
                (posts.length === 0 ? (
                  <div
                    className="text-center py-5 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <p className="mb-2">
                      Você ainda não publicou nenhuma postagem.
                    </p>
                    <Button
                      as={Link}
                      to="/forum"
                      variant="outline-primary"
                      size="sm"
                    >
                      Explorar o fórum
                    </Button>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {posts.map((post) => {
                      const catColor =
                        CATEGORIA_META[post.categoria]?.color || "#6c757d";
                      const catLabel =
                        CATEGORIA_META[post.categoria]?.label || post.categoria;
                      return (
                        <div
                          key={post._id}
                          className="pagina-card"
                          style={{ padding: "0.875rem 1rem" }}
                        >
                          {/* Origem */}
                          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              bg="light"
                              className="border"
                              style={{ color: catColor, fontSize: "0.67rem" }}
                            >
                              {catLabel}
                            </Badge>
                            <Link
                              to={`/forum/categorias/topicos/${post.topicoId}`}
                              className="text-muted text-decoration-none fw-medium text-truncate"
                              style={{ fontSize: "0.78rem" }}
                            >
                              ↗ {post.topicoTitulo}
                            </Link>
                            {post.postNumeracao && (
                              <span
                                className="ms-auto text-muted"
                                style={{ fontSize: "0.7rem" }}
                              >
                                Post #{post.postNumeracao}
                              </span>
                            )}
                          </div>

                          {/* Autor + conteúdo */}
                          <div className="d-flex align-items-start gap-2">
                            <Avatar
                              name={post.autor?.usuario || "?"}
                              size={28}
                              img={post.autor?.avatar || null}
                            />
                            <div className="flex-grow-1 overflow-hidden">
                              <span
                                className="fw-semibold d-block"
                                style={{ fontSize: "0.8rem" }}
                              >
                                {post.autor?.usuario}
                              </span>
                              <p
                                className="mb-0 text-body"
                                style={{
                                  fontSize: "0.85rem",
                                  lineHeight: 1.6,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {post.conteudo}
                              </p>
                            </div>

                            {/* Ação */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="flex-shrink-0"
                              style={{
                                fontSize: "0.72rem",
                                padding: "2px 8px",
                              }}
                              onClick={() =>
                                setItemParaRemover({
                                  tipo: "post",
                                  dados: post,
                                })
                              }
                            >
                              Remover
                            </Button>
                          </div>

                          {/* Meta */}
                          <div
                            className="text-muted mt-2"
                            style={{ fontSize: "0.7rem" }}
                          >
                            {timeAgo(post.createdAt)} · {post.curtidas ?? 0}{" "}
                            curtida{post.curtidas !== 1 ? "s" : ""}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </>
          )}
        </Container>
      </section>

      {/* Modal de confirmação de remoção */}
      <Modal
        show={!!itemParaRemover}
        onHide={() => setItemParaRemover(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "1rem" }}>
            Remover {itemParaRemover?.tipo === "topico" ? "tópico" : "postagem"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "0.88rem" }}>
          {itemParaRemover?.tipo === "topico" ? (
            <>
              Tem certeza que deseja remover o tópico{" "}
              <strong>"{itemParaRemover.dados.titulo}"</strong>? Todas as
              postagens serão removidas junto.
            </>
          ) : (
            <>
              Tem certeza que deseja remover esta postagem no tópico{" "}
              <strong>"{itemParaRemover?.dados.topicoTitulo}"</strong>?
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setItemParaRemover(null)}
            disabled={removendo}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={confirmarRemocao}
            disabled={removendo}
          >
            {removendo ? "Removendo..." : "Confirmar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </LayoutGeral>
  );
}
