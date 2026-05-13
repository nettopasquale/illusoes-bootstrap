import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Spinner,
  Badge,
  Nav,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchMeusComentarios,
  fetchMeusLikes,
} from "../../services/userService";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import "./ComentariosCurtidas.css";

const TIPO_LABEL = {
  conteudo: "Conteúdo",
  colecao: "Coleção",
};

const TIPO_COR = {
  conteudo: { color: "var(--cor-destaque)", bg: "rgba(192,57,43,0.07)" },
  colecao: { color: "#0d6efd", bg: "rgba(13,110,253,0.07)" },
};

export default function MeusComentariosCurtidas() {
  const { usuario } = useContext(AuthContext);
  const [tab, setTab] = useState("comentarios");
  const [comentarios, setComentarios] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  //traz comentários se existirem
  useEffect(() => {
    fetchMeusComentarios()
    .then(({data})=>{
      setComentarios(data);
    })
    .catch(()=> setErro("Erro ao carregar comentarios."))
    .finally(()=> setLoading(false))
  }, []);

  //traz curtidas se existirem
  useEffect(() => {
    fetchMeusLikes()
    .then(({data})=>{
      setLikes(data);
    })
    .catch(()=> setErro("Erro ao carregar Curtidas"))
    .finally(()=> setLoading(false))
  }, []);

  const linkParaEntidade = (targetTipo, targetId, tipo) => {
    if (targetTipo === "conteudo") return `/conteudos/${tipo}/${targetId}`;
    if (targetTipo === "colecao") return `/colecoes/${targetId}`;
    return "#";
  };

  return (
    <LayoutGeral>
      <section className="pagina-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Dashboard", to: "/dashboard" },
              {
                label: "Comentários e Curtidas",
                to: "/userProfile/me/comentarios",
              },
            ]}
          />

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div>
              <h1 className="pagina-titulo mb-4">Comentários e Curtidas</h1>
              <p className="pagina-subtitulo mb-0">
                {comentarios.length} comentário
                {comentarios.length !== 1 ? "s" : ""} · {likes.length} curtida
                {likes.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Nav
            variant="tabs"
            activeKey={tab}
            onSelect={(k) => setTab(k)}
            className="mb-4"
          >
            <Nav.Item>
              <Nav.Link eventKey="comentarios" style={{ fontSize: "0.88rem" }}>
                Comentários{" "}
                <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                  {comentarios.length}
                </Badge>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="curtidas" style={{ fontSize: "0.88rem" }}>
                Curtidas{" "}
                <Badge bg="secondary" pill style={{ fontSize: "0.7rem" }}>
                  {likes.length}
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
              {/* ── Curtidas ── */}
              {tab === "curtidas" &&
                (likes.length === 0 ? (
                  <p
                    className="text-muted text-center py-5"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Você ainda não curtiu nada.
                  </p>
                ) : (
                  <Row className="g-3">
                    {likes.map((like) => {
                      const corTipo = TIPO_COR[like.targetTipo] || {};
                      return (
                        <Col xs={12} sm={6} md={4} key={like._id}>
                          <div className="engajamento-item h-100">
                            {like.entidade?.thumbs ? (
                              <img
                                src={like.entidade.thumbs}
                                alt=""
                                className="engajamento-thumb"
                              />
                            ) : (
                              <div className="engajamento-thumb-placeholder">
                                🖼
                              </div>
                            )}
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="engajamento-titulo text-truncate">
                                {like.entidade?.titulo ||
                                  like.entidade?.nome ||
                                  "—"}
                              </div>
                              <div className="engajamento-meta d-flex align-items-center gap-2">
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    fontWeight: 600,
                                    padding: "1px 7px",
                                    borderRadius: 99,
                                    background: corTipo.bg,
                                    color: corTipo.color,
                                  }}
                                >
                                  {TIPO_LABEL[like.targetTipo] ||
                                    like.targetTipo}
                                </span>
                              </div>
                              <Link
                                to={linkParaEntidade(
                                  like.targetTipo,
                                  like.targetId,
                                  like.entidade?.tipo,
                                )}
                                className="auth-link"
                                style={{ fontSize: "0.75rem" }}
                              >
                                Ver →
                              </Link>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </Row>
                ))}

              {/* ── Comentários ── */}
              {tab === "comentarios" &&
                (comentarios.length === 0 ? (
                  <p
                    className="text-muted text-center py-5"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Você ainda não fez nenhum comentário.
                  </p>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {comentarios.map((c) => {
                      const corTipo = TIPO_COR[c.targetTipo] || {};
                      return (
                        <div key={c._id} className="engajamento-item">
                          {c.entidade?.thumbs ? (
                            <img
                              src={c.entidade.thumbs}
                              alt=""
                              className="engajamento-thumb"
                            />
                          ) : (
                            <div className="engajamento-thumb-placeholder">
                              💬
                            </div>
                          )}
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                              <span
                                style={{
                                  fontSize: "0.68rem",
                                  fontWeight: 600,
                                  padding: "1px 7px",
                                  borderRadius: 99,
                                  background: corTipo.bg,
                                  color: corTipo.color,
                                }}
                              >
                                {TIPO_LABEL[c.targetTipo] || c.targetTipo}
                              </span>
                              <span className="engajamento-titulo text-truncate">
                                {c.entidade?.titulo || c.entidade?.nome || "—"}
                              </span>
                              <Link
                                to={linkParaEntidade(
                                  c.targetTipo,
                                  c.targetId,
                                  c.entidade?.tipo,
                                )}
                                className="auth-link ms-auto"
                                style={{ fontSize: "0.75rem" }}
                              >
                                ↗ Ver
                              </Link>
                            </div>
                            <div className="engajamento-conteudo">
                              {c.conteudo}
                            </div>
                            <div className="engajamento-meta mt-1">
                              {new Date(c.createdAt).toLocaleString("pt-BR", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                              {c.editado && (
                                <span className="ms-2 fst-italic">
                                  (editado)
                                </span>
                              )}
                            </div>
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
    </LayoutGeral>
  );
}