import { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { cloudinaryUpload } from "../../utils/cloudinaryUpload";
import { useConteudo } from "../../hooks/useConteudo";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import CreatableSelect from "react-select/creatable";
import {ModalEditarConteudo} from "../../components/ModalEditarConteudo/ModalEditarConteudo"
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";

const tipoOptions = [
  { value: "noticia", label: "Notícia" },
  { value: "artigo", label: "Artigo" },
  { value: "evento", label: "Evento" },
  { value: "campeonato", label: "Campeonato" },
];

export const CriarConteudo = () => {
  const {id, tipo: tipoParams} = useParams();
  const [imagens, setImagens] = useState(null);
  const [uploadingImagens, setUploadingImagens] = useState(false);

  const modoEdicao = !!id;
  console.log("É edição: ", modoEdicao);
  console.log("id: ", id);
  console.log("Tipo Params: ", tipoParams);
  console.log("Params: ", useParams());
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

  const handleImagens = async(e) => {
    const file = e.target.files[0]
    console.log(file);

    if (!file) return;
    setUploadingImagens(true);
    try {
      const url = await cloudinaryUpload(file, "imagesConteudo");
      console.log("URL das imagens:", url); // 👈 teste

      setImagens(url);
    } catch (err) {
      console.error("Erro ao subir imagens:", err);
    } finally {
      setUploadingImagens(false);
    }
  };

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
  },[tipoParams, modoEdicao])

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
  //         image: handleImageUpload, // chama o upload
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
            { label: "Publicar" },
          ]}
        />
        <h2 className="mb-4 fs-1 fw-bold">
          {modoEdicao ? `Editar ${tipoParams}` : `Publicar ${tipoParams}`}
        </h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={publicarEditarConteudo} encType="multipart/form-data">
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
                  isDisabled={!!tipoParams && !modoEdicao}
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

          {/* REVER AQUI */}

          <Form.Group className="mb-4 p-5">
            <Form.Label className="fs-3 fw-bold text-start w-100">
              Conteúdo
            </Form.Label>
            <ReactQuill
              // ref={quillRef}
              value={texto}
              onChange={setTexto}
              // modules={modules}
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
            {modoEdicao ? (
              <Button
                className="p-5 fw-bold fs-3 bg-black w-50"
                type="submit"
                disabled={uploadingThumb}
              >
                {uploadingThumb ? "Enviando imagem..." : "Editar"}
              </Button>
            ) : (
              <Button
                className="p-5 fw-bold fs-3 bg-black w-50"
                type="submit"
                disabled={uploadingThumb}
              >
                {uploadingThumb ? "Enviando imagem..." : "Publicar"}
              </Button>
            )}
          </div>
        </Form>
      </Container>
    </LayoutGeral>
  );
};
