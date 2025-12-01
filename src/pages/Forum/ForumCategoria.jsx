import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import { useEffect } from "react";
import useForum from "../../hooks/useForum";
import ForumTopicoCard from "../../components/ForumComponentes/ForumTopicoCard";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ForumCategoria() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const { categoriaAtual, carregarCategoria, loading, forum, forumCategoria } = useForum();

  useEffect(() => {
    if (categoriaId) carregarCategoria(categoriaId);
  }, [categoriaId]);

  const handleNovoTopico = () => {
    navigate(`/forum/categorias/${categoriaId}/topicos`);
  };

  const handleAbrirTopico = (id) => {
    navigate(`/forum/topicos/${id}`);
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Breadcrumb>
            <Breadcrumb.Item onClick={() => navigate("/forum")}>
              Fórum
            </Breadcrumb.Item>
            <Breadcrumb.Item active>
              {categoriaAtual?.nome || "Categoria"}
            </Breadcrumb.Item>
          </Breadcrumb>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Row className="align-items-center mb-4">
                <Navegacao
                  itens={[
                    { label: "Home", to: "/" },
                    { label: "Forum", to: "/forum" },
                    { label: "Forum Categoria", to: "/forum/categoria" },
                  ]}
                />
                <Col>
                  <h3 className="fw-bold">{categoriaAtual?.nome}</h3>
                  <p className="text-muted">{categoriaAtual?.descricao}</p>
                </Col>
                <Col xs="auto">
                  <Button variant="primary" onClick={handleNovoTopico}>
                    + Novo Tópico
                  </Button>
                </Col>
              </Row>

              <Row className="g-3">
                {forumCategoria.topicos.length > 0 ? (
                  forumCategoria.topicos.map((topico) => (
                    <Col key={topico._id} md={12}>
                      <ForumTopicoCard
                        title={topico.titulo}
                        author={topico.autor || "Usuário"}
                        posts={topico.posts}
                        views={topico.visualizacoes}
                        lastPost={topico.ultimoPost}
                        onClick={() => handleAbrirTopico(topico._id)}
                      />
                    </Col>
                  ))
                ) : (
                  <p className="text-center text-muted py-4">
                    Nenhum tópico criado nesta categoria ainda.
                  </p>
                )}
              </Row>
            </>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
