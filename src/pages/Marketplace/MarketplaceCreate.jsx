// src/pages/Marketplace/MarketplaceCreate.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useMarketplace from "../../hooks/useMarketplace";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function MarketplaceCreate() {
  const navigate = useNavigate();
  const { createListing } = useMarketplace();

  const [form, setForm] = useState({
    title: "",
    price: "",
    currency: "BRL",
    condition: "Usado",
    location: "",
    description: "",
    images: [],
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    // Nesta versão mock, usamos URLs locais via URL.createObjectURL
    const images = files.map((f) => URL.createObjectURL(f));
    setForm((p) => ({ ...p, images: [...p.images, ...images] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: integrar upload de imagens e POST /api/marketplace
    const payload = { ...form, price: parseFloat(form.price) };
    await createListing(payload);
    setSaving(false);
    navigate("/marketplace");
  };

  return (
    <LayoutGeral>
      <Container className="my-5">
        <Row className="mb-3">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Marketplace", to: "/marketplace" },
              { label: "Marketplace Criar", to: "/marketplace/criar" },
            ]}
          />
          <Col>
            <h3 className="fw-bold text-primary">Criar anúncio</h3>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="p-3 shadow-sm">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preço (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Local</Form.Label>
                  <Form.Control
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={6}
                    value={form.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagens</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFile}
                  />
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {form.images.map((src, idx) => (
                      <Image
                        key={idx}
                        src={src}
                        thumbnail
                        style={{ width: 100, height: 70, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/marketplace")}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? "Anunciando..." : "Publicar anúncio"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </LayoutGeral>
  );
}
