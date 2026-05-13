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
import { toast } from "react-toastify";
import "./toggleCarta.css"
import "./Colecao.css"

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
    const [salvando, setSalvando] = useState(false);
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
      }catch(error){
        toast.error("Carta não encontrada. Tente novamente.")
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
        toast.success("Cartas salvas com sucesso na coleção!")
        setTimeout(() =>navigate(`/colecoes/${colecaoId}`),3000);
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
      <section className="colecao-section">
        <Container ref={topoRef}>
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Coleções", to: "/colecoes" },
              {
                label: colecao?.nome || "Coleção",
                to: `/colecoes/${colecaoId}`,
              },
              { label: "Editar cartas" },
            ]}
          />

          <div className="colecao-page-header">
            <h1 className="colecao-page-title" style={{ fontSize: "1.4rem" }}>
              Editar cartas — {colecao?.nome}
            </h1>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate(`/colecoes/${colecaoId}`)}
            >
              ← Voltar
            </Button>
          </div>

          {/* ── Busca ── */}
          <div className="busca-card">
            <Row className="g-2">
              <Col xs={12} md={4}>
                <Form.Select
                  size="sm"
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                >
                  <option value="">Selecione o jogo</option>
                  <option value="pokemon">Pokémon</option>
                  <option value="mtg">Magic: The Gathering</option>
                  <option value="yugioh">Yu-Gi-Oh!</option>
                  <option value="onepiece">One Piece</option>
                  <option value="lorcana">Lorcana</option>
                  <option value="dragonball">Dragon Ball</option>
                </Form.Select>
              </Col>
              <Col xs={12} md={8}>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder="Buscar carta (ex: Dark Magician)"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
                  />
                  <Button
                    variant="primary"
                    onClick={handleBuscar}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Buscar"
                    )}
                  </Button>
                </InputGroup>
              </Col>
            </Row>
          </div>

          {/* ── Coleção atual ── */}
          {cartasExistentes.length > 0 && (
            <>
              <p className="cartas-section-title">
                Coleção atual ({cartasExistentes.length} carta
                {cartasExistentes.length !== 1 ? "s" : ""})
              </p>
              <Row xs={2} sm={3} md={4} lg={5} className="g-3 mb-4">
                {cartasExistentes.map((item) => {
                  const estaSelecionada = cartasSelecionadas.some(
                    (c) => c.cartaID === item.cartaID,
                  );
                  return (
                    <Col key={item.cartaID}>
                      <div
                        className={`carta-card ${estaSelecionada ? "selecionada" : ""}`}
                        onClick={() =>
                          isDono &&
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
                        style={{ cursor: isDono ? "pointer" : "default" }}
                      >
                        <CartaImagem
                          src={item.carta.imagem}
                          alt={item.carta.nome}
                        />
                        <div className="card-body">
                          <div className="card-title">{item.carta.nome}</div>
                          <p className="card-text">{item.carta.jogo}</p>
                          <p className="card-text">{item.carta.setNome}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}

          {/* ── Resultados da busca ── */}
          {resultados.length > 0 && (
            <>
              <p className="cartas-section-title">
                Resultados da busca ({resultados.length})
              </p>
              <Row xs={2} sm={3} md={4} lg={5} className="g-3 mb-4">
                {resultados.map((carta) => {
                  const estaSelecionada = cartasSelecionadas.some(
                    (c) => c.cartaID === carta.id,
                  );
                  return (
                    <Col key={carta.id}>
                      <div
                        className={`carta-card ${estaSelecionada ? "selecionada" : ""}`}
                        onClick={() => isDono && toggleCarta(carta)}
                        style={{
                          cursor: isDono ? "pointer" : "not-allowed",
                          opacity: isDono ? 1 : 0.6,
                        }}
                      >
                        <CartaImagem src={carta.image_url} alt={carta.name} />
                        <div className="card-body">
                          <div className="card-title">{carta.name}</div>
                          <p className="card-text">{carta.game}</p>
                          <p className="card-text">{carta.set_name}</p>
                          <p className="card-text">{carta.rarity}</p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </>
          )}

          {/* ── Barra flutuante de salvar ── */}
          {isDono && (
            <div className="barra-salvar">
              <span>
                {cartasSelecionadas.length} carta
                {cartasSelecionadas.length !== 1 ? "s" : ""} selecionada
                {cartasSelecionadas.length !== 1 ? "s" : ""}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleReset}
              >
                Resetar seleção
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleRemoverTodasCartas}
              >
                Remover todas
              </Button>
              <Button
                variant="success"
                size="sm"
                className="px-4"
                disabled={cartasSelecionadas.length === 0 || salvando}
                onClick={salvarCartas}
              >
                {salvando ? "Salvando..." : "Salvar na coleção"}
              </Button>
            </div>
          )}
        </Container>
      </section>
    </LayoutGeral>
  );
}
