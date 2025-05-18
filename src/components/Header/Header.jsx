import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { BsFillPersonFill, BsCart3, BsEnvelope } from "react-icons/bs";
import ilusoes_logo from "../../assets/ilusoes_logo.png"
import dk_profile from "../../assets/Do-key_kongo.jpg"
import { memo } from 'react';
import MenuGaveta from '../MenuGaveta/MenuGaveta';
import PropTypes from "prop-types";


const Header = memo(function Header({ onUserClick, autenticado, usuario }) {

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

              {autenticado ? (
                  <Nav.Link
                  className='fw-bold text-white fs-5'
                  onClick={onUserClick}>
                  <Navbar.Brand href="#" className='me-3'>
                    <img
                      alt=''
                      src={dk_profile}
                      width="40"
                      height="40"
                      className="d-flex align-items-center" />
                    {usuario?.nome}
                  </Navbar.Brand>
                </Nav.Link>
              
              ) : (
                <Nav.Link
                  className='fw-bold text-white fs-5'
                  onClick={onUserClick}>
                <BsFillPersonFill
                  size={20}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Usuário' />
                </Nav.Link>
              )}

              
              <Nav.Link href="#action2" className='fw-bold text-white fs-5'>
                <BsEnvelope
                  size={20}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Mail' />
              </Nav.Link>

              <Nav.Link href="#action3" disabled className='fw-bold text-white fs-5'>
                <BsCart3
                  size={24}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Cart' />
              </Nav.Link>
            </div>

            <MenuGaveta></MenuGaveta>
            
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
});

export default Header

Header.propTypes = {
  onUserClick: PropTypes.func.isRequired,
  autenticado: PropTypes.bool.isRequired,
  usuario: PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  })
}
