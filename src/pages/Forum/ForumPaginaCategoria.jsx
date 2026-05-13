import { useState, useEffect, useCallback, useContext} from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Form,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { listarTopicos } from "../../services/forumService";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import TopicoRow from "../../components/ForumComponentes/TopicoRow";
import "./Forum.css";

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

export default function ForumPaginaCategoria() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);


  const meta = CATEGORIA_META[categoria] || {
    label: categoria,
    icon: "💬",
    color: "#212529",
  };

  const [topicos, setTopicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sort, setSort] = useState("recente");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMITE = 30;

  const isDono = usuario?._id === topicos?.autor?._id;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listarTopicos(categoria,{
        sort,
        pagina,
        limit: LIMITE,
      });
      setTopicos(data.topicos);
      setTotalPaginas(data.totalPaginas);
      setTotal(data.total);
    } catch {
      setErro("Erro ao carregar tópicos.");
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
      <section className="forum-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Fórum", to: "/forum" },
              { label: meta.label },
            ]}
          />

          {/* Header da categoria */}
          <div className="forum-page-header">
            <div className="d-flex align-items-center gap-3">
              {/* Ícone da categoria */}
              <div
                className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                style={{
                  width: 52,
                  height: 52,
                  fontSize: "1.4rem",
                  background: meta.bg,
                }}
              >
                {meta.icon}
              </div>
              <div>
                <h1 className="forum-page-title mb-0">{meta.label}</h1>
                <p className="forum-page-subtitulo mb-0">
                  {total} tópico{total !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {usuario && (
              <Link
                to={`/forum/topicos/criar?categoria=${categoria}`}
                className="btn btn-sm btn-primary px-3"
              >
                + Novo tópico
              </Link>
            )}
          </div>

          {erro && (
            <Alert variant="danger" style={{ fontSize: "0.85rem" }}>
              {erro}
            </Alert>
          )}

          {/* ── Card de tópicos ── */}
          <div className="forum-topicos-card">
            {/* Toolbar */}
            <div className="forum-topicos-toolbar">
              <div className="d-flex align-items-center gap-3 flex-grow-1">
                <span style={{ minWidth: 200 }}>Tópico</span>
                <span
                  className="d-none d-sm-block ms-auto"
                  style={{ width: 60, textAlign: "center" }}
                >
                  Curtidas
                </span>
                <span
                  className="d-none d-md-block"
                  style={{ width: 60, textAlign: "center" }}
                >
                  Posts
                </span>
                <span
                  className="d-none d-md-block"
                  style={{ width: 70, textAlign: "center" }}
                >
                  Views
                </span>
                <span
                  className="d-none d-lg-block"
                  style={{ width: 120, textAlign: "right" }}
                >
                  Atividade
                </span>
              </div>

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
                <Spinner animation="border" size="sm" variant="secondary" />
              </div>
            ) : topicos.length === 0 ? (
              <div className="forum-vazio">
                <p>Nenhum tópico nesta categoria ainda.</p>
                {usuario && (
                  <Link
                    to={`/forum/topicos/criar?categoria=${categoria}`}
                    className="btn btn-sm btn-primary"
                  >
                    Criar o primeiro tópico
                  </Link>
                )}
              </div>
            ) : (
              topicos.map((t) => <TopicoRow key={t._id} topico={t} />)
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="forum-paginacao">
                <button
                  className="forum-paginacao-btn"
                  disabled={pagina === 1}
                  onClick={() => setPagina((p) => p - 1)}
                >
                  ‹ Anterior
                </button>
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--cor-texto-suave)",
                  }}
                >
                  Página {pagina} de {totalPaginas}
                </span>
                <button
                  className="forum-paginacao-btn"
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
