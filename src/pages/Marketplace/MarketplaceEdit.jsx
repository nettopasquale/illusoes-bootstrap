import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import useMarketplace from "../../hooks/useMarketplace";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function MarketplaceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getItemById, updateListing, deleteListing} = useMarketplace(); //

  const [form, setForm] = useState({
    title: "",
    price: "",
    currency: "BRL",
    condition: "",
    location: "",
    description: "",
    images: [],
    ownerId: null, // usado para comparar com o usuário logado
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock de usuário logado (trocar para seu auth real)
  const loggedUserId = "user123";
  // TODO: Integrar com contexto real de autenticação
  // const { user } = useAuth();
  // const loggedUserId = user?.id;

  // Carrega dados do item
  useEffect(() => {
    const load = async () => {
      const data = await getItemById(id); // mock
      setForm({
        title: data.title,
        price: data.price,
        currency: data.currency,
        condition: data.condition,
        location: data.location,
        description: data.description,
        images: data.images,
        ownerId: data.sellerId || "user123", // mock
      });
      setLoading(false);
    };
    load();
  }, [id]);

  // Bloqueia acesso caso usuário não seja o dono
  if (!loading && form.ownerId !== loggedUserId) {
    return (
      <Container className="text-center mt-5">
        <h5>Você não tem permissão para editar este anúncio.</h5>
        <Button className="mt-3" onClick={() => navigate("/marketplace")}>
          Voltar ao Marketplace
        </Button>
      </Container>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((f) => URL.createObjectURL(f)); // mock
    setForm((f) => ({ ...f, images: [...f.images, ...images] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
    };

    // TODO: substituir por PUT /api/marketplace/:id
    await updateListing(id, payload);

    navigate(`/marketplace/${id}`);
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);

    // TODO: DELETE /api/marketplace/:id
    await deleteListing(id);

    navigate("/marketplace");
  };

  if (loading) {
    return (
      <LayoutGeral>
        <Container className="text-center mt-5">
          <Spinner animation="border" />
          <p className="mt-3">Carregando anúncio para edição...</p>
        </Container>
      </LayoutGeral>
    );
  }

  return (
    <LayoutGeral>
      <Container className="my-5">
        <Row className="mb-3">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Marketplace", to: "/marketplace" },
              { label: "Marketplace Editar", to: "/marketplace/editar" },
            ]}
          />
          <Col>
            <Button variant="outline-secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Card className="p-3 shadow-sm">
              <h4 className="fw-bold mb-3">Editar anúncio</h4>

              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
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
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Condição</Form.Label>
                      <Form.Select
                        name="condition"
                        value={form.condition}
                        onChange={handleChange}
                      >
                        <option>Novo</option>
                        <option>Usado</option>
                        <option>Usado - Bom</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

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

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Excluir anúncio
                  </Button>

                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Modal de confirmação */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmar exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir este anúncio? Esta ação não pode
            ser desfeita.
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Excluir
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </LayoutGeral>
  );
}
