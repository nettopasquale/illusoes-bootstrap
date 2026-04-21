import { useState, useEffect} from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import {
  ArrowLeft,
  PlusCircle,
  PencilSquare,
  Trash3,
  Collection,
} from "react-bootstrap-icons";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import { useParams } from "react-router-dom";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { ModalEditarConteudo } from "../../components/ModalEditarConteudo/ModalEditarConteudo";
import DatePicker from "react-datepicker";
import "react-quill/dist/quill.snow.css";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useConteudo } from "../../hooks/useConteudo";

export const EditarConteudo = () => {
  const { id, tipo:tipoParams } = useParams();
  const [imagems, setImagens] = useState(null);
  const [uploadingImagens, setUploadingImagens] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const modoEdicao = !!id;

  const {
    titulo,
    subTitulo,
    tipo,
    tags,
    thumbs,
    erro,
    mensagem,
    dataEvento,
    valorEntrada,
    texto,
    handleThumb,
    uploadingThumb,
    navigate,
    setTitulo,
    setSubTitulo,
    setTipo,
    setTags,
    setThumbs,
    setTexto,
    setDataEvento,
    setValorEntrada,
    publicarEditarConteudo,
    excluirConteudo,
  } = useConteudo(id, modoEdicao);

  //setar automaticamente o tipo
  useEffect(()=>{
    if(tipoParams && !modoEdicao){
      const tipoEncontrado = tipoOptions.find(
        (t)=> t.value === tipoParams
      );

      if(tipoEncontrado){
        setTipo(tipoEncontrado);
      }
    }
  },[tipoParams, modoEdicao]);

    const handleConfirmarExclusao = async () => {
      await excluirConteudo();
      setShowConfirmDelete(false);
    };

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
          Editar {tipo?.label || "conteúdo"}
        </h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={publicarEditarConteudo} encType="multipart/form-data">
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
                  value={tipo}
                  onChange={setTipo}
                  className="w-100"
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
                  value={tags}
                  onChange={setTags}
                  className="w-100"
                  style={{ fontSize: "1.4rem" }}
                  placeholder="Adicione tags"
                />
              </Form.Group>
            </Col>
          </Row>

          {["evento", "campeonato"].includes(tipo?.value) && (
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
              name="thumbs"
              className="w-100"
              style={{ height: "30px" }}
              onChange={handleThumb}
            />
          </Form.Group>
          {/* prévia da thumb */}
          {thumbs && (
            <img
              src={thumbs}
              alt="preview"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Conteúdo
            </Form.Label>
            <ReactQuill
              // ref={quillRef}
              // modules={modules}
              value={texto}
              onChange={setTexto}
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
          <div className="d-flex justify-content-between mt-4 gap-5">
            <Button
              className="p-5 fw-bold fs-3 bg-danger w-50"
              onClick={() => excluirConteudo()}
            >
              Excluir
            </Button>
          </div>
        </Form>
      </Container>

      {/* Modal */}
      {modoEdicao && (
        <ModalEditarConteudo
          show={showModal}
          onClose={() => setShowModal(false)}
          onDelete={() => {
            setShowModal(false);
            setShowConfirmDelete(true);
          }}
          titulo={titulo}
          setTitulo={setTitulo}
          setSubTitulo={setSubTitulo}
          tags={tags}
          setTags={setTags}
          thumb={thumbs}
          setThumb={setThumbs}
          conteudo={texto}
          setConteudo={setTexto}
        />
      )}

      {/* Modal de confirmação de exclusão simples */}
      {modoEdicao && showConfirmDelete && (
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
