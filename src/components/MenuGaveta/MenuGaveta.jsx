import { useState } from "react";
import { Button, Nav, Offcanvas } from 'react-bootstrap'
import { FaBars } from 'react-icons/fa'; 
import { Link } from 'react-router-dom'

function MenuGaveta() {
  const [showDrawer, setShowDrawer] = useState(false);

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => setShowDrawer(true);
  return (
    <>
       <Button variant="light" onClick={handleShow} className="me-2">
        <FaBars
          size={20}
          style={{ cursor: 'pointer' }}
          role="button"
          onClick={handleShow}/>
        </Button>
      <Offcanvas show={showDrawer} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/">
              <Link>Home</Link>
            </Nav.Link>
            <Nav.Link href="/artigos">
                <Link>Artigos</Link>
            </Nav.Link>
            <Nav.Link href="/eventos">
              <Link>Eventos</Link>
            </Nav.Link>
            <Nav.Link href="/decks">
              <Link>Decks</Link>  
            </Nav.Link>
            <Nav.Link href="/colecoes">
              <Link>Coleções</Link>
            </Nav.Link>
            <Nav.Link href="/campeonatos">
              <Link>Campeonatos</Link>
            </Nav.Link>
            <Nav.Link href="/cardgames">
              <Link> Card Games</Link>
            </Nav.Link>
            <Nav.Link href="/comunidade">
              <Link>Comunidade</Link>
            </Nav.Link>
            <Nav.Link href="/forum">
              <Link>Fórum</Link>
            </Nav.Link>
            <Nav.Link href="/about">
              <Link>Sobre nós</Link>
            </Nav.Link>
            <Nav.Link href="/contato">
              <Link>Contato</Link>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

    </>
  );
}

export default MenuGaveta;