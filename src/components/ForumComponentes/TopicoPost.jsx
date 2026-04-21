import {Badge,Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

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

// ── Post de abertura do tópico ────────────────────
export default function TopicoPost({
  topico,
  usuario,
  curtidas,
  curtiu,
  bookmarked,
  denuncia,
  onVote,
  onBookmark,
  onQuote,
  onEdit,
  onSave,
  onDelete,
}) {
  const ehAutor = String(topico.autor?._id) === String(usuario?._id);
  const ehAdmin = usuario?.tipo === "admin";
  const canEdit = ehAutor || ehAdmin;
  const cat = CATEGORIA_META[topico.categoria] || {};
  console.log("Autor info:", topico.autor.usuario)

  return (
    <div className="card border rounded-3 overflow-hidden mb-0">
      <div className="d-flex gap-0">
        {/* Sidebar autor */}
        <div
          className="d-flex flex-column align-items-center py-3 px-2 border-end flex-shrink-0 gap-2"
          style={{ width: 130, background: "#f8f9fa" }}
        >
          <Avatar name={topico.autor?.usuario || "?"} size={52} img={topico.autor?.avatar || null}/>
          <Link
            to={`/user/topicos/${topico.autor?._id}`}
            className="fw-semibold text-decoration-none text-body text-center"
            style={{ fontSize: "0.8rem", wordBreak: "break-word" }}
          >
            {topico.autor?.usuario}
          </Link>
          {topico.autor?.tipo === "admin" && (
            <Badge bg="danger" style={{ fontSize: "0.63rem" }}>
              Admin
            </Badge>
          )}
          <div
            className="text-center text-muted"
            style={{ fontSize: "0.67rem", lineHeight: 1.5 }}
          >
            <div>💬 {topico.autor?.postagensContador || 0} posts</div>
            <div>
              desde{" "}
              {topico.autor?.createdAt
                ? new Date(topico.autor.createdAt).toLocaleDateString("pt-BR", {
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div className="flex-grow-1 d-flex flex-column overflow-hidden">
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom flex-wrap gap-1"
            style={{
              background: "#f8f9fa",
              fontSize: "0.75rem",
              color: "#6c757d",
            }}
          >
            <span>Postado em {formatarData(topico.createdAt)}</span>
            {topico.editadoEm && (
              <span className="fst-italic">
                · Editado em {formatarData(topico.editadoEm)}
                {topico.editadoPor?.usuario &&
                  ` por ${topico.editadoPor.usuario}`}
              </span>
            )}
            <span className="fw-semibold" style={{ color: "#adb5bd" }}>
              #1
            </span>
          </div>

          {/* Conteúdo */}
          <div className="px-3 py-3 flex-grow-1">
            <div
              className="text-body"
              style={{
                fontSize: "0.93rem",
                whiteSpace: "pre-wrap",
                lineHeight: 1.75,
              }}
            >
              {topico.conteudo}
            </div>

            {/* Mídia */}
            {topico.anexos?.length > 0 && (
              <div className="mt-3 d-flex flex-wrap gap-2">
                {topico.anexos.map((m, i) =>
                  m.type === "image" ? (
                    <img
                      key={i}
                      src={m.url}
                      alt={m.usuario}
                      className="rounded border"
                      style={{
                        maxWidth: 360,
                        maxHeight: 260,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(m.url, "_blank")}
                    />
                  ) : (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary"
                    >
                      🔗 {m.usuario || m.url}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-top flex-wrap gap-2"
            style={{ background: "#f8f9fa" }}
          >
            <div className="d-flex align-items-center gap-2">
              {/* curtir */}
              <Button
                variant={curtiu ? "success" : "outline-secondary"}
                size="sm"
                onClick={onVote}
                disabled={!usuario}
                style={{ fontSize: "0.8rem", padding: "2px 10px" }}
              >
                ▲ {curtidas}
              </Button>
              {/* bookmark */}
              <Button
                variant={bookmarked ? "warning" : "outline-secondary"}
                size="sm"
                onClick={onBookmark}
                disabled={!usuario}
                title={bookmarked ? "Remover bookmark" : "Salvar tópico"}
                style={{ fontSize: "0.78rem", padding: "2px 8px" }}
              >
                🔖
              </Button>
            </div>

            <div className="d-flex gap-2 align-items-center">
              {usuario && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={() => onQuote(topico)}
                >
                  ↩ Citar
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary text-decoration-none"
                  style={{ fontSize: "0.78rem" }}
                  onClick={onEdit}
                >
                  ✏ Editar
                </Button>
              )}
              {canEdit && (
                <Button
                  variant="link"
                  size="sm"
                  className={`p-0 text-decoration-none ${ehAdmin && ehAutor ? "text-danger fw-semibold" : "text-secondary"}`}
                  style={{ fontSize: "0.78rem" }}
                  onClick={onDelete}
                >
                  {ehAdmin && ehAutor ? "⚠ Remover (Admin)" : "Excluir"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
