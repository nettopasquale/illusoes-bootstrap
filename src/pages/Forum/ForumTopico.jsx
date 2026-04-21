import {
  Container,
  Row,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
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
 import { toast } from "react-toastify";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumPostCard from "../../components/ForumComponentes/ForumPostCard";
import ForumPostEdicao from "../../components/ForumComponentes/ForumPostEdicao";
import TopicoPost from "../../components/ForumComponentes/TopicoPost";


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
  const navigate = useNavigate();

  const [topico, setTopico] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curtidas, setCurtidas] = useState(0);
  const [curtiu, setCurtiu] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
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
      console.log("Bookmarked?: ", data.bookmarked)
      flash(
        data.bookmarked
          ? "Tópico salvo nos bookmarks!"
          : "Bookmark removido.",
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
      navigate("/forum");
    } catch {
      toast.error("Erro ao excluir.");
    }
  };

  const handleDenunciarTopico = async () => {
    if (!denunciaMotivo.trim()) return;
    setSalvando(true);
    try {
      await denunciarTopico(topicoId, denunciaMotivo);
      setShowDenuncia(false);
      setDenunciaMotivo("");
      toast.success("Denúncia enviada. Obrigado!");
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setSalvando(false);
    }
  };

  // Ativa o modo de edição — popula os states com os valores atuais do tópico
  const handleAbrirEdicaoTopico = () => {
    setTituloEditado(topico.titulo);
    setConteudoEditado(topico.conteudo);
    setTagsEditadas(topico.tags?.join(", ") || "");
    setEditandoTopico(true);
  };

  // Salva as alterações chamando a API
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
            onEdit={handleAbrirEdicaoTopico}
            onSave={handleSalvarEdicaoTopico}
            onDelete={handleDeletarTopico}
          />
          {/* Formulário de edição do tópico — aparece no lugar do conteúdo */}
          {editandoTopico && (
            <div className="card border rounded-3 p-4 mt-2 mb-3">
              <h6 className="fw-semibold mb-3">Editar tópico</h6>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.85rem" }}>
                  Título
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={tituloEditado}
                  onChange={(e) => setTituloEditado(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.85rem" }}>
                  Conteúdo
                </label>
                <textarea
                  className="form-control"
                  rows={8}
                  value={conteudoEditado}
                  onChange={(e) => setConteudoEditado(e.target.value)}
                  style={{ resize: "vertical", fontFamily: "inherit" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ fontSize: "0.85rem" }}>
                  Tags{" "}
                  <span className="text-muted fw-normal">
                    (separadas por vírgula)
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ex: deck, combo, iniciante"
                  value={tagsEditadas}
                  onChange={(e) => setTagsEditadas(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setEditandoTopico(false)}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSalvarEdicaoTopico}
                  disabled={
                    salvando || !tituloEditado.trim() || !conteudoEditado.trim()
                  }
                >
                  {salvando ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          )}

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
          {/* Campo de denúncia */}
          {showDenuncia && (
            <div className="px-3 pb-3 d-flex gap-2 align-items-center flex-wrap">
              <Form.Control
                size="sm"
                placeholder="Motivo da denúncia..."
                value={denunciaMotivo}
                onChange={(e) => setDenunciaMotivo(e.target.value)}
                style={{ maxWidth: 300 }}
              />
              <Button
                size="sm"
                variant="warning"
                onClick={handleDenunciarTopico}
                disabled={salvando}
              >
                Enviar
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => setShowDenuncia(false)}
              >
                Cancelar
              </Button>
            </div>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
