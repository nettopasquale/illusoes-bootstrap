import PropTypes from "prop-types";
import Header from "../../components/Header/Header";
import ModalLogin from "../ModalLogin/ModalLogin";
import Footer from "../Footer/Footer";
import { useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";

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
    <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100 bg-body-secondary px-3">
      <div className="position-fixed top-0 w-100 z-3">
              <Header onUserClick={handleUserClick} autenticado={autenticado} usuario={usuario} />
        <ModalLogin show={modalShow} onClose={handleModalClose} />
      </div>

      {/* Espaço reservado do header */}
      <div style={{ height: "70px" }} />

      <main className="flex-grow-1 px-3">{children}</main>

      <footer className="container-fluid p-0 m-0">
        <Footer></Footer>
      </footer>
    </div>
  );
}

export default LayoutGeral;
