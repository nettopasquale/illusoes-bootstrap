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
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { 
  listarTopicosPorId,
  curtirTopico,
  denunciarTopico,
  criarBookmarkTopico,
  editarTopico,
  deletarTopico,
  publicarPostagem,
 } from "../../services/forumService";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumPostCard from "../../components/ForumComponentes/ForumPostCard";
import ForumPostEdicao from "../../components/ForumComponentes/ForumPostEdicao";
import { toast } from "react-toastify";

//Utilitarios
const CATEGORIA_META = {
  estrategia: { label: "Estratégia", color: "#0d6efd", bg: "primary" },
  iniciante: { label: "Iniciante", color: "#198754", bg: "success" },
  meta: { label: "Meta", color: "#dc3545", bg: "danger" },
  trocas: { label: "Trocas & Vendas", color: "#856404", bg: "warning" },
  regras: { label: "Regras", color: "#055160", bg: "info" },
  torneio: { label: "Torneios", color: "#495057", bg: "secondary" },
  geral: { label: "Geral", color: "#212529", bg: "dark" },
  batepapo: { label: "Bate-papo", color: "#6f42c1", bg: "secondary" },
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

// ── Post de abertura do tópico ────────────────────
function TopicoPost({ 
  topico, 
  usuario, 
  curtidas,
  curtiu, 
  bookmarked, 
  onVote, 
  onBookmark, 
  onQuote, 
  onEdit, 
  onDelete }) {
  const ehAutor = String(topico.autor?._id) === String(usuario?._id);
  const ehAdmin  = usuario?.tipo === "admin";
  const canEdit  = ehAutor || ehAdmin;
  const cat      = CATEGORIA_META[topico.categoria] || {};

  return (
    <div className="card border rounded-3 overflow-hidden mb-0">
      <div className="d-flex gap-0">
        {/* Sidebar autor */}
        <div
          className="d-flex flex-column align-items-center py-3 px-2 border-end flex-shrink-0 gap-2"
          style={{ width: 130, background: "#f8f9fa" }}
        >
          <Avatar name={topico.autor?.usuario || "?"} size={52} />
          <Link
            to={`/perfil/${topico.autor?._id}`}
            classusuario="fw-semibold text-decoration-none text-body text-center"
            style={{ fontSize: "0.8rem", wordBreak: "break-word" }}
          >
            {topico.autor?.usuario}
          </Link>
          {topico.autor?.tipo === "admin" && (
            <Badge bg="danger" style={{ fontSize: "0.63rem" }}>
              Admin
            </Badge>
          )}
          <div
            className="text-center text-muted"
            style={{ fontSize: "0.67rem", lineHeight: 1.5 }}
          >
            <div>💬 {topico.autor?.postagensContador || 0} posts</div>
            <div>
              desde{" "}
              {topico.autor?.createdAt
                ? new Date(topico.autor.createdAt).toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom flex-wrap gap-1"
            style={{
              background: "#f8f9fa",
              fontSize: "0.75rem",
              color: "#6c757d",
            }}
          >
            <span>Postado em {formatarData(topico.createdAt)}</span>
            {topico.editadoEm && (
              <span className="fst-italic">
                · Editado em {formatarData(topico.editadoEm)}
                {topico.editadoPor?.usuario && ` por ${topico.editadoPor.usuario}`}
              </span>
            )}
            <span className="fw-semibold" style={{ color: "#adb5bd" }}>
              #1
            </span>
          </div>

          {/* Conteúdo */}
          <div className="px-3 py-3 flex-grow-1">
            <div
              className="text-body"
              style={{
                fontSize: "0.93rem",
                whiteSpace: "pre-wrap",
                lineHeight: 1.75,
              }}
            >
              {topico.conteudo}
            </div>

            {/* Mídia */}
            {topico.anexos?.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {topico.anexos.map((m, i) =>
                  m.type === "image" ? (
                    <img
                      key={i}
                      src={m.url}
                      alt={m.usuario}
                      className="rounded border"
                      style={{
                        maxWidth: 360,
                        maxHeight: 260,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(m.url, "_blank")}
                    />
                  ) : (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      🔗 {m.usuario || m.url}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-top flex-wrap gap-2"
            style={{ background: "#f8f9fa" }}
          >
            <div className="d-flex align-items-center gap-2">
              <Button
                variant={curtiu ? "success" : "outline-secondary"}
                size="sm"
                onClick={onVote}
                disabled={!usuario}
                style={{ fontSize: "0.8rem", padding: "2px 10px" }}
              >
                ▲ {curtidas}
              </Button>
              <Button
                variant={bookmarked ? "warning" : "outline-secondary"}
                size="sm"
                onClick={onBookmark}
                disabled={!usuario}
                title={bookmarked ? "Remover bookmark" : "Salvar tópico"}
                style={{ fontSize: "0.78rem", padding: "2px 8px" }}
              >
                🔖
              </Button>
            </div>

            <div className="d-flex gap-2 align-items-center">
              {usuario && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={() => onQuote(topico)}
                >
                  ↩ Citar
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={onEdit}
                >
                  ✏ Editar
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="link"
                  size="sm"
                  className={`p-0 text-decoration-none ${ehAdmin && ehAutor ? "text-danger fw-semibold" : "text-secondary"}`}
                  style={{ fontSize: "0.78rem" }}
                  onClick={onDelete}
                >
                  {ehAdmin && ehAutor ? "⚠ Remover (Admin)" : "Excluir"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForumTopico() {
  const { topicoId } = useParams(); // ID do tópico
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();
  // console.log("Id:", topicoId);
  // console.log("usuario:", usuario)

  const [topico, setTopico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [quotedPost, setQuotedPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [successo, setSuccesso] = useState("");
  const [pagina, setPagina] = useState(1);
  const POSTS_POR_PAGINA = 20;

  //carregar topicos existentes
  useEffect(() => {
    const buscarTopico = async ()=>{
      try {
        const { data } = await listarTopicosPorId(topicoId);
        setTopico(data);
        setCurtidas(data.curtidas);
        setCurtiu(data.curtidoPor?.map(String).includes(String(usuario?._id)));
        setBookmarked(
          data.bookmarkedPor?.map(String).includes(String(usuario?._id)),
        );
      } catch {
        setError("Tópico não encontrado.");
      } finally {
        setLoading(false);
      }
    };
    buscarTopico();
  
  }, [topicoId, usuario]);

  const handleCurtirTopico = async () => {
    if (!usuario) return navigate("/login");
    try {
      const { data } = await curtirTopico(topicoId);
      setCurtidas(data.curtidas);
      setCurtiu(data.curtiu);
    } catch {
      /* silencioso */
    }
  };

  const flash = (msg) => {
    setSuccesso(msg);
    setTimeout(() => setSuccesso(""), 3500);
  };

  const handleCurtida = async () => {
    if (!usuario) return navigate("/login");
    try {
      const { data } = await curtirTopico(id);
      setCurtidas(data.curtidas);
      setCurtiu(data.curtiu);
    } catch {
      /* silencioso */
    }
  };

  const handleBookmark = async () => {
    if (!usuario) return navigate("/login");
    try {
      const { data } = await criarBookmarkTopico(topicoId);
      setBookmarked(data.bookmarkedPor);
      flash(
        data.bookmarkedPor
          ? "Tópico salvo nos bookmarks!"
          : "Bookmark removido.",
      );
    } catch {
      /* silencioso */
    }
  };

  const handleDenunciarTopico = async () => {
    const msg =
      usuario?.tipo === "admin" &&
      String(topico.autor?._id) !== String(usuario?._id)
        ? "Remover este tópico como administrador?"
        : "Excluir este tópico?";
    if (!window.confirm(msg)) return;
    try {
      await deletarTopico(topicoId);
      navigate("/forum");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  //VER AQUI
  const handlePublicarPost = async (postData) => {
    if (!usuario) return navigate("/login");
    setPostLoading(true);
    try {
      const { data } = await publicarPostagem(topicoId, postData);
      setTopico((prev) => ({
        ...prev,
        postagens: [...prev.postagens, data],
        postagensContador: (prev.postagensContador || 0) + 1,
      }));
      setQuotedPost(null);
      flash("Resposta publicada!");
      const totalPaginas = Math.ceil(
        (topico.postagens.length + 1) / POSTS_POR_PAGINA,
      );
      setPagina(totalPaginas);
      setTimeout(
        () =>
          document
            .getElementById(`reply-${data._id}`) //ver aqui
            ?.scrollIntoView({ behavior: "smooth" }),
        200,
      );
    } catch {
      toast.error("Erro ao publicar resposta.");
    }
    setPostLoading(false);
  };

  const handleDeletarPost = (postId) => {
    setTopico((prev) => ({
      ...prev,
      postagens: prev.postagens.map((r) =>
        r._id === postId
          ? { ...r, deletado: true, conteudo: "[Post removido]" }
          : r,
      ),
      postagensContador: Math.max((prev.postagensContador || 1) - 1, 0),
    }));
  };

  const handleAtualizarPost = (postId, postAtualizado) => {
    setTopico((prev) => ({
      ...prev,
      postagens: prev.postagens.map((r) =>
        r._id === postId ? { ...r, ...postAtualizado } : r,
      ),
    }));
  };

  if (loading)
    return (
      <LayoutGeral>
          <Container className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
          </Container>
      </LayoutGeral>
    );
  if (error)
    return (
      <LayoutGeral>
          <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
          </Container>
      </LayoutGeral>
    );
  const cat = CATEGORIA_META[topico.categoria] || {};
  const ehAutor = String(topico.autor?._id) === String(usuario?._id);
  const ehAdmin = usuario?.tipo === "admin";
    console.log("Autor:", ehAutor);
    console.log("Admin:", ehAdmin);

  // Paginação de replies
  const postsVisiveis = topico.postagens?.filter((r) => !r.parenteResposta) || [];
  const totalPaginas = Math.ceil(postsVisiveis.length / POSTS_POR_PAGINA);
  const postsPaginados = postsVisiveis.slice(
    (pagina - 1) * POSTS_POR_PAGINA,
    pagina * POSTS_POR_PAGINA,
  );

  const childMap = {};
  topico.postagens?.forEach((r) => {
    if (r.parenteResposta) {
      const k = String(r.parenteResposta);
      if (!childMap[k]) childMap[k] = [];
      childMap[k].push(r);
    }
  });

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
            <div className="text-center text-danger mt-5">{error}</div>
          </Row>

          {successo && (
            <Alert variant="success" className="mb-3">
              {successo}
            </Alert>
          )}

          {/* Título + badges */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <Badge bg={cat.bg || "secondary"}>
                {cat.label || topico.categoria}
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
                  className="border fw-normal"
                  style={{ fontSize: "0.7rem" }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
            <h1
              style={{ fontSize: "1.35rem", fontWeight: 700, lineHeight: 1.3 }}
              className="mb-0"
            >
              {topico.titulo}
            </h1>
            <div className="text-muted mt-1" style={{ fontSize: "0.78rem" }}>
              {topico.visualizacoes} views · {topico.postagensContador} posts
              {totalPaginas > 1 && (
                <span className="ms-2">
                  · Página {pagina} de {totalPaginas}
                </span>
              )}
            </div>
          </div>

          {/* Post de abertura */}
          <TopicoPost
            topico={topico}
            usuario={usuario}
            curtidas={curtidas}
            curtiu={curtiu}
            bookmarked={bookmarked}
            onVote={handleCurtida}
            onBookmark={handleBookmark}
            onQuote={(t) =>
              setQuotedPost({
                _id: t._id,
                conteudo: t.conteudo,
                autor: t.autor,
              })
            }
            onEdit={() => navigate(`/forum/topicos/${topico._id}/editar`)}
            onDelete={handleDenunciarTopico}
          />

          {/* Separador */}
          <div
            className="my-0 border-start border-end border-bottom rounded-bottom-3 px-3 py-2 d-flex justify-content-between align-items-center"
            style={{
              background: "#f8f9fa",
              fontSize: "0.75rem",
              color: "#6c757d",
            }}
          >
            <span>{topico.postagens?.length || 0} respostas</span>
            {totalPaginas > 1 && (
              <div className="d-flex gap-1">
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`btn btn-sm py-0 px-2 ${p === pagina ? "btn-primary" : "btn-outline-secondary"}`}
                      style={{ fontSize: "0.72rem" }}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Respostas */}
          <div className="border rounded-3 overflow-hidden mt-3 mb-3">
            {postsPaginados.length === 0 ? (
              <div
                className="text-center py-4 text-muted"
                style={{ fontSize: "0.9rem" }}
              >
                Nenhuma resposta ainda. Seja o primeiro!
              </div>
            ) : (
              postsPaginados.map((post) => (
                <div key={post._id}>
                  <ForumPostCard
                    postagem={post}
                    topicoId={topicoId}
                    atualUserId={usuario?._id}
                    onQuote={setQuotedPost}
                    onDelete={handleDeletarPost}
                    onUpdate={handleAtualizarPost}
                    depth={0}
                  />
                  {childMap[String(post._id)]?.map((child) => (
                    <ForumPostCard
                      key={child._id}
                      postagem={child}
                      topicoId={id}
                      atualUserId={usuario?._id}
                      onQuote={setQuotedPost}
                      onDelete={handleDeletarPost}
                      onUpdate={handleAtualizarPost}
                      depth={1}
                    />
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Paginação inferior */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center gap-2 mb-4">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                ‹
              </Button>
              <span
                className="text-muted align-self-center"
                style={{ fontSize: "0.82rem" }}
              >
                {pagina} / {totalPaginas}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                ›
              </Button>
            </div>
          )}

          {/* Editor de resposta */}
          {topico.trancado ? (
            <Alert variant="warning">
              🔒 Este tópico está fechado para novas respostas.
            </Alert>
          ) : usuario ? (
            <ForumPostEdicao
              onSubmit={handlePublicarPost}
              quotedReply={quotedPost}
              onClearQuote={() => setQuotedPost(null)}
              loading={postLoading}
            />
          ) : (
            <Card className="border text-center p-4">
              <p className="text-muted mb-2">
                Faça login para responder neste tópico.
              </p>
              <Button variant="primary" as={Link} to="/login">
                Entrar
              </Button>
            </Card>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
