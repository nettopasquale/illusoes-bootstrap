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
            <Nav.Link className="fs-5">
              <Link to={"/"}>Home</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/artigos"}>Artigos</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/eventos"}>Eventos</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/decks"}>Decks</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/colecoes"}>Coleções</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/campeonatos"}>Campeonatos</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/cardgames"}>Card Games</Link>
            </Nav.Link>
            <Nav.Link className="fs-5">
              <Link to={"/comunidade"}>Comunidade</Link>
            </Nav.Link>
            <Nav.Link href="/forum" className="fs-5">
              <Link to={"/forum"}>Fórum</Link>
            </Nav.Link>
            <Nav.Link href="/about" className="fs-5">
              <Link to={"/about"}>Sobre nós</Link>
            </Nav.Link>
            <Nav.Link href="/contato" className="fs-5">
              <Link to={"/contato"}>Contato</Link>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

    </>
  );
}

export default MenuGaveta;