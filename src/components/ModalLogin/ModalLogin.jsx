import {
  Button,
  Modal,
  Form,
  Col,
  Row,
  Container,
  Nav,
  Alert} from 'react-bootstrap';
import { Link } from "react-router-dom";
import { BsFillPersonFill } from "react-icons/bs";
import { useAuth } from "../../context/useAuth";
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import * as yup from "yup";

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


function ModalLogin({ show, onClose }) {
    //validação form
    const [formData, setFormData] = useState({
      login: "",
      senha: "",
    });
  
  const [erro, setErro] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const [mensagem, setMensagem] = useState("");
  
  const { login } = useAuth();

  //controle de mudança dos inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro({});
    setSucesso(false);
  }
  
  //controle do modal
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      setErro({});
      setSucesso(false);

      //envio no backend
      const resposta = await axios.post("http://localhost:8080/users/login", {
        login: formData.login,
        senha: formData.senha,
      });

      if (resposta.data.token) {
        login(resposta.data.token, resposta.data.usuario);
        setMensagem("Login realizado com sucesso!");
        //teste
        handleMensagem();
        setSucesso(true);
        setFormData({
          login: "",
          senha: "",
        });
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
        setErro({global: "Erro inesperado. Tente novamente"})
      }
      setSucesso(false)
      //teste
      handleMensagem();
    }
    onClose();
  }

  // controle do console sobre o estado do modal
  useEffect(() => {
  console.log("Modal show prop mudou para:", show);
  }, [show]);
  
  const handleMensagem = () => {
    if (sucesso && mensagem) {
      setInterval(() => {
        return (
          <>
            <Alert variant="success">Cadastro realizado com sucesso!</Alert>
            <Alert variant="info">{mensagem}</Alert>
          </>
        );
        
      }, 5000)
    }
    else {
      setInterval(() => {
        return (
          <Alert variant="danger">{erro.global}</Alert>
        )
      }, 5000);
    }
  }


  return (
    <>
    <Modal show={show} onHide={onClose} animation={true} centered>
      <Modal.Header closeButton>
          <Modal.Title>
          <BsFillPersonFill className='me-2'/> Login
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex-column'>
        <Form noValidate onSubmit={handleLogin}>
          <Form.Group as={Row} className="mb-3" controlId="formLogin">
            <Form.Label column sm="2">
              Usuario ou Email
            </Form.Label>
            <Col sm="10">
                <Form.Control
                  type="text"
                  name='login'
                  value={formData.login}
                  onChange={handleChange}
                  placeholder='Digite usuário ou email'
                  required
                  isInvalid={!!formData.login}
                  aria-invalid={
                    formData.login ? "bordborder-success" : "border border-danger"
                  }
                  className="fs-5"
                  style={{ width: "300px" }}
                  />
              </Col>
              <Form.Control.Feedback type="invalid">
                {erro.login}
              </Form.Control.Feedback>
          </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPassword">
            <Form.Label column sm="2">
              Senha
            </Form.Label>
            <Col sm="10">
                <Form.Control
                  type="password"
                  name='senha'
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="****"
                  required
                  className="fs-5"
                  isInvalid={!!erro.senha}
                  aria-invalid={
                    formData.usuario
                      ? "border border-success"
                      : "border border-danger"
                  }
                />
              </Col>
              <Form.Control.Feedback type="invalid">
                {erro.senha}
              </Form.Control.Feedback>
            </Form.Group>
            
          <Modal.Footer>
              <Button
                variant="secondary"
                type='submit'
                className="fs-4"
                style={{ width: "150px" }}
                disabled={
                  !formData.login || !formData.senha
                  ? true
                  : false
                }
              >
              Avançar
            </Button>
            </Modal.Footer>
            <Container className="d-flex flex-column mt-4 mb-4 justify-content-center g-4">
            <span className="fs-5">Ainda não é cadastrado?</span>
            <Nav>
              <Nav.Link className="fs-5">
              <Link to={"/cadastro"}>Faça seu cadastro</Link>
              </Nav.Link>
            </Nav>
          </Container>

        </Form>
      </Modal.Body>
    </Modal>
  </>
    
  )
}

export default ModalLogin;

ModalLogin.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}