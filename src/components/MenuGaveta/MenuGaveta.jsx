import { useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

function MenuGaveta({ autenticado }) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState({
    noticias: false,
    artigos: false,
    eventos: false,
    campeonatos: false,
  });

  const toggleSubmenu = (menu) => {
    setSubmenuAberto((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => setShowDrawer(true);

  return (
    <>
      <Button variant="light" onClick={handleShow} className="me-2">
        <FaBars size={20} style={{ cursor: "pointer" }} />
      </Button>

      <Offcanvas show={showDrawer} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className="fs-5">
              Home
            </Nav.Link>

            {!autenticado && (
              <>
                <hr />
                <Nav.Link as={Link} to="/cadastro" className="fs-5">
                  Criar nova conta
                </Nav.Link>
              </>
            )}
            <hr />
            <Nav.Link as={Link} to="/dashboard" className="fs-5">
              {autenticado ? "Meu Perfil" : "Fazer Login"}
            </Nav.Link>
            <hr />

            {/* NOTÍCIAS */}
            <Nav.Link
              onClick={() => toggleSubmenu("noticias")}
              className="fs-5 d-flex justify-content-between align-items-center"
            >
              Notícias{" "}
              {submenuAberto.noticias ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.noticias && (
              <>
                <Nav.Link as={Link} to="/conteudos/noticia" className="ps-4">
                  Todas as Notícias
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={`/conteudos/noticia/criar`}
                  className="ps-4"
                >
                  Publicar Notícia
                </Nav.Link>
              </>
            )}
            <hr />

            {/* ARTIGOS */}
            <Nav.Link
              onClick={() => toggleSubmenu("artigos")}
              className="fs-5 d-flex justify-content-between align-items-center"
            >
              Artigos{" "}
              {submenuAberto.artigos ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.artigos && (
              <>
                <Nav.Link as={Link} to="/conteudos/artigo" className="ps-4">
                  Todos os Artigos
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={`/conteudos/artigo/criar`}
                  className="ps-4"
                >
                  Publicar Artigo
                </Nav.Link>
              </>
            )}
            <hr />

            {/* EVENTOS */}
            <Nav.Link
              onClick={() => toggleSubmenu("eventos")}
              className="fs-5 d-flex justify-content-between align-items-center"
            >
              Eventos{" "}
              {submenuAberto.eventos ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.eventos && (
              <>
                <Nav.Link as={Link} to="/conteudos/evento" className="ps-4">
                  Todos os Eventos
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={`/conteudos/evento/criar`}
                  className="ps-4"
                >
                  Criar Evento
                </Nav.Link>
              </>
            )}
            <hr />

            {/* CAMPEONATOS */}
            <Nav.Link
              onClick={() => toggleSubmenu("campeonatos")}
              className="fs-5 d-flex justify-content-between align-items-center"
            >
              Campeonatos{" "}
              {submenuAberto.campeonatos ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.campeonatos && (
              <>
                <Nav.Link as={Link} to="/conteudos/campeonato" className="ps-4">
                  Todos os Campeonatos
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to={`/conteudos/campeonato/criar`}
                  className="ps-4"
                >
                  Criar Campeonato
                </Nav.Link>
              </>
            )}
            <hr />

            <Nav.Link as={Link} to="/colecoes" className="fs-5">
              Coleções
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/cardgames" className="fs-5">
              Card Games
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/marketplace/anuncios" className="fs-5">
              Marketplace
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/forum" className="fs-5">
              Fórum
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/about" className="fs-5">
              Sobre nós
            </Nav.Link>
            <hr />
            <Nav.Link as={Link} to="/contato" className="fs-5">
              Contato
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default MenuGaveta;
