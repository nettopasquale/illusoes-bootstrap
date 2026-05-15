import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import CreatableSelect from "react-select/creatable";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import {fetchMeusConteudos} from "../../services/userService";
import "./Conteudoform.css";
import "./Conteudo.css";

const TIPO_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "noticia", label: "Notícias" },
  { value: "artigo", label: "Artigos" },
  { value: "evento", label: "Eventos" },
  { value: "campeonato", label: "Campeonatos" },
];

const TIPO_LABEL = {
  noticia: "Notícia",
  artigo: "Artigo",
  evento: "Evento",
  campeonato: "Campeonato",
};

const MeusConteudos = ()=>{
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const navigate = useNavigate();

  const buscarConteudos = async () => {
    setLoading(true);
    try {
      const tipo = tipoFiltro === "todos" ? undefined : tipoFiltro;
      const response = await fetchMeusConteudos(tipo);
      setConteudos(response.data);
    } catch (err) {
      setErro("Erro ao buscar conteúdos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarConteudos();
  }, [tipoFiltro]);

  const abrirModal = (e, conteudo) => {
    e.stopPropagation();
    setConteudoSelecionado(conteudo);
    setModalShow(true);
  };

  const confirmarExclusao = async () => {
    if (!conteudoSelecionado) return;
    setExcluindo(true);
    try {
      await api.delete(
        `/conteudos/${conteudoSelecionado.tipo}/${conteudoSelecionado._id}`,
      );
      setConteudos((prev) =>
        prev.filter((c) => c._id !== conteudoSelecionado._id),
      );
      setModalShow(false);
      setConteudoSelecionado(null);
      setMensagem("Conteúdo excluído com sucesso!");
      setTimeout(() => setMensagem(null), 3000);
    } catch (err) {
      console.error("Erro ao excluir conteúdo:", err);
    } finally {
      setExcluindo(false);
    }
  };

  const irParaEdicao = () => {
    if (!conteudoSelecionado) return;
    navigate(
      `/conteudos/${conteudoSelecionado.tipo}/${conteudoSelecionado._id}/editar`,
    );
  };

  const conteudosFiltrados = conteudos.filter((c) =>
    busca ? c.titulo.toLowerCase().includes(busca.toLowerCase()) : true,
  );

  return (
   <LayoutGeral>
     <section className="meus-conteudos-section">
       <Container>
         <Navegacao
           itens={[
             { label: "Home", to: "/" },
             { label: "Dashboard", to: "/dashboard" },
             { label: "Meus Conteúdos" },
           ]}
         />

         {/* Header */}
         <div className="conteudo-page-header">
           <h1 className="conteudo-page-title">Meus Conteúdos</h1>
           <div className="d-flex gap-2">
             {TIPO_OPTIONS.filter((t) => t.value !== "todos").map((t) => (
               <Button
                 key={t.value}
                 variant="outline-primary"
                 size="sm"
                 style={{ fontSize: "0.76rem" }}
                 onClick={() => navigate(`/conteudos/${t.value}/criar`)}
               >
                 <PlusCircle className="me-1" size={12} />
                 {t.label.slice(0, -1) /* remove 's' do plural */}
               </Button>
             ))}
           </div>
         </div>

         {mensagem && (
           <Alert variant="success" className="mb-3">
             {mensagem}
           </Alert>
         )}
         {erro && (
           <Alert variant="danger" className="mb-3">
             {erro}
           </Alert>
         )}

         {/* Filtros */}
         <div className="d-flex gap-2 mb-4 flex-wrap align-items-center">
           <Form.Control
             size="sm"
             placeholder="Buscar por título..."
             value={busca}
             onChange={(e) => setBusca(e.target.value)}
             style={{ maxWidth: 220 }}
           />
           <div className="d-flex gap-1 flex-wrap">
             {TIPO_OPTIONS.map((op) => (
               <button
                 key={op.value}
                 onClick={() => setTipoFiltro(op.value)}
                 style={{
                   fontSize: "0.76rem",
                   padding: "3px 10px",
                   borderRadius: 99,
                   border: "1px solid",
                   borderColor:
                     tipoFiltro === op.value
                       ? "var(--cor-destaque)"
                       : "var(--cor-borda)",
                   background:
                     tipoFiltro === op.value ? "var(--cor-destaque)" : "white",
                   color:
                     tipoFiltro === op.value
                       ? "white"
                       : "var(--cor-texto-suave)",
                   cursor: "pointer",
                   fontFamily: "var(--fonte-ui)",
                   transition: "all 0.15s",
                 }}
               >
                 {op.label}
               </button>
             ))}
           </div>
         </div>

         {/* Grid */}
         {loading ? (
           <div className="text-center py-5">
             <Spinner animation="border" variant="secondary" />
           </div>
         ) : conteudosFiltrados.length === 0 ? (
           <div className="estado-vazio">
             <p>
               {conteudos.length === 0
                 ? "Você ainda não publicou nenhum conteúdo."
                 : "Nenhum conteúdo encontrado com esses filtros."}
             </p>
           </div>
         ) : (
           <Row xs={1} sm={2} md={3} lg={4} className="g-3">
             {conteudosFiltrados.map((item) => (
               <Col key={item._id}>
                 <div
                   className="conteudo-list-card h-100"
                   onClick={() =>
                     navigate(`/conteudos/${item.tipo}/${item._id}`)
                   }
                 >
                   {item.thumbs ? (
                     <img
                       src={item.thumbs}
                       alt={item.titulo}
                       className="conteudo-list-card-img"
                     />
                   ) : (
                     <div
                       className="conteudo-list-card-img d-flex align-items-center justify-content-center"
                       style={{
                         background: "#f0f0f0",
                         color: "#aaa",
                         fontSize: "0.8rem",
                       }}
                     >
                       Sem imagem
                     </div>
                   )}

                   <div className="conteudo-list-card-body">
                     <div className="conteudo-list-card-tipo">
                       {TIPO_LABEL[item.tipo] || item.tipo}
                     </div>
                     <div className="conteudo-list-card-titulo">
                       {item.titulo}
                     </div>
                     <div className="conteudo-list-card-subtitulo">
                       {item.subTitulo}
                     </div>

                     <div className="conteudo-list-card-meta">
                       <span>
                         {new Date(item.dataPublicacao).toLocaleDateString(
                           "pt-BR",
                         )}
                       </span>
                       {/* Ações — stopPropagation para não navegar */}
                       <div
                         className="d-flex gap-1"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <button
                           onClick={() =>
                             navigate(
                               `/conteudos/${item.tipo}/${item._id}/editar`,
                             )
                           }
                           style={{
                             fontSize: "0.7rem",
                             padding: "1px 7px",
                             borderRadius: 4,
                             border: "1px solid var(--cor-borda)",
                             background: "white",
                             color: "var(--cor-texto-suave)",
                             cursor: "pointer",
                             fontFamily: "var(--fonte-ui)",
                           }}
                         >
                           Editar
                         </button>
                         <button
                           onClick={(e) => abrirModal(e, item)}
                           style={{
                             fontSize: "0.7rem",
                             padding: "1px 7px",
                             borderRadius: 4,
                             border: "1px solid #f5c6c6",
                             background: "#fff8f8",
                             color: "var(--cor-destaque)",
                             cursor: "pointer",
                             fontFamily: "var(--fonte-ui)",
                           }}
                         >
                           Excluir
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               </Col>
             ))}
           </Row>
         )}
       </Container>
     </section>

     {/* Modal de confirmação */}
     <Modal
       show={modalShow}
       onHide={() => setModalShow(false)}
       centered
       size="sm"
     >
       <Modal.Header closeButton>
         <Modal.Title style={{ fontSize: "1rem" }}>
           Excluir conteúdo
         </Modal.Title>
       </Modal.Header>
       <Modal.Body style={{ fontSize: "0.9rem" }}>
         Tem certeza que deseja excluir{" "}
         <strong>"{conteudoSelecionado?.titulo}"</strong>?
       </Modal.Body>
       <Modal.Footer>
         <Button
           variant="outline-secondary"
           size="sm"
           onClick={() => setModalShow(false)}
           disabled={excluindo}
         >
           Cancelar
         </Button>
         <Button
           variant="danger"
           size="sm"
           onClick={confirmarExclusao}
           disabled={excluindo}
         >
           {excluindo ? "Excluindo..." : "Confirmar"}
         </Button>
       </Modal.Footer>
     </Modal>
   </LayoutGeral>
 );
};

export default MeusConteudos