import { useEffect, useState } from "react";
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
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useListarColecao } from "../../hooks/useListarColecao";
import axios from "axios";

export default function ColecaoView() {
  const { id } = useParams();
  const [cartas, setCartas] = useState([]);

  const {
    colecoes: colecao,
    erro,
    navigate,
  } = useListarColecao(`http://localhost:8080/colecoes`);

  const handleExcluir = async() => {
    if (window.confirm("Tem certeza que deseja excluir esta coleção?")) {
      try{
        await axios.delete(`http://localhost:8080/colecoes/${id}`);
        console.log("Coleção excluída:", id);
        navigate("/colecoes");
      }catch(error){
        console.error("Erro ao deletar coleção.")
      }
    }
  };

  //lidar com população de cartas, caso exista
  useEffect(()=>{
    const fetchCartas = async()=>{
      try{
        const resposta = await axios.get(
          `http://localhost:8080/colecoes/${id}/cartas`,
        );
        setCartas(resposta.data);
      }catch(error){
        console.error("erro ao buscar cartas:", error)
      }
    };
    if(id) fetchCartas();
  },[id])

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
                { label: "Colecao", to: `/colecoes/${id}` },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" /> {colecao.nome}
              </h3>
              <p className="text-muted mb-0">{colecao.descricao}</p>
              <small className="text-secondary">
                Criada por <strong>{colecao.dono}</strong> em{" "}
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
                to={`/colecoes/${id}/cartas/editar`}
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
                  onClick={() => navigate(`/colecoes/${id}/cartas`)}
                >
                  <PlusCircle className="me-1" />
                  Adicionar cartas
                </Button>
              </div>
            )}
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
