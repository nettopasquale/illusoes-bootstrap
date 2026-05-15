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
import BuscaHeader from "./BuscaHeader";
import "./Header.css"

const Header = memo(function Header({ onUserClick, autenticado, usuario }) {
  const navigate = useNavigate();
  const { logout, isAdmin, } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      className="bg-black site-header"
      fixed="top"
      style={{ position: "fixed", top: 0, left: 0, zIndex: 1000 }}
    >
      <Container fluid className="container-fluid">
        {/* Logo e Slogan */}
        <div className="d-flex align-items-center gap-3">
          <Nav.Link as={Link} to="/" className="nav-link">
            <img
              src={ilusoes_logo}
              alt="Logo"
              width={50}
              height={50}
              className="site-header-logo"
            />
            <span className="header-title text-white fw-bold d-none d-sm-inline">
              Ilusões Industriais
            </span>
          </Nav.Link>
        </div>

        {/* Campo de busca */}
        <BuscaHeader/>
        {/* <Form
          className="header-search d-none d-md-flex"
          style={{ flex: 1, maxWidth: "600px" }}
        >
          <Form.Control
            type="search"
            placeholder="Buscar"
            className="form-control"
          />
          <Button variant="light">Buscar</Button>
        </Form> */}



        {/* Ações e menu */}
        <div className="header-actions d-flex align-items-center gap-3">
          {autenticado ? (
            <>
              <div className="d-flex align-items-center gap-2 text-white">
                <img
                  src={usuario?.avatar ? usuario.avatar : dk_profile}
                  alt="profile"
                  width={40}
                  height={40}
                  className="rounded-circle"
                />
                <span className="fw-bold d-none d-lg-inline">
                  {usuario?.nome}
                </span>
              </div>
              <Nav.Link onClick={handleLogout} className="text-white fw-bold">
                Sair
              </Nav.Link>
            </>
          ) : (
            <Nav.Link onClick={onUserClick} className="text-white fw-bold">
              <BsFillPersonFill size={24} />
              Fazer Login
            </Nav.Link>
          )}
          {/* Menu lateral */}
          <MenuGaveta autenticado={autenticado} />
        </div>
      </Container>
    </Navbar>
  );
});

export default Header;

//header renderiza mesmo sem o usuário logado
Header.propTypes = {
  onUserClick: PropTypes.func.isRequired,
  autenticado: PropTypes.bool.isRequired,
  usuario: PropTypes.shape({
    _id: PropTypes.string,
    nome: PropTypes.string,
    email: PropTypes.string,
  }),
};
