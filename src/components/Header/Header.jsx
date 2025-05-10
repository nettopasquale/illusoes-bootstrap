import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { BsFillPersonFill, BsCart3, BsEnvelope } from "react-icons/bs";
import ilusoes_logo from "../../assets/ilusoes_logo.png"
//import { Link } from 'react-router-dom'
import { useState } from 'react';
import Login from '../login/Login';
import MenuGaveta from '../MenuGaveta/MenuGaveta';



const Header = () => {
  const [modalShow, setModalShow] = useState(false);

  return (
      <Navbar expand="lg" className="w-100  navbar fixed-top" bg='dark'>
        <Container fluid className="d-flex align-items-center justify-content-between">
          <Navbar.Brand href="#" className='me-3'>
            <img
              alt=''
              src={ilusoes_logo}
              width="40"
              height="40"
              className="d-flex align-items-center" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" >
            <Nav
              className="d-flex justify-content-between align-items-center w-100 px-3"
              style={{ maxHeight: '100px' }}
              navbarScroll>
            
            <Form inline className="d-flex mx-auto" style={{ flexGrow: 1, maxWidth: '500px' }}>
              <Form.Control
                type="search"
                placeholder="Buscar"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="secondary">Buscar</Button>
            </Form>

            <div className='d-flex align-items-center gap-3'>
              <Nav.Link
                className='fw-bold text-white fs-5'
                onClick={() => setModalShow(true)}>
                <BsFillPersonFill
                  size={20}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Usuário'
                  onClick={() => setModalShow(true)}/>
                <Login handleShow={modalShow} handleClose={() => setModalShow(false)}></Login>
              </Nav.Link>
              
              <Nav.Link href="#action2" className='fw-bold text-white fs-5'>
                <BsEnvelope
                  size={20}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Mail'/>
              </Nav.Link>

              <Nav.Link href="#action3" disabled className='fw-bold text-white fs-5'>
                <BsCart3
                  size={24}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Cart'/>
              </Nav.Link>
            </div>

            <MenuGaveta></MenuGaveta>
            
          </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default Header

//dropdown
/*



                <NavDropdown id="navbarScrollingDropdown" className='fw-bold text-white fs-5' >
                    <NavDropdown.Item href="#action3">Home</NavDropdown.Item>
                    <NavDropdown.Divider />
                  <NavDropdown.Item href="/artigos">
                    <Link>Artigos</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Eventos
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Decks
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Coleções
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Campeonatos
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Card Games
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Comunidade
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Fórum
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Sobre Nós
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action5">
                      Contato
                    </NavDropdown.Item>

                </NavDropdown>

*/
    //Offcanvas
/*


            <Navbar.Offcanvas
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav>
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="/artigos">Artigos</Nav.Link>
                  <Nav.Link href="#action1">Eventos</Nav.Link>
                  <Nav.Link href="#action1">Decks</Nav.Link>
                  <Nav.Link href="#action1">Coleções</Nav.Link>
                  <Nav.Link href="#action1">Campeonatos</Nav.Link>
                  <Nav.Link href="#action1">Card Games</Nav.Link>
                  <Nav.Link href="#action1">Comunidade</Nav.Link>
                  <Nav.Link href="#action1">Fórum</Nav.Link>
                  <Nav.Link href="#action1">Sobre nós</Nav.Link>
                  <Nav.Link href="#action1">Contato</Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>

*/