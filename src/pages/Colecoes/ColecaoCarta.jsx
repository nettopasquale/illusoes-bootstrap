import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, PlusCircle, Trash } from "react-bootstrap-icons";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useListarColecao } from "../../hooks/useListarColecao";
import axios from "axios";

export default function ColecaoCarta() {
    const { colecaoId } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cartasSelecionadas, setCartasSelecionadas] = useState([]);
    const [game, setGame] = useState("");

      const { colecoes: colecao } = useListarColecao(
        `http://localhost:8080/colecoes`,
      );

    //busca da api
    const handleBuscar = async()=>{
      if(!busca.trim()) return;
      setLoading(true);

      //ver aqui
      try{
        const res = await axios.get(
          `http://localhost:8080/cartas/busca?q=${busca}&game=${game}`
        );

        // const res = await axios.get(
        //   `${BASE_URL}/cards?q=${busca}`
        // );
        setResultados(res.data.data || res.data);
      }catch(error){
        console.error("Erro ao buscar as cartas: ", error)
      }finally{
        setLoading(false);
      }
    }

    //add as cartas a uma lista temporaria
    const addCarta = (carta)=>{
      const cartaExiste = cartasSelecionadas.find(
        (c) => c.cartaID === carta.id
      );

      if(cartaExiste) return

      //ver aqui
      setCartasSelecionadas([
        ...cartasSelecionadas,
        {
          cartaID: carta.id,
          nome: carta.name,
          jogo: carta.game,
          setNome: carta.set_name,
          raridade: carta.rarity,
          printagem: carta.printing,
          imagem: carta.image_url
        },
      ]);

      console.log([cartasSelecionadas])
    };

    //remove da lista
    const removerCarta = (cartaID) => {
      setCartasSelecionadas(
        cartasSelecionadas.filter((c) => c.cartaID !== cartaID),
      );
    };

    //salva na coleção
    const salvarCartas = async()=>{
      const token = localStorage.getItem("token");

      //mudar aqui
      try{
        await axios.post(
          `http://localhost:8080/colecoes/${colecaoId}/cartas`,
          {
            cartas: cartasSelecionadas,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        navigate(`/colecoes/${colecaoId}`);
      }catch(error){
        console.error("Erro ao salvar cartas: ", error);
      }
    }

 
  if(!colecao) return <p>Carregando Coleção...</p>

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5">
          {/* navegação */}
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todoas as coleções", to: "/colecoes" },
                { label: "Colecao", to: `/colecoes/${colecaoId}` },
              ]}
            />
          </Row>

          {/*BUSCA */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select
                value={game}
                onChange={(e) => setGame(e.target.value)}
              >
                {/* Add futuramente mais opções */}
                <option value="">Selecione o jogo</option>
                <option value="pokemon">Pokémon</option>
                <option value="mtg">Magic: The Gathering</option>
                <option value="yugioh">Yu-Gi-Oh</option>
                <option value="onepiece">One Piece</option>
                <option value="lorcana">Lorcana</option>
                <option value="dragonball">Dragon Ball</option>
              </Form.Select>
            </Col>
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  placeholder="Buscar carta (ex: Dark Magician)"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
                <Button onClick={handleBuscar}>Buscar</Button>
              </InputGroup>
            </Col>
          </Row>

          {/* RESULTADOS */}
          <Row className="mb-5">
            {loading ? (
              <Spinner animation="border" />
            ) : (
              resultados.map((carta) => (
                <Col md={3} key={carta.id} className="mb-3">
                  <Card className="shadow-sm h-100">
                    <Card.Img
                      variant="top"
                      src={carta.image_url}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fs-6">{carta.name}</Card.Title>
                      <Card.Text className="small text-muted">
                        Jogo: {carta.game}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Set: {carta.set_name}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Raridade: {carta.rarity}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Printagem: {carta.printing}
                      </Card.Text>
                      <Button size="sm" onClick={() => addCarta(carta)}>
                        <PlusCircle className="me-1" />
                        Adicionar
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* 🧺 LISTA TEMPORÁRIA */}
          <h5 className="mb-3">Cartas selecionadas</h5>

          <Row className="mb-4">
            {cartasSelecionadas.length === 0 ? (
              <p className="text-muted">Nenhuma carta selecionada.</p>
            ) : (
              cartasSelecionadas.map((carta) => (
                <Col md={3} key={carta.cardId} className="mb-3">
                  <Card className="border-0 shadow-sm">
                    <Card.Img
                      variant="top"
                      src={carta.imagem}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fs-6">{carta.nome}</Card.Title>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removerCarta(carta.cartaID)}
                      >
                        <Trash /> Remover
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/*BOTÃO FINAL */}
          <Button
            variant="success"
            disabled={cartasSelecionadas.length === 0}
            onClick={salvarCartas}
          >
            Salvar na coleção
          </Button>
        </Container>
      </section>
    </LayoutGeral>
  );
}
