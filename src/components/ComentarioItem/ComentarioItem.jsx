import { useState, useContext } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";
import { FlagFill } from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useLike } from "../../hooks/useLikes";
import { criarDenuncia } from "../../services/denunciasService";

export default function ComentarioItem({
  comentario,
  usuario,
  onReply,
  onDelete,
}) {
  const { token } = useContext(AuthContext);
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
    <Card className="mb-2 ms-3">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>{comentario.autor?.usuario || "Usuário desconhecido"}</span>
          <small className="text-muted">
            {formatDistanceToNow(new Date(comentario.createdAt), {
              addSuffix: true,
            })}
          </small>
        </Card.Title>

        <Card.Text>{comentario.conteudo}</Card.Text>

        <div className="d-flex gap-2 align-items-center flex-wrap">
          <Button
            size="sm"
            variant={curtido ? "primary" : "outline-primary"}
            onClick={toggleLike}
            disabled={!token || loading}
          >
            ❤️ {curtidasTotais}
          </Button>

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setMostrarReply(!mostrarReply)}
          >
            Responder
          </Button>

          {ehAutor && (
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => onDelete(comentario._id)}
            >
              Excluir
            </Button>
          )}

          {/* Denúncia */}
          {usuario && !ehAutor && (
            <Button
              variant="link"
              size="sm"
              className="p-0 text-warning text-decoration-none"
              style={{ fontSize: "0.78rem" }}
              onClick={() => setShowDenuncia((v) => !v)}
            >
              <FlagFill />
            </Button>
          )}
        </div>

        {/* Campo de denúncia */}
        {showDenuncia && (
          <div className="mt-2 d-flex gap-2 align-items-center flex-wrap">
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
              onClick={handleDenunciarComentario}
              disabled={salvando}
            >
              Enviar
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

        {/* Resposta */}
        {mostrarReply && (
          <div className="mt-2">
            <textarea
              className="form-control mb-2"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />
            <Button
              size="sm"
              onClick={() => {
                onReply(resposta, comentario._id);
                setResposta("");
                setMostrarReply(false);
              }}
            >
              Enviar
            </Button>
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
      </Card.Body>
    </Card>
  );
}
