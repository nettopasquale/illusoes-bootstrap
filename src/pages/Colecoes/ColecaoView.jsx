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

     //limpar a coleção
  const handleRemoverTodasCartas = async () => {
    if (!isDono) return;
 
    const confirmacao = window.confirm(
      "Tem certeza que deseja remover todas as cartas da coleção?",
    );
    if (!confirmacao) return;
    try {
      await api.delete(`/colecoes/${colecaoId}/cartas`);
      setCartas([]);
    } catch (error) {
      console.error();
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
              {usuario && <ShareLinks url={url} title={colecao?.nome} />}

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
                    onClick={() => handleRemoverTodasCartas()}
                  >
                    <MinusCircle className="me-1" size={13} />
                    Excluir cartas
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
