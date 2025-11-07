import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  PencilSquare,
  Trash3,
  Collection,
} from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function ColecaoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [colecao, setColecao] = useState(null);

  useEffect(() => {
    // ========== MOCK TEMPORÁRIO ==========
    // Substituir futuramente por:
    // axios.get(`/api/colecoes/${id}`)
    setColecao({
      _id: id,
      nome: "Coleção Raras 2025",
      descricao: "Cartas raras coletadas nos últimos campeonatos.",
      criador: "Pasquale",
      dataCriacao: "2025-10-22",
      cartas: [
        {
          _id: "c1",
          nome: "Dragão de Fogo Supremo",
          tipo: "Lendária",
          imagem: "/cards/dragao.jpg",
        },
        {
          _id: "c2",
          nome: "Feiticeiro das Sombras",
          tipo: "Épica",
          imagem: "/cards/feiticeiro.jpg",
        },
        {
          _id: "c3",
          nome: "Guardião Elemental",
          tipo: "Rara",
          imagem: "/cards/guardiao.jpg",
        },
        {
          _id: "c4",
          nome: "Arqueiro Élfico",
          tipo: "Comum",
          imagem: "/cards/arqueiro.jpg",
        },
      ],
    });
    // =====================================
  }, [id]);

  const handleExcluir = () => {
    if (window.confirm("Tem certeza que deseja excluir esta coleção?")) {
      // ========== MOCK TEMPORÁRIO ==========
      // axios.delete(`/api/colecoes/${id}`)
      console.log("Coleção excluída:", id);
      navigate("/colecoes");
    }
  };

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
                { label: "Todoas as coleções", to: "/colecoes/colecao" },
                { label: "Colecao" },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" /> {colecao.nome}
              </h3>
              <p className="text-muted mb-0">{colecao.descricao}</p>
              <small className="text-secondary">
                Criada por <strong>{colecao.criador}</strong> em{" "}
                {new Date(colecao.dataCriacao).toLocaleDateString("pt-BR")}
              </small>
            </Col>
            <Col className="text-end">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => navigate("/colecoes")}
              >
                <ArrowLeft className="me-1" /> Voltar
              </Button>
              <Link
                to={`/colecoes/editar/${colecao._id}`}
                className="btn btn-outline-primary me-2"
              >
                <PencilSquare className="me-1" /> Editar
              </Link>
              <Button variant="danger" onClick={handleExcluir}>
                <Trash3 className="me-1" /> Excluir
              </Button>
            </Col>
          </Row>

          <Row className="gy-4">
            {colecao.cartas && colecao.cartas.length > 0 ? (
              colecao.cartas.map((carta) => (
                <Col xs={12} sm={6} md={4} lg={3} key={carta._id}>
                  <Card className="shadow-sm border-0 rounded-3 carta-card">
                    <div className="carta-imagem-wrapper">
                      <Card.Img
                        variant="top"
                        src={carta.imagem || "/cards/placeholder.jpg"}
                        alt={carta.nome}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title className="fs-6 fw-semibold">
                        {carta.nome}
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        {carta.tipo}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-muted mt-4">
                Nenhuma carta adicionada nesta coleção ainda.
              </p>
            )}
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
