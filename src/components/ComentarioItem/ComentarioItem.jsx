import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function ComentarioItem({
    comentario,
    usuario,
    onReply,
    onDelete,
    onLike
}) {
  const [resposta, setResposta] = useState("");
  const [mostrarReply, setMostrarReply] = useState(false);

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

        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => onLike(comentario._id)}
          >
            ❤️ {comentario.likes?.length || 0}
          </Button>

          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setMostrarReply(!mostrarReply)}
          >
            Responder
          </Button>

          {usuario?._id === comentario.autor?._id && (
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => onDelete(comentario._id)}
            >
              Excluir
            </Button>
          )}
        </div>

        {/* resposta */}
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

        {/* respostas */}
        {comentario.respostas?.map((resp) => (
          <ComentarioItem
            key={resp._id}
            comentario={resp}
            usuario={usuario}
            onReply={onReply}
            onDelete={onDelete}
            onLike={onLike}
          />
        ))}
      </Card.Body>
    </Card>
  );
}
