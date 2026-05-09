import {
  Container,
  Row,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  Form
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { 
  listarTopicosPorId,
  curtirTopico,
  criarBookmarkTopico,
  editarTopico,
  deletarTopico,
  publicarPostagem,
 } from "../../services/forumService";
 import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumPostCard from "../../components/ForumComponentes/ForumPostCard";
import ForumPostEdicao from "../../components/ForumComponentes/ForumPostEdicao";
import TopicoPost from "../../components/ForumComponentes/TopicoPost";
import { criarDenuncia } from "../../services/denunciasService";
import { useForumTopicos } from "../../hooks/useForumTopicos";
import "./Forum.css";

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

export default function ForumTopico() {
  const { topicoId } = useParams(); // ID do tópico
  const { usuario } = useContext(AuthContext);
  const [topico, setTopico] = useState(null);
  const [error, setError] = useState(null);
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quotedPost, setQuotedPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [successo, setSuccesso] = useState("");
  const [denunciaMotivo, setDenunciaMotivo] = useState("");
  const [showDenuncia, setShowDenuncia] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [editandoTopico, setEditandoTopico] = useState(false);
  const [tituloEditado, setTituloEditado] = useState("");
  const [conteudoEditado, setConteudoEditado] = useState("");
  const [tagsEditadas, setTagsEditadas] = useState("");
  const POSTS_POR_PAGINA = 20;

  //carregar topicos existentes
  useEffect(() => {
    const buscarTopico = async () => {
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

  const flash = (msg) => {
    setSuccesso(msg);
    setTimeout(() => setSuccesso(""), 3500);
  };

  const handleCurtida = async () => {
    if (!usuario) return navigate("/login");
    try {
      const { data } = await curtirTopico(topicoId);
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
      setBookmarked(data.bookmarked);
      console.log("Bookmarked?: ", data.bookmarked);
      flash(
        data.bookmarked ? "Tópico salvo nos bookmarks!" : "Bookmark removido.",
      );
    } catch {
      /* silencioso */
    }
  };

  const handleDeletarTopico = async () => {
    const msg =
      usuario?.tipo === "admin" &&
      String(topico.autor?._id) !== String(usuario?._id)
        ? "Remover este tópico como administrador?"
        : "Excluir este tópico?";
    if (!window.confirm(msg)) return;
    try {
      await deletarTopico(topicoId);
      toast.success("tópico deletado com sucesso")
      navigate("/forum");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const handleDenunciarTopico = async () => {
    if (!denunciaMotivo.trim()) return;
    setSalvando(true);
    try {
      await criarDenuncia({
        denunciado: topico.autor?._id, // ID do autor do tópico
        targetId: topicoId, // ID do tópico em si
        targetTipo: "topico",
        motivo: denunciaMotivo,
      });
      setShowDenuncia(false);
      setDenunciaMotivo("");
      toast.success("Denúncia enviada. Obrigado!");
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setSalvando(false);
    }
  };
  // // Ativa o modo de edição — popula os states com os valores atuais do tópico
  const handleAbrirEdicaoTopico = () => {
    setTituloEditado(topico.titulo);
    setConteudoEditado(topico.conteudo);
    setTagsEditadas(topico.tags?.join(", ") || "");
    setEditandoTopico(true);
  };

  // // Salva as alterações chamando a API
  const handleSalvarEdicaoTopico = async () => {
    if (!tituloEditado.trim() || !conteudoEditado.trim()) {
      toast.error("Título e conteúdo são obrigatórios.");
      return;
    }
    setSalvando(true);
    try {
      const tagsArray = tagsEditadas
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const { data } = await editarTopico(topicoId, {
        titulo: tituloEditado.trim(),
        conteudo: conteudoEditado.trim(),
        tags: tagsArray,
      });

      // Atualiza o state local com o retorno da API
      setTopico((prev) => ({ ...prev, ...data }));
      setEditandoTopico(false);
      flash("Tópico editado com sucesso!");
    } catch {
      toast.error("Erro ao salvar edição.");
    } finally {
      setSalvando(false);
    }
  };

  // //VER AQUI
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

  // Paginação de replies
  const postsVisiveis =
    topico.postagens?.filter((r) => !r.parenteResposta) || [];
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
      <section className="forum-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Fórum", to: "/forum" },
              {
                label: cat.label || topico.categoria,
                to: `/forum/categorias/${topico.categoria}/topicos`,
              },
              { label: topico.titulo },
            ]}
          />

          {successo && (
            <Alert
              variant="success"
              className="mb-3"
              style={{ fontSize: "0.85rem" }}
            >
              {successo}
            </Alert>
          )}

          {/* ── Cabeçalho do tópico ── */}
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
              <Badge bg={cat.bg || "secondary"} style={{ fontSize: "0.72rem" }}>
                {cat.label || topico.categoria}
              </Badge>
              {topico.destaque && (
                <Badge bg="light" text="dark" style={{ fontSize: "0.7rem" }}>
                  📌 Fixado
                </Badge>
              )}
              {topico.trancado && (
                <Badge bg="warning" text="dark" style={{ fontSize: "0.7rem" }}>
                  🔒 Fechado
                </Badge>
              )}
              {topico.tags?.map((tag) => (
                <Badge
                  key={tag}
                  bg="light"
                  text="secondary"
                  className="border fw-normal"
                  style={{ fontSize: "0.68rem" }}
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            <h1 className="forum-page-title mb-1">{topico.titulo}</h1>

            <div className="forum-page-subtitulo">
              {topico.visualizacoes} visualizações · {topico.postagensContador}{" "}
              posts
              {totalPaginas > 1 && ` · Página ${pagina} de ${totalPaginas}`}
            </div>
          </div>

          {/* ── Post de abertura ── */}
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
            onEdit={handleAbrirEdicaoTopico}
            onSave={handleSalvarEdicaoTopico}
            onDelete={handleDeletarTopico}
            onShowDenuncia={() => setShowDenuncia(true)}
          />

          {/* ── Formulário de edição do tópico ── */}
          {editandoTopico && (
            <div className="forum-post-card p-4 mt-2 mb-3">
              <h6
                className="fw-semibold mb-3"
                style={{ fontFamily: "var(--fonte-titulo)" }}
              >
                Editar tópico
              </h6>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  Título
                </Form.Label>
                <Form.Control
                  type="text"
                  value={tituloEditado}
                  onChange={(e) => setTituloEditado(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  Conteúdo
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={conteudoEditado}
                  onChange={(e) => setConteudoEditado(e.target.value)}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                  Tags{" "}
                  <span className="text-muted fw-normal">
                    (separadas por vírgula)
                  </span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ex: deck, combo, iniciante"
                  value={tagsEditadas}
                  onChange={(e) => setTagsEditadas(e.target.value)}
                />
              </Form.Group>

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setEditandoTopico(false)}
                  disabled={salvando}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="px-4"
                  onClick={handleSalvarEdicaoTopico}
                  disabled={
                    salvando || !tituloEditado.trim() || !conteudoEditado.trim()
                  }
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          )}

          {/* ── Campo de denúncia ── */}
          {showDenuncia && (
            <div className="forum-denuncia-form mt-2 mb-3">
              <Form.Control
                size="sm"
                placeholder="Descreva o motivo da denúncia..."
                value={denunciaMotivo}
                onChange={(e) => setDenunciaMotivo(e.target.value)}
                style={{ maxWidth: 320 }}
              />
              <Button
                size="sm"
                variant="danger"
                onClick={handleDenunciarTopico}
                disabled={salvando || !denunciaMotivo.trim()}
              >
                {salvando ? "Enviando..." : "Enviar"}
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  setShowDenuncia(false);
                  setDenunciaMotivo("");
                }}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* ── Separador com paginação superior ── */}
          <div
            className="d-flex justify-content-between align-items-center px-3 py-2 mt-0"
            style={{
              background: "#f8f9fa",
              borderLeft: "1px solid var(--cor-borda)",
              borderRight: "1px solid var(--cor-borda)",
              borderBottom: "1px solid var(--cor-borda)",
              borderRadius: "0 0 var(--raio) var(--raio)",
              fontSize: "0.75rem",
              color: "var(--cor-texto-suave)",
            }}
          >
            <span>
              {topico.postagens?.length || 0} resposta
              {topico.postagens?.length !== 1 ? "s" : ""}
            </span>
            {totalPaginas > 1 && (
              <div
                className="forum-paginacao"
                style={{ padding: 0, border: "none" }}
              >
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPagina(p)}
                      className={`forum-paginacao-btn ${p === pagina ? "ativo" : ""}`}
                    >
                      {p}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {/* ── Posts ── */}
          <div className="forum-topicos-card mt-3 mb-3">
            {postsPaginados.length === 0 ? (
              <div className="forum-vazio">
                <p>Nenhuma resposta ainda. Seja o primeiro!</p>
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
                      topicoId={topicoId}
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

          {/* ── Paginação inferior ── */}
          {totalPaginas > 1 && (
            <div className="forum-paginacao mb-4">
              <button
                className="forum-paginacao-btn"
                disabled={pagina === 1}
                onClick={() => setPagina((p) => p - 1)}
              >
                ‹
              </button>
              <span
                style={{ fontSize: "0.82rem", color: "var(--cor-texto-suave)" }}
              >
                {pagina} / {totalPaginas}
              </span>
              <button
                className="forum-paginacao-btn"
                disabled={pagina === totalPaginas}
                onClick={() => setPagina((p) => p + 1)}
              >
                ›
              </button>
            </div>
          )}

          {/* ── Editor de resposta ── */}
          {topico.trancado ? (
            <Alert variant="warning" style={{ fontSize: "0.85rem" }}>
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
            <div
              className="forum-post-card text-center p-4"
              style={{ marginTop: "1rem" }}
            >
              <p className="text-muted mb-2" style={{ fontSize: "0.88rem" }}>
                Faça login para responder neste tópico.
              </p>
              <Button
                variant="primary"
                size="sm"
                as={Link}
                to="/login"
                style={{ background: "var(--cor-destaque)", border: "none" }}
              >
                Entrar
              </Button>
            </div>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
