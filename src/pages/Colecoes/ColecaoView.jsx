import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PlusCircle,
  PencilSquare,
  Trash3,
  Collection,
} from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useColecao } from "../../hooks/useColecao";
import { AuthContext } from "../../context/AuthContext";
import { useLike } from "../../hooks/useLikes";
import { useComentarios } from "../../hooks/useComentarios";
import api from "../../services/api"
import Comentarios from "../../components/Comentarios/Comentarios";
import BotaoLike from "../../components/BotaoLike/BotaoLike";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import ShareLinks from "../../components/ShareLinks/ShareLinks";

export default function ColecaoView() {
  const { colecaoId } = useParams();
  const [cartas, setCartas] = useState([]);
  const { usuario, token } = useContext(AuthContext);

  //hook das coleções
  const { colecoes, excluirColecao, navigate, setColecoes } = useColecao();
  const colecao = colecoes?.find((c) => c._id === colecaoId);
  const isDono = usuario?._id === colecao?.dono?._id;

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
        const cartasExistentes = res.data;
        setCartas(cartasExistentes);
      } catch (error) {
        console.error("erro ao buscar cartas:", error);
      }
    };
    if (colecaoId) fetchCartas();
  }, [colecaoId]);

  if (!colecao)
    return <p className="text-center mt-5">Carregando coleção...</p>;

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todoas as coleções", to: "/colecoes" },
                { label: "Colecao", to: `/colecoes/${colecaoId}` },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" /> {colecao.nome}
              </h3>
              <p className="text-muted mb-0">{colecao.descricao}</p>
              <small className="text-secondary">
                Criada por <strong>{colecao.dono.usuario}</strong> em{" "}
                {new Date(colecao.dataCriacao).toLocaleDateString("pt-BR") ||
                  "Data desconhecida"}
              </small>
            </Col>

            {/* Botões de Share e Likes */}
            <BotaoLike
              curtido={curtido}
              curtidasTotais={curtidasTotais}
              onClick={toggleLike}
            />
            <ShareLinks
            url={url}
            title={colecao?.nome}/>

            <Col className="text-end">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => navigate("/colecoes")}
              >
                <ArrowLeft className="me-1" /> Voltar
              </Button>
              <Link
                to={`/colecoes/${colecaoId}/cartas/editar`}
                className="btn btn-outline-primary me-2"
              >
                <PencilSquare className="me-1" /> Editar
              </Link>
              <Button
                variant="danger"
                onClick={() => excluirColecao(colecaoId)}
              >
                <Trash3 className="me-1" /> Excluir
              </Button>
            </Col>
          </Row>

          <Row className="gy-4">
            <h3 className="fw-bold text-primary d-flex align-items-center">
              Cartas da coleção
            </h3>
            {cartas.length > 0 ? (
              cartas.map((carta) => (
                <Col xs={12} sm={6} md={4} lg={3} key={carta.cartaID}>
                  <Card className="shadow-sm border-0 rounded-3 carta-card">
                    <div className="carta-imagem-wrapper">
                      <Card.Img
                        variant="top"
                        src={carta.carta.imagem}
                        alt={carta.carta.nome}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fs-6 fw-semibold">
                        Nome: {carta.carta.nome}
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        Jogo: {carta.carta.jogo}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Set: {carta.carta.setNome}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Raridade: {carta.carta.raridade}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Printagem: {carta.carta.printagem}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Quantidade: {carta.quantidade}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <div>
                <p className="text-center text-muted mt-4">
                  Nenhuma carta adicionada nesta coleção ainda.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/colecoes/${colecaoId}/cartas`)}
                >
                  <PlusCircle className="me-1" />
                  Adicionar cartas
                </Button>
              </div>
            )}
            {colecao.dono?._id && (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/colecoes/${colecaoId}/editar`)}
                >
                  <PlusCircle className="me-1" />
                  Editar Coleção
                </Button>
                <Button
                  variant="danger"
                  onClick={() => excluirColecao(colecaoId)}
                >
                  <PlusCircle className="me-1" />
                  Excluir Coleção
                </Button>
              </>
            )}
          </Row>
          {/* Comentários */}
          <Row>
            <Comentarios
              comentarios={comentarios}
              criarComentario={criarComentario}
              deletarComentario={deletarComentario}
              curtirComentario={curtirComentario}
              usuario={usuario}
            />
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
