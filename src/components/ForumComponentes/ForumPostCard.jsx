import { useState, useContext } from "react";
import { Card, Row, Col, Badge, Button, Dropdown } from "react-bootstrap";
import { ChatDots, Eye } from "react-bootstrap-icons";
import { 
  curtirPostagem, 
  deletarPostagem, 
  denunciarPostagem,
  criarBookmarkPost,
  editarPostagem
 } from "../../services/forumService";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";

function Avatar({nome="", size=36}){
  const iniciais = nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center fw-semibold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `hsl(${[...nome].reduce((a, c) => a + c.charCodeAt(0), 0) % 360}, 55%, 45%)`,
      }}
    >
      {iniciais || "?"}
    </div>
  );
}

function formatarData(d) {
  return new Date(d).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}


export default function ForumPostCard({
  postagem,
  topicoId,
  atualUserId,
  onQuote,
  onDelete,
  depth = 0,
}) {
const { usuario } = useAuth(AuthContext);
const [curtidas, setCurtidas] = useState(postagem.curtidas || 0);
const [curtiu, setCurtiu] = useState(
  postagem.curtidoPor?.map(String).includes(String(atualUserId)),
);
const [bookmarked, setBookmarked] = useState(
  postagem.bookmarkedPor?.map(String).includes(String(atualUserId)),
);
const [denunciaMotivo, setDenunciaMotivo] = useState("");
const [showDenuncia, setShowDenuncia] = useState(false);
const [editando, setEditando] = useState(false);
const [editarConteudo, setEditarConteudo] = useState(postagem.content);
const [salvando, setSalvando] = useState(false);

const ehAutor = String(postagem.autor?._id) === String(atualUserId);
const ehAdmin = usuario.tipo === 'admin';
const modoEdicao = ehAutor || ehAdmin;

const handleCurtida = async () => {
  if (!usuario) return;
  try {
    const { data } = await curtirPostagem(topicoId, postagem._id);
    setCurtidas(data.curtidas);
    setCurtiu(data.curtiu);
  } catch {
    /* silencioso */
  }
};

const handleDelete = async () => {
  if (
    !window.confirm(
      ehAdmin && !ehAutor
        ? "Remover este post como administrador?"
        : "Remover sua resposta?",
    )
  )
    return;
  try {
    await deletarPostagem(topicoId, postagem._id);
    onDelete(postagem._id);
  } catch {
    toast.error("Erro ao remover resposta.");
  }
};

const handleBookmark = async () => {
  if (!usuario) return;
  try {
    const { data } = await bookmarkPostagem(threadId, postagem._id);
      setBookmarked(data.bookmarked);
  } catch {
      /* silencioso */
  }
};

const handleDenuncia = async () => {
  if (!denunciaMotivo.trim()) return;
  setSalvando(true);
  try {
    await denunciarPostagem(topicoId, postagem._id, denunciaMotivo);
    setShowDenuncia(false);
    setDenunciaMotivo("");
    toast.success("Denúncia enviada. Obrigado!");
  } catch {
    toast.error("Erro ao enviar denúncia.");
  } finally {
    setSalvando(false);
  }
};

const handleSaveEdit = async () => {
  if (!editarConteudo.trim()) return;
    setSalvando(true);
  try {
    const { data } = await editarPostagem(topicoId, postagem._id, {
      conteudo: editarConteudo.trim(),
    });
    onUpdate(postagem._id, data);
    setEditando(false);
  } catch {
    toast.error("Erro ao salvar edição.");
  }
    setSalvando(false);
};

if (postagem.deletado) {
  return (
    <div
      className="text-muted fst-italic ps-3 py-2 border-start border-2 mb-2"
      style={{ marginLeft: depth * 24 }}
    >
      #{postagem.postNumeracao} · [Post removido]
    </div>
  );
}

  return (
    <div
      id={`postagem-${postagem._id}`}
      className="border-bottom"
      style={{
        marginLeft: depth > 0 ? 32 : 0,
        background: depth > 0 ? "#f9f9f9" : "white",
      }}
    >
      <div className="d-flex gap-0">
        {/* ── Sidebar do autor ── */}
        <div
          className="d-flex flex-column align-items-center py-3 px-3 border-end flex-shrink-0 gap-2"
          style={{ width: 140, background: "#f8f9fa" }}
        >
          <Avatar name={postagem.autor?.usuario || "?"} size={48} />
          <Link
            to={`/perfil/${postagem.autor?._id}`}
            className="fw-semibold text-decoration-none text-body text-center"
            style={{ fontSize: "0.82rem", wordBreak: "break-word" }}
          >
            {postagem.autor?.usuario}
          </Link>
          {postagem.autor?.tipo ==='admin' && (
            <Badge bg="danger" style={{ fontSize: "0.65rem" }}>
              Admin
            </Badge>
          )}
          <div
            className="text-center text-muted"
            style={{ fontSize: "0.68rem", lineHeight: 1.5 }}
          >
            <div>💬 {postagem.autor?.postNumeracao || 0} posts</div>
            <div>
              desde{" "}
              {postagem.autor?.criadoEm
                ? new Date(postagem.autor.criadoEm).toLocaleDateString(
                    "pt-BR",
                    {
                      month: "short",
                      year: "numeric",
                    },
                  )
                : "—"}
            </div>
          </div>
        </div>

        {/* ── Corpo do post ── */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {/* Header do post */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom flex-wrap gap-1"
            style={{
              background: "#f8f9fa",
              fontSize: "0.75rem",
              color: "#6c757d",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <span>Postado em {formatarData(postagem.criadoEm)}</span>
              {postagem.editadoEm && (
                <span className="fst-italic">
                  · Editado em {formatarData(postagem.editarEm)}
                  {postagem.editarPor?.usuario &&
                    postagem.editarPor.usuario !== postagem.autor?.usuario && (
                      <> por {postagem.editarPor.usuario}</>
                    )}
                </span>
              )}
            </div>
            <span className="fw-semibold" style={{ color: "#adb5bd" }}>
              #{postagem.postNumeracao}
            </span>
          </div>

          {/* Citação */}
          {postagem.conteudoCitacao && (
            <div className="mx-3 mt-3 p-2 rounded border-start border-3 border-secondary bg-light">
              <div
                className="text-muted fw-semibold mb-1"
                style={{ fontSize: "0.76rem" }}
              >
                {postagem.nomeAutorCitacao} escreveu:
              </div>
              <div
                className="text-secondary"
                style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap" }}
              >
                {postagem.conteudoCitacao.length > 250
                  ? postagem.conteudoCitacao.slice(0, 250) + "…"
                  : postagem.conteudoCitacao}
              </div>
            </div>
          )}

          {/* Conteúdo */}
          <div className="px-3 py-3 flex-grow-1">
            {editando ? (
              <div>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={editarConteudo}
                  onChange={(e) => setEditarConteudo(e.target.value)}
                  style={{
                    fontSize: "0.9rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
                <div className="d-flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSaveEdit}
                    disabled={salvando}
                  >
                    {salvando ? "Salvando…" : "Salvar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setEditando(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="text-body"
                style={{
                  fontSize: "0.92rem",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.7,
                }}
              >
                {postagem.conteudo}
              </div>
            )}

            {/* Mídia */}
            {postagem.anexos?.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {postagem.anexos.map((m, i) =>
                  m.type === "image" ? (
                    <img
                      key={i}
                      src={m.url}
                      alt={m.usuario || "imagem"}
                      className="rounded border"
                      style={{
                        maxWidth: 320,
                        maxHeight: 220,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(m.url, "_blank")}
                    />
                  ) : m.type === "link" ? (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      🔗 {m.usuario || m.url}
                    </a>
                  ) : (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      📎 {m.usuario || "Anexo"}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Footer de ações */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-top flex-wrap gap-2"
            style={{ background: "#f8f9fa" }}
          >
            {/* Voto */}
            <div className="d-flex align-items-center gap-2">
              <Button
                variant={curtiu ? "success" : "outline-secondary"}
                size="sm"
                onClick={handleCurtida}
                disabled={!usuario || ehAutor}
                style={{ fontSize: "0.8rem", padding: "2px 10px" }}
              >
                ▲ {curtidas}
              </Button>

              {/* Bookmark */}
              <Button
                variant={bookmarked ? "warning" : "outline-secondary"}
                size="sm"
                onClick={handleBookmark}
                disabled={!usuario}
                title={bookmarked ? "Remover bookmark" : "Salvar post"}
                style={{ fontSize: "0.78rem", padding: "2px 8px" }}
              >
                🔖
              </Button>
            </div>

            {/* Ações direita */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {usuario && !ehAutor && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={() => onQuote(postagem)}
                >
                  ↩ Citar
                </Button>
              )}

              {modoEdicao && !editando && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={() => setEditando(true)}
                >
                  ✏ Editar
                </Button>
              )}

              {modoEdicao && (
                <Button
                  variant="link"
                  size="sm"
                  className={`p-0 text-decoration-none ${ehAdmin && !ehAutor ? "text-danger fw-semibold" : "text-secondary"}`}
                  style={{ fontSize: "0.78rem" }}
                  onClick={handleDelete}
                >
                  {ehAdmin && !ehAutor ? "⚠ Remover (Admin)" : "Excluir"}
                </Button>
              )}

              {usuario && !ehAutor && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-warning text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={() => setShowReport((v) => !v)}
                >
                  ⚑
                </Button>
              )}
            </div>
          </div>

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
                onClick={handleDenuncia}
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
        </div>
      </div>
    </div>
  );
}
