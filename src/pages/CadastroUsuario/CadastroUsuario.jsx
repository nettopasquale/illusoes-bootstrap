import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useCadastroUsuario } from "../../hooks/useCadastroUsuario";
import { Navegacao } from "../../components/Navegacao/Navegacao";

export default function CadastroUsuario() {
  const { formData, erro, sucesso, handleChange, handleSubmit } =
    useCadastroUsuario();
  return (
    <LayoutGeral>
      <Container fluid className="mt-5" style={{ width: "100%" }}>
        <Navegacao
          itens={[{ label: "Home", to: "/" }, { label: "Cadastro" }]}
        />
        <h2 className="mb-4 fs-1 fw-bold">Faça seu Cadastro</h2>
        {sucesso && (
          <Alert variant="success">Cadastro realizado com sucesso!</Alert>
        )}
        {erro.global && <Alert variant="danger">{erro.global}</Alert>}
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-4 px-5" controlId="formUserName">
            <div className="text-center">
              <Form.Label className="fs-3 fw-bold mt-5">Usuário</Form.Label>
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
                className="w-25 mx-auto"
                style={{ fontSize: "1.2rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {erro.nome}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-4 px-5" controlId="formEmail">
            <div className="text-center">
              <Form.Label className="fs-3 fw-bold mt-5">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                required
                className="w-25 mx-auto"
                isInvalid={!!erro.email}
                aria-invalid={
                  formData.email
                    ? "border border-success"
                    : "border border-danger"
                }
                style={{ fontSize: "1.2rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {erro.email}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-4 px-5" controlId="formPassword">
            <Form.Label className="fs-3 fw-bold mt-5">Senha</Form.Label>
            <Form.Control
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite uma senha"
              required
              className="w-25 mx-auto"
              isInvalid={!!erro.senha}
              aria-invalid={
                formData.usuario
                  ? "border border-success"
                  : "border border-danger"
              }
              style={{ fontSize: "1.2rem" }}
            />
            <Form.Control.Feedback type="invalid">
              {erro.senha}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4 px-5" controlId="formConfirmPassword">
            <div className="text-center">
              <Form.Label className="fs-3 fw-bold mt-5">
                Confirme sua Senha
              </Form.Label>
              <Form.Control
                type="password"
                name="confirmarSenha"
                placeholder="Confirme sua senha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                required
                className="w-25 mx-auto"
                isInvalid={!!erro.confirmarSenha}
                style={{ fontSize: "1.2rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {erro.confirmarSenha}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="fs-4 bg-black w-25 mt-3"
            style={{ fontSize: "1.2rem" }}
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

          <Container className="text-center mt-3">
            <span className="fs-5">Já é cadastrado?</span>
            <Nav>
              <Nav.Link href="/login" className="fs-5 mx-auto">
                Faça seu Login
              </Nav.Link>
            </Nav>
          </Container>
        </Form>
      </Container>
    </LayoutGeral>
  );
}
