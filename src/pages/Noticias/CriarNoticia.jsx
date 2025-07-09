import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

const tipoOptions = [
  { value: "noticia", label: "Notícia" },
  { value: "artigo", label: "Artigo" },
];

export const CriarNoticia = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [subTitulo, setSubTitulo] = useState("");
  const [tipo, setTipo] = useState(null);
  const [tags, setTags] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const handleImagem = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo) return setErro("Escolha um tipo de conteúdo");
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("subTitulo", subTitulo);
      formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
      formData.append("imagem", imagem);
      formData.append("conteudo", conteudo);

      console.log(formData);

      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:8080/noticias/${tipo.value}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem(`Publicação realizada com sucesso!`);
      setErro(null);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao publicar conteúdo");
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <h2 className="mb-4 fw-bold">Publicar Notícia ou Artigo</h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-5 fw-bold">Título</Form.Label>
                <Form.Control
                  type="text"
                  size="lg"
                  style={{ width: "200px", fontSize: "1.2rem" }}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-5 fw-bold">Subtítulo</Form.Label>
                <Form.Control
                  type="text"
                  size="lg"
                  style={{ width: "200px", fontSize: "1.2rem" }}
                  value={subTitulo}
                  onChange={(e) => setSubTitulo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-5 fw-bold">Tipo</Form.Label>
                <CreatableSelect
                  options={tipoOptions}
                  onChange={setTipo}
                  size="lg"
                  style={{ width: "250px" }}
                  value={tipo}
                  placeholder="Escolha o tipo"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-5 fw-bold">Tags</Form.Label>
                <CreatableSelect
                  isMulti
                  onChange={setTags}
                  size="lg"
                  style={{ width: "250px", fontSize: "1.2rem" }}
                  value={tags}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 py-5">
            <Form.Label className="fs-5 fw-bold">
              Imagem da Thumbnail
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              style={{ height: "30px" }}
              onChange={handleImagem}
            />
          </Form.Group>

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-5 fw-bold">Conteúdo</Form.Label>
            <ReactQuill
              value={conteudo}
              onChange={setConteudo}
              style={{ height: "300px", fontSize: "1.1rem", marginBottom: "2rem" }}
              theme="snow"
              placeholder="Escreva seu conteúdo aqui..."
            />
          </Form.Group>

          <Button
            className="p-5 fw-bold fs-5 bg-black"
            type="submit"
          >
            Publicar
          </Button>
        </Form>
      </Container>
    </LayoutGeral>
  );
};
