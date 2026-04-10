import { useState, useContext } from "react";
import { Card, Row, Col, Badge, Button, Dropdown } from "react-bootstrap";
import { ChatDots, Eye } from "react-bootstrap-icons";
import { curtirPostagem, deletarPostagem, denunciarPostagem } from "../../services/forumService";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "react-toastify";

const corCategorias = {
  estrategia: "primary",
  iniciante: "success",
  meta: "danger",
  trocas: "warning",
  regras: "info",
  torneio: "secondary",
  geral: "dark",
  batepapo: "secondary",
};

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
const [denunciaMotivo, setDenunciaMotivo] = useState("");
const [showDenunciaInput, setShowDenunciaInput] = useState(false);
const [loading, setLoading] = useState(false);

const ehAutor = String(postagem.autor?._id) === String(atualUserId);

const handleCurtida = async () => {
  if (!usuario) return;
  try {
    const { data } = await curtirPostagem(topicoId, postagem._id);
    setCurtidas(data.curtidas);
    setCurtidas(data.curtiu);
  } catch {
    /* silencioso */
  }
};

const handleDelete = async () => {
  if (!window.confirm("Remover esta resposta?")) return;
  try {
    await deletarPostagem(topicoId, postagem._id);
    onDelete(postagem._id);
  } catch {
    toast.error("Erro ao remover resposta.");
  }
};

const handleDenuncia = async () => {
  if (!denunciaMotivo.trim()) return;
  setLoading(true);
  try {
    await denunciarPostagem(topicoId, postagem._id, denunciaMotivo);
    setShowDenunciaInput(false);
    setDenunciaMotivo("");
    toast.success("Denúncia enviada. Obrigado!");
  } catch {
    toast.error("Erro ao enviar denúncia.");
  } finally {
    setLoading(false);
  }
};

if (postagem.deletado) {
  return (
    <div
      className="text-muted fst-italic ps-3 py-2 border-start border-2 mb-2"
      style={{ marginLeft: depth * 24 }}
    >
      [Resposta removida pelo autor]
    </div>
  );
}

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <Card className="mb-3 border" id={`postagem-${postagem._id}`}>
        <Card.Body className="p-3">
          {/* Citação */}
          {postagem.conteudoCitacao && (
            <blockquote className="blockquote border-start border-3 border-secondary ps-3 mb-3">
              <p className="mb-0 text-muted" style={{ fontSize: "0.82rem" }}>
                <strong>{postagem.nomeAutorCitacao}</strong> escreveu:
              </p>
              <p
                className="mb-0 text-secondary"
                style={{ fontSize: "0.82rem", whiteSpace: "pre-wrap" }}
              >
                {postagem.conteudoCitacao.length > 200
                  ? postagem.conteudoCitacao.slice(0, 200) + "…"
                  : postagem.conteudoCitacao}
              </p>
            </blockquote>
          )}

          <div className="d-flex gap-3 align-items-start">
            {/* Coluna de curtidas */}
            <div className="d-flex flex-column align-items-center gap-1">
              <Button
                variant={curtiu ? "success" : "outline-secondary"}
                size="sm"
                onClick={handleCurtida}
                disabled={!usuario}
                style={{ width: 32, height: 32, padding: 0, fontSize: "1rem" }}
              >
                ▲
              </Button>
              <span className="fw-semibold" style={{ fontSize: "0.85rem" }}>
                {curtidas}
              </span>
            </div>

            {/* Conteúdo */}
            <div className="flex-grow-1 min-width-0">
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <Avatar name={postagem.autor?.nome} size={28} />
                <span className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                  {postagem.autor?.nome}
                </span>
                <span className="text-muted" style={{ fontSize: "0.78rem" }}>
                  {new Date(postagem.criadoEm).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
                {depth > 0 && (
                  <Badge
                    bg="secondary"
                    className="ms-auto"
                    style={{ fontSize: "0.7rem" }}
                  >
                    resposta aninhada
                  </Badge>
                )}
              </div>

              <div
                className="text-body"
                style={{
                  fontSize: "0.92rem",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.65,
                }}
              >
                {postagem.conteudo}
              </div>

              {/* Ações */}
              <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                {usuario && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-secondary text-decoration-none"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => onQuote(postagem)}
                  >
                    ↩ Citar
                  </Button>
                )}

                {ehAutor && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger text-decoration-none"
                    style={{ fontSize: "0.8rem" }}
                    onClick={handleDelete}
                  >
                    Excluir
                  </Button>
                )}

                {usuario && !ehAutor && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-warning text-decoration-none"
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => setShowDenunciaInput((v) => !v)}
                  >
                    ⚑ Denunciar
                  </Button>
                )}
              </div>

              {showDenunciaInput && (
                <div className="mt-2 d-flex gap-2 align-items-center">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Motivo da denúncia..."
                    value={denunciaMotivo}
                    onChange={(e) => setDenunciaMotivo(e.target.value)}
                    style={{ maxWidth: 280 }}
                  />
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={handleDenuncia}
                    disabled={loading}
                  >
                    Enviar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => setShowDenunciaInput(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
