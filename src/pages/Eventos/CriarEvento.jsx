import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import { Navegacao } from "../../components/Navegacao/Navegacao";

const tipoOptions = [
  { value: "evento", label: "Evento" },
  { value: "campeonato", label: "Campeonato" },
];

export const CriarEvento = () => {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [subTitulo, setSubTitulo] = useState("");
  const [tipo, setTipo] = useState(null);
  const [tags, setTags] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [dataEvento, setDataEvento] = useState(null);
  const [valorEntrada, setValorEntrada] = useState("");

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
      formData.append("dataEvento", dataEvento);

      //transformar String em Number
      const valorLimpo = valorEntrada
        .replace("R$", "")
        .trim()
        .replace(",", ".");
      const valorNumerico = parseFloat(valorLimpo);

      // depois no formData:
      formData.append("valorEntrada", isNaN(valorNumerico) ? 0 : valorNumerico);
      const token = localStorage.getItem("token");

      const result = await axios.post(
        `http://localhost:8080/eventos/${tipo.value}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem(`Publicação realizada com sucesso! ${result.data}`);
      setErro(null);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      console.log(`Erro: ${err.data}`);
      setErro("Erro ao publicar conteúdo");
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Meu Perfil", to: "/dashboard" },
            { label: "Publicar" },
          ]}
        />
        <h2 className="mb-4 fs-1 fw-bold">Publicar Evento ou Campeonato</h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4 px-5 justify-content-center align-items-center">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Título
                </Form.Label>
                <Form.Control
                  type="text"
                  value={titulo}
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
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
                  value={subTitulo}
                  className="w-100"
                  style={{ width: "200px", fontSize: "1.2rem" }}
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
                  value={tipo}
                  className="w-100"
                  style={{ width: "250px" }}
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
                  style={{ width: "250px", fontSize: "1.2rem" }}
                  value={tags}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="my-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Data do Evento
                </Form.Label>
                <div className="w-100">
                  <DatePicker
                    selected={dataEvento}
                    onChange={(date) => setDataEvento(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    placeholderText="Selecione a data"
                  />
                </div>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Valor da Entrada
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: R$ 0,00"
                  className="w-100"
                  style={{fontSize: "1.2rem" }}
                  value={valorEntrada}
                  onChange={(e) => setValorEntrada(e.target.value)}
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
              className="w-100"
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
