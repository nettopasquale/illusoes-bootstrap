import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import useMarketplace from "../../hooks/useMarketplace";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import MarketplaceCard from "../../components/MarketplaceComponentes/MarketplaceCard";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import flareon  from "../../assets/imgs/Pokemon/flareon_tcg.jpg";
import knight  from "../../assets/imgs/Digimon/1BT2-020__sasasi_jpg.jpg";

export default function MarketplaceHome() {
  const navigate = useNavigate();
  const { items, loading, loadItems } = useMarketplace();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tipo, setTipo] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  const handleView = (id) => {
    navigate(`/marketplace/anuncios/:tipo/${id}`);
  };

  const handleCreate = () => {
    navigate("/marketplace/anunciar");
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-3 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Marketplace", to: "/marketplace/anuncios" },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary">Marketplace</h3>
              <p className="text-muted mb-0">
                Compre, venda e troque cartas e decks.
              </p>
            </Col>
            <Col xs="auto">
              <Button variant="primary" onClick={handleCreate}>
                Anunciar
              </Button>
            </Col>
          </Row>

          <Row className="mb-3 g-2">
            <Col md={6} lg={4}>
              <Form.Control
                placeholder="Pesquisar por título ou vendedor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={4} lg={3}>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Todas categorias</option>
                <option value="decks">Decks</option>
                <option value="cartas">Cartas</option>
                <option value="acessorios">Acessórios</option>
              </Form.Select>
            </Col>
            <Col md={4} lg={3}>
              <Form.Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="">Todas os tipos</option>
                <option value="venda">Venda</option>
                <option value="troca">Troca</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {items.map((it) => (
                <Col key={it.id}>
                  <MarketplaceCard item={it} onView={handleView} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
