import { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ModalEditarConteudo } from "../../components/ModalEditarConteudo/ModalEditarConteudo";
import { Navegacao } from "../../components/Navegacao/Navegacao";

export const EditarNoticia = () => {
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
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarNoticia = async () => {
      try {
        const response = await axios.get(
          `https://illusoes-bootstrap.onrender.com/noticias/${tipo}/${id}`
        );
        const dados = response.data;
        console.log(dados);

        setTitulo(dados.titulo);
        setSubTitulo(dados.subTitulo);
        setTipoSelecionado({ value: dados.tipo, label: dados.tipo });
        setConteudo(dados.conteudo);

        setTags(dados.tags?.map((tag) => ({ value: tag, label: tag })) || []);
        // adaptar se estiver usando tag como objeto ou string
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar o conteúdo para edição");
      }
    };

    carregarNoticia();
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

      console.log(formData);

      const token = localStorage.getItem("token");

      await axios.put(
        `https://illusoes-bootstrap.onrender.com/noticias/${tipo}/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      await axios.delete(`https://illusoes-bootstrap.onrender.com/noticias/${tipo}/${id}`, {
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
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Meu Perfil", to: "/dashboard" },
            { label: "Meus Conteúdos", to: "/user/conteudos" },
            { label: "Editar" },
          ]}
        />
        <h2 className="mb-4 fs-1 fw-bold">
          Editar {tipoSelecionado?.label || "conteúdo"}
        </h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSalvarAlteracoes}>
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
                  placeholder="Título principal"
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
                  options={[
                    { value: "noticia", label: "Notícia" },
                    { value: "artigo", label: "Artigo" },
                  ]}
                  onChange={setTipoSelecionado}
                  className="w-100"
                  style={{ fontSize: "1.2rem" }}
                  value={tipoSelecionado}
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
                  style={{ fontSize: "1.3rem" }}
                  value={tags}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Imagem da Thumbnail
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              style={{ height: "30px" }}
              onChange={handleImagem}
            />
            <Form.Text className="text-muted fs-4">
              Você pode substituir a imagem atual.
            </Form.Text>
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
              onClick={() => navigate("/user/conteudos")}
            >
              Cancelar
            </Button>
            <Button className="p-5 fw-bold fs-3 bg-black w-50" type="submit">
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
