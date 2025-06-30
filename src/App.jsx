import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage/HomePage";
import Marketplace from "./pages/Marketplace/Marketplace";
import Forum from "./pages/Forum/Forum";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import { Component } from "react"; 
import { noticiasRoutes } from "./routes/routesNoticias";
import { eventosRoutes } from "./routes/routesEventos";
import { colecoesRoutes } from "./routes/routesColecoes";
import { anunciosRoutes } from "./routes/routesAnuncios";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <>
        <Router>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* Noticias e Artigos */}
            {noticiasRoutes}

            {/* Eventos e Campeonatos */}
            {eventosRoutes}

            {/* Marketplace */}
            <Route path="/marketplace" element={<Marketplace/>}/>
            {anunciosRoutes}

            {/* Colecoes */}
            {colecoesRoutes}

            {/* Forum */}
            <Route path="/forums" element={<Forum />} />
            
            {/* Cadastro */}
            <Route path="/cadastro" element={<Cadastro />} />
            
            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Redrecionar para a Home */}
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </Router>
      </>
    );
    
  }
}

export default App;
