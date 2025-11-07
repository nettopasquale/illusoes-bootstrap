import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Card,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ColecaoEdicao() {
  const { id } = useParams(); // ID da coleção a ser editada
  const navigate = useNavigate();

  // Estado da coleção
  const [collection, setCollection] = useState({
    name: "",
    description: "",
    tags: [],
    visibility: "public",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // MOCK - simula carregamento de dados
  useEffect(() => {
    // TODO: integrar com backend (GET /colecoes/:id)
    setTimeout(() => {
      setCollection({
        name: "Coleção Exemplo",
        description: "Essa é uma coleção de exemplo criada pelo usuário.",
        tags: ["Dragões", "Fogo", "Raro"],
        visibility: "private",
      });
      setLoading(false);
    }, 500);
  }, [id]);

  // Atualiza valores dos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCollection((prev) => ({ ...prev, [name]: value }));
  };

  // Atualiza tags (separadas por vírgula)
  const handleTagsChange = (e) => {
    setCollection((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  // Salvar alterações
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: integrar com backend (PUT /colecoes/:id)
    console.log("Coleção salva:", collection);
    navigate(`/colecoes/${id}`);
  };

  // Excluir coleção
  const handleDelete = () => {
    // TODO: integrar com backend (DELETE /colecoes/:id)
    console.log("Coleção excluída:", id);
    setShowDeleteModal(false);
    navigate("/colecoes");
  };

  if (loading) return <p className="text-center mt-4">Carregando coleção...</p>;

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
                { label: "Home", to: "/" },
                { label: "Minhas Coleções", to: "/colecoes" },
                { label: "Editar Coleção", to: "/colecoes/editar/:id" },
          ]}
        />

        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm p-4">
              <h2 className="mb-4 text-center">Editar Coleção</h2>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Coleção</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={collection.name}
                    onChange={handleChange}
                    placeholder="Digite o nome da coleção"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={collection.description}
                    onChange={handleChange}
                    placeholder="Escreva uma breve descrição"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (separadas por vírgula)</Form.Label>
                  <Form.Control
                    type="text"
                    value={collection.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="Ex: Dragões, Fogo, Lendário"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Visibilidade</Form.Label>
                  <Form.Select
                    name="visibility"
                    value={collection.visibility}
                    onChange={handleChange}
                  >
                    <option value="public">Pública</option>
                    <option value="private">Privada</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-between mt-4">
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Excluir Coleção
                  </Button>
                  <Button variant="primary" type="submit">
                    Salvar Alterações
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Modal de Confirmação de Exclusão */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Exclusão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Tem certeza de que deseja excluir esta coleção? Esta ação não pode
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
