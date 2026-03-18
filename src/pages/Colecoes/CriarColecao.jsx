import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { PlusCircle, ArrowLeft, Collection } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { cloudinaryUpload } from "../../utils/cloudinaryUpload";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CriarColecao() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [capa, setCapa] = useState("");
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

//salva a imagem na variavel capa
//envia a imagem para o cloudinary
  const handleCapa = async (e) => {
    const file = e.target.files[0];
    console.log("a imagem:", file);

    if (!file) return;
    setUploadingCapa(true);

    try {
      const url = await cloudinaryUpload(file, "capa");
      console.log("URL da capa: ", url);

      setCapa(url);
    } catch (error) {
      console.error("Erro ao subir capa: ", error);
    } finally {
      setUploadingCapa(false);
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert("O nome da coleção é obrigatório.");
      return;
    }

    if (!capa) {
      alert("Aguarde o upload da capa terminar!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const payload = {
        nome,
        descricao,
        capa,
      };

      const resultado = await axios.post(
        `http://localhost:8080/colecoes`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("coleção enviada: ", payload);

      setMensagem(`Coleção criada com sucesso! ${resultado.data}`);
      setErro(null);
      setTimeout(() => navigate("/colecoes"), 2000);
    } catch (error) {
      console.error("Erro ao publicar a coleção: ", error);
    }
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Meu Perfil", to: "/dashboard" },
                { label: "Criar Colecao" },
              ]}
            />
            <h2 className="mb-4 fs-1 fw-bold">Criar Coleção</h2>
            {mensagem && <Alert variant="success">{mensagem}</Alert>}
            {erro && <Alert variant="danger">{erro}</Alert>}
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" />
                Criar Nova Coleção
              </h3>
            </Col>
            <Col className="text-end">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/colecoes")}
              >
                <ArrowLeft className="me-1" /> Voltar
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 rounded-3 p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Coleção</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Coleção Raras 2025"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descricao"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva brevemente sua coleção..."
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

              <div className="text-end">
                <Button variant="primary" type="submit">
                  <PlusCircle className="me-1" />
                  Criar Coleção
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </section>
    </LayoutGeral>
  );
}
