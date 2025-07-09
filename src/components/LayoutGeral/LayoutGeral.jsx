import PropTypes from "prop-types";
import ModalLogin from "../ModalLogin/ModalLogin";
import { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

LayoutGeral.propTypes = {
  children: PropTypes.node,
};

function LayoutGeral({ children }) {
    const [modalShow, setModalShow] = useState(false);
    const { autenticado, usuario } = useAuth();

  //console.log("Modal aberto?", modalShow);

  const handleUserClick = useCallback(() => setModalShow(true), []);
  const handleModalClose = useCallback(() => setModalShow(false), []);

    //login persistente - localstorage?
  const token = localStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = token;
    }

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-secondary">
      <div className="position-fixed top-0 w-100 z-3">
        <Header onUserClick={handleUserClick} autenticado={autenticado} usuario={usuario}/>
        
        <ModalLogin show={modalShow} onClose={handleModalClose} />
      </div>

      {/* Espaço reservado do header */}
      <div style={{ height: "70px" }} />

      <main className="flex-grow-1 w-100 px-3">{children}</main>

      <footer className="w-100 text-white mt-auto">
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default LayoutGeral;
