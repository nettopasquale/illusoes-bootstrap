import { useContext, useState } from "react";
import { Button, Nav, Offcanvas, Accordion } from "react-bootstrap";
import { FaBars, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function MenuGaveta({ autenticado }) {
  const {usuario, isAdmin} = useContext(AuthContext)
  const [showDrawer, setShowDrawer] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState({
    conteudos: false,
    noticias: false,
    artigos: false,
    eventos: false,
    colecoes: false,
    forum: false,
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

            <Nav.Link
              as={Link}
              className="fs-5 d-flex justify-content-between align-items-center"
              onClick={() => toggleSubmenu("conteudos")}
            >
              Conteúdos{" "}
              {submenuAberto.conteudos ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>

            {submenuAberto.conteudos && (
              <>
                {/* Notícias */}
                <Nav.Link
                  onClick={() => toggleSubmenu("noticias")}
                  className="fs-6 d-flex align-items-center"
                >
                  Notícias{" "}
                  {submenuAberto.noticias ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {submenuAberto.noticias && (
                  <>
                    {isAdmin ? (
                      <Nav.Link
                        as={Link}
                        to={`/conteudos/noticia`}
                        className="ps-4"
                      >
                        Moderar Notícias
                      </Nav.Link>
                    ) : (
                      <Nav.Link
                        as={Link}
                        to="/conteudos/noticia"
                        className="ps-4"
                      >
                        Gerenciar Notícias
                      </Nav.Link>
                    )}
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
                  className="fs-6 d-flex align-items-center"
                >
                  Artigos{" "}
                  {submenuAberto.artigos ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {submenuAberto.artigos && (
                  <>
                    {isAdmin ? (
                      <Nav.Link
                        as={Link}
                        to="/conteudos/artigo"
                        className="ps-4"
                      >
                        Moderar Artigos
                      </Nav.Link>
                    ) : (
                      <Nav.Link
                        as={Link}
                        to="/conteudos/artigo"
                        className="ps-4"
                      >
                        Gerenciar Artigos
                      </Nav.Link>
                    )}
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
                  className="fs-6 d-flex align-items-center"
                >
                  Eventos{" "}
                  {submenuAberto.eventos ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>
                {submenuAberto.eventos && (
                  <>
                  {isAdmin ? (
                    <Nav.Link as={Link} to="/conteudos/evento" className="ps-4">
                      Moderar Eventos
                    </Nav.Link>
                  ): (
                    <Nav.Link as={Link} to="/conteudos/evento" className="ps-4">
                      Gerenciar Eventos
                    </Nav.Link>
                  )}
                    <Nav.Link
                      as={Link}
                      to={`/conteudos/evento/criar`}
                      className="ps-4"
                    >
                      Publicar Evento
                    </Nav.Link>
                  </>
                )}
                <hr />

                {/* CAMPEONATOS */}
                <Nav.Link
                  onClick={() => toggleSubmenu("campeonatos")}
                  className="fs-6 d-flex align-items-center"
                >
                  Campeonatos{" "}
                  {submenuAberto.campeonatos ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </Nav.Link>
                {submenuAberto.campeonatos && (
                  <>
                  {isAdmin ? (
                     <Nav.Link
                      as={Link}
                      to="/conteudos/campeonato"
                      className="ps-4"
                    >
                      Moderar Campeonatos
                    </Nav.Link>                   
                  ):(
                    <Nav.Link
                      as={Link}
                      to="/conteudos/campeonato"
                      className="ps-4"
                    >
                      Gerenciar Campeonatos
                    </Nav.Link>
                  )}
                    <Nav.Link
                      as={Link}
                      to={`/conteudos/campeonato/criar`}
                      className="ps-4"
                    >
                      Publicar Campeonato
                    </Nav.Link>
                    <hr />
                  </>
                )}
              </>
            )}
            <hr />
            {/* Coleções */}
            <Nav.Link
              onClick={() => toggleSubmenu("colecoes")}
              className="fs-5 d-flex justify-content-between align-items-center"
            >
              Coleções{" "}
              {submenuAberto.colecoes ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.colecoes && (
              <>
                <Nav.Link as={Link} to="/colecoes" className="ps-4">
                  Todas as Coleções
                </Nav.Link>
                <Nav.Link as={Link} to={`/colecoes/criar`} className="ps-4">
                  Criar Coleção
                </Nav.Link>
                <Nav.Link as={Link} to={`user/colecoes`} className="ps-4">
                  Editar minhas coleções
                </Nav.Link>
              </>
            )}
            <hr />
            <Nav.Link
              as={Link}
              className="fs-5 d-flex justify-content-between align-items-center"
              onClick={() => toggleSubmenu("forum")}
            >
              Fórum {submenuAberto.forum ? <FaChevronUp /> : <FaChevronDown />}
            </Nav.Link>
            {submenuAberto.forum && (
              <>
                <Nav.Link as={Link} to="/forum" className="ps-4">
                  Acessar Fórum
                </Nav.Link>
                <Nav.Link as={Link} to="/forum/topicos/criar" className="ps-4">
                  Publicar Tópico
                </Nav.Link>
                <Nav.Link as={Link} to={`/forum/bookmarks`} className="ps-4">
                  Meus bookmarks
                </Nav.Link>
              </>
            )}
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
