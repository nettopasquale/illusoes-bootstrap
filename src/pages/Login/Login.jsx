import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import api from "../../services/api";
import "./Login.css";

// schema do login
const schema = yup.object().shape({
  login: yup.string().required("Usuário ou Email é obrigatório"),
  senha: yup
    .string()
    .min(8, "A senha deve conter no mínimo 8 caracteres!")
    .matches(/[A-Z]/, "A senha deve conter no mínimo um caracter maiúsculo")
    .matches(/[a-z]/, "A senha deve conter no mínimo um caracter minísculo")
    .matches(/\d/, "A senha deve conter pelo menos um número")
    .matches(
      /[!@#$%^&*]/,
      "A senha deve conter pelo menos um caracter especial"
    )
    .required("Senha é obrigatória"),
});

export default function Login() {
  //validação form
  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  });
  const [erro, setErro] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro({});
    setSucesso(false);
  };

  const { login } = useAuth();

  // controle de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await schema.validate(formData, { abortEarly: false });
      setErro({});

      const resposta = await api.post("/users/login", {
        login: formData.login,
        senha: formData.senha,
      });

      if (resposta.data.token) {
        login(resposta.data.token, resposta.data.usuario);
        setMensagem("Login realizado! Redirecionando...");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const formatados = {};
        error.inner.forEach((e) => (formatados[e.path] = e.message));
        setErro(formatados);
      } else if (error.response) {
        setErro({ global: error.response.data.message || "Erro no login" });
      } else {
        setErro({ global: "Erro inesperado. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <LayoutGeral>
  //     <Container fluid className="mt-5 py-5" style={{ width: "100%" }}>
  //       <Navegacao itens={[{ label: "Home", to: "/" }, { label: "Login" }]} />
  //       <h2 className="mb-4 fs-1 fw-bold">Faça seu Login</h2>
  //       {sucesso && (
  //         <Alert variant="success">Login realizado com sucesso!</Alert>
  //       )}

  //       {erro.global && <Alert variant="danger">{erro.global}</Alert>}

  //       {mensagem && <Alert variant="info">{mensagem}</Alert>}

  //       <Form noValidate onSubmit={handleLogin} className="">
  //         <Form.Group className="mb-4 px-5" controlId="formLogin">
  //           <div className="text-center">
  //             <Form.Label className="fs-3 fw-bold mt-5">
  //               Usuário ou Email
  //             </Form.Label>
  //             <Form.Control
  //               type="text"
  //               name="login"
  //               value={formData.login}
  //               onChange={handleChange}
  //               placeholder="Digite o usuário ou email"
  //               required
  //               isInvalid={!!erro.login}
  //               aria-invalid={
  //                 formData.login ? "bordborder-success" : "border border-danger"
  //               }
  //               className="w-25 mx-auto"
  //               style={{ fontSize: "1.2rem" }}
  //             />
  //             <Form.Control.Feedback type="invalid">
  //               {erro.login}
  //             </Form.Control.Feedback>
  //           </div>
  //         </Form.Group>

  //         <Form.Group className="mb-4 px-5" controlId="formPassword">
  //           <div className="text-center">
  //             <Form.Label className="fs-3 fw-bold mt-5">
  //               Senha
  //             </Form.Label>
  //             <Form.Control
  //               type="password"
  //               name="senha"
  //               value={formData.senha}
  //               onChange={handleChange}
  //               placeholder="Digite uma senha"
  //               required
  //               className="w-25 mx-auto"
  //               isInvalid={!!erro.senha}
  //               aria-invalid={
  //                 formData.usuario
  //                   ? "border border-success"
  //                   : "border border-danger"
  //               }
  //               style={{ fontSize: "1.2rem" }}
  //             />
  //             <Form.Control.Feedback type="invalid">
  //               {erro.senha}
  //             </Form.Control.Feedback>
  //           </div>
  //         </Form.Group>

  //         <Button
  //           type="submit"
  //           className="fs-4 bg-black w-25"
  //           disabled={!formData.login || !formData.senha ? true : false}
  //         >
  //           Login
  //         </Button>

  //         <Container className="text-center">
  //           <span className="fs-5">Ainda não é cadastrado?</span>
  //           <Nav>
  //             <Nav.Link className="fs-5 mx-auto">
  //               <Link to={"/cadastro"}>Faça seu cadastro</Link>
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
          {/* Logo / nome do site */}
          <div className="auth-logo">Ilusões Industriais</div>
          <h1 className="auth-titulo">Bem-vindo de volta</h1>
          <p className="auth-subtitulo">Entre com sua conta para continuar</p>

          {mensagem && (
            <Alert
              variant="success"
              className="py-2 text-center"
              style={{ fontSize: "0.85rem" }}
            >
              {mensagem}
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

          <Form noValidate onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Usuário ou e-mail</Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="seu@email.com"
                isInvalid={!!erro.login}
                autoComplete="username"
              />
              <Form.Control.Feedback type="invalid">
                {erro.login}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
                isInvalid={!!erro.senha}
                autoComplete="current-password"
              />
              <Form.Control.Feedback type="invalid">
                {erro.senha}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              type="submit"
              variant="danger"
              className="w-100"
              disabled={loading || !formData.login || !formData.senha}
              style={{ background: "var(--cor-destaque)", border: "none" }}
            >
              {loading ? <Spinner size="sm" animation="border" /> : "Entrar"}
            </Button>
          </Form>

          <div className="auth-divider">ou</div>

          <p
            className="text-center mb-0"
            style={{ fontSize: "0.85rem", color: "var(--cor-texto-suave)" }}
          >
            Ainda não tem conta?{" "}
            <Link to="/cadastro" className="auth-link">
              Cadastre-se
            </Link>
          </p>
        </div>
      </section>
    </LayoutGeral>
  );
}
