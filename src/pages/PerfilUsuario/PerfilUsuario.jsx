import { useContext, useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { cloudinaryUpload } from "../../utils/cloudinaryUpload"
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import InputMask from "react-input-mask";
import api from "../../services/api";
import "./Perfil.css"

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
  const [salvando, setSalvando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const response = await api.get(`/userProfile/me`);
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
      await api.put(`/userProfile/me`, payload);
      setMensagem("Perfil atualizado com sucesso!");
      setErro(null);
      toast.success("Perfil cadastrado com sucesso!");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setErro("Erro ao salvar o perfil.");
      console.error(err);
    }
  };

  // return (
  //   <LayoutGeral>
  //     <Container className="my-5 py-5">
  //       <Navegacao
  //         itens={[{ label: "Home", to: "/" }, 
  //         { label: "Meu Perfil", to: `/user/profile/${id}` }]}
  //       />
  //       <h2 className="mb-4 fs-1 fw-bold">Meu Perfil</h2>
  //       {mensagem && <Alert variant="success">{mensagem}</Alert>}
  //       {erro && <Alert variant="danger">{erro}</Alert>}
  //       <Form onSubmit={handleSubmit}>
  //         <Row>
  //           {avatar && (
  //             <img
  //               src={avatar}
  //               alt="avatar"
  //               className="mb-3"
  //               style={{ width: "150px", borderRadius: "50%" }}
  //             />
  //           )}
  //           <Col md={6}>
  //             <Form.Group className="mb-4 px-5">
  //               <Form.Label className="fs-3 fw-bold text-start w-100">
  //                 Avatar
  //               </Form.Label>
  //               <Form.Control
  //                 name="avatar"
  //                 type="file"
  //                 accept="image/*"
  //                 className="rounded-5 w-100"
  //                 style={{
  //                   heigh: "200px",
  //                   borderRadius: "200px",
  //                 }}
  //                 onChange={handleAvatar}
  //                 disabled={!modoEdicao}
  //               />
  //             </Form.Group>
  //           </Col>

  //           <Col md={6}>
  //             <Form.Group className="mb-4 px-5">
  //               <Form.Label className="fs-3 fw-bold text-start w-100">
  //                 Nome do usuário
  //               </Form.Label>
  //               <Form.Control
  //                 name="nome"
  //                 className="w-100"
  //                 value={nome}
  //                 onChange={(e) => setNome(e.target.value)}
  //                 disabled={!modoEdicao}
  //                 style={{ width: "200px", fontSize: "1.2rem" }}
  //               />
  //             </Form.Group>
  //           </Col>

  //           <Col md={6}>
  //             <Form.Group className="mb-4 px-5">
  //               <Form.Label className="fs-3 fw-bold text-start w-100">
  //                 Sobrenome
  //               </Form.Label>
  //               <Form.Control
  //                 name="sobreNome"
  //                 className="w-100"
  //                 value={sobrenome}
  //                 onChange={(e) => setSobrenome(e.target.value)}
  //                 disabled={!modoEdicao}
  //                 style={{ width: "200px", fontSize: "1.2rem" }}
  //               />
  //             </Form.Group>
  //           </Col>

  //           <Col md={6}>
  //             <Form.Group className="mb-4 px-5">
  //               <Form.Label className="fs-3 fw-bold text-start w-100">
  //                 Data de Nascimento
  //               </Form.Label>
  //               <InputMask
  //                 mask="99/99/9999"
  //                 value={dataNascimento}
  //                 onChange={(e) => setDataNascimento(e.target.value)}
  //                 disabled={!modoEdicao}
  //               >
  //                 {(inputProps) => <Form.Control {...inputProps} type="text" />}
  //               </InputMask>
  //             </Form.Group>
  //           </Col>
  //         </Row>

  //         <Row>
  //           <Col>
  //             <div className="d-flex justify-content-between mt-4 gap-5">
  //               <Button
  //                 className="p-5 fw-bold fs-3 bg-black w-50"
  //                 onClick={() => setModoEdicao(!modoEdicao)}
  //               >
  //                 {modoEdicao ? "Cancelar" : "Editar"}
  //               </Button>{" "}
  //               {modoEdicao && (
  //                 <Button
  //                   className="p-5 fw-bold fs-3 bg-black w-50"
  //                   onClick={handleSubmit}
  //                   type="submit"
  //                 >
  //                   {id ? "Salvar Alterações" : "Criar Perfil"}
  //                 </Button>
  //               )}
  //             </div>
  //           </Col>
  //         </Row>
  //       </Form>
  //     </Container>
  //   </LayoutGeral>
  // );
 
  return (
   <LayoutGeral>
     <section className="pagina-section">
       <Container style={{ maxWidth: 680 }}>
         <Navegacao
           itens={[
             { label: "Home", to: "/" },
             { label: "Dashboard", to: "/usuario/dashboard" },
             { label: "Meu Perfil" },
           ]}
         />

         {mensagem && (
           <Alert
             variant="success"
             className="mb-3"
             style={{ fontSize: "0.85rem" }}
           >
             {mensagem}
           </Alert>
         )}
         {erro && (
           <Alert
             variant="danger"
             className="mb-3"
             style={{ fontSize: "0.85rem" }}
           >
             {erro}
           </Alert>
         )}

         <div className="pagina-card">
           <div className="d-flex align-items-center justify-content-between mb-4">
             <h1 className="pagina-titulo mb-0">Meu Perfil</h1>
             <Button
               variant={modoEdicao ? "outline-secondary" : "outline-primary"}
               size="sm"
               onClick={() => {
                 setModoEdicao(!modoEdicao);
                 setMensagem("");
                 setErro("");
               }}
             >
               {modoEdicao ? "Cancelar" : "Editar perfil"}
             </Button>
           </div>

           <div className="d-flex gap-4 flex-wrap flex-md-nowrap">
             {/* Avatar */}
             <div className="perfil-avatar-wrapper" style={{ minWidth: 140 }}>
               {avatar ? (
                 <img src={avatar} alt="avatar" className="perfil-avatar" />
               ) : (
                 <div className="perfil-avatar-placeholder">👤</div>
               )}
               <div className="perfil-nome">
                 {usuario?.nome || usuario?.usuario}
               </div>
               <span
                 className="perfil-badge-tipo"
                 style={{
                   background:
                     usuario?.tipo === "admin" ? "#fde8e8" : "#e8f4fd",
                   color:
                     usuario?.tipo === "admin"
                       ? "var(--cor-destaque)"
                       : "#0d6efd",
                 }}
               >
                 {usuario?.tipo === "admin" ? "Admin" : "Membro"}
               </span>

               {modoEdicao && (
                 <div className="w-100 mt-2">
                   <Form.Label
                     className="text-muted"
                     style={{ fontSize: "0.75rem" }}
                   >
                     Trocar foto
                   </Form.Label>
                   <Form.Control
                     type="file"
                     accept="image/*"
                     size="sm"
                     onChange={handleAvatar}
                     disabled={uploadingAvatar}
                   />
                   {uploadingAvatar && (
                     <div className="text-center mt-1">
                       <Spinner size="sm" animation="border" />
                     </div>
                   )}
                 </div>
               )}
             </div>

             {/* Formulário */}
             <Form onSubmit={handleSubmit} className="flex-grow-1">
               <Form.Group className="mb-3">
                 <Form.Label>Nome de usuário</Form.Label>
                 <Form.Control
                   value={usuario?.nome || usuario?.usuario || ""}
                   disabled
                   style={{ background: "#f8f9fa" }}
                 />
                 <Form.Text
                   className="text-muted"
                   style={{ fontSize: "0.72rem" }}
                 >
                   O nome de usuário não pode ser alterado aqui.
                 </Form.Text>
               </Form.Group>

               <Form.Group className="mb-3">
                 <Form.Label>Sobrenome</Form.Label>
                 <Form.Control
                   value={sobrenome}
                   onChange={(e) => setSobrenome(e.target.value)}
                   disabled={!modoEdicao}
                   placeholder="Seu sobrenome"
                 />
               </Form.Group>

               <Form.Group className="mb-4">
                 <Form.Label>Data de nascimento</Form.Label>
                 <InputMask
                   mask="99/99/9999"
                   value={dataNascimento}
                   onChange={(e) => setDataNascimento(e.target.value)}
                   disabled={!modoEdicao}
                 >
                   {(inputProps) => (
                     <Form.Control
                       {...inputProps}
                       type="text"
                       placeholder="DD/MM/AAAA"
                     />
                   )}
                 </InputMask>
               </Form.Group>

               {modoEdicao && (
                 <div className="d-flex justify-content-end">
                   <Button
                     type="submit"
                     variant="primary"
                     size="sm"
                     className="px-4"
                     disabled={salvando || uploadingAvatar}
                     style={{
                       background: "var(--cor-destaque)",
                       border: "none",
                     }}
                   >
                     {salvando ? "Salvando..." : "Salvar alterações"}
                   </Button>
                 </div>
               )}
             </Form>
           </div>
         </div>
       </Container>
     </section>
   </LayoutGeral>
 );
};
