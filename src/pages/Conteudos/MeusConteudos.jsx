import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";

const opcoesTipo = [
  { value: "todos", label: "Todos os Conteúdos" },
  { value: "noticia", label: "Notícias" },
  { value: "artigo", label: "Artigos" },
  { value: "evento", label: "Eventos" },
  { value: "campeonato", label: "Campeonatos" },
];

export const MeusConteudos = () => {
  const [conteudos, setConteudos] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState(opcoesTipo[0]);
  const [modalShow, setModalShow] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);
  const navigate = useNavigate();

  const buscarConteudos = async () => {
    try {
      const token = localStorage.getItem("token");
      const filtro =
        tipoSelecionado.value === "todos"
          ? ""
          : `?tipo=${tipoSelecionado.value}`;
      const response = await axios.get(
        `https://illusoes-bootstrap.onrender.com/user/conteudos/${filtro}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConteudos(response.data);
    } catch (err) {
      console.error("Erro ao buscar conteúdos:", err);
    }
  };

  useEffect(() => {
    buscarConteudos();
  }, [tipoSelecionado]);

  const abrirModal = (conteudo) => {
    setConteudoSelecionado(conteudo);
    setModalShow(true);
  };

  const confirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");
      const tipo = conteudoSelecionado.tipo;
      const id = conteudoSelecionado._id;

      await axios.delete(
        `https://illusoes-bootstrap.onrender.com/user/conteudos/${tipo}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setModalShow(true);
      buscarConteudos();
    } catch (err) {
      console.error("Erro ao excluir conteúdo:", err);
    }
  };

  const irParaEdicao = () => {
    const tipo = conteudoSelecionado.tipo;
    const id = conteudoSelecionado._id;
    navigate(`/conteudos/${tipo}/${id}/editar`);
  };

  return (
    <LayoutGeral>
      <Container className="my-5">
                <Navegacao itens={[
                  {label: "Home", to: "/"},
                  {label: "Meu Perfil", to: "/dashboard"},
                  {label: "Meus Conteúdos",},
                ]}/>
        <h2 className="fw-bold mb-4">Meus Conteúdos</h2>

        <Form.Group className="mb-4" style={{ maxWidth: "300px" }}>
          <Form.Label>Filtrar por tipo</Form.Label>
          <CreatableSelect
            options={opcoesTipo}
            value={tipoSelecionado}
            onChange={setTipoSelecionado}
            isClearable={false}
          />
        </Form.Group>

        <Row xs={1} md={2} lg={3} className="g-4">
          {conteudos.map((item) => (
            <Col key={item._id}>
              <Card
                onClick={() => abrirModal(item)}
                style={{ cursor: "pointer" }}
              >
                {item.thumbs && (
                  <Card.Img
                    variant="top"
                    src={`https://illusoes-bootstrap.onrender.com${item.thumbs}`}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{item.titulo}</Card.Title>
                  <Card.Text>{item.subTitulo}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal de Ações */}
        <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Ações do Conteúdo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fw-bold">{conteudoSelecionado?.titulo}</p>
            <p>Deseja editar ou excluir este conteúdo?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmarExclusao}>
              Excluir
            </Button>
            <Button variant="primary" onClick={irParaEdicao}>
              Editar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </LayoutGeral>
  );
};
