import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap'
import { BsFillPersonFill, BsCart3, BsEnvelope } from "react-icons/bs";
import ilusoes_logo from "../../assets/ilusoes_logo.png"
//import { Link } from 'react-router-dom'
import { useState } from 'react';
import ModalLogin from '../ModalLogin/ModalLogin';
import MenuGaveta from '../MenuGaveta/MenuGaveta';



const Header = () => {
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

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
                onClick={handleShow}>
                <BsFillPersonFill
                  size={20}
                  style={{ cursor: 'pointer' }}
                  role='button'
                  title='Usuário'
                  onClick={handleShow}/>
                <ModalLogin handleShow={modalShow} handleClose={handleClose}></ModalLogin>
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