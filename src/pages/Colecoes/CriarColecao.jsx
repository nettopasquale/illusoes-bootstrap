import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { PlusCircle, ArrowLeft, Collection } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

export default function CriarColecao() {
  const navigate = useNavigate();
  const { id } = useParams(); // usado caso seja modo edição
  const [modoEdicao, setModoEdicao] = useState(false);
  const [colecao, setColecao] = useState({
    nome: "",
    descricao: "",
    cartasSelecionadas: [],
  });
  const [todasCartas, setTodasCartas] = useState([]);

  useEffect(() => {
    // ========== MOCK TEMPORÁRIO ==========
    // Aqui futuramente entrará a chamada real ao backend:
    // axios.get("/api/cartas")
    setTodasCartas([
      { _id: "c1", nome: "Dragão de Fogo Supremo" },
      { _id: "c2", nome: "Feiticeiro das Sombras" },
      { _id: "c3", nome: "Guardião Elemental" },
      { _id: "c4", nome: "Arqueiro Élfico" },
      { _id: "c5", nome: "Golpe Tempestuoso" },
    ]);

    if (id) {
      // ========== MOCK TEMPORÁRIO ==========
      // axios.get(`/api/colecoes/${id}`)
      setColecao({
        nome: "Coleção Raras 2025",
        descricao: "Cartas raras coletadas nos últimos campeonatos.",
        cartasSelecionadas: ["c1", "c3"],
      });
      setModoEdicao(true);
    }
  }, [id]);

  const handleChange = (e) => {
    setColecao({ ...colecao, [e.target.name]: e.target.value });
  };

  const handleToggleCarta = (idCarta) => {
    setColecao((prev) => {
      const selecionadas = prev.cartasSelecionadas.includes(idCarta)
        ? prev.cartasSelecionadas.filter((c) => c !== idCarta)
        : [...prev.cartasSelecionadas, idCarta];
      return { ...prev, cartasSelecionadas: selecionadas };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!colecao.nome.trim()) {
      alert("O nome da coleção é obrigatório.");
      return;
    }

    // ========== MOCK TEMPORÁRIO ==========
    // Substituir futuramente por:
    // if (modoEdicao) axios.put(`/api/colecoes/${id}`, colecao)
    // else axios.post("/api/colecoes", colecao)
    console.log("Coleção salva:", colecao);

    navigate("/colecoes");
  };

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Meu Perfil", to: "/dashboard" },
                { label: "Criar Colecao" },
              ]}
            />
            <Col>
              <h3 className="fw-bold text-primary d-flex align-items-center">
                <Collection className="me-2" />
                {modoEdicao ? "Editar Coleção" : "Criar Nova Coleção"}
              </h3>
            </Col>
            <Col className="text-end">
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/colecoes")}
              >
                <ArrowLeft className="me-1" /> Voltar
              </Button>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 rounded-3 p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nome da Coleção</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={colecao.nome}
                  onChange={handleChange}
                  placeholder="Ex: Coleção Raras 2025"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descricao"
                  rows={3}
                  value={colecao.descricao}
                  onChange={handleChange}
                  placeholder="Descreva brevemente sua coleção..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Selecione as cartas</Form.Label>
                <div className="cartas-grid">
                  {todasCartas.map((carta) => (
                    <div
                      key={carta._id}
                      className={`carta-item ${
                        colecao.cartasSelecionadas.includes(carta._id)
                          ? "selecionada"
                          : ""
                      }`}
                      onClick={() => handleToggleCarta(carta._id)}
                    >
                      {carta.nome}
                    </div>
                  ))}
                </div>
              </Form.Group>

              <div className="text-end">
                <Button variant="primary" type="submit">
                  <PlusCircle className="me-1" />
                  {modoEdicao ? "Salvar Alterações" : "Criar Coleção"}
                </Button>
              </div>
            </Form>
          </Card>
        </Container>
      </section>
    </LayoutGeral>
  );
}
