import { Button, Form, Container, Alert, Nav, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCadastroUsuario } from "../../hooks/useCadastroUsuario";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import "./Cadastro.css"


export default function CadastroUsuario() {
  const { formData, erro, sucesso, handleChange, handleSubmit } =
    useCadastroUsuario();

  const camposPreenchidos =
    formData.usuario &&
    formData.email &&
    formData.senha &&
    formData.confirmarSenha;

  // return (
  //   <LayoutGeral>
  //     <Container fluid className="mt-5" style={{ width: "100%" }}>
  //       <Navegacao
  //         itens={[{ label: "Home", to: "/" }, { label: "Cadastro" }]}
  //       />
  //       <h2 className="mb-4 fs-1 fw-bold">Faça seu Cadastro</h2>
  //       {sucesso && (
  //         <Alert variant="success">Cadastro realizado com sucesso!</Alert>
  //       )}
  //       {erro.global && <Alert variant="danger">{erro.global}</Alert>}
  //       <Form noValidate onSubmit={handleSubmit}>
  //         <Form.Group className="mb-4 px-5" controlId="formUserName">
  //           <div className="text-center">
  //             <Form.Label className="fs-3 fw-bold mt-5">Usuário</Form.Label>
  //             <Form.Control
  //               type="text"
  //               name="usuario"
  //               value={formData.usuario}
  //               onChange={handleChange}
  //               placeholder="Digite o nome do usuário"
  //               required
  //               isInvalid={!!erro.nome}
  //               aria-invalid={
  //                 formData.usuario
  //                   ? "border border-success"
  //                   : "border border-danger"
  //               }
  //               className="w-25 mx-auto"
  //               style={{ fontSize: "1.2rem" }}
  //             />
  //             <Form.Control.Feedback type="invalid">
  //               {erro.nome}
  //             </Form.Control.Feedback>
  //           </div>
  //         </Form.Group>

  //         <Form.Group className="mb-4 px-5" controlId="formEmail">
  //           <div className="text-center">
  //             <Form.Label className="fs-3 fw-bold mt-5">Email</Form.Label>
  //             <Form.Control
  //               type="email"
  //               name="email"
  //               value={formData.email}
  //               onChange={handleChange}
  //               placeholder="Digite seu email"
  //               required
  //               className="w-25 mx-auto"
  //               isInvalid={!!erro.email}
  //               aria-invalid={
  //                 formData.email
  //                   ? "border border-success"
  //                   : "border border-danger"
  //               }
  //               style={{ fontSize: "1.2rem" }}
  //             />
  //             <Form.Control.Feedback type="invalid">
  //               {erro.email}
  //             </Form.Control.Feedback>
  //           </div>
  //         </Form.Group>

  //         <Form.Group className="mb-4 px-5" controlId="formPassword">
  //           <Form.Label className="fs-3 fw-bold mt-5">Senha</Form.Label>
  //           <Form.Control
  //             type="password"
  //             name="senha"
  //             value={formData.senha}
  //             onChange={handleChange}
  //             placeholder="Digite uma senha"
  //             required
  //             className="w-25 mx-auto"
  //             isInvalid={!!erro.senha}
  //             aria-invalid={
  //               formData.usuario
  //                 ? "border border-success"
  //                 : "border border-danger"
  //             }
  //             style={{ fontSize: "1.2rem" }}
  //           />
  //           <Form.Control.Feedback type="invalid">
  //             {erro.senha}
  //           </Form.Control.Feedback>
  //         </Form.Group>

  //         <Form.Group className="mb-4 px-5" controlId="formConfirmPassword">
  //           <div className="text-center">
  //             <Form.Label className="fs-3 fw-bold mt-5">
  //               Confirme sua Senha
  //             </Form.Label>
  //             <Form.Control
  //               type="password"
  //               name="confirmarSenha"
  //               placeholder="Confirme sua senha"
  //               value={formData.confirmarSenha}
  //               onChange={handleChange}
  //               required
  //               className="w-25 mx-auto"
  //               isInvalid={!!erro.confirmarSenha}
  //               style={{ fontSize: "1.2rem" }}
  //             />
  //             <Form.Control.Feedback type="invalid">
  //               {erro.confirmarSenha}
  //             </Form.Control.Feedback>
  //           </div>
  //         </Form.Group>

  //         <Button
  //           type="submit"
  //           className="fs-4 bg-black w-25 mt-3"
  //           style={{ fontSize: "1.2rem" }}
  //           disabled={
  //             !formData.usuario ||
  //             !formData.email ||
  //             !formData.senha ||
  //             !formData.confirmarSenha
  //               ? true
  //               : false
  //           }
  //         >
  //           Cadastrar
  //         </Button>

  //         <Container className="text-center mt-3">
  //           <span className="fs-5">Já é cadastrado?</span>
  //           <Nav>
  //             <Nav.Link href="/login" className="fs-5 mx-auto">
  //               Faça seu Login
  //             </Nav.Link>
  //           </Nav>
  //         </Container>
  //       </Form>
  //     </Container>
  //   </LayoutGeral>
  // );
  return (
    <LayoutGeral>
      <section className="auth-section">
        <div className="auth-card">
          <div className="auth-logo">Ilusões Industriais</div>
          <h1 className="auth-titulo">Criar conta</h1>
          <p className="auth-subtitulo">Junte-se à comunidade de card games</p>

          {sucesso && (
            <Alert
              variant="success"
              className="py-2 text-center"
              style={{ fontSize: "0.85rem" }}
            >
              Cadastro realizado com sucesso!
            </Alert>
          )}
          {erro.global && (
            <Alert
              variant="danger"
              className="py-2 text-center"
              style={{ fontSize: "0.85rem" }}
            >
              {erro.global}
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nome de usuário</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="seuusuario"
                isInvalid={!!erro.nome}
                autoComplete="username"
              />
              <Form.Control.Feedback type="invalid">
                {erro.nome}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                isInvalid={!!erro.email}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">
                {erro.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                isInvalid={!!erro.senha}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {erro.senha}
              </Form.Control.Feedback>
              <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                Mínimo 8 caracteres, com maiúscula, número e símbolo.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar senha</Form.Label>
              <Form.Control
                type="password"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="••••••••"
                isInvalid={!!erro.confirmarSenha}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {erro.confirmarSenha}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              disabled={!camposPreenchidos}
              style={{ background: "var(--cor-destaque)", border: "none" }}
            >
              Criar conta
            </Button>
          </Form>

          <div className="auth-divider">ou</div>

          <p
            className="text-center mb-0"
            style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
          >
            Já tem conta?{" "}
            <Link to="/login" className="auth-link">
              Faça login
            </Link>
          </p>
        </div>
      </section>
    </LayoutGeral>
  );
}
