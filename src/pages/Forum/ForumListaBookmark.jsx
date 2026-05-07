import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Spinner, Badge, Nav, Alert, Row } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { listarMeusBookmarks, criarBookmarkTopico, criarBookmarkPost} from "../../services/forumService";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Avatar } from "../../components/ForumComponentes/Avatar";
import "./Forum.css"

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


export default function ForumListaBookmark() {
const [tab, setTab] = useState("topicos");
const [topicoBMs, setTopicoBMs] = useState([]);
const [postBMs, setPostBMs] = useState([]);
const [loading, setLoading] = useState(true);
const [erro, setErro] = useState(null);
const [removendoId, setRemovendoId] = useState(null);

//traz os bookmarks se já existirem
useEffect(() => {
    listarMeusBookmarks()
      .then(({ data }) => {
        setTopicoBMs(data.topicoBookmarks);
        setPostBMs(data.postBookmarks);
      })
      .catch(() => setErro("Erro ao carregar bookmarks."))
      .finally(() => setLoading(false));
  }, []);

  const removerTopicoBM = async (id) => {
    setRemovendoId(id);
    try {
      await criarBookmarkTopico(id);
      setTopicoBMs((prev) => prev.filter((t) => t._id !== id));
    } catch {
      /* silencioso */
    }
    setRemovendoId(null);
  };

  const removerPostBM = async (topicoId, postId) => {
    const key = postId;
    setRemovendoId(key);
    try {
      await criarBookmarkPost(topicoId, postId);
      setPostBMs((prev) => prev.filter((r) => r._id !== postId));
    } catch {
      /* silencioso */
    }
    setRemovendoId(null);
  };

  return (
    <LayoutGeral>
      <section className="forum-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home",           to: "/"               },
              { label: "Fórum",          to: "/forum"          },
              { label: "Meus Bookmarks", to: "/forum/bookmarks"},
            ]}
          />
 
          {/* Header */}
          <div className="forum-page-header">
            <div>
              <h1 className="forum-page-title">🔖 Meus Bookmarks</h1>
              <p className="forum-page-subtitulo mb-0">
                {topicoBMs.length} tópico{topicoBMs.length !== 1 ? "s" : ""} ·{" "}
                {postBMs.length} post{postBMs.length !== 1 ? "s" : ""} salvos
              </p>
            </div>
          </div>
 
          {/* ✅ erro em um único lugar */}
          {erro && (
            <Alert variant="danger" style={{ fontSize: "0.85rem" }}>{erro}</Alert>
          )}
 
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
                  {topicoBMs.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="posts" style={{ fontSize: "0.88rem" }}>
                Posts{" "}
                <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                  {postBMs.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>
 
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="secondary" />
            </div>
          ) : (
            <>
              {/* ── Tópicos salvos ── */}
              {tab === "topicos" && (
                topicoBMs.length === 0 ? (
                  <div className="forum-vazio">
                    <p>Você ainda não salvou nenhum tópico.</p>
                    <Link to="/forum" className="btn btn-sm btn-outline-primary">
                      Explorar o fórum
                    </Link>
                  </div>
                ) : (
                  <div className="forum-topicos-card">
                    {topicoBMs.map((topico) => {
                      const catColor = CATEGORIA_META[topico.categoria]?.color || "#6c757d";
                      const catLabel = CATEGORIA_META[topico.categoria]?.label || topico.categoria;
                      return (
                        <div key={topico._id} className="bookmark-item">
                          {/* Avatar do autor */}
                          <div className="bookmark-thumb">
                            <Avatar
                              name={topico.autor?.usuario || "?"}
                              size={32}
                              img={topico.autor?.avatar}
                            />
                          </div>
 
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
                              <Link
                                to={`/forum/categorias/topicos/${topico._id}`}
                                className="bookmark-titulo text-decoration-none text-truncate"
                              >
                                {topico.titulo}
                              </Link>
                            </div>
                            <div className="d-flex gap-3 flex-wrap bookmark-meta">
                              {/* ✅ corrigido: postagensContador, não postCount */}
                              <span>💬 {topico.postagensContador ?? 0} posts</span>
                              <span>▲ {topico.curtidas ?? 0} curtidas</span>
                              <span>
                                Criado em{" "}
                                {new Date(topico.createdAt).toLocaleDateString("pt-BR")}
                              </span>
                            </div>
                          </div>
 
                          {/* Remover */}
                          <button
                            className="btn btn-sm btn-outline-danger flex-shrink-0"
                            style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                            disabled={removendoId === topico._id}
                            onClick={() => removerTopicoBM(topico._id)}
                            title="Remover bookmark"
                          >
                            {removendoId === topico._id ? "..." : "🔖 Remover"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
 
              {/* ── Posts salvos ── */}
              {tab === "posts" && (
                postBMs.length === 0 ? (
                  <div className="forum-vazio">
                    <p>Você ainda não salvou nenhum post.</p>
                    <Link to="/forum" className="btn btn-sm btn-outline-primary">
                      Explorar o fórum
                    </Link>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {postBMs.map((post) => {
                      const catColor = CATEGORIA_META[post.categoria]?.color || "#6c757d";
                      const catLabel = CATEGORIA_META[post.categoria]?.label || post.categoria;
                      return (
                        <div
                          key={post._id}
                          className="forum-post-card"
                          style={{ borderRadius: "var(--raio)" }}
                        >
                          <div style={{ padding: "0.875rem 1rem" }}>
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
                                  className="ms-auto bookmark-meta"
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
                                img={post.autor?.avatar}
                              />
                              <div className="flex-grow-1 overflow-hidden">
                                <span
                                  className="fw-semibold d-block"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {post.autor?.usuario}
                                </span>
                                <p className="bookmark-conteudo mb-0 mt-1">
                                  {post.conteudo}
                                </p>
                              </div>
 
                              {/* Remover */}
                              <button
                                className="btn btn-sm btn-outline-danger flex-shrink-0"
                                style={{ fontSize: "0.72rem", padding: "2px 8px" }}
                                disabled={removendoId === post._id}
                                onClick={() => removerPostBM(post.topicoId, post._id)}
                                title="Remover bookmark"
                              >
                                {removendoId === post._id ? "..." : "🔖"}
                              </button>
                            </div>
 
                            {/* Meta */}
                            <div className="bookmark-meta mt-2">
                              {new Date(post.createdAt).toLocaleDateString("pt-BR", {
                                dateStyle: "short",
                              })}{" "}
                              · ▲ {post.curtidas ?? 0} curtidas
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
