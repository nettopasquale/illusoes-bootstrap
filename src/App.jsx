import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage/HomePage";
import Marketplace from "./pages/Marketplace/Marketplace";
import CadastroUsuario from "./pages/CadastroUsuario/CadastroUsuario";
import Login from "./pages/Login/Login";
import { noticiasRoutes } from "./routes/routesNoticias";
import { eventosRoutes } from "./routes/routesEventos";
import { colecoesRoutes } from "./routes/routesColecoes";
import { forumRoutes } from "./routes/routesForum";
import { anunciosRoutes } from "./routes/routesAnuncios";
import { usuarioRoutes } from "./routes/routesUsuarios";
import { tokenExp } from "./context/tokenExp";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

export const App = ()=> {
    tokenExp(); // vai deslogar quando a sessão expirar
    return (
      <>
        <Router>
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />

            {/* DashBoard Usuário */}
            {usuarioRoutes}

            {/* Noticias e Artigos */}
            {noticiasRoutes}

            {/* Eventos e Campeonatos */}
            {eventosRoutes}

            {/* Marketplace */}
            <Route path="/marketplace" element={<Marketplace />} />
            {anunciosRoutes}

            {/* Colecoes */}
            {colecoesRoutes}

            {/* Forum */}
            {forumRoutes}

            {/* Cadastro */}
            <Route path="/cadastro" element={<CadastroUsuario />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Redrecionar para a Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </>
    );
  }
