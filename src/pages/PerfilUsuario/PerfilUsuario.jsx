import { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { cloudinaryUpload } from "../../utils/cloudinaryUpload"
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import InputMask from "react-input-mask";
import api from "../../services/api";

export const PerfilUsuario = () => {
  const {id} = useParams();
  const {usuario, token} = useContext(AuthContext)
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [avatar, setAvatar] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get(`/user/profile`);
        setSobrenome(response.data.sobrenome);
        setAvatar(response.data.avatar);
        setDataNascimento(response.data.dataNascimento);
      } catch (err) {
        if (err.response?.status === 404) {
          setMensagem("Nenhum perfil encontrado. Você pode criar um.");
        } else {
          setErro("Erro ao criar o perfil");
          console.error(err);
        }
      }
    };
    carregarPerfil();
  }, [id]);

    //handleImageProfile
  const handleAvatar = async (e) => {
    const file = e.target.files[0]
      console.log(file);
    
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await cloudinaryUpload(file, "avatar");
      console.log("URL da imagem de avatar:", url);
    
      setAvatar(url);
    }catch (err) {
      console.error("Erro ao subir imagem de avatar:", err);
    }finally {
      setUploadingAvatar(false);
    }
  };

  //Para criar novo Perfil / Editar Perfil
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        sobrenome,
        avatar,
        dataNascimento,
      };
      await api.put(`/user/profile`, payload);
      setMensagem("Perfil atualizado com sucesso!");
      setErro(null);
      toast.success("Perfil cadastrado com sucesso!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setErro("Erro ao salvar o perfil.");
      console.error(err);
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[{ label: "Home", to: "/" }, 
          { label: "Meu Perfil", to: `/user/profile/${id}` }]}
        />
        <h2 className="mb-4 fs-1 fw-bold">Meu Perfil</h2>
        {mensagem && <Alert variant="success">{mensagem}</Alert>}
        {erro && <Alert variant="danger">{erro}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            {avatar && (
              <img
                src={avatar}
                alt="avatar"
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
                  name="avatar"
                  type="file"
                  accept="image/*"
                  className="rounded-5 w-100"
                  style={{
                    heigh: "200px",
                    borderRadius: "200px",
                  }}
                  onChange={handleAvatar}
                  disabled={!modoEdicao}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Nome do usuário
                </Form.Label>
                <Form.Control
                  name="nome"
                  className="w-100"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
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
                  value={sobrenome}
                  onChange={(e) => setSobrenome(e.target.value)}
                  disabled={!modoEdicao}
                  style={{ width: "200px", fontSize: "1.2rem" }}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-4 px-5">
                <Form.Label className="fs-3 fw-bold text-start w-100">
                  Data de Nascimento
                </Form.Label>
                <InputMask
                  mask="99/99/9999"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  disabled={!modoEdicao}
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
                    {id ? "Salvar Alterações" : "Criar Perfil"}
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
