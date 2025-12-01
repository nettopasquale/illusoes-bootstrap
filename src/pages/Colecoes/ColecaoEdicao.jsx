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
//MOCKUP TEMPORÁRIO - substituir futuramente por: GET IMAGENS
import agido from "../../assets/imgs/Yugioh/agido.jpg";
import darkMagicianFanGirl from "../../assets/imgs/Yugioh/dark magician fan girl.jpg";

export default function ColecaoEdicao() {
  const { id } = useParams(); // ID da coleção a ser editada
  const navigate = useNavigate();

  // Estado da coleção
  const [colecao, setColecao] = useState({
    nome: "",
    descricao: "",
    tags: [],
    capa: agido,
    visibilidade: "public",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todasCartas, setTodasCartas] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  // MOCK - simula carregamento de dados
  useEffect(() => {
    // TODO: integrar com backend (GET /colecoes/:id)
    setTimeout(() => {
      setColecao({
        nome: "Coleção Exemplo",
        descricao: "Essa é uma coleção de exemplo criada pelo usuário.",
        tags: ["Dragões", "Fogo", "Raro"],
        capa: agido,
        cartasSelecionadas: ["c1", "c3"],
        visibilidade: "private",
      });

      setTodasCartas([
        { _id: "c1", nome: "Dragão de Fogo Supremo", img: darkMagicianFanGirl },
        { _id: "c2", nome: "Feiticeiro das Sombras", img: darkMagicianFanGirl },
        { _id: "c3", nome: "Guardião Elemental", img: darkMagicianFanGirl },
        { _id: "c4", nome: "Arqueiro Élfico", img: darkMagicianFanGirl },
        { _id: "c5", nome: "Golpe Tempestuoso", img: darkMagicianFanGirl },
      ]);
      setLoading(false);
    }, 500);
  }, [id]);

  // Atualiza valores dos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setColecao((prev) => ({ ...prev, [name]: value }));
  };

  // Atualiza tags (separadas por vírgula)
  const handleTagsChange = (e) => {
    setColecao((prev) => ({
      ...prev,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  // Salvar alterações
  const handleSave = (e) => {
    e.preventDefault();
    // TODO: integrar com backend (PUT /colecoes/:id)
    try {
      const formData = new FormData();
      formData.append("nome", colecao.nome);
      formData.append("descricao", colecao.descricao);
      formData.append("tags", JSON.stringify(colecao.tags));
      formData.append("visibilidade", colecao.visibilidade);
      formData.append("capa", colecao.capa);

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
                    value={colecao.nome}
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
                    name="descricao"
                    value={colecao.descricao}
                    onChange={handleChange}
                    placeholder="Escreva uma breve descrição"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tags (separadas por vírgula)</Form.Label>
                  <Form.Control
                    type="text"
                    value={colecao.tags.join(", ")}
                    name="tags"
                    onChange={handleTagsChange}
                    placeholder="Ex: Dragões, Fogo, Lendário"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Selecione as cartas</Form.Label>
                  <Row xs={1} md={2} lg={3} className="g-4 text-center">
                    {todasCartas.map((carta) => (
                      <Row
                        key={carta._id}
                        className={`row align-items-start ${
                          colecao.cartasSelecionadas.includes(carta._id)
                            ? "selecionada"
                            : ""
                        }`}
                        onClick={() => handleToggleCarta(carta._id)}
                      >
                        <Col className="col">
                          <img
                            src={carta.img}
                            alt={carta.nome}
                            style={{
                              width: "150px",
                              height: "140px",
                              objectFit: "cover",
                            }}
                          />
                          <div>{carta.nome}</div>
                        </Col>
                        <Col className="col">
                          <img
                            src={carta.img}
                            alt={carta.nome}
                            style={{
                              width: "150px",
                              height: "140px",
                              objectFit: "cover",
                            }}
                          />
                          <div>{carta.nome}</div>
                        </Col>
                      </Row>
                    ))}
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Visibilidade</Form.Label>
                  <Form.Select
                    name="visibilidade"
                    value={colecao.visibilidade}
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
