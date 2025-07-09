import {
  Button,
  Modal,
  Form,
  Alert,
  Stack,
} from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { useAuth } from "../../context/useAuth";
import { schemaLogin } from "../../schema/schema";
import PropTypes from "prop-types";
import axios from "axios";

export default function ModalLoginteste({ show, onClose }) {
  const [formData, setFormData] = useState({ login: "", senha: "" });
  const [erro, setErro] = useState({});
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro({});
    setMensagem("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await schemaLogin.validate(formData, { abortEarly: false });

      const resposta = await axios.post("http://localhost:8080/users/login", {
        login: formData.login,
        senha: formData.senha,
      });

      if (resposta.data.token) {
        login(resposta.data.token, resposta.data.usuario);
        setMensagem("Login realizado com sucesso!");
        setSucesso(true);
        setFormData({ login: "", senha: "" });

        // Aguarda 2 segundos para mostrar mensagem e depois recarrega
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const formatados = {};
        error.inner.forEach((e) => (formatados[e.path] = e.message));
        setErro(formatados);
      } else if (error.response) {
        setErro({ global: error.response.data.message || "Erro no login." });
      } else {
        setErro({ global: "Erro inesperado. Tente novamente." });
      }
      setSucesso(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered animation>
      <Modal.Header closeButton>
        <Modal.Title className="fs-3 d-flex align-items-center">
          <BsFillPersonFill className="me-2" /> Entrar
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleLogin} noValidate>
          <Stack gap={3}>
            {mensagem && <Alert variant="success">{mensagem}</Alert>}
            {erro.global && <Alert variant="danger">{erro.global}</Alert>}

            <Form.Group className="text-center" controlId="formLogin">
              <Form.Label className="fs-5 fw-bold">Usuário ou Email</Form.Label>
              <Form.Control
                type="text"
                name="login"
                placeholder="Digite seu usuário ou email"
                value={formData.login}
                onChange={handleChange}
                isInvalid={!!erro.login}
                className="fs-5"
              />
              <Form.Control.Feedback type="invalid">
                {erro.login}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="text-center" controlId="formSenha">
              <Form.Label className="fs-5 fw-bold">Senha</Form.Label>
              <Form.Control
                type="password"
                name="senha"
                placeholder="Digite sua senha"
                value={formData.senha}
                onChange={handleChange}
                isInvalid={!!erro.senha}
                className="fs-5"
              />
              <Form.Control.Feedback type="invalid">
                {erro.senha}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="secondary"
                type="submit"
                size="lg"
                className="fs-4 fw-bold"
                disabled={!formData.login || !formData.senha}
              >
                Avançar
              </Button>
            </div>

            <div className="text-center mt-3">
              <p className="fs-5">
                Ainda não tem cadastro?{" "}
                <Link to="/cadastro" onClick={onClose}>
                  Cadastre-se
                </Link>
              </p>
            </div>
          </Stack>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

ModalLoginteste.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
