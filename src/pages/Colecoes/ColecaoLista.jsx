import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { PlusCircle, ArrowLeft, Collection } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useParams } from "react-router-dom";
import { useListarColecao } from "../../hooks/useListarColecao";

export default function ColecaoLista() {
  const [loading, setLoading] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  
  //para identificar caso o usuário veja suas próprias coleções
  //e permitir que ele edite elas
  const { id } = useParams();

  const {
      colecoes,
      erro,
      navigate,
    } = useListarColecao(`https://illusoes-bootstrap.onrender.com/colecoes`);

  //se o usuário dono das coleções estiver na página
    useEffect(() => {
      if (id) {
        setModoEdicao(true);
      }
    }, [id]);

  

  if (loading) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas as Coleções", to: "/colecoes" },
            ]}
          />
          <p className="mt-3">Carregando as coleções...</p>
        </Container>
      </LayoutGeral>
    );
  }
  if (erro) {
    return (
      <LayoutGeral>
        <Container className="my-5 py-5">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Todas as Coleções", to: "/colecoes" },
            ]}
          />
          <p className="mt-3">{erro}</p>
        </Container>
      </LayoutGeral>
    );
  }

  return (
    <LayoutGeral>
      <Container className="my-5 py-5">
        <Navegacao
          itens={[
            { label: "Home", to: "/" },
            { label: "Todas as Coleções", to: "/colecoes" },
          ]}
        />
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="fw-bold text-primary d-flex align-items-center">
              <Collection className="me-2" />
              Todas as Coleções
            </h3>
          </Col>
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

        {colecoes.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>Você ainda não possui coleções criadas.</p>
            <Button
              onClick={() => navigate(`/colecoes/criar`)}
              variant="outline-primary"
            >
              Criar minha primeira coleção
            </Button>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={3} className="g-4">
            {colecoes.map((col) => (
              <Col key={col._id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={col.capa}
                    alt={col.nome}
                    style={{
                      height: "180px",
                      objectFit: "cover",
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="fw-semibold">{col.nome}</Card.Title>
                    <Card.Text className="text-muted small">
                      {col.descricao}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        {col.totalCartas} cartas
                      </small>
                      <div>
                        {modoEdicao && (
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            className="me-2"
                            onClick={() => navigate(`/colecoes/${col._id}`)}
                          >
                            Editar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => navigate(`/colecoes/${col._id}`)}
                        >
                          Ver
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </LayoutGeral>
  );
}
