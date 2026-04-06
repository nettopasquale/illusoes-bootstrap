import { Container, Col, Row, Image, Button } from "react-bootstrap";
import {
  ArrowLeft,
  PlusCircle,
  PencilSquare,
  Trash3,
  Collection,
} from "react-bootstrap-icons";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useConteudo } from "../../hooks/useConteudo";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useParams, Link } from "react-router-dom";
import { useLike } from "../../hooks/useLikes";
import { useComentarios } from "../../hooks/useComentarios";
import Comentarios from "../../components/Comentarios/Comentarios";
import BotaoLike from "../../components/BotaoLike/BotaoLike";
import ShareLinks from "../../components/ShareLinks/ShareLinks";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ConteudoView() {
  const {tipo: tipoParam, id} = useParams();

  const {usuario, token}=useContext(AuthContext);
  const { 
    conteudo, 
    setConteudo, 
    erro,
    navigate, 
  } = useConteudo(id);

  const isDono = usuario?._id === conteudo?.autor?._id;

  console.log("Tipo Param: ", tipoParam);
  console.log("Id: ", id);
  console.log("Usuário: ", usuario);
  console.log("É dono: ", isDono);


  //url para compartilhar
  const url = `${window.location.origin}/conteudos/${tipoParam}/${id}`;
  console.log("URL: ", url)

    //hook dos likes
  const { 
    curtido, 
    curtidasTotais, 
    toggleLike 
  } = useLike(id,"conteudo",token);
  
    //hook dos comentários
  const {
    comentarios,
    criarComentario,
    deletarComentario,
    curtirComentario,
  } = useComentarios(id,"conteudo",token);

  if (erro)
    return (
      <LayoutGeral>
        <section id="conteudo" className="block evento-block">
          <Container className="my-5">
            <Row className="justify-content-center">
              <Navegacao
                itens={[
                  { label: "Home", to: "/" },
                  { label: "Todos os Conteudos", to: `/conteudos` },
                  { label: "Conteudo" },
                ]}
              />
              <div className="text-center text-danger mt-5">{erro}</div>
            </Row>
          </Container>
        </section>
      </LayoutGeral>
    );
  if (!conteudo)
    return (
      <LayoutGeral>
        <section id="conteudo" className="block evento-block">
          <Container className="my-5">
            <Row className="justify-content-center">
              <Navegacao
                itens={[
                  { label: "Home", to: "/" },
                  { label: "Todos os Conteudos", to: `/conteudo` },
                  { label: "Conteudo" },
                ]}
              />
              <div className="text-center mt-5">Carregando...</div>
            </Row>
          </Container>
        </section>
      </LayoutGeral>
    );

  return (
    <LayoutGeral>
      <section id="conteudo" className="block evento-block">
        <Container className="my-5">
          <Row className="justify-content-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todos os Conteudos", to: `/conteudos` },
                { label: "Conteudo" },
              ]}
            />

            <Row>
              {/* Botões de Share e Likes */}
              <BotaoLike
                curtido={curtido}
                curtidasTotais={curtidasTotais}
                onClick={toggleLike}
              />

              <ShareLinks url={url} title={conteudo?.titulo} />

              {/* Voltar/Editar/Excluir */}
              <Col className="text-end">
                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() => navigate("/conteudos")}
                >
                  <ArrowLeft className="me-1" /> Voltar
                </Button>

                <Button
                  variant="outline-secondary"
                  className="me-2"
                  onClick={() =>
                    navigate(`/conteudos/${tipoParam}/${id}/editar`)
                  }
                >
                  Editar
                </Button>

                {/* <Link
            to={`/conteudos/${tipoParam}/${id}/editar`}
            className="btn btn-outline-primary me-2"
            >
              <PencilSquare className="me-1" /> Editar
            </Link> */}
                <Button variant="danger" onClick={() => excluirConteudo()}>
                  <Trash3 className="me-1" /> Excluir
                </Button>
              </Col>
            </Row>

            <Col md={10}>
              <h1 className="fw-bold mb-2 text-start">{conteudo.titulo}</h1>
              <h5 className="text-muted mb-4 text-start">
                {conteudo.subTitulo}
              </h5>
              <div className="d-flex flex-wrap gap-3 align-items-center text-secondary mb-4">
                <span>
                  <strong>Autor:</strong>{" "}
                  {conteudo.autor?.usuario ||
                    conteudo.autor?.nome ||
                    "Desconhecido"}
                </span>
                <span className="text-muted">•</span>
                <span>
                  <strong>Publicado em:</strong>{" "}
                  {new Date(conteudo.dataPublicacao).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </span>
              </div>

              <Col md={10}>
                <div className="d-flex flex-wrap gap-3 align-items-center text-secondary mb-4 text-secondary">
                  {conteudo.dataEvento && (
                    <div>
                      <p>
                        <strong>Data do Evento: </strong>
                        {new Date(conteudo.dataEvento).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  )}

                  {conteudo.valorEntrada !== undefined && (
                    <div>
                      <strong>Entrada:</strong>{" "}
                      {conteudo.valorEntrada === 0 ||
                      conteudo.valorEntrada === "0"
                        ? "Entrada gratuita"
                        : `R$ ${parseFloat(conteudo.valorEntrada).toFixed(2)}`}
                    </div>
                  )}
                </div>
              </Col>

              <div className="my-3 text-muted text-start">
                Tags: <strong>{conteudo.tipo}</strong>
              </div>

              {conteudo.thumbs && (
                <Image
                  src={conteudo.thumbs}
                  width={700}
                  height={200}
                  className="img-fluid rounded mb-3"
                  alt="imagem do conteudo"
                />
              )}
              <div
                className="lead conteudo-html text-muted"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{ __html: conteudo.texto }}
              ></div>
            </Col>
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
