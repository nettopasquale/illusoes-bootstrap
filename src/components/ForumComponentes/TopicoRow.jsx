import { useParams, Link, useNavigate } from "react-router-dom";
import {Badge} from "react-bootstrap";

//calcula tempo passado pelas atividades do forum
function timeAgo(data) {
  if (!data) return "—";
  const diff = (Date.now() - new Date(data)) / 1000;
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function TopicoRow({ topico }) {
  const teveAtividade = topico.postagensContador > 0;

  return (
    <div className="d-flex align-items-center border-bottom py-2 px-3 gap-3">
      {/* Status dot */}
      <div
        className="rounded-circle flex-shrink-0"
        style={{
          width: 10,
          height: 10,
          background: teveAtividade ? "#198754" : "#dee2e6",
        }}
        title={teveAtividade ? "Com respostas" : "Sem respostas"}
      />

      {/* Título + metadados */}
      <div className="flex-grow-1 overflow-hidden">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {topico.destaque && (
            <span style={{ fontSize: "0.7rem" }} title="Fixado">
              📌
            </span>
          )}
          {topico.trancado && (
            <span style={{ fontSize: "0.7rem" }} title="Fechado">
              🔒
            </span>
          )}
          <Link
            to={`/forum/categorias/topicos/${topico._id}`}
            className="text-decoration-none text-body fw-medium text-truncate"
            style={{ fontSize: "0.9rem", maxWidth: "100%" }}
          >
            {topico.titulo}
          </Link>
        </div>
        <div
          className="text-muted d-flex gap-2 flex-wrap"
          style={{ fontSize: "0.73rem" }}
        >
          <span>
            por{" "}
            <Link
              to={`/perfil/${topico.autor?._id}`}
              className="text-decoration-none fw-medium text-secondary"
            >
              {topico.autor?.usuario}
            </Link>
          </span>
          <span>·</span>
          <span>{new Date(topico.createdAt).toLocaleDateString("pt-BR")}</span>
          {topico.tags?.map((tag) => (
            <Badge
              key={tag}
              bg="light"
              text="secondary"
              className="border fw-normal"
              style={{ fontSize: "0.68rem" }}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* curtidas */}
      <div
        className="text-center flex-shrink-0 d-none d-sm-block"
        style={{ width: 50 }}
      >
        <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
          {topico.curtidas}
        </div>
        <div className="text-muted" style={{ fontSize: "0.68rem" }}>
          curtidas
        </div>
      </div>

      {/* Respostas */}
      <div
        className="text-center flex-shrink-0 d-none d-md-block"
        style={{ width: 60 }}
      >
        <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
          {topico.postagensContador}
        </div>
        <div className="text-muted" style={{ fontSize: "0.68rem" }}>
          posts
        </div>
      </div>

      {/* visualizações */}
      <div
        className="text-center flex-shrink-0 d-none d-md-block"
        style={{ width: 60 }}
      >
        <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
          {topico.visualizacoes}
        </div>
        <div className="text-muted" style={{ fontSize: "0.68rem" }}>
          visualizações
        </div>
      </div>

      {/* Última atividade */}
      <div
        className="flex-shrink-0 text-end d-none d-lg-block"
        style={{ width: 120 }}
      >
        {topico.ultimaPostagemPor ? (
          <>
            <div className="text-muted" style={{ fontSize: "0.72rem" }}>
              {timeAgo(topico.ultimaPostagemPor)}
            </div>
            <div
              className="text-truncate fw-medium"
              style={{ fontSize: "0.72rem", maxWidth: 120 }}
            >
              {topico.ultimaPostagemPor.usuario}
            </div>
          </>
        ) : (
          <span className="text-muted" style={{ fontSize: "0.72rem" }}>
            {timeAgo(topico.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
