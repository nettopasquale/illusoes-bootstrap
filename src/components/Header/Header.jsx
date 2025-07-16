// Header.jsx (ajustado)
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { BsFillPersonFill, BsCart3, BsEnvelope } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ilusoes_logo from "../../assets/ilusoes_logo.png";
import dk_profile from "../../assets/Do-key_kongo.jpg";
import { memo } from "react";
import MenuGaveta from "../MenuGaveta/MenuGaveta";
import PropTypes from "prop-types";
import { useAuth } from "../../context/useAuth";
import { Link } from "react-router-dom";

const Header = memo(function Header({ onUserClick, autenticado, usuario }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      className=" bg-black py-3 px-4 w-100 shadow-sm"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
    >
      <Container
        fluid
        className="d-flex align-items-center justify-content-between"
      >
        {/* Logo e Slogan */}
        <div className="d-flex align-items-center gap-3">
          <Nav.Link as={Link} to="/">
            <img src={ilusoes_logo} alt="Logo" width={50} height={50} />
            <span className="text-white fs-4 fw-bold">Ilusões Industriais</span>
          </Nav.Link>
        </div>

        {/* Campo de busca */}
        <Form className="d-flex mx-4" style={{ flex: 1, maxWidth: "600px" }}>
          <Form.Control type="search" placeholder="Buscar" className="me-2" />
          <Button variant="light">Buscar</Button>
        </Form>

        {/* Ações e menu */}
        <div className="d-flex align-items-center gap-4">
          {autenticado ? (
            <>
              <div className="d-flex align-items-center gap-2 text-white">
                <img
                  src={
                    usuario?.imagemProfile
                      ? `https://illusoes-bootstrap.onrender.com${usuario.imagemProfile}`
                      : dk_profile
                  }
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-circle"
                />
                <span className="fw-bold">{usuario?.nome}</span>
              </div>
              <Nav.Link onClick={handleLogout} className="text-white fw-bold">
                Sair
              </Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={onUserClick} className="text-white fw-bold">
              <BsFillPersonFill size={24} />
            </Nav.Link>
          )}
          <Nav.Link className="text-white">
            <BsEnvelope size={22} />
          </Nav.Link>
          <Nav.Link className="text-white">
            <BsCart3 size={22} />
          </Nav.Link>

          {/* Menu lateral */}
          <MenuGaveta autenticado={autenticado} />
        </div>
      </Container>
    </Navbar>
  );
});

export default Header;

Header.propTypes = {
  onUserClick: PropTypes.func.isRequired,
  autenticado: PropTypes.bool.isRequired,
  usuario: PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }),
};
