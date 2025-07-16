import { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import InputMask from "react-input-mask";
import { Navegacao } from "../../components/Navegacao/Navegacao";

export const PerfilUsuario = () => {
  const [perfil, setPerfil] = useState({
    nome: "",
    sobreNome: "",
    imagemProfile: "",
    cpf: "",
    rg: "",
    endereco: "",
    dataNascimento: "",
    telefone: "",
  });

  const [mensagem, setMensagem] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [perfilId, setPerfilId] = useState(null);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token");

  const carregarPerfil = async () => {
    try {
      const response = await axios.get("https://illusoes-bootstrap.onrender.com/userProfile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPerfil(response.data);
      setPerfilId(response.data._id);
    } catch (err) {
      if (err.response?.status === 404) {
        console.log("Perfil ainda não existe. Permitindo criação.");
        setMensagem("Nenhum perfil encontrado. Você pode criar um.");
      } else {
        setErro("Erro ao criar o perfil");
        console.error(err);
      }
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imagemProfile") {
      setPerfil({ ...perfil, imagemProfile: files[0] });
    } else {
      setPerfil({ ...perfil, [name]: value });
    }
  };

  //Para criar novo Perfil / Editar Perfil
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.entries(perfil).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (perfilId) {
        // Atualiza perfil existente
        console.log("PerfilID: ", perfilId);
        await axios.put(
          `https://illusoes-bootstrap.onrender.com/userProfile/${perfilId}`,
          formData,
          config
        );
        setMensagem("Perfil atualizado com sucesso!");
      } else {
        // Cria novo perfil
        const response = await axios.post(
          "https://illusoes-bootstrap.onrender.com/userProfile",
          formData,
          config
        );
        setMensagem("Perfil criado com sucesso!");
        setPerfilId(response.data._id); // para futuras edições
      }
    } catch (err) {
      setErro("Erro ao salvar o perfil.");
      console.error(err);
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[{ label: "Home", to: "/" }, { label: "Meu Perfil" }]}
        />
        <h2 className="mb-4 fs-1 fw-bold">Meu Perfil</h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            {perfil.imagemProfile && (
              <img
                src={`https://illusoes-bootstrap.onrender.com/imagens/${perfil.imagemProfile}`}
                alt="imagemProfile"
                className="mb-3"
                style={{ width: "150px", borderRadius: "50%" }}
              />
            )}
            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Avatar
                </Form.Label>
                <Form.Control
                  name="imagemProfile"
                  type="file"
                  accept="image/*"
                  className="rounded-5 w-100"
                  style={{
                    heigh: "200px",
                    borderRadius: "200px",
                  }}
                  onChange={handleChange}
                  disabled={!modoEdicao}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Nome
                </Form.Label>
                <Form.Control
                  name="nome"
                  className="w-100"
                  value={perfil.nome}
                  onChange={handleChange}
                  disabled={!modoEdicao}
                  style={{ width: "200px", fontSize: "1.2rem" }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Sobrenome
                </Form.Label>
                <Form.Control
                  name="sobreNome"
                  className="w-100"
                  value={perfil.sobreNome}
                  onChange={handleChange}
                  disabled={!modoEdicao}
                  style={{ width: "200px", fontSize: "1.2rem" }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  CPF
                </Form.Label>
                <InputMask
                  mask="999.999.999-99"
                  value={perfil.cpf}
                  onChange={(e) =>
                    setPerfil({ ...perfil, cpf: e.target.value })
                  }
                >
                  {(inputProps) => <Form.Control {...inputProps} type="text" />}
                </InputMask>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  RG
                </Form.Label>
                <InputMask
                  mask="99.999.999-9"
                  value={perfil.rg}
                  onChange={(e) => setPerfil({ ...perfil, rg: e.target.value })}
                >
                  {(inputProps) => <Form.Control {...inputProps} type="text" />}
                </InputMask>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Telefone
                </Form.Label>
                <InputMask
                  mask="(99) 99999-9999"
                  value={perfil.telefone}
                  onChange={(e) =>
                    setPerfil({ ...perfil, telefone: e.target.value })
                  }
                >
                  {(inputProps) => <Form.Control {...inputProps} type="text" />}
                </InputMask>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Data de Nascimento
                </Form.Label>
                <InputMask
                  mask="99/99/9999"
                  value={perfil.dataNascimento}
                  onChange={(e) =>
                    setPerfil({ ...perfil, dataNascimento: e.target.value })
                  }
                >
                  {(inputProps) => <Form.Control {...inputProps} type="text" />}
                </InputMask>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="d-flex justify-content-between mt-4 gap-5">
                <Button
                  className="p-5 fw-bold fs-3 bg-black w-50"
                  onClick={() => setModoEdicao(!modoEdicao)}
                >
                  {modoEdicao ? "Cancelar" : "Editar"}
                </Button>{" "}
                {modoEdicao && (
                  <Button
                    className="p-5 fw-bold fs-3 bg-black w-50"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    {perfilId ? "Salvar Alterações" : "Criar Perfil"}
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </Container>
    </LayoutGeral>
  );
};
