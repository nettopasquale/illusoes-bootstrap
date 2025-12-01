import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Carousel,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useMarketplace from "../../hooks/useMarketplace";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import flareon  from "../../assets/imgs/Pokemon/flareon_tcg.jpg";

export default function MarketplaceItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, loading } = useMarketplace();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getItemById(id); // mock
      setItem(data);
    };
    load();
  }, [id]);

  if (loading || !item) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-3">Carregando anúncio...</p>
      </Container>
    );
  }

  const handleContact = () => {
    // TODO: abrir modal de contato ou enviar mensagem ao vendedor
    alert("Funcionalidade de contato mockada. Substituir por integração real.");
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-3">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Marketplace", to: "/marketplace/anuncios" },
                { label: "Marketplace item", to: "/marketplace/anuncios/:tipo/:id" },
              ]}
            />
            <Col>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/marketplace/anuncios")}
              >
                Voltar
              </Button>
            </Col>
          </Row>

          <Row>
            <Col md={7}>
              <Card className="shadow-sm border-0">
                <Carousel>
                  {item.imagem?.map((idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        className="d-block w-100"
                        src={item.capa}
                        alt={`${item.titulo} ${idx}`}
                        style={{ objectFit: "cover", height: 420 }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <Card.Body>
                  <h4 className="fw-bold">
                    {item.titulo} <Badge bg="secondary">{item.condicao}</Badge>
                  </h4>
                  <p className="text-muted small">
                    Anunciado em{" "}
                    {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p>{item.descricao}</p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>
              <Card className="shadow-sm border-0 p-3">
                <h5 className="fw-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.preco)}
                </h5>
                <p className="text-muted small mb-3">
                  Vendedor: <strong>{item.vendedor}</strong>
                </p>
                <p className="text-muted small mb-3">Local: {item.localizacao}</p>

                <Button
                  variant="primary"
                  className="w-100 mb-2"
                  onClick={handleContact}
                >
                  Contactar vendedor
                </Button>
                <Button
                  variant="outline-secondary"
                  className="w-100"
                  onClick={() => alert("Favoritar (mock) - implementar")}
                >
                  Favoritar
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
