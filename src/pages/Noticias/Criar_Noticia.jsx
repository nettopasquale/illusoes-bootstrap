import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import useCriarNoticia from "../../hooks/useCriarNoticia";

export default function CriarNoticia() {
  const {
    mensagem,
    register,
    handleSubmit,
    formState,
    errors,
    onSubmit,
  } = useCriarNoticia();

  return (
    <LayoutGeral>
      <Container>
        <div>
          <h1>Criar Noticia / Artigo</h1>
        </div>
        {mensagem && <div className="alert alert-info">{mensagem}</div>}

        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formTitulo">
            <Form.Label className="mb-3 fs-4">Título</Form.Label>
            <Form.Control
              type="text"
              name="titulo"
              {...register("titulo")}
              placeholder="Digite o título"
              required
              isInvalid={!!errors.titulo}
              aria-invalid={
                formState.titulo ? "bordborder-success" : "border border-danger"
              }
              className="fs-5"
              style={{ width: "300px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.titulo && (
                <p className="text-danger">{errors.titulo.message}</p>
              )}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formSubTitulo">
            <Form.Label className="mb-3 fs-4">SubTítulo</Form.Label>
            <Form.Control
              type="text"
              name="subtitulo"
              {...register("subtitulo")}
              placeholder="Digite um subtitulo"
              required
              isInvalid={!!errors.subTitulo}
              aria-invalid={
                formState.subTitulo
                  ? "bordborder-success"
                  : "border border-danger"
              }
              className="fs-5"
              style={{ width: "300px" }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.titulo && (
                <p className="text-danger">{errors.subTitulo.message}</p>
              )}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="mb-3">
            <label className="form-label">Conteúdo</label>
            <textarea
              className="form-control"
              rows="6"
              {...register("conteudo")}
            />
            {errors.conteudo && (
              <p className="text-danger">{errors.conteudo.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">URL da imagem (opcional)</label>
            <input className="form-control" {...register("imagem")} />
            {errors.imagem && (
              <p className="text-danger">{errors.imagem.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select className="form-select" {...register("tipo")}>
              <option value="">Selecione</option>
              <option value="noticia">Notícia</option>
              <option value="artigo">Artigo</option>
            </select>
            {errors.tipo && (
              <p className="text-danger">{errors.tipo.message}</p>
            )}
          </div>

          <Button
            variant="dark"
            type="submit"
            className="fs-4 btn btn-primary"
            style={{ width: "150px" }}
            disabled={!formState.titulo || !formState.subTitulo || !formState.conteudo || !formState.tipo ? true : false}
          >
            Publicar
          </Button>
        </Form>
      </Container>
    </LayoutGeral>
  );
}
