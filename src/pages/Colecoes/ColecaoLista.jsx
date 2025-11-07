import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export default function ColecaoLista() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: integrar com backend (GET /collections)
    // Mock temporário
    setTimeout(() => {
      setCollections([
        {
          id: "1",
          title: "Coleção de Dragões",
          description: "Uma seleção das cartas de dragões mais raras.",
          cardsCount: 42,
          cover:
            "https://images.unsplash.com/photo-1618073190506-bfd9c39f0d2d?w=600",
        },
        {
          id: "2",
          title: "Coleção Feras do Norte",
          description:
            "Cartas inspiradas nas lendas das terras geladas do norte.",
          cardsCount: 28,
          cover:
            "https://images.unsplash.com/photo-1590080875832-13c3f2c4a8e0?w=600",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateCollection = () => {
    navigate("/colecoes/criar");
  };

  const handleViewCollection = (id) => {
    navigate(`/colecoes/${id}`);
  };

  const handleEditCollection = (id) => {
    navigate(`/colecoes/${id}/editar`);
  };

  if (loading) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas as Coleções", to: "/colecoes" },
            ]}
          />
          <p className="mt-3">Carregando suas coleções...</p>
        </Container>
      </LayoutGeral>
    );
  }

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Todas as Coleções", to: "/colecoes" },
          ]}
        />
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="fw-bold">Minhas Coleções</h3>
            <p className="text-muted mb-0">
              Gerencie suas coleções personalizadas de cartas.
            </p>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleCreateCollection}>
              <PlusCircle className="me-2" size={18} />
              Nova Coleção
            </Button>
          </Col>
        </Row>

        {collections.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>Você ainda não possui coleções criadas.</p>
            <Button onClick={handleCreateCollection} variant="outline-primary">
              Criar minha primeira coleção
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {collections.map((col) => (
              <Col key={col.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={col.cover}
                    alt={col.title}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-semibold">{col.title}</Card.Title>
                    <Card.Text className="text-muted small">
                      {col.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        {col.cardsCount} cartas
                      </small>
                      <div>
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          className="me-2"
                          onClick={() => handleEditCollection(col.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleViewCollection(col.id)}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </LayoutGeral>
  );
}
