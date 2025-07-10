import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as yup from "yup";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { Navegacao } from "../../components/Navegacao/Navegacao";

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

  const navigate = useNavigate();

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro({});
    setSucesso(false);
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
        login: formData.login,
        senha: formData.senha,
      });

      if (resposta.data.token) {
        login(resposta.data.token, resposta.data.usuario);
        setMensagem("Login realizado com sucesso!");

        // Aguarda 2 segundos para mostrar mensagem e depois recarrega
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        //erro de validação
        const formatados = {};

        error.inner.forEach((e) => (formatados[e.path] = e.message));
        setErro(formatados);
      } else if (error.response) {
        //erro da resposta
        setErro(erro.response.data.message || "Erro no Login");
      } else {
        setErro({ global: "Erro inesperado. Tente novamente" });
      }
      setSucesso(false);
    }
  };

  return (
    <LayoutGeral>
      <Container fluid className="mt-5 py-5" style={{ width: "100%" }}>
        <Navegacao itens={[{ label: "Home", to: "/" }, { label: "Login" }]} />
        <h2 className="mb-4 fs-1 fw-bold">Faça seu Login</h2>
        {sucesso && (
          <Alert variant="success">Login realizado com sucesso!</Alert>
        )}

        {erro.global && <Alert variant="danger">{erro.global}</Alert>}

        {mensagem && <Alert variant="info">{mensagem}</Alert>}

        <Form noValidate onSubmit={handleLogin} className="">
          <Form.Group className="mb-4 px-5" controlId="formLogin">
            <div className="text-center">
              <Form.Label className="fs-3 fw-bold mt-5">
                Usuário ou Email
              </Form.Label>
              <Form.Control
                type="text"
                name="login"
                value={formData.login}
                onChange={handleChange}
                placeholder="Digite o usuário ou email"
                required
                isInvalid={!!erro.login}
                aria-invalid={
                  formData.login ? "bordborder-success" : "border border-danger"
                }
                className="w-25 mx-auto"
                style={{ fontSize: "1.2rem" }}
              />
              <Form.Control.Feedback type="invalid">
                {erro.login}
              </Form.Control.Feedback>
            </div>
          </Form.Group>

          <Form.Group className="mb-4 px-5" controlId="formPassword">
            <div className="text-center">
              <Form.Label className="fs-3 fw-bold mt-5">
                Senha
              </Form.Label>
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
            </div>
          </Form.Group>

          <Button
            type="submit"
            className="fs-4 bg-black w-25"
            disabled={!formData.login || !formData.senha ? true : false}
          >
            Login
          </Button>

          <Container className="text-center">
            <span className="fs-5">Ainda não é cadastrado?</span>
            <Nav>
              <Nav.Link className="fs-5 mx-auto">
                <Link to={"/cadastro"}>Faça seu cadastro</Link>
              </Nav.Link>
            </Nav>
          </Container>

        </Form>
      </Container>
    </LayoutGeral>
  );
}
