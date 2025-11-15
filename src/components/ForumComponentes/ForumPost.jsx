import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAuth }  from "../../context/useAuth";
import ForumPostEditor from "./ForumPostEditor";



export default function ForumPost({ post, onEdit, onDelete, onReply }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { user } = useAuth();

  const isAuthor = user && post.authorId === user.id;

  const handleSaveEdit = (newContent) => {
    // MOCK - Atualiza localmente
    // TODO: integrar com backend (PUT /forum/posts/:id)
    console.log("Editando post:", post.id);
    onEdit?.(post.id, newContent);
    setIsEditing(false);
  };

  const handleReply = (content) => {
    // MOCK - Cria resposta
    // TODO: integrar com backend (POST /forum/posts)
    console.log("Respondendo post:", post.id);
    onReply?.(post.id, content);
    setIsReplying(false);
  };
  return (
    <Card className="mb-3 p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>{post.authorName}</strong>
          <span className="text-muted ms-2" style={{ fontSize: "0.9em" }}>
            {new Date(post.createdAt).toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      {!isEditing ? (
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <ForumPostEditor
          initialContent={post.content}
          isEditing
          onSubmit={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          user={user}
        />
      )}

      {/* Ações do Post */}
      {!isEditing && (
        <div className="d-flex gap-2 mt-3">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
          >
            Responder
          </Button>
          {isAuthor && (
            <>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete?.(post.id)}
              >
                Excluir
              </Button>
            </>
          )}
        </div>
      )}

      {/* Editor de resposta */}
      {isReplying && (
        <div className="mt-3">
          <ForumPostEditor
            replyingTo={post}
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            user={user}
          />
        </div>
      )}
    </Card>
  );
}
