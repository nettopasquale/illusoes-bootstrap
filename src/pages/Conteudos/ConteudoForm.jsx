import { useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { ArrowLeft, Trash3 } from "react-bootstrap-icons";
import { useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import ReactQuill from "react-quill";
import DatePicker from "react-datepicker";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useConteudo } from "../../hooks/useConteudo";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "./Conteudo.css";
import "./Conteudoform.css";

const TIPO_OPTIONS = [
  { value: "noticia", label: "Notícia" },
  { value: "artigo", label: "Artigo" },
  { value: "evento", label: "Evento" },
  { value: "campeonato", label: "Campeonato" },
];

const TIPO_LABEL = {
  noticia: "Notícia",
  artigo: "Artigo",
  evento: "Evento",
  campeonato: "Campeonato",
};

export const ConteudoForm = () => {
  const { id, tipo: tipoParams } = useParams();
  const modoEdicao = !!id;

  const {
    titulo,
    setTitulo,
    subTitulo,
    setSubTitulo,
    tipo,
    setTipo,
    tags,
    setTags,
    thumbs,
    texto,
    setTexto,
    dataEvento,
    setDataEvento,
    valorEntrada,
    setValorEntrada,
    erro,
    mensagem,
    handleThumb,
    uploadingThumb,
    navigate,
    publicarEditarConteudo,
    excluirConteudo,
  } = useConteudo(id, modoEdicao);

  // Define o tipo automaticamente pela URL ao criar
  useEffect(() => {
    if (tipoParams && !modoEdicao) {
      const encontrado = TIPO_OPTIONS.find((t) => t.value === tipoParams);
      if (encontrado) setTipo(encontrado);
    }
  }, [tipoParams, modoEdicao]);

  const ehEventoOuCampeonato = ["evento", "campeonato"].includes(tipo?.value);
  const tipoLabel = TIPO_LABEL[tipoParams] || tipoParams || "Conteúdo";

  return (
    <LayoutGeral>
      <section className="conteudo-form-section">
        <Container>
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Dashboard", to: "/dashboard" },
              { label: "Meus Conteúdos", to: "/userProfile/me/conteudos" },
              {
                label: modoEdicao
                  ? `Editar ${tipoLabel}`
                  : `Publicar ${tipoLabel}`,
              },
            ]}
          />

          {/* Header */}
          <div
            className="colecao-page-header"
            style={{ maxWidth: 860, margin: "0 auto 1.5rem" }}
          >
            <h1 className="colecao-page-title" style={{ fontSize: "1.6rem" }}>
              {modoEdicao ? `Editar ${tipoLabel}` : `Publicar ${tipoLabel}`}
            </h1>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/userProfile/me/conteudos")}
            >
              <ArrowLeft className="me-1" size={13} />
              Voltar
            </Button>
          </div>

          {mensagem && (
            <Alert
              variant="success"
              style={{ maxWidth: 860, margin: "0 auto 1rem" }}
            >
              {mensagem}
            </Alert>
          )}
          {erro && (
            <Alert
              variant="danger"
              style={{ maxWidth: 860, margin: "0 auto 1rem" }}
            >
              {erro}
            </Alert>
          )}

          {/* Formulário */}
          <Form
            onSubmit={publicarEditarConteudo}
            encType="multipart/form-data"
            className="conteudo-form-card"
          >
            {/* Título + Subtítulo */}
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Título <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título principal"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Subtítulo <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={subTitulo}
                    onChange={(e) => setSubTitulo(e.target.value)}
                    placeholder="Um breve subtítulo"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tipo + Tags */}
            <Row className="g-3 mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    Tipo <span className="text-danger">*</span>
                  </Form.Label>
                  <CreatableSelect
                    options={TIPO_OPTIONS}
                    value={tipo}
                    onChange={setTipo}
                    placeholder="Selecione o tipo"
                    isDisabled={!!tipoParams && !modoEdicao}
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Tags</Form.Label>
                  <CreatableSelect
                    isMulti
                    value={tags}
                    onChange={setTags}
                    placeholder="Adicione tags (Enter para confirmar)"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Campos exclusivos de evento/campeonato */}
            {ehEventoOuCampeonato && (
              <div className="evento-info-box mb-3">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Data do evento</Form.Label>
                      <DatePicker
                        selected={dataEvento}
                        onChange={setDataEvento}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                        placeholderText="Selecione a data"
                        wrapperClassName="w-100"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Valor da entrada</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ex: 25.00 (deixe 0 para gratuito)"
                        value={valorEntrada}
                        onChange={(e) => setValorEntrada(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}

            {/* Thumbnail */}
            <Form.Group className="mb-3">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="thumbs"
                onChange={handleThumb}
              />
              {thumbs && (
                <img src={thumbs} alt="preview" className="thumb-preview" />
              )}
            </Form.Group>

            {/* Editor de conteúdo */}
            <Form.Group className="mb-4">
              <Form.Label>
                Conteúdo <span className="text-danger">*</span>
              </Form.Label>
              <div className="conteudo-quill-wrapper">
                <ReactQuill
                  value={texto}
                  onChange={setTexto}
                  theme="snow"
                  placeholder="Escreva o conteúdo aqui..."
                />
              </div>
            </Form.Group>

            {/* Ações */}
            <div className="d-flex justify-content-between align-items-center pt-3 border-top">
              {/* Excluir — só no modo edição */}
              {modoEdicao ? (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Tem certeza que deseja excluir este conteúdo?",
                      )
                    ) {
                      excluirConteudo();
                    }
                  }}
                >
                  <Trash3 className="me-1" size={13} />
                  Excluir conteúdo
                </Button>
              ) : (
                <div /> /* espaço vazio para manter o flex */
              )}

              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  type="button"
                  onClick={() => navigate("/usuario/conteudos")}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  className="px-4"
                  disabled={uploadingThumb}
                >
                  {uploadingThumb
                    ? "Enviando imagem..."
                    : modoEdicao
                      ? "Salvar alterações"
                      : "Publicar"}
                </Button>
              </div>
            </div>
          </Form>
        </Container>
      </section>
    </LayoutGeral>
  );
};
