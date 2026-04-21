import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { AuthContext } from "../../context/AuthContext";
import { listarCategorias } from "../../services/forumService";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import CategoriaRow from "../../components/ForumComponentes/CategoriaRow";

export default function ForumHome(){
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //lista categorias existentes
  useEffect(() => {
    listarCategorias()
      .then(({ data }) => setStats(data))
      .catch(() => setError("Erro ao carregar categorias."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Carregando fórum...</p>
      </Container>
    );

    return (
      <LayoutGeral>
        <section id="artigo" className="block artigo-block">
          <Container fluid="lg" className="py-4">
            <Row className="justify-content-center">
              <Navegacao
                itens={[
                  { label: "Home", to: "/" },
                  { label: "Forum", to: `/forum` },
                ]}
              />
            </Row>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                <h1 className="h4 mb-0 fw-bold">Fórum</h1>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Discussões, dúvidas e comunidade
                </p>
              </div>
              <Link
                to="/forum/topicos/criar"
                className="btn btn-primary btn-sm px-3"
              >
                + Novo tópico
              </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Tabela de categorias */}
            <div className="card border rounded-3 overflow-hidden mb-4">
              {/* Cabeçalho da tabela */}
              <div
                className="d-flex align-items-center border-bottom px-3 py-2"
                style={{
                  background: "#f8f9fa",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <div style={{ width: 260 }}>Categoria</div>
                <div style={{ width: 90, textAlign: "center" }}>Tópicos</div>
                <div className="flex-grow-1 ps-3">Última atividade</div>
              </div>

              {stats.map((stat) => (
                <CategoriaRow key={stat.categoria} stat={stat} />
              ))}
            </div>

            {/* Links rápidos */}
            <Row className="g-3">
              <Col sm={6} md={4}>
                <Link
                  to="/forum/bookmarks"
                  className="d-flex align-items-center gap-3 p-3 card border text-decoration-none text-body rounded-3 h-100"
                >
                  <span style={{ fontSize: "1.5rem" }}>🔖</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      Meus Bookmarks
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                      Tópicos e posts salvos
                    </div>
                  </div>
                </Link>
              </Col>
              <Col sm={6} md={4}>
                <Link
                  to="/forum?sort=curtidas"
                  className="d-flex align-items-center gap-3 p-3 card border text-decoration-none text-body rounded-3 h-100"
                >
                  <span style={{ fontSize: "1.5rem" }}>🔥</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      Em alta
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                      Tópicos mais curtidos
                    </div>
                  </div>
                </Link>
              </Col>
              <Col sm={6} md={4}>
                <Link
                  to="/forum?sort=recente"
                  className="d-flex align-items-center gap-3 p-3 card border text-decoration-none text-body rounded-3 h-100"
                >
                  <span style={{ fontSize: "1.5rem" }}>🕐</span>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                      Recentes
                    </div>
                    <div className="text-muted" style={{ fontSize: "0.76rem" }}>
                      Última atividade
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      </LayoutGeral>
    );
};