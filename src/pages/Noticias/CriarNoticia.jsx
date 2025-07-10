import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Navegacao } from "../../components/Navegacao/Navegacao";

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
        <Navegacao itens={[
          {label: "Home", to: "/"},
          {label: "Meu Perfil", to: "/dashboard"},
          {label: "Publicar",},
        ]}/>
        <h2 className="mb-4 fs-1 fw-bold">Publicar Notícia ou Artigo</h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Título
                </Form.Label>
                <Form.Control
                  type="text"
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Subtítulo
                </Form.Label>
                <Form.Control
                  type="text"
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
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
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Tipo
                </Form.Label>
                <CreatableSelect
                  options={tipoOptions}
                  onChange={setTipo}
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
                  value={tipo}
                  placeholder="Escolha o tipo"
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Tags
                </Form.Label>
                <CreatableSelect
                  isMulti
                  onChange={setTags}
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
                  value={tags}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4 px-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
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
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Conteúdo
            </Form.Label>
            <ReactQuill
              value={conteudo}
              onChange={setConteudo}
              style={{
                height: "300px",
                fontSize: "1.1rem",
                marginBottom: "2rem",
              }}
              theme="snow"
              placeholder="Escreva seu conteúdo aqui..."
            />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4 gap-5">
            <Button
              className="p-5 fw-bold fs-3 bg-black w-50"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancelar
            </Button>
            <Button className="p-5 fw-bold fs-3 bg-black w-50" type="submit">
              Publicar
            </Button>
          </div>
        </Form>
      </Container>
    </LayoutGeral>
  );
};
