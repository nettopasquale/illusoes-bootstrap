import { useState, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FlagFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useLike } from "../../hooks/useLikes";
import { criarDenuncia } from "../../services/denunciasService";
import "./Comentario.css"; 

export default function ComentarioItem({
  comentario,
  usuario,
  onReply,
  onDelete,
}) {
  const { token, isAdmin } = useContext(AuthContext);

  const [resposta, setResposta] = useState("");
  const [mostrarReply, setMostrarReply] = useState(false);
  const [denunciaMotivo, setDenunciaMotivo] = useState("");
  const [showDenuncia, setShowDenuncia] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { curtido, curtidasTotais, toggleLike, loading } = useLike(
    comentario._id,
    "comentario",
    token,
  );

  const ehAutor = usuario?._id === comentario.autor?._id;
  const podeEditar = ehAutor || isAdmin;

  // ✅ função declarada — estava faltando no arquivo original
  const handleDenunciarComentario = async () => {
    if (!denunciaMotivo.trim()) return;
    setSalvando(true);
    try {
      await criarDenuncia({
        denunciado: comentario.autor?._id,
        targetId: comentario._id,
        targetTipo: "comentario",
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

  return (
    <div className={`comentario-card ${comentario.parentId ? "aninhado" : ""}`}>
      <div className="comentario-card-body">
        {/* Header — autor + tempo */}
        <div className="comentario-header">
          <span className="comentario-autor">
            {comentario.autor?.usuario || "Usuário desconhecido"}
          </span>
          <span className="comentario-tempo">
            {formatDistanceToNow(new Date(comentario.createdAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </span>
        </div>

        {/* Conteúdo */}
        <p className="comentario-conteudo">{comentario.conteudo}</p>

        {/* Ações */}
        <div className="comentario-acoes">
          {/* Curtir */}
          <button
            className={`comentario-btn-acao ${curtido ? "curtido" : ""}`}
            onClick={toggleLike}
            disabled={!token || loading}
          >
            ❤️ {curtidasTotais}
          </button>

          {/* Responder */}
          {usuario && (
            <button
              className="comentario-btn-acao"
              onClick={() => setMostrarReply((v) => !v)}
            >
              ↩ Responder
            </button>
          )}

          {/* Excluir — autor ou admin */}
          {podeEditar && (
            <button
              className="comentario-btn-acao danger"
              onClick={() => onDelete(comentario._id)}
            >
              Excluir
            </button>
          )}

          {/* Denunciar — só para quem não é autor */}
          {usuario && !ehAutor && (
            <button
              className="comentario-btn-denuncia"
              onClick={() => setShowDenuncia((v) => !v)}
              title="Denunciar comentário"
            >
              <FlagFill size={11} />
              Denunciar
            </button>
          )}
        </div>

        {/* Campo de denúncia */}
        {showDenuncia && (
          <div className="comentario-denuncia-form">
            <Form.Control
              size="sm"
              placeholder="Motivo da denúncia..."
              value={denunciaMotivo}
              onChange={(e) => setDenunciaMotivo(e.target.value)}
              style={{ maxWidth: 280 }}
            />
            <Button
              size="sm"
              variant="danger"
              onClick={handleDenunciarComentario}
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

        {/* Editor de resposta */}
        {mostrarReply && (
          <div className="comentario-reply-form">
            <textarea
              className="comentario-reply-textarea"
              placeholder="Escreva sua resposta..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="primary"
                disabled={!resposta.trim()}
                onClick={() => {
                  onReply(resposta, comentario._id);
                  setResposta("");
                  setMostrarReply(false);
                }}
              >
                Enviar resposta
              </Button>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => {
                  setMostrarReply(false);
                  setResposta("");
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Respostas aninhadas */}
        {comentario.respostas?.map((resp) => (
          <ComentarioItem
            key={resp._id}
            comentario={resp}
            usuario={usuario}
            onReply={onReply}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
