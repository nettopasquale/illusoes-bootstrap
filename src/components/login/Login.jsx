import { Button, Modal, Form, Col, Row } from 'react-bootstrap';
import { BsFillPersonFill } from "react-icons/bs";
import PropTypes from 'prop-types';

Login.propTypes = {
  handleShow: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
}

function Login({ handleShow, handleClose }) {
  
  const handleLogin = (e) => {
    e.preventDefault();
    handleClose();
  }

  return (
    <>
    <Modal show={handleShow} onHide={handleClose} animation={true} centered>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type='submit'>
          Avançar
        </Button>
      </Modal.Footer>
    </Modal>
  </>
    
  )
}

export default Login;