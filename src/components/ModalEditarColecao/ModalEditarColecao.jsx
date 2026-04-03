// ModalEditarConteudo.jsx
import { Modal, Button, Alert, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import "react-quill/dist/quill.snow.css";

export function ModalEditarColecao({
  show,
  onHide,
  onSubmit,
  nome,
  setNome,
  descricao,
  setDescricao,
  capa,
  setCapa,
  erro,
  mensagem,
  handleDelete,
}) {
  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Colecao</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erro && <Alert variant="danger">{erro}</Alert>}
        {mensagem && <Alert variant="success">{mensagem}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Capa</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              name="thumbs"
              onChange={(e) => setCapa(e.target.files)}
            />
          </Form.Group>
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Excluir Coleção
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Salvar alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
