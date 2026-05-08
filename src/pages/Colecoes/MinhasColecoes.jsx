import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import { PlusCircle, Collection, Search } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useColecao } from "../../hooks/useColecao";
import { fetchMinhasColecoes } from "../../services/userService";
import api from "../../services/api";
import "./Colecao.css"

export default function MinhasColecoes() {
  const [busca, setBusca] = useState("");
  const [colecoes, setColecoes] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [colecaoSelecionada, setColecaoSelecionada] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [mensagem, setMensagem] = useState(null);
  const navigate = useNavigate();

  // const { colecoes, erro, carregando, navigate } = useColecao();

  //busca as coleções do usuário
  useEffect(() => {
    const buscarColecoes = async () => {
      try {
        const response = await fetchMinhasColecoes();
        setColecoes(response.data);
      } catch (error) {
        setErro("Erro ao carregar suas coleções.");
        console.error("Erro ao buscar coleções:", error);
      } finally {
        setCarregando(false);
      }
    };
    buscarColecoes();
  }, []);

  const abrirModal = (e, colecao) => {
    e.stopPropagation(); // evita navegar para a colecao ao clicar em ações
    setColecaoSelecionada(colecao);
    setModalShow(true);
  };

  const confirmarExclusao = async () => {
    if (!colecaoSelecionada) return;
    setExcluindo(true);
    try {
      await api.delete(`/colecoes/${colecaoSelecionada._id}`);
      setColecoes((prev) =>
        prev.filter((c) => c._id !== colecaoSelecionada._id),
      );
      setModalShow(false);
      setColecaoSelecionada(null);
      setMensagem("Coleção excluída com sucesso!");
      setTimeout(() => setMensagem(null), 3000);
    } catch (err) {
      console.error("Erro ao excluir coleção:", err);
    } finally {
      setExcluindo(false);
    }
  };

  const irParaEdicao = () => {
    const id = colecaoSelecionada._id;
    navigate(`/colecoes/${id}/editar`);
  };

  const colecoesFiltradas = colecoes.filter((c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  if (carregando)
    return (
      <LayoutGeral>
        <section className="colecao-section">
          <Container className="text-center py-5">
            <Spinner animation="border" variant="secondary" />
          </Container>
        </section>
      </LayoutGeral>
    );

  if (erro || colecoes === null)  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Minhas coleções", to: "/userProfile/me/colecoes" },
              ]}
            />
            <p>{erro || "Não existem coleções para este usuário"}</p>
            <Col className="text-end">
              <Button
                variant="primary"
                onClick={() => navigate(`/colecoes/criar`)}
              >
                <PlusCircle className="me-2" size={18} />
                Nova Coleção
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );

  // return (
  //   <LayoutGeral>
  //     <section id="artigo" className="block artigo-block">
  //       <Container className="my-5">
  //         <Row className="mb-4 align-items-center">
  //           <Navegacao
  //             itens={[
  //               { label: "Home", to: "/" },
  //               { label: "Minhas coleções", to: "/user/colecoes" },
  //             ]}
  //           />
  //           <Col xs={12} md={8}>
  //             <h3 className="fw-bold text-primary d-flex align-items-center">
  //               <Collection className="me-2" /> Minhas Coleções
  //             </h3>
  //           </Col>
  //           <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
  //             <Link
  //               to="/colecoes/criar"
  //               className="btn btn-primary d-flex align-items-center justify-content-center"
  //               style={{ gap: "0.5rem", width: "fit-content", float: "right" }}
  //             >
  //               <PlusCircle /> Criar Nova
  //             </Link>
  //           </Col>
  //         </Row>

  //         <Row className="mb-4">
  //           <Col md={6} lg={4}>
  //             <Form.Control
  //               type="text"
  //               placeholder="Buscar coleção..."
  //               value={busca}
  //               onChange={(e) => setBusca(e.target.value)}
  //             />
  //           </Col>
  //         </Row>

  //         <Row className="gy-4">
  //           {colecoes.length > 0 ? (
  //             colecoes.map((colecao) => (
  //               <Col
  //                 xs={12}
  //                 md={6}
  //                 lg={4}
  //                 key={colecao._id}
  //                 onClick={() => navigate(`/colecoes/${colecao._id}`)}
  //               >
  //                 <Card className="shadow-sm border-0 rounded-3 colecao-card">
  //                   <Card.Body>
  //                     <Card.Title className="fw-bold mb-2 text-dark">
  //                       {colecao.nome}
  //                     </Card.Title>
  //                     <Card.Text className="text-muted small mb-2">
  //                       {colecao.descricao}
  //                     </Card.Text>
  //                     <Card.Img variant="top" src={colecao.capa} />
  //                     <Card.Text className="text-muted small mb-3">
  //                       <strong>{colecao.totalCartas}</strong> cartas • Criada
  //                       em{" "}
  //                       {new Date(colecao.dataCriacao).toLocaleDateString(
  //                         "pt-BR",
  //                       )}
  //                     </Card.Text>
  //                     <Link
  //                       to={`/colecoes/${colecao._id}`}
  //                       className="btn btn-outline-primary btn-sm"
  //                     >
  //                       Ver Coleção
  //                     </Link>
  //                   </Card.Body>
  //                 </Card>
  //               </Col>
  //             ))
  //           ) : (
  //             <p className="text-center text-muted mt-4">
  //               Nenhuma coleção encontrada.
  //             </p>
  //           )}
  //         </Row>
  //         {/* Modal de Ações */}
  //         <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
  //           <Modal.Header closeButton>
  //             <Modal.Title>Ações da Coleção</Modal.Title>
  //           </Modal.Header>
  //           <Modal.Body>
  //             <p className="fw-bold">{colecaoSelecionada?.nome}</p>
  //             <p>Deseja editar ou excluir esta coleção?</p>
  //           </Modal.Body>
  //           <Modal.Footer>
  //             <Button variant="secondary" onClick={() => setModalShow(false)}>
  //               Cancelar
  //             </Button>
  //             <Button variant="danger" onClick={confirmarExclusao}>
  //               Excluir
  //             </Button>
  //             <Button variant="primary" onClick={irParaEdicao}>
  //               Editar
  //             </Button>
  //           </Modal.Footer>
  //         </Modal>
  //       </Container>
  //     </section>
  //   </LayoutGeral>
  // );
  
  return (
    <LayoutGeral>
      <section className="colecao-section">
        <Container>
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Dashboard", to: "/usuario/dashboard" },
              { label: "Minhas Coleções", to: "/usuario/colecoes" },
            ]}
          />

          {/* Header */}
          <div className="colecao-page-header">
            <h1 className="colecao-page-title">
              <Collection size={22} />
              Minhas Coleções
            </h1>
            <Button
              size="sm"
              className="px-3 bg-dark fw-bold"
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
          {erro && (
            <Alert variant="danger" className="mb-3">
              {erro}
            </Alert>
          )}

          {/* Busca */}
          {colecoes.length > 0 && (
            <Form.Control
              size="sm"
              placeholder="Buscar coleção..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="mb-3"
              style={{ maxWidth: 280 }}
            />
          )}

          {/* Grid */}
          {colecoesFiltradas.length === 0 ? (
            <div className="estado-vazio">
              <p>
                {colecoes.length === 0
                  ? "Você ainda não criou nenhuma coleção."
                  : "Nenhuma coleção encontrada com esse nome."}
              </p>
              {colecoes.length === 0 && (
                <Button
                  size="sm"
                  className="px-3 bg-dark fw-bold"
                  onClick={() => navigate("/colecoes/criar")}
                >
                  Criar minha primeira coleção
                </Button>
              )}
            </div>
          ) : (
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {colecoesFiltradas.map((col) => (
                <Col key={col._id}>
                  <div
                    className="colecao-card h-100"
                    onClick={() => navigate(`/colecoes/${col._id}`)}
                  >
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
                        <span>
                          {new Date(col.dataCriacao).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>

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
                          onClick={(e) => abrirModal(e, col)}
                        >
                          Excluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          style={{ fontSize: "0.76rem" }}
                          onClick={() => navigate(`/colecoes/${col._id}`)}
                        >
                          Ver
                        </Button>
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
            Excluir coleção
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "0.9rem" }}>
          Tem certeza que deseja excluir a coleção{" "}
          <strong>"{colecaoSelecionada?.nome}"</strong>? Todas as cartas serão
          removidas.
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
}
