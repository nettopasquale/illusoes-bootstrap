import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import dk_logo from "../../assets/Do-key_kongo.jpg"

const BarraNav = () => {
  return (
      <Navbar expand="lg" className="navbar-nav nav-fill w-100" bg='dark'>
        <Container fluid className="w-100">
          <Navbar.Brand href="#">
            <img
              alt=''
              src={dk_logo}
              width="30"
              height="30"
              className='d-inline-block align-top' />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link href="#action1" className='fw-bold text-white fs-5'>Login</Nav.Link>
              <Nav.Link href="#action2" className='fw-bold text-white fs-5'>DM</Nav.Link>
              <Nav.Link href="#" disabled className='fw-bold text-white fs-5'>
              Meu Carrinho
              </Nav.Link>
              <NavDropdown title="Mais" id="navbarScrollingDropdown" className='fw-bold text-white fs-5' >
                <NavDropdown.Item href="#action3">Home</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action4">
                  Artigos
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

            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default BarraNav