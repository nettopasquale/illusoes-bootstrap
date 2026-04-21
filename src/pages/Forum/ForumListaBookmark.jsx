import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Spinner, Badge, Nav, Alert, Row } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { listarMeusBookmarks, criarBookmarkTopico, criarBookmarkPost} from "../../services/forumService";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Avatar } from "../../components/ForumComponentes/Avatar";

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
const [error, setError] = useState(null);
const [removendoId, setRemovendoId] = useState(null);

//traz os bookmarks se já existirem
useEffect(() => {
    listarMeusBookmarks()
      .then(({ data }) => {
        setTopicoBMs(data.topicoBookmarks);
        setPostBMs(data.postBookmarks);
      })
      .catch(() => setError("Erro ao carregar bookmarks."))
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
      <section id="artigo" className="block artigo-block">
        <Container fluid="lg" className="py-4">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: `/forum` },
                { label: "Meus Bookmars", to: `/forum/bookmarks` },
              ]}
            />
            <div className="text-center text-danger mt-5">{error}</div>
          </Row>
          {/* Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div>
              <h1 className="h4 fw-bold mb-0">Meus Bookmarks</h1>
              <p className="text-muted mb-0" style={{ fontSize: "0.82rem" }}>
                {topicoBMs.length} topicos {topicoBMs.length !== 1 ? "s" : ""} salvos{" "}
                {postBMs.length} posts {postBMs.length !== 1 ? "s" : ""} salvos
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Nav
            variant="tabs"
            className="mb-3"
            activeKey={tab}
            onSelect={setTab}
          >
            <Nav.Item>
              <Nav.Link eventKey="topicos" style={{ fontSize: "0.88rem" }}>
                Tópicos{" "}
                <Badge
                  bg="secondary"
                  pill
                  className="ms-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  {topicoBMs.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="replies" style={{ fontSize: "0.88rem" }}>
                Posts{" "}
                <Badge
                  bg="secondary"
                  pill
                  className="ms-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  {postBMs.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" size="sm" />
            </div>
          ) : tab === "topicos" ? (
            /*  Tópicos salvos */
            topicoBMs.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-0">Você ainda não salvou nenhum tópico.</p>
                <Link
                  to="/forum"
                  className="btn btn-sm btn-outline-primary mt-3"
                >
                  Explorar o fórum
                </Link>
              </div>
            ) : (
              <div className="card border rounded-3 overflow-hidden">
                {topicoBMs.map((topico) => {
                  const catColor =
                    CATEGORIA_META[topico.categoria]?.color || "#6c757d";
                  const catLabel =
                    CATEGORIA_META[topico.categoria]?.label || topico.categoria;
                  return (
                    <div
                      key={topico._id}
                      className="d-flex align-items-center gap-3 px-3 py-3 border-bottom"
                    >
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            bg="light"
                            className="border"
                            style={{ color: catColor, fontSize: "0.68rem" }}
                          >
                            {catLabel}
                          </Badge>
                          <Link
                            to={`/forum/categorias/topicos/${topico._id}`}
                            className="text-decoration-none text-body fw-medium text-truncate"
                            style={{ fontSize: "0.88rem" }}
                          >
                            {topico.titulo}
                          </Link>
                        </div>
                        <div
                          className="text-muted d-flex gap-3 flex-wrap"
                          style={{ fontSize: "0.72rem" }}
                        >
                          <span>{topico.postCount} posts</span>
                          <span>{topico.curtidas} curtidas</span>
                          <span>
                            Criado em{" "}
                            {new Date(topico.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger flex-shrink-0"
                        style={{ fontSize: "0.75rem" }}
                        disabled={removendoId === topico._id}
                        onClick={() => removerTopicoBM(topico._id)}
                        title="Remover bookmark"
                      >
                         Remover
                      </button>
                    </div>
                  );
                })}
              </div>
            )
          ) : /*  Posts salvos */
          postBMs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">Você ainda não salvou nenhum post.</p>
              <Link to="/forum" className="btn btn-sm btn-outline-primary mt-3">
                Explorar o fórum
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {postBMs.map((post) => (
                <div key={post._id} className="card border rounded-3">
                  <div className="card-body p-3">
                    {/* Origem */}
                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                      <Badge
                        bg="light"
                        className="border"
                        style={{
                          color:
                            CATEGORIA_META[post.categoria]?.color || "#6c757d",
                          fontSize: "0.68rem",
                        }}
                      >
                        {CATEGORIA_META[post.categoria]?.label || post.categoria}
                      </Badge>
                      <Link
                        to={`/forum/topicos/${post.topicoId}/postagens/${post._id}`}
                        className="text-decoration-none text-muted fw-medium"
                        style={{ fontSize: "0.78rem" }}
                      >
                        {post.topicoTitulo}
                      </Link>
                      <span
                        className="ms-auto text-muted"
                        style={{ fontSize: "0.72rem" }}
                      >
                        Post #{post.postNumeracao}
                      </span>
                    </div>

                    {/* Autor + conteudo */}
                    <div className="d-flex gap-2 align-items-start">
                      <Avatar 
                        name={post.autor?.usuario || "?"} 
                        size={30} 
                        img={post.autor?.avatar}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <span
                          className="fw-semibold"
                          style={{ fontSize: "0.82rem" }}
                        >
                          {post.autor?.usuario}
                        </span>
                        <p
                          className="mb-0 text-secondary mt-1"
                          style={{
                            fontSize: "0.85rem",
                            lineHeight: 1.55,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.conteudo}
                        </p>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger flex-shrink-0"
                        style={{ fontSize: "0.72rem" }}
                        disabled={removendoId === post._id}
                        onClick={() => removerPostBM(post.topicoId, post._id)}
                        title="Remover bookmark"
                      >
                        Remover
                      </button>
                    </div>

                    <div
                      className="mt-2 text-muted"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")} {" "}
                      {post.curtidas} curtidas
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
