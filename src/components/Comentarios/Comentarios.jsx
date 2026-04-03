import { useState } from "react";
import {
  Card,
  Button
} from "react-bootstrap";
import ComentarioItem from "../ComentarioItem/ComentarioItem";

const montarArvore = (comentarios) => {
  const mapa = {};
  const raiz = [];

  comentarios.forEach((c) => {
    mapa[c._id] = { ...c, respostas: [] };
  });

  comentarios.forEach((c) => {
    if (c.parentId) {
      mapa[c.parentId]?.respostas.push(mapa[c._id]);
    } else {
      raiz.push(mapa[c._id]);
    }
  });

  // 🔥 ordenar respostas
  Object.values(mapa).forEach((c) => {
    c.respostas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });

  return raiz;
};


export default function Comentarios({
  comentarios,
  criarComentario,
  deletarComentario,
  curtirComentario,
  usuario,
}) {
  const [texto, setTexto] = useState("");

  const arvore = montarArvore(comentarios);

  return (
    <Card className="mt-4">
      <Card.Body>
        <h5>Comentários</h5>

        <textarea
          className="form-control mb-2"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <Button
          onClick={() => {
            criarComentario(texto);
            setTexto("");
          }}
        >
          Comentar
        </Button>

        <div className="mt-3">
          {arvore.map((c) => (
            <ComentarioItem
              key={c._id}
              comentario={c}
              usuario={usuario}
              onReply={criarComentario}
              onDelete={deletarComentario}
              onLike={curtirComentario}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
