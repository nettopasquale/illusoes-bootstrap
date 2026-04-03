import { useEffect, useState, useContext, useRef } from "react";
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
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import { useColecao } from "../../hooks/useColecao";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { CartaImagem } from "../../components/CartaImagem/CartaImagem";
import "./toggleCarta.css"

export default function ColecaoCarta() {
    const { colecaoId } = useParams();
    const navigate = useNavigate();
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState([]);
    const [cartasIniciais, setCartasIniciais] = useState([]);
    const [cartasExistentes, setCartasExistentes] = useState([]);
    const [cartasSelecionadas, setCartasSelecionadas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [game, setGame] = useState("");
    const { usuario } = useContext(AuthContext);

    const { colecoes, setColecoes } = useColecao();

    const colecao = colecoes?.find(c => c._id === colecaoId);
    const isDono = usuario?._id === colecao?.dono?._id;

    //voltar para o topo
    const topoRef = useRef(null);

    //busca da api
    const handleBuscar = async()=>{
      if(!busca.trim()) return;
      setLoading(true);

      //ver aqui
      try{
        const res = await api.get(`/cartas/busca?q=${busca}&game=${game}`);
        setResultados(res.data.data || res.data);
        console.log("resultados: ", res.data.data)
      }catch(error){
        console.error("Erro ao buscar as cartas: ", error)
      }finally{
        setLoading(false);
      }
    }
    //toggle de seleção
    const toggleCarta = (carta) => {
      if (!isDono) return;

      setCartasSelecionadas((prev) => {
        const existe = prev.find((c) => c.cartaID === carta.id);

        if (existe) {
          return prev.filter((c) => c.cartaID !== carta.id);
        }

        return [
          ...prev,
          {
            cartaID: carta.id,
            nome: carta.name,
            jogo: carta.game,
            setNome: carta.set_name,
            raridade: carta.rarity,
            printagem: carta.printing,
            imagem: carta.image_url,
          },
        ];
      });
    };

    //limpar a coleção
    const handleRemoverTodasCartas = async () => {
      if (!isDono) return;

      const confirmacao = window.confirm(
        "Tem certeza que deseja remover todas as cartas da coleção?",
      );
      if (!confirmacao) return;
      try {
        await api.delete(`/colecoes/${colecaoId}/cartas`);
        setCartasExistentes([]);
      } catch (error) {
        console.error();
      }
    };

    //resetar cartas da seleção
    const handleReset = () =>{
      if(!isDono) return;
      setCartasSelecionadas(cartasIniciais);

      topoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setBusca("");
      setResultados([]); //talvez n seja necessário
    }

    //salva na coleção
    const salvarCartas = async()=>{
      //mudar aqui
      try{
        await api.post(`/colecoes/${colecaoId}/cartas`,
          {
            cartas: cartasSelecionadas,
          },
        );
        navigate(`/colecoes/${colecaoId}`);
      }catch(error){
        console.error("Erro ao salvar cartas: ", error);
      }
    }
    
    //carrega as já existentes
    useEffect(() => {
    const fetchCartas = async () => {
      try {
        const res = await api.get(`/colecoes/${colecaoId}/cartas`);
        const cartasExistentes = res.data;

        setCartasExistentes(cartasExistentes);

        const cartasFormatadas = cartasExistentes.map((item)=> ({
          cartaID: item.cartaID,
          nome: item.carta.nome,
          jogo: item.carta.jogo,
          setNome: item.carta.setNome,
          raridade: item.carta.raridade,
          printagem: item.carta.printagem,
          imagem: item.carta.imagem
        }));
        setCartasSelecionadas(cartasFormatadas);
        setCartasIniciais(cartasFormatadas);
      } catch (error) {
        console.error("erro ao buscar cartas:", error);
      }
    };
    if (colecaoId) fetchCartas();
    }, [colecaoId]);
 
  if(!colecoes) return <p>Carregando Coleção...</p>

  return (
    <LayoutGeral>
      <section id="artigo" className="block artigo-block">
        <Container className="my-5" ref={topoRef}>
          {/* navegação */}
          <Row className="mb-4 align-items-center">
            <Navegacao
              itens={[
                { label: "Home", to: "/" },
                { label: "Todoas as coleções", to: "/colecoes" },
                { label: "Colecao", to: `/colecoes/${colecaoId}` },
                {
                  label: "Cartas da coleção",
                  to: `/colecoes/${colecaoId}/cartas`,
                },
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

          {/* CARTAS EXISTENTES */}
          <Row className="mb-5">
            <h2>Coleção Atual</h2>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              cartasExistentes.map((item) => (
                <Col md={3} key={item.cartaID} className="mb-3">
                  <Card
                    className="shadow-sm h-100"
                    onClick={() =>
                      toggleCarta({
                        id: item.cartaID,
                        name: item.carta.nome,
                        game: item.carta.jogo,
                        set_name: item.carta.setNome,
                        rarity: item.carta.raridade,
                        printing: item.carta.printagem,
                        image_url: item.carta.imagem,
                      })
                    }
                  >
                    {/* <Card.Img variant="top" src={item.carta.imagem} /> */}
                    <CartaImagem
                      src={item.carta.imagem}
                      alt={item.carta.nome}
                    />
                    <Card.Body>
                      <Card.Title className="fs-6">
                        {item.carta.nome}
                      </Card.Title>
                      <Card.Text className="small text-muted">
                        Jogo: {item.carta.jogo}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Set: {item.carta.setNome}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Raridade: {item.carta.raridade}
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Printagem: {item.carta.printagem}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>

          {/* RESULTADOS DA API*/}
          <Row className="mb-5">
            {loading ? (
              <Spinner animation="border" />
            ) : (
              resultados.map((carta) => {
                const estaSelecionada = cartasSelecionadas.some(
                  (c) => c.cartaID === carta.id,
                );
                console.log("Esta selecionada: ", estaSelecionada);

                return (
                  <Col md={3} key={carta._id} className="mb-3">
                    <Card
                      className={`carta ${
                        estaSelecionada ? "selecionada" : ""
                      }`}
                      onClick={() => isDono && toggleCarta(carta)}
                      style={{
                        cursor: isDono ? "pointer" : "not-allowed",
                        opacity: isDono ? 1 : 0.6,
                      }}
                    >
                      {/* <Card.Img variant="top" src={carta.image_url} /> */}
                      <CartaImagem src={carta.image_url} alt={carta.name} />
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
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
          {/* Botões de Remover e Reset */}
          {isDono && (
            <div className="d-flex gap-2 mb-4">
              <Button
                variant="outline-danger"
                onClick={() => handleRemoverTodasCartas()}
              >
                Remover cartas
              </Button>

              <Button variant="outline-secondary" onClick={handleReset}>
                Resetar seleção
              </Button>
            </div>
          )}

          {/*BOTÃO FINAL */}
          <Button
            variant="success"
            disabled={cartasSelecionadas.length === 0 || !isDono}
            onClick={salvarCartas}
          >
            Salvar na coleção
          </Button>
        </Container>
      </section>
    </LayoutGeral>
  );
}
