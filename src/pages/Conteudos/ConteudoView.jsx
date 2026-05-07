import { Container, Col, Row, Image, Button, Form } from "react-bootstrap";
import {
  ArrowLeft,
  PlusCircle,
  PencilSquare,
  Trash3,
  Collection,
  FlagFill
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
import "./Conteudo.css";

// ── Utilitário ────────────────────────────────
const TIPO_LABEL = {
  noticia:    "Notícia",
  artigo:     "Artigo",
  evento:     "Evento",
  campeonato: "Campeonato",
};

function formatarData(data, opcoes = { day: "2-digit", month: "long", year: "numeric" }) {
  return new Date(data).toLocaleDateString("pt-BR", opcoes);
}


export default function ConteudoView() {
  const {tipo: tipoParam, id} = useParams();

  const {usuario, token}=useContext(AuthContext);
  const { 
    conteudo, 
    setConteudo, 
    erro,
    navigate,
    denunciaMotivo,
    setDenunciaMotivo,
    showDenuncia,
    setShowDenuncia,
    salvando,
    setSalvando,
    handleDenunciarConteudo,
    excluirConteudo,
  } = useConteudo(id);

  const isAutor = usuario?._id === conteudo?.autor?._id;
  const isAdmin = usuario?.tipo === "admin";
  const podeEditar = isAutor || isAdmin;

  //url para compartilhar
  const url = `${window.location.origin}/conteudos/${tipoParam}/${id}`;

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
        <section id="conteudo" className="conteudo-section">
          <Container className="text-center py-5">
              <Navegacao
                itens={[
                  { label: "Home", to: "/" },
                  { label: "Todos os Conteudos", to: `/conteudos` },
                  { label: "Conteudo" },
                ]}
              />
              <div className="text-center text-danger mt-5">{erro}</div>
          </Container>
        </section>
      </LayoutGeral>
    );
  if (!conteudo)
    return (
      <LayoutGeral>
        <section id="conteudo" className="conteudo-section">
          <Container className="text-center py-5">
              <Navegacao
                itens={[
                  { label: "Home", to: "/" },
                  { label: "Todos os Conteudos", to: `/conteudo` },
                  { label: "Conteudo" },
                ]}
              />
              <div className="text-center text-danger mt-5">Carregando...</div>
          </Container>
        </section>
      </LayoutGeral>
    );

  // return (
  //   <LayoutGeral>
  //     <section id="conteudo" className="conteudo-section">
  //       <Container className="my-5">
  //         <Row className="justify-content-center">
  //           <Navegacao
  //             itens={[
  //               { label: "Home", to: "/" },
  //               { label: "Todos os Conteudos", to: `/conteudos` },
  //               { label: "Conteudo" },
  //             ]}
  //           />

  //           <Row>
  //             {/* Botões de Share e Likes */}
  //             <div className="d-flex align-items-center gap-2 flex-wrap">
  //               <BotaoLike
  //                 curtido={curtido}
  //                 curtidasTotais={curtidasTotais}
  //                 onClick={toggleLike}
  //               />

  //               <ShareLinks url={url} title={conteudo?.titulo} />

  //               {/* Campo de denúncia */}
  //               <div className="d-flex align-items-center gap-2 flex-wrap">
  //                 {usuario && !isAutor && (
  //                   <Button
  //                     variant="link"
  //                     size="sm"
  //                     className="p-0 text-warning text-decoration-none fs-3 fw-bold text-start w-100"
  //                     style={{ fontSize: "0.78rem" }}
  //                     onClick={() => setShowDenuncia((v) => !v)}
  //                   >
  //                     <FlagFill className="me-1" />
  //                     Denunciar
  //                   </Button>
  //                 )}

  //                 {showDenuncia && (
  //                   <div className="px-3 pb-3 d-flex gap-2 align-items-center flex-wrap">
  //                     <Form.Control
  //                       size="sm"
  //                       placeholder="Motivo da denúncia..."
  //                       value={denunciaMotivo}
  //                       onChange={(e) => setDenunciaMotivo(e.target.value)}
  //                       style={{ maxWidth: 300 }}
  //                     />
  //                     <Button
  //                       size="sm"
  //                       variant="warning"
  //                       onClick={handleDenunciarConteudo}
  //                       disabled={salvando}
  //                     >
  //                       Enviar
  //                     </Button>
  //                     <Button
  //                       size="sm"
  //                       variant="outline-secondary"
  //                       onClick={() => setShowDenuncia(false)}
  //                     >
  //                       Cancelar
  //                     </Button>
  //                   </div>
  //                 )}
  //               </div>

  //               {/* Voltar/Editar/Excluir */}
  //               <Col className="text-end">
  //                 <Button
  //                   variant="outline-secondary"
  //                   className="me-2"
  //                   onClick={() => navigate("/conteudos")}
  //                 >
  //                   <ArrowLeft className="me-1" /> Voltar
  //                 </Button>

  //                 <Button
  //                   variant="outline-secondary"
  //                   className="me-2"
  //                   onClick={() =>
  //                     navigate(`/conteudos/${tipoParam}/${id}/editar`)
  //                   }
  //                 >
  //                   Editar
  //                 </Button>
  //                 <Button variant="danger" onClick={() => excluirConteudo()}>
  //                   <Trash3 className="me-1" /> Excluir
  //                 </Button>
  //               </Col>
  //             </div>
  //           </Row>

  //           <Col md={10}>
  //             <h1 className="fw-bold fs-2 lh-sm mb-2">{conteudo.titulo}</h1>
  //             <h5 className="text-muted mb-4 fw-bold fs-2 lh-sm mb-2">
  //               {conteudo.subTitulo}
  //             </h5>
  //             <div className="text-muted small mb-3 meta-conteudo">
  //               <span>
  //                 <strong>Autor:</strong>{" "}
  //                 {conteudo.autor?.usuario ||
  //                   conteudo.autor?.nome ||
  //                   "Desconhecido"}
  //               </span>
  //               <span className="text-muted small mb-3 meta-conteudo ">•</span>
  //               <span>
  //                 <strong>Publicado em:</strong>{" "}
  //                 {new Date(conteudo.dataPublicacao).toLocaleDateString(
  //                   "pt-BR",
  //                   {
  //                     day: "2-digit",
  //                     month: "long",
  //                     year: "numeric",
  //                   },
  //                 )}
  //               </span>
  //             </div>

  //             <Col md={10}>
  //               <div>
  //                 {conteudo.dataEvento && (
  //                   <div className="d-flex flex-wrap gap-3 align-items-center text-muted small mb-3 meta-conteudo ">
  //                     <p>
  //                       <strong>Data do Evento: </strong>
  //                       {new Date(conteudo.dataEvento).toLocaleDateString(
  //                         "pt-BR",
  //                       )}
  //                     </p>
  //                   </div>
  //                 )}

  //                 {conteudo.valorEntrada !== undefined && (
  //                   <div className="d-flex flex-wrap gap-3 align-items-center text-muted small mb-3 meta-conteudo ">
  //                     <strong>Entrada:</strong>{" "}
  //                     {conteudo.valorEntrada === 0 ||
  //                     conteudo.valorEntrada === "0"
  //                       ? "Entrada gratuita"
  //                       : `R$ ${parseFloat(conteudo.valorEntrada).toFixed(2)}`}
  //                   </div>
  //                 )}
  //               </div>
  //             </Col>

  //             <div className="d-flex flex-wrap gap-3 align-items-center text-muted small mb-3 meta-conteudo">
  //               Tags: <strong>{conteudo.tipo}</strong>
  //             </div>

  //             {conteudo.thumbs && (
  //               <Image
  //                 src={conteudo.thumbs}
  //                 width={700}
  //                 height={200}
  //                 className="img-fluid rounded mb-3"
  //                 alt="imagem do conteudo"
  //               />
  //             )}
  //             <div
  //               className="fs-5 lh-lg text-dark corpo-conteudo"
  //               style={{ whiteSpace: "pre-line" }}
  //               dangerouslySetInnerHTML={{ __html: conteudo.texto }}
  //             ></div>
  //           </Col>
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
      <section className="conteudo-section">
        <Container>
          {/* Navegação */}
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Conteúdos", to: "/conteudos" },
              { label: conteudo.titulo, to: "#" },
            ]}
          />

          {/* ── Card do artigo ── */}
          <article className="conteudo-card">
            {/* Imagem de capa — fora do padding, ocupa a largura toda */}
            {conteudo.thumbs && (
              <img
                src={conteudo.thumbs}
                alt={conteudo.titulo}
                className="conteudo-capa"
              />
            )}

            <div className="conteudo-corpo-wrapper">
              {/* Badge de tipo */}
              <span className="conteudo-tipo-badge">
                {TIPO_LABEL[conteudo.tipo] || conteudo.tipo}
              </span>

              {/* Título */}
              <h1 className="conteudo-titulo">{conteudo.titulo}</h1>

              {/* Subtítulo */}
              {conteudo.subTitulo && (
                <p className="conteudo-subtitulo">{conteudo.subTitulo}</p>
              )}

              {/* Meta: autor · data · tag */}
              <div className="conteudo-meta">
                <span>
                  Por{" "}
                  <strong>
                    {conteudo.autor?.usuario ||
                      conteudo.autor?.nome ||
                      "Desconhecido"}
                  </strong>
                </span>
                <span className="conteudo-meta-separador">·</span>
                <span>{formatarData(conteudo.dataPublicacao)}</span>
                <span className="conteudo-meta-separador">·</span>
                <span className="conteudo-tag">
                  {TIPO_LABEL[conteudo.tipo] || conteudo.tipo}
                </span>
              </div>

              {/* Info de evento/campeonato */}
              {(conteudo.dataEvento && conteudo.valorEntrada !== undefined) && (
                <div className="conteudo-evento-info">
                  {conteudo.dataEvento && (
                    <span>
                      📅 <strong>Data do evento:</strong>{" "}
                      {formatarData(conteudo.dataEvento)}
                    </span>
                  )}
                  {conteudo.valorEntrada !== undefined && (
                    <span>
                      🎟 <strong>Entrada:</strong>{" "}
                      {conteudo.valorEntrada === 0 ||
                      conteudo.valorEntrada === "0"
                        ? "Gratuita"
                        : `R$ ${parseFloat(conteudo.valorEntrada).toFixed(2)}`}
                    </span>
                  )}
                </div>
              )}

              {/* ── Barra de ações ── */}
              <div className="conteudo-acoes">
                {/* Esquerda: like + share + denunciar */}
                <BotaoLike
                  curtido={curtido}
                  curtidasTotais={curtidasTotais}
                  onClick={toggleLike}
                />
                <ShareLinks url={url} title={conteudo?.titulo} />

                {usuario && !isAutor && (
                  <button
                    className="btn-denuncia"
                    onClick={() => setShowDenuncia((v) => !v)}
                    title="Denunciar conteúdo"
                  >
                    <FlagFill size={13} />
                    Denunciar
                  </button>
                )}

                {/* Direita: editar + excluir */}
                {podeEditar && (
                  <div className="conteudo-acoes-direita">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() =>
                        navigate(`/conteudos/${tipoParam}/${id}/editar`)
                      }
                    >
                      <PencilSquare className="me-1" size={13} />
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => excluirConteudo()}
                    >
                      <Trash3 className="me-1" size={13} />
                      Excluir
                    </Button>
                  </div>
                )}

                <Button
                  variant="link"
                  size="sm"
                  className="text-secondary text-decoration-none ms-1 p-0"
                  style={{ fontSize: "0.82rem" }}
                  onClick={() => navigate("/conteudos")}
                >
                  <ArrowLeft size={13} className="me-1" />
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
                    onClick={handleDenunciarConteudo}
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

              {/* ── Corpo do artigo ── */}
              <div
                className="corpo-conteudo"
                dangerouslySetInnerHTML={{ __html: conteudo.texto }}
              />
            </div>
          </article>

          {/* ── Comentários ── */}
          <div className="comentarios-wrapper">
            <Comentarios
              comentarios={comentarios}
              criarComentario={criarComentario}
              deletarComentario={deletarComentario}
              curtirComentario={curtirComentario}
              usuario={usuario}
            />
          </div>
        </Container>
      </section>
    </LayoutGeral>
  );
}
