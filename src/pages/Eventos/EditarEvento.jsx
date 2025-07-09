import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ModalEditarConteudo } from "../../components/ModalEditarConteudo/ModalEditarConteudo";

export const EditarEvento = () => {
  const { id, tipo } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [subTitulo, setSubTitulo] = useState("");
  const [tags, setTags] = useState([]);
  const [imagem, setImagem] = useState(null);
  const [conteudo, setConteudo] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState({
    value: tipo,
    label: tipo,
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [dataEvento, setDataEvento] = useState(null);
  const [valorEntrada, setValorEntrada] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarEvento = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/eventos/${tipo}/${id}`
        );
        const dados = response.data;

        setTitulo(dados.titulo);
        setSubTitulo(dados.subTitulo);
        setTipoSelecionado({ value: dados.tipo, label: dados.tipo });
        setConteudo(dados.conteudo);
        setDataEvento(dados.dataEvento);
        setValorEntrada(dados.valorEntrada);

        setTags(dados.tags?.map((tag) => ({ value: tag, label: tag })) || []);
        //adaptar se estiver usando tag como objeto ou string
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar o conteúdo para edição");
      }
    };

    carregarEvento();
  }, [id, tipo]);

  const handleImagem = (e) => {
    setImagem(e.target.files[0]);
  };

  const handleSalvarAlteracoes = async (e) => {
    e.preventDefault();
    if (!tipoSelecionado) return setErro("Escolha um tipo de conteúdo");
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("subTitulo", subTitulo);
      formData.append("tags", JSON.stringify(tags.map((tag) => tag.value)));
      if (imagem) formData.append("imagem", imagem);
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

      console.log(formData);

      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:8080/eventos/${tipo}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMensagem(`Alterações realizadas com sucesso!`);
      setErro("");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao publicar conteúdo");
    }
  };

  // Excluir conteúdo
  const handleConfirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/eventos/${tipo}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMensagem("Conteúdo excluído com sucesso!");
      setErro(null);
      setShowConfirmDelete(false);
      setTimeout(() => navigate("/usuario"), 2000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao excluir conteúdo");
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <h2 className="mb-4 fw-bold">
          Editar {tipoSelecionado?.label || "conteúdo"}
        </h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSalvarAlteracoes}>
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
                  placeholder="Título principal"
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
                  options={[
                    { value: "noticia", label: "Notícia" },
                    { value: "artigo", label: "Artigo" },
                  ]}
                  onChange={setTipoSelecionado}
                  size="lg"
                  style={{ width: "250px" }}
                  value={tipoSelecionado}
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
            <Form.Text className="text-muted">
              Você pode substituir a imagem atual.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-5 fw-bold">Conteúdo</Form.Label>
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

          <div className="d-flex justify-content-between mt-4">
            <Button
              className="p-5 fw-bold fs-5 bg-black"
              type="button"
              onClick={() => navigate("/conteudos")}
            >
              Cancelar
            </Button>
            <Button className="p-5 fw-bold fs-5 bg-black" type="submit">
              Salvar Alterações
            </Button>
          </div>
        </Form>
      </Container>

      {/* Modal */}
      <ModalEditarConteudo
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSalvarAlteracoes}
        onDelete={() => {
          setShowModal(false);
          setShowConfirmDelete(true);
        }}
        titulo={titulo}
        setTitulo={setTitulo}
        subTitulo={subTitulo}
        setSubTitulo={setSubTitulo}
        tags={tags}
        setTags={setTags}
        imagem={imagem}
        setImagem={setImagem}
        conteudo={conteudo}
        setConteudo={setConteudo}
      />

      {/* Modal de confirmação de exclusão simples */}
      {showConfirmDelete && (
        <ModalEditarConteudo
          show={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onDelete={handleConfirmarExclusao}
          titulo="Confirmar Exclusão"
        />
      )}
    </LayoutGeral>
  );
};
