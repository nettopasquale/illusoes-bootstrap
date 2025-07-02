// src/pages/Eventos/CriarEvento.jsx
import { Form, Button, Container, Alert } from "react-bootstrap";
import useCriacao from "../../hooks/useCriacao";
import { schemaEvento } from "../../schema/schema";

export default function CriarEvento({ tipo = "evento" }) {
  const {
    mensagem,
    register,
    handleSubmit,
    errors,
    onSubmit,
  } = useCriacao(schemaEvento, "http://localhost:8080/eventos");

  return (
    <Container className="mt-5 mb-5">
      <h2>{tipo === "campeonato" ? "Criar Campeonato" : "Criar Evento"}</h2>

      {mensagem && <Alert variant="info">{mensagem}</Alert>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label>Título</Form.Label>
          <Form.Control {...register("titulo")} isInvalid={!!errors.titulo} />
          <Form.Control.Feedback type="invalid">
            {errors.titulo?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Subtítulo</Form.Label>
          <Form.Control {...register("subTitulo")} isInvalid={!!errors.subTitulo} />
          <Form.Control.Feedback type="invalid">
            {errors.subTitulo?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Conteúdo</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            {...register("conteudo")}
            isInvalid={!!errors.conteudo}
          />
          <Form.Control.Feedback type="invalid">
            {errors.conteudo?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Link da imagem</Form.Label>
          <Form.Control {...register("imagem")} isInvalid={!!errors.imagem} />
          <Form.Control.Feedback type="invalid">
            {errors.imagem?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Data do Evento (apenas exibição)</Form.Label>
          <Form.Control type="date" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Hora do Evento (apenas exibição)</Form.Label>
          <Form.Control type="time" />
        </Form.Group>

        <Form.Control type="hidden" {...register("tipo")} value={tipo} />

        <Button type="submit" className="mt-3">
          Criar
        </Button>
      </Form>
    </Container>
  );
}
