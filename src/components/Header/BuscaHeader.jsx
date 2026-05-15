import { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  InputGroup,
  Dropdown,
  Spinner,
  ListGroup,
  Image,
  Badge,
} from "react-bootstrap";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./Header.css"

const tiposFiltro = [
  { label: "Tudo", value: "" },
  { label: "Conteúdos", value: "conteudo" },
  { label: "Coleções", value: "colecao" },
  { label: "Notícias", value: "noticia" },
  { label: "Artigos", value: "artigo" },
  { label: "Eventos", value: "evento" },
  { label: "Campeonatos", value: "campeonato" },
];

export default function BuscaHeader() {
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const buscaRef = useRef(null);

  useEffect(() => {
    const buscarResultados = async () => {
      if (busca.trim().length < 2) {
        setResultados([]);
        return;
      }

      try {
        setLoading(true);

        const response = await api.get("/api/busca", {
          params: {
            q: busca,
            tipo,
            limite: 8,
          },
        });

        setResultados(response.data);
      } catch (erro) {
        console.error("Erro ao buscar:", erro);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      buscarResultados();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [busca, tipo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buscaRef.current && !buscaRef.current.contains(event.target)) {
        setMostrarResultados(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getBadgeVariant = (tipo) => {
    switch (tipo) {
      case "noticia":
        return "primary";
      case "artigo":
        return "success";
      case "evento":
        return "warning";
      case "campeonato":
        return "danger";
      case "colecao":
        return "secondary";
      default:
        return "dark";
    }
  };

  return (
    <div
      className="header-search d-none d-md-flex"
      ref={buscaRef}
    >
      <InputGroup>
        <Dropdown>
          <Dropdown.Toggle variant="dark">
            {tiposFiltro.find((t) => t.value === tipo)?.label || "Tudo"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {tiposFiltro.map((item) => (
              <Dropdown.Item
                key={item.value}
                active={tipo === item.value}
                onClick={() => setTipo(item.value)}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <InputGroup.Text>
          <Search size={18} />
        </InputGroup.Text>

        <FormControl
          placeholder="Buscar conteúdos ou coleções..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onFocus={() => setMostrarResultados(true)}
        />

        {loading && (
          <InputGroup.Text>
            <Spinner animation="border" size="sm" />
          </InputGroup.Text>
        )}
      </InputGroup>

      {mostrarResultados && busca.trim().length >= 2 && (
        <ListGroup
          className="position-absolute w-100 mt-1 shadow z-3"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {!loading && resultados.length === 0 && (
            <ListGroup.Item className="text-center text-muted">
              Nenhum resultado encontrado.
            </ListGroup.Item>
          )}

          {resultados.map((item) => (
            <ListGroup.Item
              key={item._id}
              as={Link}
              to={item.url}
              action
              className="d-flex align-items-center gap-3"
              onClick={() => setMostrarResultados(false)}
            >
              <Image
                src={item.thumb || "?"}
                rounded
                width={60}
                height={60}
                style={{
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              <div className="flex-grow-1 overflow-hidden">
                <div className="fw-semibold text-truncate">{item.titulo}</div>

                {item.subtitulo && (
                  <small className="text-muted d-block text-truncate">
                    {item.subtitulo}
                  </small>
                )}

                <div className="mt-1 d-flex gap-2 align-items-center">
                  <Badge bg={getBadgeVariant(item.tipo)}>{item.tipo}</Badge>

                  <small className="text-muted">{item.entidade}</small>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
