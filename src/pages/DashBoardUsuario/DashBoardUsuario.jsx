import { Container, Row, Col, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import api from "../../services/api";

const menuToRouteMap = {
  "Minhas Notícias": "noticia",
  "Meus Artigos": "artigo",
  "Meus Eventos": "evento",
  "Meus Campeonatos": "campeonato",
  "Meus Comentários": "comentario",
  "Minhas Curtidas": "curtida",
  "Minhas Coleções": "colecao",
  "Meus topicos": "topico",
  "Meus posts": "post",
};

const DashboardUsuario = () => {
  const [submenus, setSubmenus] = useState({});
  const [conteudos, setConteudos] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);

  const toggleSubmenu = (menu) => {
    const tipo = menuToRouteMap[menu] || null;

    setSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));

    // Se o submenu aberto corresponde a um tipo válido, carregar os conteúdos
    if (tipo) {
      setTipoSelecionado(tipo);
      buscarConteudos(tipo);
    }
  };

  // Buscar conteúdos do usuário
  const buscarConteudos = async (tipo) => {
    try {
      const response = await api.get(`/user/conteudos?tipo=${tipo}`);
      setConteudos(response.data);
    } catch (err) {
      console.error("Erro ao carregar conteúdos do usuário:", err);
    }
  };

  const MenuLateral = () => (
    <Card className="p-3 shadow">
      <Nav className="flex-column">
        {["Meu Perfil", "Meu Perfil do Forum"].map((menu) => (
          <div key={menu}>
            <Nav.Link
              onClick={() => toggleSubmenu(menu)}
              className="d-flex justify-content-between align-items-center fw-bold"
            >
              {menu}
              {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>

            {submenus[menu] == 0 && !menuToRouteMap[menu] && (
              <Nav.Link as={Link} to={`/user/profile`}>
                Editar
              </Nav.Link>
            )}
          </div>
        ))}
      </Nav>
      <Nav className="flex-column">
        {[
          "Minhas Notícias",
          "Meus Artigos",
          "Meus Eventos",
          "Meus Campeonatos",
        ].map((menu) => (
          <div key={menu}>
            <Nav.Link
              onClick={() => toggleSubmenu(menu)}
              className="d-flex justify-content-between align-items-center fw-bold"
            >
              {menu}
              {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>

            {submenus[menu] == 0 && !menuToRouteMap[menu] && (
              <Nav.Link as={Link} to={`/user/profile`}>
                Editar
              </Nav.Link>
            )}

            {submenus[menu] && menuToRouteMap[menu] && (
              <div className="ps-3">
                <Nav.Link
                  as={Link}
                  to={`/user/conteudos/tipo=${menuToRouteMap[menu]}`}
                >
                  Editar
                </Nav.Link>
              </div>
            )}
          </div>
        ))}
      </Nav>

      <Nav className="flex-column">
        {["Minhas Coleções"].map((menu) => (
          <div key={menu}>
            <Nav.Link
              onClick={() => toggleSubmenu(menu)}
              className="d-flex justify-content-between align-items-center fw-bold"
            >
              {menu}
              {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>

            {submenus[menu] == 0 && !menuToRouteMap[menu] && (
              <Nav.Link as={Link} to={`/user/colecoes`}>
                Editar
              </Nav.Link>
            )}

            {submenus[menu] && menuToRouteMap[menu] && (
              <div className="ps-3">
                <Nav.Link as={Link} to={`/user/colecoes`}>
                  Editar
                </Nav.Link>
              </div>
            )}
          </div>
        ))}
      </Nav>

      <Nav className="flex-column">
        {["Meus topicos", "Meus posts"].map((menu) => (
          <div key={menu}>
            <Nav.Link
              onClick={() => toggleSubmenu(menu)}
              className="d-flex justify-content-between align-items-center fw-bold"
            >
              {menu}
              {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>

            {submenus[menu] == 0 && !menuToRouteMap[menu] && (
              <Nav.Link as={Link} to={`/user/forum/topicos`}>
                Editar
              </Nav.Link>
            )}

            {submenus[menu] && menuToRouteMap[menu] && (
              <div className="ps-3">
                <Nav.Link as={Link} to={`/user/forum/topicos/postagens`}>
                  Editar
                </Nav.Link>
              </div>
            )}
          </div>
        ))}
      </Nav>
    </Card>
  );

  const BotoesCriar = () => (
    <>
      <Card className="p-4 shadow">
        <h2 className="fw-bold mb-4">Conteúdos</h2>
        <Row className="g-3">
          <Col md={6}>
            <Button
              as={Link}
              to="/conteudos/noticia/criar"
              className="w-100 py-3"
            >
              Publicar Notícia
            </Button>
          </Col>
          <Col md={6}>
            <Button
              as={Link}
              to="/conteudos/artigo/criar"
              className="w-100 py-3"
            >
              Publicar Artigo
            </Button>
          </Col>
          <Col md={6}>
            <Button
              as={Link}
              to="/conteudos/evento/criar"
              className="w-100 py-3"
            >
              Criar Evento
            </Button>
          </Col>
          <Col md={6}>
            <Button
              as={Link}
              to="/conteudos/campeonato/criar"
              className="w-100 py-3"
            >
              Criar Campeonato
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 shadow">
        <h2 className="fw-bold mt-4 mb-4">Coleções</h2>
        <Row className="g-3">
          <Col className="d-flex justify-content-center">
            <Button as={Link} to="/colecoes/criar" className="w-50 py-3">
              Cadastrar nova coleção
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="p-4 shadow">
        <h2 className="fw-bold mt-4 mb-4">Fórum</h2>
        <Row className="g-3">
          <Col className="d-flex justify-content-center">
            <Button as={Link} to="/forum/topicos/criar" className="w-50 py-3">
              Publicar novo tópico
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );

  return (
    <LayoutGeral>
      <Container fluid className="py-4">
        <Row>
          <Col md={3}>
            <MenuLateral />
          </Col>
          <Col md={9}>
            <BotoesCriar />
          </Col>
        </Row>
      </Container>
    </LayoutGeral>
  );
};

export default DashboardUsuario;
