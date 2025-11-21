// ModalEditarConteudo.jsx
import { Modal, Button, Alert, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";

export function ModalEditarConteudo({
  show,
  onHide,
  onSubmit,
  titulo,
  setTitulo,
  subTitulo,
  setSubTitulo,
  tipoSelecionado,
  setTipoSelecionado,
  tags,
  setTags,
  conteudo,
  setConteudo,
  thumb,
  setThumb,
  erro,
  mensagem,
  handleDelete
}) {
  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Conteúdo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erro && <Alert variant="danger">{erro}</Alert>}
        {mensagem && <Alert variant="success">{mensagem}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subtítulo</Form.Label>
            <Form.Control
              type="text"
              value={subTitulo}
              onChange={(e) => setSubTitulo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Select
              value={tipoSelecionado}
              onChange={setTipoSelecionado}
              options={[
                { value: "noticia", label: "Notícia" },
                { value: "artigo", label: "Artigo" },
                { value: "evento", label: "Evento" },
                { value: "campeonato", label: "Campeonato" },
              ]}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <CreatableSelect
              isMulti
              value={tags}
              onChange={setTags}
              placeholder="Adicionar ou escolher tags"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imagem</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setThumb(e.target.files[0])}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Conteúdo</Form.Label>
            <ReactQuill value={conteudo} onChange={setConteudo} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Excluir Conteúdo
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Salvar alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
