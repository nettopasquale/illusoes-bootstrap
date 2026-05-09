import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Badge,
  Spinner,
  Alert,
  Button,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  cancelarDenuncia, 
  listarTodasDenuncias, 
  listarMinhasDenuncias
} from "../../services/denunciasService"
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import "./Denuncia.css"

// ── Utilitários ───────────────────────────────────

const STATUS_META = {
  pendente:  { label: "Pendente",  bg: "warning",   text: "dark" },
  aprovada:  { label: "Aprovada",  bg: "danger",    text: "white" },
  rejeitada: { label: "Rejeitada", bg: "secondary", text: "white" },
  cancelada: { label: "Cancelada", bg: "light",     text: "dark" },
};

const TIPO_META = {
  topico:   "Tópico",
  postagem: "Postagem",
  conteudo: "Conteúdo",
  colecao:  "Coleção",
};

function BadgeStatus({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pendente;
  return (
    <Badge bg={meta.bg} text={meta.text} style={{ fontSize: "0.75rem" }}>
      {meta.label}
    </Badge>
  );
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}


export default function ListarDenuncias() {
  const { usuario, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [denuncias, setDenuncias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("");
  const [selecionadas, setSelecionadas] = useState([]);
  const [cancelando, setCancelando] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Carrega denúncias conforme o tipo de usuário
  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro(null);
      try {
        const { data } = isAdmin
          ? await listarTodasDenuncias(filtroStatus)
          : await listarMinhasDenuncias();
        setDenuncias(data);
      } catch {
        setErro("Erro ao carregar denúncias.");
        toast.error("Erro ao carregar denúncias.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [isAdmin, filtroStatus]);

  // ── Seleção (apenas usuário padrão) ──────────────

  const toggleSelecionada = (id) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const toggleTodas = () => {
    const cancelaveis = denuncias
      .filter((d) => d.status === "pendente")
      .map((d) => d._id);
    setSelecionadas((prev) =>
      prev.length === cancelaveis.length ? [] : cancelaveis,
    );
  };

  // ── Cancelar denúncias selecionadas ──────────────

  const handleCancelar = async () => {
    setCancelando(true);
    try {
      await Promise.all(selecionadas.map((id) => cancelarDenuncia(id)));
      setDenuncias((prev) =>
        prev.map((d) =>
          selecionadas.includes(d._id) ? { ...d, status: "cancelada" } : d,
        ),
      );
      setSelecionadas([]);
      setShowConfirm(false);
      toast.success(
        selecionadas.length === 1
          ? "Denúncia cancelada com sucesso."
          : `${selecionadas.length} denúncias canceladas.`,
      );
    } catch {
      toast.error("Erro ao cancelar denúncias.");
    } finally {
      setCancelando(false);
    }
  };

  // ── Render ────────────────────────────────────────

  const cancelaveis = denuncias.filter((d) => d.status === "pendente");
  const todasSelecionadas =
    cancelaveis.length > 0 &&
    selecionadas.length === cancelaveis.map((d) => d._id).length;

  // return (
  //   <LayoutGeral>
  //     <section id="artigo" className="block artigo-block">
  //       <Container fluid="lg" className="py-4">
  //         <Row className="justify-content-center">
  //           <Navegacao
  //             itens={[
  //               { label: "Home", to: "/" },
  //               { label: "Minhas Denúnicas", to: `/userProfile/me/denuncias` },
  //             ]}
  //           />
  //         </Row>
  //         {/* Header */}
  //         <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
  //           <div>
  //             <h1 className="h4 fw-bold mb-0">
  //               {isAdmin ? "Gerenciar Denúncias" : "Minhas Denúncias"}
  //             </h1>
  //             <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
  //               {isAdmin
  //                 ? "Avalie as denúncias enviadas pela comunidade"
  //                 : "Acompanhe e cancele suas denúncias"}
  //             </p>
  //           </div>

  //           {/* Filtro de status — só admin */}
  //           {isAdmin && (
  //             <Form.Select
  //               size="sm"
  //               value={filtroStatus}
  //               onChange={(e) => setFiltroStatus(e.target.value)}
  //               style={{ width: "auto" }}
  //             >
  //               <option value="">Todos os status</option>
  //               <option value="pendente">Pendentes</option>
  //               <option value="aprovada">Aprovadas</option>
  //               <option value="rejeitada">Rejeitadas</option>
  //               <option value="cancelada">Canceladas</option>
  //             </Form.Select>
  //           )}
  //         </div>

  //         {/* Ações em lote — só usuário padrão */}
  //         {!isAdmin && selecionadas.length > 0 && (
  //           <Alert
  //             variant="warning"
  //             className="d-flex align-items-center justify-content-between mb-3"
  //           >
  //             <span>
  //               {selecionadas.length} denúncia
  //               {selecionadas.length > 1 ? "s" : ""} selecionada
  //               {selecionadas.length > 1 ? "s" : ""}
  //             </span>
  //             <Button
  //               variant="danger"
  //               size="sm"
  //               onClick={() => setShowConfirm(true)}
  //               disabled={cancelando}
  //             >
  //               Cancelar selecionadas
  //             </Button>
  //           </Alert>
  //         )}

  //         {/* Conteúdo */}
  //         {loading ? (
  //           <div className="text-center py-5">
  //             <Spinner animation="border" variant="primary" />
  //           </div>
  //         ) : erro ? (
  //           <Alert variant="danger">{erro}</Alert>
  //         ) : denuncias.length === 0 ? (
  //           <div className="text-center py-5 text-muted">
  //             <p className="mb-0">
  //               {isAdmin
  //                 ? filtroStatus
  //                   ? `Nenhuma denúncia com status "${STATUS_META[filtroStatus]?.label}".`
  //                   : "Nenhuma denúncia registrada."
  //                 : "Você ainda não fez nenhuma denúncia."}
  //             </p>
  //           </div>
  //         ) : (
  //           <div className="card border rounded-3 overflow-hidden">
  //             <Table
  //               hover
  //               responsive
  //               className="mb-0"
  //               style={{ fontSize: "0.88rem" }}
  //             >
  //               <thead style={{ background: "#f8f9fa" }}>
  //                 <tr>
  //                   {/* Checkbox só para usuário padrão */}
  //                   {!isAdmin && (
  //                     <th style={{ width: 40 }}>
  //                       <Form.Check
  //                         type="checkbox"
  //                         checked={todasSelecionadas}
  //                         onChange={toggleTodas}
  //                         title="Selecionar todas as pendentes"
  //                         disabled={cancelaveis.length === 0}
  //                       />
  //                     </th>
  //                   )}
  //                   <th>Denunciado</th>
  //                   {isAdmin && <th>Autor</th>}
  //                   <th>Tipo</th>
  //                   <th>Motivo</th>
  //                   <th>Status</th>
  //                   <th>Data</th>
  //                   <th style={{ width: isAdmin ? 120 : 80 }}>Ação</th>
  //                 </tr>
  //               </thead>
  //               <tbody>
  //                 {denuncias.map((d) => (
  //                   <tr
  //                     key={d._id}
  //                     className={
  //                       !isAdmin && selecionadas.includes(d._id)
  //                         ? "table-warning"
  //                         : ""
  //                     }
  //                   >
  //                     {/* Checkbox */}
  //                     {!isAdmin && (
  //                       <td>
  //                         <Form.Check
  //                           type="checkbox"
  //                           checked={selecionadas.includes(d._id)}
  //                           onChange={() => toggleSelecionada(d._id)}
  //                           disabled={d.status !== "pendente"}
  //                         />
  //                       </td>
  //                     )}

  //                     {/* Denunciado */}
  //                     <td className="fw-medium">
  //                       {d.denunciado?.usuario || "—"}
  //                     </td>

  //                     {/* Autor — só admin vê */}
  //                     {isAdmin && (
  //                       <td className="text-muted">
  //                         {d.autor?.usuario || "—"}
  //                       </td>
  //                     )}

  //                     {/* Tipo */}
  //                     <td>
  //                       <Badge
  //                         bg="light"
  //                         text="dark"
  //                         className="border fw-normal"
  //                       >
  //                         {TIPO_META[d.targetTipo] || d.targetTipo}
  //                       </Badge>
  //                     </td>

  //                     {/* Motivo */}
  //                     <td
  //                       className="text-muted"
  //                       style={{
  //                         maxWidth: 220,
  //                         overflow: "hidden",
  //                         textOverflow: "ellipsis",
  //                         whiteSpace: "nowrap",
  //                       }}
  //                       title={d.motivo}
  //                     >
  //                       {d.motivo}
  //                     </td>

  //                     {/* Status */}
  //                     <td>
  //                       <BadgeStatus status={d.status} />
  //                     </td>

  //                     {/* Data */}
  //                     <td
  //                       className="text-muted"
  //                       style={{ whiteSpace: "nowrap" }}
  //                     >
  //                       {formatarData(d.createdAt)}
  //                     </td>

  //                     {/* Ação */}
  //                     <td>
  //                       {isAdmin ? (
  //                         d.status === "pendente" ? (
  //                           <Button
  //                             as={Link}
  //                             to={`/denuncias/${d._id}/avaliar`}
  //                             variant="outline-primary"
  //                             size="sm"
  //                           >
  //                             Avaliar
  //                           </Button>
  //                         ) : (
  //                           <Button
  //                             as={Link}
  //                             to={`/denuncias/${d._id}/avaliar`}
  //                             variant="outline-secondary"
  //                             size="sm"
  //                           >
  //                             Ver
  //                           </Button>
  //                         )
  //                       ) : (
  //                         d.status === "pendente" && (
  //                           <Button
  //                             variant="outline-danger"
  //                             size="sm"
  //                             onClick={() => {
  //                               setSelecionadas([d._id]);
  //                               setShowConfirm(true);
  //                             }}
  //                           >
  //                             Cancelar
  //                           </Button>
  //                         )
  //                       )}
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </Table>
  //           </div>
  //         )}
  //         {/* Modal de confirmação de cancelamento */}
  //         <Modal
  //           show={showConfirm}
  //           onHide={() => setShowConfirm(false)}
  //           centered
  //           size="sm"
  //         >
  //           <Modal.Header closeButton>
  //             <Modal.Title style={{ fontSize: "1rem" }}>
  //               Cancelar denúncia{selecionadas.length > 1 ? "s" : ""}
  //             </Modal.Title>
  //           </Modal.Header>
  //           <Modal.Body style={{ fontSize: "0.9rem" }}>
  //             Tem certeza que deseja cancelar{" "}
  //             {selecionadas.length === 1
  //               ? "esta denúncia"
  //               : `estas ${selecionadas.length} denúncias`}
  //             ? Esta ação não pode ser desfeita.
  //           </Modal.Body>
  //           <Modal.Footer>
  //             <Button
  //               variant="outline-secondary"
  //               size="sm"
  //               onClick={() => setShowConfirm(false)}
  //               disabled={cancelando}
  //             >
  //               Voltar
  //             </Button>
  //             <Button
  //               variant="danger"
  //               size="sm"
  //               onClick={handleCancelar}
  //               disabled={cancelando}
  //             >
  //               {cancelando ? "Cancelando..." : "Confirmar"}
  //             </Button>
  //           </Modal.Footer>
  //         </Modal>
  //       </Container>
  //     </section>
  //   </LayoutGeral>
  // );
 return (
   <LayoutGeral>
     <section className="pagina-section">
       <Container fluid="lg">
         <Navegacao
           itens={[
             { label: "Home", to: "/" },
             { label: "Dashboard", to: "/dashboard" },
             {
               label: isAdmin ? "Gerenciar Denúncias" : "Minhas Denúncias",
               to: "/denuncias",
             },
           ]}
         />

         {/* Header */}
         <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
           <div>
             <h1 className="pagina-titulo mb-4">
               {isAdmin ? "Gerenciar Denúncias" : "Minhas Denúncias"}
             </h1>
             <p className="pagina-subtitulo mb-0">
               {isAdmin
                 ? "Avalie as denúncias enviadas pela comunidade"
                 : "Acompanhe e cancele suas denúncias"}
             </p>
           </div>

           {isAdmin && (
             <Form.Select
               size="sm"
               value={filtroStatus}
               onChange={(e) => setFiltroStatus(e.target.value)}
               style={{ width: "auto" }}
             >
               <option value="">Todos os status</option>
               <option value="pendente">Pendentes</option>
               <option value="aprovada">Aprovadas</option>
               <option value="rejeitada">Rejeitadas</option>
               <option value="cancelada">Canceladas</option>
             </Form.Select>
           )}
         </div>

         {/* Barra de seleção em lote */}
         {!isAdmin && selecionadas.length > 0 && (
           <Alert
             variant="warning"
             className="d-flex align-items-center justify-content-between mb-3 py-2"
             style={{ fontSize: "0.85rem" }}
           >
             <span>
               {selecionadas.length} denúncia
               {selecionadas.length > 1 ? "s" : ""} selecionada
               {selecionadas.length > 1 ? "s" : ""}
             </span>
             <Button
               variant="danger"
               size="sm"
               onClick={() => setShowConfirm(true)}
               disabled={cancelando}
             >
               Cancelar selecionadas
             </Button>
           </Alert>
         )}

         {/* Conteúdo */}
         {loading ? (
           <div className="text-center py-5">
             <Spinner animation="border" variant="secondary" />
           </div>
         ) : erro ? (
           <Alert variant="danger" style={{ fontSize: "0.85rem" }}>
             {erro}
           </Alert>
         ) : denuncias.length === 0 ? (
           <div
             className="text-center py-5 text-muted"
             style={{ fontSize: "0.9rem" }}
           >
             {isAdmin
               ? filtroStatus
                 ? `Nenhuma denúncia com status "${STATUS_META[filtroStatus]?.label}".`
                 : "Nenhuma denúncia registrada."
               : "Você ainda não fez nenhuma denúncia."}
           </div>
         ) : (
           <div className="pagina-card p-0">
             <Table
               hover
               responsive
               className="mb-0"
               style={{ fontSize: "0.85rem" }}
             >
               <thead style={{ background: "#f8f9fa" }}>
                 <tr>
                   {!isAdmin && (
                     <th style={{ width: 40, padding: "0.75rem 1rem" }}>
                       <Form.Check
                         type="checkbox"
                         checked={todasSelecionadas}
                         onChange={toggleTodas}
                         disabled={cancelaveis.length === 0}
                         title="Selecionar todas as pendentes"
                       />
                     </th>
                   )}
                   <th>Denunciado</th>
                   {isAdmin && <th>Autor</th>}
                   <th>Tipo</th>
                   <th>Motivo</th>
                   <th>Status</th>
                   <th>Data</th>
                   <th style={{ width: isAdmin ? 110 : 90 }}>Ação</th>
                 </tr>
               </thead>
               <tbody>
                 {denuncias.map((d) => (
                   <tr
                     key={d._id}
                     className={
                       !isAdmin && selecionadas.includes(d._id)
                         ? "table-warning"
                         : ""
                     }
                   >
                     {!isAdmin && (
                       <td>
                         <Form.Check
                           type="checkbox"
                           checked={selecionadas.includes(d._id)}
                           onChange={() => toggleSelecionada(d._id)}
                           disabled={d.status !== "pendente"}
                         />
                       </td>
                     )}

                     <td className="fw-medium">
                       {d.denunciado?.usuario || "—"}
                     </td>

                     {isAdmin && (
                       <td className="text-muted">{d.autor?.usuario || "—"}</td>
                     )}

                     <td>
                       <Badge
                         bg="light"
                         text="dark"
                         className="border fw-normal"
                         style={{ fontSize: "0.7rem" }}
                       >
                         {TIPO_META[d.targetTipo] || d.targetTipo}
                       </Badge>
                     </td>

                     <td
                       className="text-muted"
                       style={{
                         maxWidth: 200,
                         overflow: "hidden",
                         textOverflow: "ellipsis",
                         whiteSpace: "nowrap",
                       }}
                       title={d.motivo}
                     >
                       {d.motivo}
                     </td>

                     <td>
                       <BadgeStatus status={d.status} />
                     </td>

                     <td
                       className="text-muted"
                       style={{ whiteSpace: "nowrap", fontSize: "0.78rem" }}
                     >
                       {formatarData(d.createdAt)}
                     </td>

                     <td>
                       {isAdmin ? (
                         <Button
                           as={Link}
                           to={`/denuncias/${d._id}/avaliar`}
                           variant={
                             d.status === "pendente"
                               ? "outline-primary"
                               : "outline-secondary"
                           }
                           size="sm"
                           style={{ fontSize: "0.75rem" }}
                         >
                           {d.status === "pendente" ? "Avaliar" : "Ver"}
                         </Button>
                       ) : (
                         d.status === "pendente" && (
                           <Button
                             variant="outline-danger"
                             size="sm"
                             style={{ fontSize: "0.75rem" }}
                             onClick={() => {
                               setSelecionadas([d._id]);
                               setShowConfirm(true);
                             }}
                           >
                             Cancelar
                           </Button>
                         )
                       )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </Table>
           </div>
         )}
       </Container>
     </section>

     {/* Modal de confirmação */}
     <Modal
       show={showConfirm}
       onHide={() => setShowConfirm(false)}
       centered
       size="sm"
     >
       <Modal.Header closeButton>
         <Modal.Title style={{ fontSize: "1rem" }}>
           Cancelar denúncia{selecionadas.length > 1 ? "s" : ""}
         </Modal.Title>
       </Modal.Header>
       <Modal.Body style={{ fontSize: "0.88rem" }}>
         Tem certeza que deseja cancelar{" "}
         {selecionadas.length === 1
           ? "esta denúncia"
           : `estas ${selecionadas.length} denúncias`}
         ? Esta ação não pode ser desfeita.
       </Modal.Body>
       <Modal.Footer>
         <Button
           variant="outline-secondary"
           size="sm"
           onClick={() => setShowConfirm(false)}
           disabled={cancelando}
         >
           Voltar
         </Button>
         <Button
           variant="danger"
           size="sm"
           onClick={handleCancelar}
           disabled={cancelando}
         >
           {cancelando ? "Cancelando..." : "Confirmar"}
         </Button>
       </Modal.Footer>
     </Modal>
   </LayoutGeral>
 );
}

