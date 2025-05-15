import PropTypes from "prop-types";
import Header from "../../components/Header/Header";
import ModalLogin from '../ModalLogin/ModalLogin';
import Footer from "../Footer/Footer";
import { useState } from "react";

LayoutGeral.propTypes = {
    children: PropTypes.node
}


function LayoutGeral({ children }) {

    const [modalShow, setModalShow] = useState(false);
      console.log("Modal aberto?", modalShow);
    
    return (
        <div className="d-flex flex-column flex-grow-1 justify-content-center align-items-center w-100 bg-body-secondary px-3">

            <div className="position-fixed top-0 w-100 z-3">
                <Header onUserClick={() => setModalShow(true)} />
                <ModalLogin show={modalShow} onClose={()=> setModalShow(false)} />
            </div>

            {/* Espaço reservado do header */}
            <div style={{ height: "70px" }} /> 

            <main className="flex-grow-1 px-3">
                    {children}
            </main>

            <footer className="container-fluid p-0 m-0">
                <Footer></Footer>
            </footer>
        </div>
    )
}

export default LayoutGeral;