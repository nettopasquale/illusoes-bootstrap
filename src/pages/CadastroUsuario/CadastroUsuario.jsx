import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useCadastroUsuario } from "../../hooks/useCadastroUsuario";

export default function CadastroUsuario() {
  const { formData, erro, sucesso, handleChange, handleSubmit } = useCadastroUsuario();
  return (
    <LayoutGeral>
      <Container
        fluid
        className="mt-5"
        style={{ width: "100%" }}
      >
        {sucesso && (
          <Alert variant="success">Cadastro realizado com sucesso!</Alert>
        )}
        {erro.global && <Alert variant="danger">{erro.global}</Alert>}
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formUserName">
            <Form.Label className="mb-3 fs-4">Usuário</Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Digite o nome do usuário"
              required
              isInvalid={!!erro.nome}
              aria-invalid={
                formData.usuario
                  ? "border border-success"
                  : "border border-danger"
              }
              className="fs-5"
              style={{ width: "300px" }}
            />
            <Form.Control.Feedback type="invalid">
              {erro.nome}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className="mb-3 fs-4">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              required
              className="fs-5"
              isInvalid={!!erro.email}
              aria-invalid={
                formData.email
                  ? "border border-success"
                  : "border border-danger"
              }
            />
            <Form.Control.Feedback type="invalid">
              {erro.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label className="mb-3 fs-4">Senha</Form.Label>
            <Form.Control
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite uma senha"
              required
              className="fs-5"
              isInvalid={!!erro.senha}
              aria-invalid={
                formData.usuario
                  ? "border border-success"
                  : "border border-danger"
              }
            />
            <Form.Control.Feedback type="invalid">
              {erro.senha}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label className="mb-3 fs-4">Confirme sua Senha</Form.Label>
            <Form.Control
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              required
              className="fs-5"
              isInvalid={!!erro.confirmarSenha}
            />
            <Form.Control.Feedback type="invalid">
              {erro.confirmarSenha}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            className="fs-4 bg-black"
            style={{ width: "150px" }}
            disabled={
              !formData.usuario ||
              !formData.email ||
              !formData.senha ||
              !formData.confirmarSenha
                ? true
                : false
            }
          >
            Cadastrar
          </Button>
          <Container className="d-flex flex-column mt-4 mb-4 justify-content-center g-4">
            <span className="fs-5">Já é cadastrado?</span>
            <Nav>
              <Nav.Link href="/login" className="fs-5">
                Faça seu Login
              </Nav.Link>
            </Nav>
          </Container>
        </Form>
      </Container>
    </LayoutGeral>
  );
}
