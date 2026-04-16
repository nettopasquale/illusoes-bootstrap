import { useState, useEffect, useCallback, useContext} from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Badge,
  Breadcrumb,
  Form,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { listarTopicos } from "../../services/forumService";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

const CATEGORIA_META = {
  estrategia: { label: "Estratégia", icon: "♟", color: "#0d6efd" },
  iniciante: { label: "Iniciante", icon: "🌱", color: "#198754" },
  meta: { label: "Meta", icon: "📊", color: "#dc3545" },
  trocas: { label: "Trocas & Vendas", icon: "🔄", color: "#856404" },
  regras: { label: "Regras", icon: "📖", color: "#055160" },
  torneio: { label: "Torneios", icon: "🏆", color: "#495057" },
  geral: { label: "Geral", icon: "💬", color: "#212529" },
  batepapo: { label: "Bate-papo", icon: "☕", color: "#6f42c1" },
};

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

function TopicoRow({ topico }) {
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


export default function ForumPaginaCategoria() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  console.log("Categoria: ", categoria)

  const meta = CATEGORIA_META[categoria] || {
    label: categoria,
    icon: "💬",
    color: "#212529",
  };

  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("recente");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
    const LIMITE = 30;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listarTopicos({
        categoria,
        sort,
        pagina,
        limit: LIMITE,
      });
      setTopicos(data.topicos);
      setTotalPaginas(data.totalPaginas);
      setTotal(data.total);
    } catch {
      setError("Erro ao carregar tópicos.");
      toast.error("Erro ao carregar tópicos")
    } finally {
      setLoading(false);
    }
  }, [categoria, sort, pagina]);

  //
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPagina(1);
  }, [categoria, sort]);

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container fluid="lg" className="py-4">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Forum", to: `/forum` },
                { label: "Categorias", to: `/forum/categorias` },
              ]}
            />
          </Row>

          {/* Header da categoria */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  fontSize: "1.5rem",
                  background: meta.bg || "#f0f0f0",
                }}
              >
                {meta.icon}
              </div>
              <div>
                <h1 className="h4 fw-bold mb-0">{meta.label}</h1>
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                  {total} tópico{total !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <Link
              to={`/forum/topicos/criar?categoria=${categoria}`}
              className="btn btn-primary btn-sm px-3"
            >
              + Novo tópico
            </Link>
          </div>

          {/* Controles */}
          <div className="card border rounded-3 overflow-hidden">
            {/* Toolbar */}
            <div
              className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom gap-2 flex-wrap"
              style={{ background: "#f8f9fa" }}
            >
              {/* Cabeçalhos */}
              <div
                className="d-flex align-items-center gap-2 flex-grow-1"
                style={{
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <div style={{ minWidth: 200 }}>Tópico</div>
                <div
                  className="ms-auto d-none d-sm-block"
                  style={{ width: 50, textAlign: "center" }}
                >
                  Curtidas
                </div>
                <div
                  className="d-none d-md-block"
                  style={{ width: 60, textAlign: "center" }}
                >
                  Posts
                </div>
                <div
                  className="d-none d-md-block"
                  style={{ width: 60, textAlign: "center" }}
                >
                  Visualizações
                </div>
                <div
                  className="d-none d-lg-block"
                  style={{ width: 120, textAlign: "right" }}
                >
                  Atividade
                </div>
              </div>

              {/* Ordenação */}
              <Form.Select
                size="sm"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ width: "auto", fontSize: "0.78rem" }}
              >
                <option value="recente">Mais recentes</option>
                <option value="curtidas">Mais curtidos</option>
                <option value="postagens">Mais postagens</option>
              </Form.Select>
            </div>

            {/* Lista */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" size="sm" />
              </div>
            ) : error ? (
              <div className="alert alert-danger m-3">{error}</div>
            ) : topicos.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="mb-2">Nenhum tópico nesta categoria ainda.</p>
                <Link
                  to={`/forum/topicos/criar?categoria=${categoria}`}
                  className="btn btn-sm btn-primary"
                >
                  Criar o primeiro tópico
                </Link>
              </div>
            ) : (
              topicos.map((t) => <TopicoRow key={t._id} topico={t} />)
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 py-3 border-top">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => p - 1)}
                >
                  ‹ Anterior
                </button>
                <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  disabled={pagina === totalPaginas}
                  onClick={() => setPagina((p) => p + 1)}
                >
                  Próxima ›
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </LayoutGeral>
  );
}
