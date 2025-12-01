import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { PlusCircle, Collection, Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import agido from "../../assets/imgs/Yugioh/agido.jpg";
import charizard from "../../assets/imgs/Pokemon/Charizard-Base-SEt-art-pkmn-900x900.jpg";
import liliana from "../../assets/imgs/Magic/liliana-vess-1920_jpg.jpg";

export default function ColecoesHome() {
  const [colecoes, setColecoes] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    // ========== MOCK TEMPORÁRIO ==========
    // Substituir futuramente por:
    // axios.get("/api/colecoes")
    setColecoes([
      {
        _id: "c1",
        nome: "Coleção Raras 2025",
        descricao: "Cartas raras coletadas nos últimos campeonatos.",
        cartas: ["", false],
        totalCartas: 52,
        dono: "Pasquale",
        capa: agido,
        dataCriacao: "2025-10-22",
      },
      {
        _id: "c2",
        nome: "Decks Estratégicos",
        descricao: "Cartas com alta sinergia para decks de controle.",
        cartas: ["", false],
        totalCartas: 37,
        dono: "Pasquale",
        capa: charizard,
        dataCriacao: "2025-09-15",
      },
      {
        _id: "c3",
        nome: "Coleção Elementais",
        descricao: "Coleção temática de cartas baseadas em elementos mágicos.",
        cartas: ["", false],
        totalCartas: 64,
        dono: "Pasquale",
        capa: liliana,
        dataCriacao: "2025-07-10",
      },
    ]);
    // =====================================
  }, []);

  const colecoesFiltradas = colecoes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );
  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todoas as coleções", to: "/colecoes" },
              ]}
            />
            <Col xs={12} md={8}>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" /> Minhas Coleções
              </h3>
            </Col>
            <Col xs={12} md={4} className="text-md-end mt-3 mt-md-0">
              <Link
                to="/colecoes/criar"
                className="btn btn-primary d-flex align-items-center justify-content-center"
                style={{ gap: "0.5rem", width: "fit-content", float: "right" }}
              >
                <PlusCircle /> Criar Nova
              </Link>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6} lg={4}>
              <Form.Control
                type="text"
                placeholder="Buscar coleção..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </Col>
          </Row>

          <Row className="gy-4">
            {colecoesFiltradas.length > 0 ? (
              colecoesFiltradas.map((colecao) => (
                <Col xs={12} md={6} lg={4} key={colecao._id}>
                  <Card className="shadow-sm border-0 rounded-3 colecao-card">
                    <Card.Body>
                      <Card.Title className="fw-bold mb-2 text-dark">
                        {colecao.nome}
                      </Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        {colecao.descricao}
                      </Card.Text>
                      <Card.Img
                        variant="top"
                        src={colecao.capa}
                      />
                      <Card.Text className="text-muted small mb-3">
                        <strong>{colecao.totalCartas}</strong> cartas • Criada
                        em{" "}
                        {new Date(colecao.dataCriacao).toLocaleDateString(
                          "pt-BR"
                        )}
                      </Card.Text>
                      <Link
                        to={`/colecoes/${colecao._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Ver Coleção
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-muted mt-4">
                Nenhuma coleção encontrada.
              </p>
            )}
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
}
