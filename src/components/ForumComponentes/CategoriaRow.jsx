import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";

// ── Metadados visuais de cada categoria ──────────
const CATEGORIA_META = {
  estrategia: {
    label: "Estratégia",
    icon: "♟",
    description: "Dicas, guias e análises de decks e jogadas",
    variant: "primary",
    color: "#0d6efd",
    bg: "#e7f1ff",
  },
  iniciante: {
    label: "Iniciante",
    icon: "🌱",
    description: "Dúvidas e boas-vindas para quem está começando",
    variant: "success",
    color: "#198754",
    bg: "#d1e7dd",
  },
  meta: {
    label: "Meta",
    icon: "📊",
    description: "Discussões sobre o meta-game e tendências competitivas",
    variant: "danger",
    color: "#dc3545",
    bg: "#f8d7da",
  },
  trocas: {
    label: "Trocas & Vendas",
    icon: "🔄",
    description: "Compra, venda e troca de cartas entre membros",
    variant: "warning",
    color: "#856404",
    bg: "#fff3cd",
  },
  regras: {
    label: "Regras",
    icon: "📖",
    description: "Tire dúvidas sobre regras e interações de cartas",
    variant: "info",
    color: "#055160",
    bg: "#cff4fc",
  },
  torneio: {
    label: "Torneios",
    icon: "🏆",
    description: "Resultados, organização e inscrições em campeonatos",
    variant: "secondary",
    color: "#495057",
    bg: "#e2e3e5",
  },
  geral: {
    label: "Geral",
    icon: "💬",
    description: "Assuntos variados sobre o universo dos card games",
    variant: "dark",
    color: "#212529",
    bg: "#d3d3d4",
  },
  batepapo: {
    label: "Bate-papo",
    icon: "☕",
    description: "Conversa livre — off-topic e comunidade",
    variant: "secondary",
    color: "#6f42c1",
    bg: "#e8daff",
  },
};

//calcula tempo passado pelas atividades do forum
function timeAgo(data) {
  if (!data) return "—";
  const diff = (Date.now() - new Date(data)) / 1000;
  if (diff < 60) return "agora mesmo";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d atrás`;
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function CategoriaRow({ stat }) {
  const meta = CATEGORIA_META[stat.categoria] || {};
  const last = stat.ultimoTopico;

  return (
    <div
      className="d-flex align-items-stretch border-bottom"
      style={{ minHeight: 72 }}
    >
      {/* Ícone + nome */}
      <div
        className="d-flex align-items-center gap-3 px-3 py-3 flex-shrink-0"
        style={{ width: 260 }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
          style={{
            width: 44,
            height: 44,
            background: meta.bg,
            fontSize: "1.35rem",
          }}
        >
          {meta.icon}
        </div>
        <div>
          <Link
            to={`/forum/categorias/${stat.categoria}/topicos`}
            className="fw-semibold text-decoration-none text-body"
            style={{ fontSize: "0.95rem" }}
          >
            {meta.label}
          </Link>
          <p
            className="mb-0 text-muted"
            style={{ fontSize: "0.75rem", lineHeight: 1.3 }}
          >
            {meta.description}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div
        className="d-flex align-items-center justify-content-center px-3 border-start border-end flex-shrink-0"
        style={{ width: 90, textAlign: "center" }}
      >
        <div>
          <div className="fw-semibold" style={{ fontSize: "1rem" }}>
            {stat.total}
          </div>
          <div className="text-muted" style={{ fontSize: "0.7rem" }}>
            tópicos
          </div>
        </div>
      </div>

      {/* Último tópico */}
      <div className="d-flex align-items-center px-3 py-2 flex-grow-1 overflow-hidden">
        {last ? (
          <div className="overflow-hidden w-100">
            <Link
              to={`/forum/categorias/topicos/${last._id}`}
              className="text-decoration-none text-body d-block text-truncate fw-medium"
              style={{ fontSize: "0.85rem" }}
            >
              {last.titulo}
            </Link>
            <div
              className="text-muted d-flex align-items-center gap-2 mt-1 flex-wrap"
              style={{ fontSize: "0.73rem" }}
            >
              <span>
                por{" "}
                <span className="fw-medium" style={{ color: meta.color }}>
                  {last.ultimaPostagemPor?.usuario || last.autor?.usuario}
                </span>
              </span>
              <span>·</span>
              <span>{timeAgo(last.ultimaPostagemEm || last.createdAt)}</span>
              {last.postagensContador > 0 && (
                <>
                  <span>·</span>
                  <span>💬 {last.postagensContador}</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <span className="text-muted" style={{ fontSize: "0.8rem" }}>
            Nenhum tópico ainda
          </span>
        )}
      </div>
    </div>
  );
}
