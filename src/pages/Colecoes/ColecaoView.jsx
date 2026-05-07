import { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PlusCircle,
  PencilSquare,
  Trash3,
  Collection,
  FlagFill
} from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useColecao } from "../../hooks/useColecao";
import { AuthContext } from "../../context/AuthContext";
import { useLike } from "../../hooks/useLikes";
import { useComentarios } from "../../hooks/useComentarios";
import { criarDenuncia } from "../../services/denunciasService";
import api from "../../services/api"
import Comentarios from "../../components/Comentarios/Comentarios";
import BotaoLike from "../../components/BotaoLike/BotaoLike";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ShareLinks from "../../components/ShareLinks/ShareLinks";
import { toast } from "react-toastify";
import { MinusCircle } from "lucide-react";
import "./Colecao.css"

export default function ColecaoView() {
  const { colecaoId } = useParams();
  const [cartas, setCartas] = useState([]);
  const [cartasLoading, setCartasLoading] = useState(true);
  const [uploadingCapa, setUploadingCapa] = useState(false);
  const [denunciaMotivo, setDenunciaMotivo] = useState("");
  const [showDenuncia, setShowDenuncia] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const { usuario, token, isAdmin } = useContext(AuthContext);

  //hook das coleções
  const { colecoes, excluirColecao, navigate, setColecoes } = useColecao();
  const colecao = colecoes?.find((c) => c._id === colecaoId);
  const isDono = usuario?._id === colecao?.dono?._id;
  const podeEditar = isDono || isAdmin;

  //url para compartilhar
  const url = `${window.location.origin}/colecoes/${colecaoId}`;

  //hook dos likes
  const { curtido, curtidasTotais, toggleLike } = useLike(
    colecaoId,
    "colecao",
    token,
  );

  //hook dos comentários
  const {
    comentarios,
    criarComentario,
    deletarComentario,
    curtirComentario,
  } = useComentarios(colecaoId,"colecao",token);

  //lidar com população de cartas, caso exista
  useEffect(() => {
    const fetchCartas = async () => {
      try {
        const res = await api.get(`/colecoes/${colecaoId}/cartas`);
        setCartas(res.data);
      } catch (error) {
        console.error("Erro ao buscar cartas:", error);
      } finally {
        setCartasLoading(false);
      }
    };
    if (colecaoId) fetchCartas();
  }, [colecaoId]);

  //denuncia
  const denunciarColecao = async () => {
    if (!denunciaMotivo.trim()) return;
    setSalvando(true);
    try {
      await criarDenuncia({
        denunciado: colecao.dono?._id, // ID do dono da colecao
        targetId: colecao._id, // ID do post
        targetTipo: "colecao",
        motivo: denunciaMotivo,
      });
      setShowDenuncia(false);
      setDenunciaMotivo("");
      toast.success("Denúncia enviada. Obrigado!");
    } catch {
      toast.error("Erro ao enviar denúncia.");
    } finally {
      setSalvando(false);
    }
  };

  if (!colecao)
    return (
      <LayoutGeral>
        <section className="colecao-section">
          <Container className="text-center py-5">
            <Spinner animation="border" variant="secondary" />
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
  //               { label: "Todoas as coleções", to: "/colecoes" },
  //               { label: "Colecao", to: `/colecoes/${colecaoId}` },
  //             ]}
  //           />

  //           <div className="d-flex align-items-center gap-2 flex-wrap">
  //             {/* Botões de Share e Likes */}
  //             <BotaoLike
  //               curtido={curtido}
  //               curtidasTotais={curtidasTotais}
  //               onClick={toggleLike}
  //             />
  //             <ShareLinks url={url} title={colecao?.nome} />

  //             {/* Campo de denúncia */}
  //             <div className="d-flex align-items-center gap-2 flex-wrap">
  //               {usuario && !isDono && (
  //                 <Button
  //                   variant="link"
  //                   size="sm"
  //                   className="p-0 text-warning text-decoration-none fs-3 fw-bold text-start w-100"
  //                   style={{ fontSize: "0.78rem" }}
  //                   onClick={() => setShowDenuncia((v) => !v)}
  //                 >
  //                   <FlagFill className="me-1" />
  //                   Denunciar
  //                 </Button>
  //               )}

  //               {showDenuncia && (
  //                 <div className="px-3 pb-3 d-flex gap-2 align-items-center flex-wrap">
  //                   <Form.Control
  //                     size="sm"
  //                     placeholder="Motivo da denúncia..."
  //                     value={denunciaMotivo}
  //                     onChange={(e) => setDenunciaMotivo(e.target.value)}
  //                     style={{ maxWidth: 300 }}
  //                   />
  //                   <Button
  //                     size="sm"
  //                     variant="warning"
  //                     onClick={denunciarColecao}
  //                     disabled={salvando}
  //                   >
  //                     Enviar
  //                   </Button>
  //                   <Button
  //                     size="sm"
  //                     variant="outline-secondary"
  //                     onClick={() => setShowDenuncia(false)}
  //                   >
  //                     Cancelar
  //                   </Button>
  //                 </div>
  //               )}
  //             </div>

  //             <Col className="text-end">
  //               <Button
  //                 variant="outline-secondary"
  //                 className="me-2"
  //                 onClick={() => navigate("/colecoes")}
  //               >
  //                 <ArrowLeft className="me-1" /> Voltar
  //               </Button>
  //               <Link
  //                 to={`/colecoes/${colecaoId}/cartas/editar`}
  //                 className="btn btn-outline-primary me-2"
  //               >
  //                 <PencilSquare className="me-1" /> Editar
  //               </Link>
  //               <Button
  //                 variant="danger"
  //                 onClick={() => excluirColecao(colecaoId)}
  //               >
  //                 <Trash3 className="me-1" /> Excluir
  //               </Button>
  //             </Col>
  //           </div>

  //           {/* Titulo e Descrição */}
  //           <Col>
  //             <h3 className="fw-bold fs-2 lh-sm mb-2">
  //               <Collection className="me-2" /> {colecao.nome}
  //             </h3>
  //             <p className="text-muted mb-4 fw-bold fs-3 lh-sm mb-2">
  //               {colecao.descricao}
  //             </p>
  //             <small className="text-muted small mb-3 ">
  //               Criada por <strong>{colecao.dono.usuario}</strong> em{" "}
  //               {new Date(colecao.dataCriacao).toLocaleDateString("pt-BR") ||
  //                 "Data desconhecida"}
  //             </small>
  //           </Col>
  //         </Row>

  //         <Row className="gy-4">
  //           <h3 className="text-muted fs-5 mb-3">Cartas da coleção</h3>
  //           {cartas.length > 0 ? (
  //             cartas.map((carta) => (
  //               <Col xs={12} sm={6} md={4} lg={3} key={carta.cartaID}>
  //                 <Card className="shadow-sm border-0 rounded-3 carta-card">
  //                   <div className="carta-imagem-wrapper">
  //                     <Card.Img
  //                       variant="top"
  //                       src={carta.carta.imagem}
  //                       alt={carta.carta.nome}
  //                     />
  //                   </div>
  //                   <Card.Body>
  //                     <Card.Title className="fs-6 fw-semibold">
  //                       Nome: {carta.carta.nome}
  //                     </Card.Title>
  //                     <Card.Text className="text-muted small">
  //                       Jogo: {carta.carta.jogo}
  //                     </Card.Text>
  //                     <Card.Text className="text-muted small">
  //                       Set: {carta.carta.setNome}
  //                     </Card.Text>
  //                     <Card.Text className="text-muted small">
  //                       Raridade: {carta.carta.raridade}
  //                     </Card.Text>
  //                     <Card.Text className="text-muted small">
  //                       Printagem: {carta.carta.printagem}
  //                     </Card.Text>
  //                     <Card.Text className="text-muted small">
  //                       Quantidade: {carta.quantidade}
  //                     </Card.Text>
  //                   </Card.Body>
  //                 </Card>
  //               </Col>
  //             ))
  //           ) : (
  //             <div>
  //               <p className="text-center text-muted mt-4 fs-4">
  //                 Nenhuma carta adicionada nesta coleção ainda.
  //               </p>
  //               <Button
  //                 className="p-5 fw-bold fs-3 bg-success w-50"
  //                 onClick={() => navigate(`/colecoes/${colecaoId}/cartas`)}
  //               >
  //                 <PlusCircle className="me-1" />
  //                 Adicionar cartas
  //               </Button>
  //             </div>
  //           )}
  //           {colecao.dono?._id && (
  //             <div className="d-flex gap-3">
  //               <Button
  //                 className="bg-warning p-5 fw-bold fs-3 w-50 "
  //                 onClick={() => navigate(`/colecoes/${colecaoId}/editar`)}
  //               >
  //                 <PlusCircle className="me-1" />
  //                 Editar Coleção
  //               </Button>
  //               <Button
  //                 className="bg-danger p-5 fw-bold fs-3 w-50"
  //                 onClick={() => excluirColecao(colecaoId)}
  //               >
  //                 <MinusCircle className="me-1" />
  //                 Excluir Coleção
  //               </Button>
  //             </div>
  //           )}
  //         </Row>
  //         {/* Comentários */}
  //         <Row>
  //           <Comentarios
  //             comentarios={comentarios}
  //             criarComentario={criarComentario}
  //             deletarComentario={deletarComentario}
  //             curtirComentario={curtirComentario}
  //             usuario={usuario}
  //           />
  //         </Row>
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
              { label: "Coleções", to: "/colecoes" },
              { label: colecao.nome, to: `/colecoes/${colecaoId}` },
            ]}
          />

          {/* ── Card de cabeçalho da coleção ── */}
          <div className="colecao-view-header">
            {/* Capa */}
            {colecao.capa ? (
              <img
                src={colecao.capa}
                alt={colecao.nome}
                className="colecao-view-capa"
              />
            ) : (
              <div
                className="colecao-card-capa-placeholder"
                style={{ height: 200 }}
              >
                <Collection size={48} />
              </div>
            )}

            {/* Info */}
            <div className="colecao-view-info">
              <h1 className="colecao-view-nome">
                <Collection className="me-2" size={22} />
                {colecao.nome}
              </h1>
              {colecao.descricao && (
                <p className="colecao-view-descricao">{colecao.descricao}</p>
              )}
              <div className="colecao-view-meta">
                <span>
                  Criada por <strong>{colecao.dono?.usuario || "—"}</strong>
                </span>
                <span>
                  {new Date(colecao.dataCriacao).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span>
                  {cartas.length} carta{cartas.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Barra de ações */}
            <div className="colecao-view-acoes">
              <BotaoLike
                curtido={curtido}
                curtidasTotais={curtidasTotais}
                onClick={toggleLike}
              />
              <ShareLinks url={url} title={colecao?.nome} />

              {usuario && !isDono && (
                <button
                  className="btn-denuncia"
                  onClick={() => setShowDenuncia((v) => !v)}
                  title="Denunciar coleção"
                >
                  <FlagFill size={12} />
                  Denunciar
                </button>
              )}

              {podeEditar && (
                <div className="colecao-view-acoes-direita">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => navigate(`/colecoes/${colecaoId}/editar`)}
                  >
                    <PencilSquare className="me-1" size={12} />
                    Editar
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => excluirColecao(colecaoId)}
                  >
                    <Trash3 className="me-1" size={12} />
                    Excluir
                  </Button>
                </div>
              )}

              <Button
                variant="link"
                size="sm"
                className="text-secondary text-decoration-none p-0 ms-1"
                style={{ fontSize: "0.82rem" }}
                onClick={() => navigate("/colecoes")}
              >
                <ArrowLeft size={12} className="me-1" />
                Voltar
              </Button>
            </div>

            {/* Campo de denúncia */}
            {showDenuncia && (
              <div className="denuncia-form">
                <Form.Control
                  size="sm"
                  placeholder="Descreva o motivo da denúncia..."
                  value={denunciaMotivo}
                  onChange={(e) => setDenunciaMotivo(e.target.value)}
                  style={{ maxWidth: 320 }}
                />
                <Button
                  size="sm"
                  variant="danger"
                  onClick={denunciarColecao}
                  disabled={salvando || !denunciaMotivo.trim()}
                >
                  {salvando ? "Enviando..." : "Enviar"}
                </Button>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    setShowDenuncia(false);
                    setDenunciaMotivo("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>

          {/* ── Cartas ── */}
          <p className="cartas-section-title">Cartas da coleção</p>

          {cartasLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" variant="secondary" />
            </div>
          ) : cartas.length === 0 ? (
            <div className="estado-vazio">
              <p>Nenhuma carta adicionada nesta coleção ainda.</p>
              {isDono && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/colecoes/${colecaoId}/cartas`)}
                >
                  <PlusCircle className="me-1" size={13} />
                  Adicionar cartas
                </Button>
              )}
            </div>
          ) : (
            <>
              <Row xs={2} sm={3} md={4} lg={5} className="g-3 mb-4">
                {cartas.map((carta) => (
                  <Col key={carta._id}>
                    <div className="carta-card">
                      <img src={carta.carta.imagem} alt={carta.carta.nome} />
                      <div className="card-body">
                        <div className="card-title">{carta.carta.nome}</div>
                        <p className="card-text">Jogo: {carta.carta.jogo}</p>
                        <p className="card-text">Set: {carta.carta.setNome}</p>
                        <p className="card-text">
                          Raridade: {carta.carta.raridade}
                        </p>
                        <p className="card-text">
                          Quantidade: {carta.quantidade}
                        </p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Botões de gestão — só para o dono */}
              {isDono && (
                <div className="d-flex gap-2 mb-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/colecoes/${colecaoId}/cartas/editar`)
                    }
                  >
                    <PencilSquare className="me-1" size={13} />
                    Editar cartas
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => excluirColecao(colecaoId)}
                  >
                    <MinusCircle className="me-1" size={13} />
                    Excluir coleção
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ── Comentários ── */}
          <Comentarios
            comentarios={comentarios}
            criarComentario={criarComentario}
            deletarComentario={deletarComentario}
            curtirComentario={curtirComentario}
            usuario={usuario}
          />
        </Container>
      </section>
    </LayoutGeral>
  );
}
