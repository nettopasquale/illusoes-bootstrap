import { useState, useEffect} from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ModalEditarConteudo } from "../../components/ModalEditarConteudo/ModalEditarConteudo";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import { Navegacao } from "../../components/Navegacao/Navegacao";
// import { useReactQuillFirebase } from "../../hooks/useReactQuillFireBase";
// import { uploadToFirebase } from "../../utils/uploadFirebase";

export const EditarConteudo = () => {
  const { id, tipo } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [subTitulo, setSubTitulo] = useState("");
  const [tags, setTags] = useState([]);
  const [thumbs, setThumbs] = useState(null);
  const [imagems, setImagens] = useState(null);
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
          `https://illusoes-bootstrap.onrender.com/conteudos/${tipo}/${id}`
        );
        const dados = response.data;

        setTitulo(dados.titulo);
        setSubTitulo(dados.subTitulo);
        setTipoSelecionado({ value: dados.tipo, label: dados.tipo });
        setConteudo(dados.conteudo);
        setDataEvento(dados.dataEvento ? new Date(dados.dataEvento) : null);
        setValorEntrada(
          dados.valorEntrada != null ? dados.valorEntrada.toString() : ""
        );

        setTags(dados.tags?.map((tag) => ({ value: tag, label: tag })) || []);

      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar o conteúdo para edição");
      }
    };

    carregarEvento();
  }, [id]);



  //edição de conteúdo
  const handleSalvarAlteracoes = async (e) => {
    e.preventDefault();
    if (!tipoSelecionado) return setErro("Escolha um tipo de conteúdo");
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("subTitulo", subTitulo);
      formData.append("tags", tags.length ? tags.map((tag) => tag.value) : []);
      formData.append("conteudo", conteudo);
      formData.append("dataEvento", dataEvento ? dataEvento.toISOString() : "");
      
      //transformar String em Number
      let valorLimpo =
      typeof valorEntrada === "string"
      ? valorEntrada.replace("R$", "").trim().replace(",", ".")
      : valorEntrada;
      
      const valorNumerico = parseFloat(valorLimpo);
      
      formData.append("valorEntrada", isNaN(valorNumerico) ? 0 : valorNumerico);
      formData.append("thumbs", thumbs);

      console.log(formData);

      const token = localStorage.getItem("token");

      await axios.put(
        `https://illusoes-bootstrap.onrender.com/conteudos/${tipoSelecionado.value}/${id}`,
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
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao publicar conteúdo");
    }
  };

  // Excluir conteúdo
  const handleConfirmarExclusao = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `https://illusoes-bootstrap.onrender.com/conteudos/${tipoSelecionado.value}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagem("Conteúdo excluído com sucesso!");
      setErro(null);
      setShowConfirmDelete(false);
      setTimeout(() => navigate("/usuario"), 2000);
    } catch (err) {
      console.error(err);
      setErro("Erro ao excluir conteúdo");
    }
  };

  const handleThumb = (e) => {
    setThumbs(e.target.file);
  };

  //   const handleImagens = (e) => {
  //   setImagens(e.target.files[0]);
  // };

  // TOOLBAR CUSTOMIZADA DO QUILL
  // const modules = useMemo(
  //   () => ({
  //     toolbar: {
  //       container: [
  //         [{ header: [1, 2, 3, false] }],
  //         ["bold", "italic", "underline", "strike"],
  //         [{ align: [] }],
  //         [{ list: "ordered" }, { list: "bullet" }],
  //         ["link"],
  //         ["image"], // Vamos interceptar este botão
  //         ["clean"],
  //       ],
  //       handlers: {
  //         image: handleImageUpload, // substitui o handler padrão
  //       },
  //     },
  //   }),
  //   [handleImageUpload]
  // );

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
        <h2 className="mb-4 fs-1 fw-bold mb-2">
          Editar {tipoSelecionado?.label || "conteúdo"}
        </h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSalvarAlteracoes} encType="multipart/form-data">
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
                    { value: "evento", label: "Evento" },
                    { value: "campeonato", label: "Campeonato" },
                  ]}
                  onChange={setTipoSelecionado}
                  className="w-100"
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
                  style={{ fontSize: "1.4rem" }}
                  value={tags}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          {["evento", "campeonato"].includes(tipoSelecionado?.value) && (
            <Row>
              <Col md={6}>
                <Form.Group className="my-4 px-5">
                  <Form.Label className="fs-3 fw-bold text-start w-100">
                    Data do Evento
                  </Form.Label>
                  <div className="w-100">
                    <DatePicker
                      selected={dataEvento}
                      onChange={setDataEvento}
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
                    style={{ fontSize: "1.2rem" }}
                    value={valorEntrada}
                    onChange={(e) => setValorEntrada(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-4 px-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Imagem da Thumbnail
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              className="w-100"
              style={{ height: "30px" }}
              name="thumbs"
              onChange={handleThumb}
            />
            <Form.Text className="text-muted">
              Você pode substituir a imagem atual.
            </Form.Text>
          </Form.Group>

          {/* REVER AQUI GALERIA */}
          {/* <Form.Group className="mb-4 px-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Imagens da Galeria
            </Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              className="w-100"
              style={{ height: "30px" }}
              value={imagems}
              onChange={setImagens}
            />
            <Form.Text className="text-muted">
              Você pode substituir a imagem atual.
            </Form.Text>
          </Form.Group> */}

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Conteúdo
            </Form.Label>
            <ReactQuill
              // ref={quillRef}
              value={conteudo}
              onChange={setConteudo}
              // modules={modules}
              className="w-100"
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
        thumb={thumbs}
        setThumb={setThumbs}
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
