import { Container, Row, Col, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

const menuToRouteMap = {
  "Minhas Notícias": "noticia",
  "Meus Artigos": "artigo",
  "Meus Eventos": "evento",
  "Meus Campeonatos": "campeonato",
};

const DashboardUsuario = () => {
  const [submenus, setSubmenus] = useState({});

  const toggleSubmenu = (menu) => {
    setSubmenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const MenuLateral = () => (
    <Card className="p-3 shadow">
      <Nav className="flex-column">
        {[
          "Meu Perfil",
          "Minhas Compras",
          "Minhas Vendas",
          "Meus Anúncios",
          "Minhas Coleções",
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

            {submenus[menu] == 0 && !menuToRouteMap[menu] &&(
              <Nav.Link as={Link} to={`/userProfile`}>
                Editar
              </Nav.Link>
            )}

            {submenus[menu] && menuToRouteMap[menu] && (
              <div className="ps-3">
                <Nav.Link
                  as={Link}
                  to={`/user/conteudos?tipo=${menuToRouteMap[menu]}`}
                >
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
    <Card className="p-4 shadow">
      <h2 className="fw-bold mb-4">Criar Conteúdo</h2>
      <Row className="g-3">
        <Col md={6}>
          <Button
            as={Link}
            to="/noticias/noticia/criar"
            variant="secondary"
            className="w-100 py-3 fs-5 fw-bold"
          >
            Publicar Notícia
          </Button>
        </Col>
        <Col md={6}>
          <Button
            as={Link}
            to="/noticias/artigo/criar"
            variant="secondary"
            className="w-100 py-3 fs-5 fw-bold bg-black"
          >
            Publicar Artigo
          </Button>
        </Col>
        <Col md={6}>
          <Button
            as={Link}
            to="/eventos/evento/criar"
            variant="secondary"
            className="w-100 py-3 fs-5 fw-bold bg-black"
          >
            Criar Evento
          </Button>
        </Col>
        <Col md={6}>
          <Button
            as={Link}
            to="/eventos/campeonato/criar"
            variant="secondary"
            className="w-100 py-3 fs-5 fw-bold bg-black"
          >
            Criar Campeonato
          </Button>
        </Col>
      </Row>
    </Card>
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
