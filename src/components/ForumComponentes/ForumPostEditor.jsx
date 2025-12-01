import { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

export default function ForumPostEditor({
  initialContent = "",
  onSubmit,
  onCancel,
  replyingTo = null,
  isEditing = false,
  user,
}) {
  const [content, setContent] = useState(initialContent);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (content.trim() === "") return alert("O post não pode estar vazio.");

    // MOCK - simula envio do post
    // TODO: integrar com backend (POST ou PUT /forum/topicos/:id/posts)
    console.log("Enviando post:", {
      content,
      replyingTo,
      autor: user?.username || "UsuárioTeste",
    });

    onSubmit?.(content);
    setContent("");
  };

  return (
    <Card className="p-3 mt-3 shadow-sm">
      {replyingTo && (
        <div className="mb-2 p-2 bg-light border rounded">
          <strong>Respondendo a:</strong>
          <div
            dangerouslySetInnerHTML={{
              __html: replyingTo.content.slice(0, 120) + "...",
            }}
          />
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Escreva sua resposta..."
          className="mb-3"
        />
        <div className="d-flex justify-content-end gap-2">
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary">
            {isEditing ? "Salvar Alterações" : "Publicar"}
          </Button>
        </div>
      </Form>
    </Card>
  );
}
