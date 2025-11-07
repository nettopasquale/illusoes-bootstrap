import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useForum from "../../hooks/useForum";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ForumTopicoCard from "../../components/ForumComponentes/ForumTopicoCard";

export default function ForumLista() {
  const navigate = useNavigate();
  const { categorias, carregarCategorias, loading } = useForum();

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleCategoriaClick = (id) => {
    navigate(`/forum/categoria/${id}`);
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <h2 className="mb-4 text-center fw-bold">Fórum</h2>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Row className="g-4">
              {categorias.length > 0 ? (
                categorias.map((cat) => (
                  <Col key={cat._id} md={6} lg={4}>
                    <ForumTopicoCard
                      title={cat.nome}
                      description={cat.descricao}
                      onClick={() => handleCategoriaClick(cat._id)}
                    />
                  </Col>
                ))
              ) : (
                <Col>
                  <Card className="p-3 text-center">
                    <Card.Body>
                      <Card.Text>Nenhuma categoria encontrada.</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
