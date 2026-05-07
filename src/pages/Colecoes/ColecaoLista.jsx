import { useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";
import {
  PlusCircle,
  ArrowLeft,
  Collection,
  Trash3,
  PencilSquare,
} from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useColecao } from "../../hooks/useColecao";
import { AuthContext } from "../../context/AuthContext";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import api from "../../services/api";
import "./Colecao.css";

export default function ColecaoLista() {
  const [loading, setLoading] = useState(false);
  // const [mensagem, setMensagem] = useState(null);
  const {usuario} = useContext(AuthContext)
  
  //hook das coleções
  const { 
    mensagem, 
    setMensagem, 
    colecoes, 
    setColecoes, 
    erro, 
    navigate } = useColecao();

  const handleExcluir = async(colecaoId)=>{{
    const confirmar = window.confirm("Tem certeza que deseja deletar a coleção?");
    if(!confirmar) return;

    try{
      await api.delete(`/colecoes/${colecaoId}`);
      //atualizar aqui
      setColecoes((prev) => prev.filter((c) => c._id !== colecaoId));
      setMensagem("Coleção deletada com sucesso!")

      setTimeout(()=> setMensagem(null), 3000)
      }catch(erro){
        console.error("Erro ao deletar a coleção: ", erro);
      }
    }
  }
  
  if (!colecoes)
    return (
      <LayoutGeral>
        <section className="colecao-section">
          <Container className="text-center py-5">
            <Spinner animation="border" variant="secondary" />
          </Container>
        </section>
      </LayoutGeral>
    );

  if (erro)
    return (
      <LayoutGeral>
        <section className="colecao-section">
          <Container>
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Coleções", to: "/colecoes" },
              ]}
            />
            <Alert variant="danger">{erro}</Alert>
          </Container>
        </section>
      </LayoutGeral>
    );

  // return (
  //   <LayoutGeral>
  //     <Container className="my-5 py-5">
  //       <Navegacao
  //         itens={[
  //           { label: "Home", to: "/" },
  //           { label: "Todas as Coleções", to: "/colecoes" },
  //         ]}
  //       />
  //       <Row className="mb-4 align-items-center">
  //         <Col>
  //           <h3 className="fw-bold text-primary d-flex align-items-center">
  //             <Collection className="me-2" />
  //             Todas as Coleções
  //           </h3>
  //           {mensagem && <Alert variant="success">{mensagem}</Alert>}
  //           {erro && <Alert variant="danger">{erro}</Alert>}
  //         </Col>
  //         <Col className="text-end">
  //           <Button
  //             variant="primary"
  //             onClick={() => navigate(`/colecoes/criar`)}
  //           >
  //             <PlusCircle className="me-2" size={18} />
  //             Nova Coleção
  //           </Button>
  //         </Col>
  //       </Row>

  //       {colecoes.length === 0 ? (
  //         <div className="text-center text-muted mt-5">
  //           <p>Você ainda não possui coleções criadas.</p>
  //           <Button
  //             onClick={() => navigate(`/colecoes/criar`)}
  //             variant="outline-primary"
  //           >
  //             Criar minha primeira coleção
  //           </Button>
  //         </div>
  //       ) : (
  //         <Row xs={1} sm={2} md={3} lg={3} className="g-4">
  //           {colecoes.map((col) => {
  //             const donoId =
  //               typeof col.dono === "object" ? col.dono._id : col.dono;

  //             const isDono = usuario?._id?.toString() === donoId?.toString();

  //             // console.log("USUARIO LOGADO: ", usuario?._id)
  //             // console.log("DONO RAW: ", isDono);

  //             return (
  //               <Col key={col._id}>
  //                 <Card className="h-100 shadow-sm">
  //                   <Card.Img
  //                     variant="top"
  //                     src={col.capa}
  //                     alt={col.nome}
  //                     style={{
  //                       height: "180px",
  //                       objectFit: "cover",
  //                     }}
  //                   />
  //                   <Card.Body>
  //                     <Card.Title className="fw-semibold">
  //                       {col.nome}
  //                     </Card.Title>
  //                     <Card.Text className="text-muted small">
  //                       {col.descricao}
  //                     </Card.Text>
  //                     <Card.Text className="text-muted small">
  //                       Criado por:{" "}
  //                       {col.dono?.usuario || "Usuário desconhecido"}
  //                     </Card.Text>
  //                     <div className="d-flex justify-content-between align-items-center mt-3">
  //                       <small className="text-muted">
  //                         {col.totalCartas} cartas
  //                       </small>
  //                       <div>
  //                         {isDono && (
  //                           <div>
  //                             <Button
  //                               size="sm"
  //                               variant="outline-secondary"
  //                               className="me-2"
  //                               onClick={() =>
  //                                 navigate(`/colecoes/${col._id}/editar`)
  //                               }
  //                             >
  //                               Editar
  //                             </Button>
  //                             <Button
  //                               size="sm"
  //                               variant="danger"
  //                               className="me-2"
  //                               onClick={() => handleExcluir(col._id)}
  //                             >
  //                               Excluir
  //                             </Button>
  //                           </div>
  //                         )}
  //                         <Button
  //                           size="sm"
  //                           variant="primary"
  //                           onClick={() => navigate(`/colecoes/${col._id}`)}
  //                         >
  //                           Ver
  //                         </Button>
  //                       </div>
  //                     </div>
  //                   </Card.Body>
  //                 </Card>
  //               </Col>
  //             );
  //           })}
  //         </Row>
  //       )}
  //     </Container>
  //   </LayoutGeral>
  // );
  return (
    <LayoutGeral>
      <section className="colecao-section">
        <Container>
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Coleções", to: "/colecoes" },
            ]}
          />

          {/* Header */}
          <div className="colecao-page-header">
            <h1 className="colecao-page-title">
              <Collection size={22} />
              Todas as Coleções
            </h1>
            <Button
              variant="primary"
              size="sm"
              className="px-3"
              onClick={() => navigate("/colecoes/criar")}
            >
              <PlusCircle className="me-1" size={14} />
              Nova coleção
            </Button>
          </div>

          {mensagem && (
            <Alert variant="success" className="mb-3">
              {mensagem}
            </Alert>
          )}

          {/* Grid */}
          {colecoes.length === 0 ? (
            <div className="estado-vazio">
              <p>Nenhuma coleção encontrada.</p>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => navigate("/colecoes/criar")}
              >
                Criar a primeira coleção
              </Button>
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {colecoes.map((col) => {
                const donoId =
                  typeof col.dono === "object" ? col.dono._id : col.dono;
                const isDono = usuario?._id?.toString() === donoId?.toString();

                return (
                  <Col key={col._id}>
                    <div
                      className="colecao-card h-100"
                      onClick={() => navigate(`/colecoes/${col._id}`)}
                    >
                      {/* Capa */}
                      {col.capa ? (
                        <img
                          src={col.capa}
                          alt={col.nome}
                          className="colecao-card-capa"
                        />
                      ) : (
                        <div className="colecao-card-capa-placeholder">
                          <Collection size={32} />
                        </div>
                      )}

                      <div className="colecao-card-body">
                        <div className="colecao-card-nome">{col.nome}</div>
                        <div className="colecao-card-descricao">
                          {col.descricao}
                        </div>

                        <div className="colecao-card-meta">
                          <span>{col.totalCartas ?? 0} cartas</span>
                          <span>por {col.dono?.usuario || "—"}</span>
                        </div>

                        {/* Ações — só para o dono */}
                        {isDono && (
                          <div
                            className="colecao-card-acoes"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              style={{ fontSize: "0.76rem" }}
                              onClick={() =>
                                navigate(`/colecoes/${col._id}/editar`)
                              }
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              style={{ fontSize: "0.76rem" }}
                              onClick={() => handleExcluir(col._id)}
                            >
                              Excluir
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
