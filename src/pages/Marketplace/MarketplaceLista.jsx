import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
//MOCKUP TEMPORÁRIO - substituir futuramente por: GET IMAGENS
import knight from "../../assets/imgs/Digimon/1BT2-020__sasasi_jpg.jpg";
import flareon from "../../assets/imgs/Pokemon/flareon_tcg.jpg";
import bloodRoseDragon from "../../assets/imgs/Yugioh/blood_rose_dragon.jpg"

export default function MarketplaceLista() {
  const [anuncios, setAnuncios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: integrar com backend (GET /colecoes)
    // Mock temporário
    setTimeout(() => {
      setAnuncios([
        {
          id: "m1",
          titulo: "Deck Starter - 60 cartas (bom estado)",
          preco: 120.0,
          frete: 0.0,
          tipo: "venda",
          categoria: "deck",
          vendedor: "Usuário X",
          localizacao: "São Paulo, SP",
          capa: knight,
          condicao: "Usado",
          descricao: "Deck completo de início com cartas sinérgicas.",
          imagem: [""],
          createdAt: "2025-10-01T12:00:00Z",
        },
        {
          id: "m2",
          titulo: "Carta rara - Dragão de Fogo Supremo",
          preco: 350.0,
          frete: 0.0,
          tipo: "venda",
          categoria: "deck",
          vendedor: "user999",
          localizacao: "Rio de Janeiro, RJ",
          capa: bloodRoseDragon,
          condicao: "Novo",
          descricao: "Carta rara em perfeito estado, com proteção.",
          imagem: [""],
          createdAt: "2025-11-02T09:10:00Z",
        },
        {
          id: "m3",
          titulo: "Carta rara - Flareon Fogo Supremo",
          preco: 350,
          frete: 0.0,
          tipo: "venda",
          categoria: "deck",
          vendedor: "Pasquale",
          localizacao: "São Paulo, SP",
          capa: flareon,
          condicao: "Novo",
          imagem: [""],
          descricao:
            "Carta rara em perfeito estado. Inclui sleeve premium. Envio por PAC/SEDEX.",
          createdAt: "2025-11-02T09:10:00Z",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleCriarAnuncio = () => {
    navigate("/marketplace/anunciar");
  };

  const handleVerAnuncio = (id) => {
    navigate(`/marketplace/anuncios/:tipo/${id}`);
  };

  const handleEditarAnuncio = (id) => {
    navigate(`/marketplace/anuncios/:tipo/${id}/editar`);
  };

  if (loading) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas os Anuncios", to: "/marketplace/anuncios" },
            ]}
          />
          <p className="mt-3">Carregando seus anúncios...</p>
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
            { label: "Todas os Anuncios", to: "/marketplace/anuncios" },
          ]}
        />
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="fw-bold">Meus Anúncios</h3>
            <p className="text-muted mb-0">Gerencie seus anúncios.</p>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={handleCriarAnuncio}>
              <PlusCircle className="me-2" size={18} />
              Novo Anúncio
            </Button>
          </Col>
        </Row>

        {anuncios.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>Você ainda não possui anúncios criados.</p>
            <Button onClick={handleCreateCollection} variant="outline-primary">
              Criar meu primeiro anúncio
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {anuncios.map((col) => (
              <Col key={col.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={col.capa}
                    alt={col.titulo}
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
                          onClick={() => handleEditarAnuncio(col.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleVerAnuncio(col.id)}
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
