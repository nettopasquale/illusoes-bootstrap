import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import axios from "axios";
import * as yup from "yup";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

// schema do login
const schema = yup.object().shape({
  usuario: yup.string().required("Nome do usuário é obrigatório"),
  email: yup.string().email("Email inválido").required("Email é obrigatório"),
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

function Login() {
  //validação form
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const [mensagem, setMensagem] = useState("");

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSucesso(false);
    setErro({});
  };

  const { login } = useAuth();

  // controle de login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErro({});
      setSucesso(false);

      //enviar p o Backend
      const resposta = await axios.post("http://localhost:8080/users/login", {
        usuario: formData.usuario,
        email: formData.email,
        senha: formData.senha,
      });

      if (resposta.data.token) {
        login(resposta.data.token, resposta.data.usuario);
        setMensagem("Login realizado com sucesso!");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        //erro de validação
        const formatados = {};

        error.inner.forEach((e) => (formatados[e.path] = e.message));
        setErro(formatados);
      } else if (error.resposta) {
        //erro da resposta
        setErro(erro.resposta.data.message || "Erro no Login");
      } else {
        setErro({ global: "Erro inesperado. Tente novamente" });
      }
      setSucesso(false);
    }
  };

  return (
    <LayoutGeral>
      <Container
        fluid
        className="mt-5"
        style={{ maxWidth: "2000px", width: "100%" }}
      >
        {sucesso && (
          <Alert variant="success">Cadastro realizado com sucesso!</Alert>
        )}

        {erro.global && <Alert variant="danger">{erro.global}</Alert>}

        {mensagem && <Alert variant="info">{mensagem}</Alert>}

        <Form noValidate onSubmit={handleLogin}>
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
                formData.usuario ? "bordborder-success" : "border border-danger"
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

          <Button
            variant="dark"
            type="submit"
            className="fs-4"
            style={{ width: "150px" }}
            disabled={
              !formData.usuario || !formData.email || !formData.senha
                ? true
                : false
            }
          >
            Login
          </Button>
          <Container className="d-flex flex-column mt-4 mb-4 justify-content-center g-4">
            <span className="fs-5">Ainda não é cadastrado?</span>
            <Nav>
              <Nav.Link className="fs-5">
                <Link to={"/cadastro"}>Faça seu cadastro</Link>
              </Nav.Link>
            </Nav>
          </Container>
        </Form>
      </Container>
    </LayoutGeral>
  );
}

export default Login;
