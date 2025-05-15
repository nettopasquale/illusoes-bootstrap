import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { BsFillPersonFill } from "react-icons/bs";
import PropTypes from 'prop-types';
import { useEffect } from 'react';

ModalLogin.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}



function ModalLogin({show, onClose}) {
  //modal
  const handleLogin = (e) => {
    e.preventDefault();
    onClose();
  }

  console.log("Recebido show:", show);

  useEffect(() => {
  console.log("Modal show prop mudou para:", show);
}, [show]);


  return (
    <>
    <Modal show={show} onHide={onClose} animation={true} centered>
      <Modal.Header closeButton>
          <Modal.Title>
          <BsFillPersonFill className='me-2'/> Login
          </Modal.Title>
      </Modal.Header>
        
        <Modal.Body className='flex-column'>
        <Form onSubmit={handleLogin}>
          <Form.Group as={Row} className="mb-3" controlId="formEmail">
            <Form.Label column sm="2">
              Email
            </Form.Label>
            <Col sm="10">
              <Form.Control type="text" defaultValue="Usuário ou Email" />
            </Col>
          </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPassword">
            <Form.Label column sm="2">
              Password
            </Form.Label>
            <Col sm="10">
              <Form.Control type="password" placeholder="****" />
            </Col>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" type='submit'>
              Avançar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  </>
    
  )
}

export default ModalLogin;