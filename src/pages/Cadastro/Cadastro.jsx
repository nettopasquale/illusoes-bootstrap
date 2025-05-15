import { Button, Form, Container, Alert, Nav } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import * as yup from "yup";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

// schema do cadastro
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
  confirmarSenha: yup
    .string()
    .oneOf([yup.ref("senha"), null], "As senhas devem coincidir")
    .required("Confirmação de senha é obrigatória"),
});

function Cadastro() {
  //validação form
  const [formData, setFormData] = useState({
    usuario: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState({});
  const [sucesso, setSucesso] = useState(false);

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSucesso(false);
    setErro({});
  };

  // controle de Submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErro({});
      setSucesso(false);

      //enviar p o Backend
      const resposta = await axios.post("http://localhost:4200/usuarios", {
        usuario: formData.usuario,
        email: formData.email,
        senha: formData.senha,
      });

      if (resposta.status === 201 || resposta.status === 200) {
        setSucesso(true);
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmarSenha: "",
        });
      }
    } catch (error) {
      if (error.resposta && error.resposta.data?.error) {
        //erro do backend
        setErro({ global: error.resposta.data.error });
      } else if (error.inner) {
        //erro de validação do yup
        const erroFormatado = {};
        error.inner.forEach((e) => {
          erroFormatado[e.path] = e.message;
        });
        setErro(erroFormatado);
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
                formData.email ? "border border-success" : "border border-danger"
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
            variant="dark"
            type="submit"
            className="fs-4"
            style={{ width: "150px" }}
            disabled={
                !formData.usuario ||
                !formData.email ||
                !formData.senha ||
                !formData.confirmarSenha
                ? true
                : false
            }>
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

export default Cadastro;
