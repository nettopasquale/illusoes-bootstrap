import { Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import Contato from "../pages/Outros/Contato";
import SobreNos from "../pages/Outros/SobreNos";

export const outrosRoutes =[
    <Route 
    path="/contato"
    element={<Contato/>}
    key="contato"
    >
    </Route>,

    <Route 
    path="/about"
    element={<SobreNos/>}
    key="contato"
    >
    </Route>,
]