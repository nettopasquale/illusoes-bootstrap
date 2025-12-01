import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
//MOCKUP TEMPORÁRIO - substituir futuramente por: GET IMAGENS
import agido from "../../assets/imgs/Yugioh/agido.jpg";

export default function ColecaoLista() {
  const [colecoes, setColecoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: integrar com backend (GET /colecoes)
    // Mock temporário
    setTimeout(() => {
      setColecoes([
        {
          _id: "c1",
          nome: "Coleção Raras 2025",
          descricao: "Cartas raras coletadas nos últimos campeonatos.",
          cartas: ["", false],
          totalCartas: 52,
          dono: "Pasquale",
          capa: agido,
          dataCriacao: "2025-10-22",
        },
        {
          _id: "c2",
          nome: "Decks Estratégicos",
          descricao: "Cartas com alta sinergia para decks de controle.",
          cartas: ["", false],
          totalCartas: 37,
          dono: "Pasquale",
          capa: agido,
          dataCriacao: "2025-09-15",
        },
        {
          _id: "c3",
          nome: "Coleção Elementais",
          descricao:
            "Coleção temática de cartas baseadas em elementos mágicos.",
          cartas: ["", false],
          totalCartas: 64,
          dono: "Pasquale",
          capa: agido,
          dataCriacao: "2025-07-10",
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

        {colecoes.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>Você ainda não possui coleções criadas.</p>
            <Button onClick={handleCreateCollection} variant="outline-primary">
              Criar minha primeira coleção
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {colecoes.map((col) => (
              <Col key={col.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={col.capa}
                    alt={col.nome}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-semibold">{col.nome}</Card.Title>
                    <Card.Text className="text-muted small">
                      {col.descricao}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        {col.totalCartas} cartas
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
