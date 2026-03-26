import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Card,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import axios from "axios";

export default function ColecaoEdicao() {
  const { id } = useParams(); // ID da coleção a ser editada
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarColecao = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/colecoes/${id}`,
        );
        const dados = response.data;

        setNome(dados.titulo);
        setDescricao(dados.subTitulo);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar a coleção para edição");
      }
    };

    carregarColecao();
  }, [id]);

  // Atualiza capa
  const handleCapa = (e) =>{
    setCapa(e.target.files)
  }

  // Salvar alterações
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: integrar com backend (PUT /colecoes/:id)
    try {
      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("descricao", descricao);
      formData.append("capa", capa);

      setMensagem(`Alterações realizadas com sucesso!`);
      setErro("");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {}
    console.log("Coleção salva:", colecao);
    setErro("Erro ao editar coleção. Tente novamente.");
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
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm p-4">
              <h2 className="mb-4 text-center">Editar Coleção</h2>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Coleção</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome da coleção"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="descricao"
                    value={descricao}
                    onChange={(e)=>(setDescricao(e.target.value))}
                    placeholder="Escreva uma breve descrição"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Capa da coleção</Form.Label>
                  <Form.Control
                    name="capa"
                    type="file"
                    accept="image/"
                    className="w-100"
                    rows={3}
                    onChange={handleCapa}
                    placeholder="Coloque uma capa para sua coleção"
                    />
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
