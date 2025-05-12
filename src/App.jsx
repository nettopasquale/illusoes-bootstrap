import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HomePage from "./pages/HomePage/HomePage";
import Artigos from "./pages/Artigos/Artigos";
import Eventos from "./pages/Eventos/Eventos";
import Campeonatos from "./pages/Campeonatos/Campeonatos";
import Decks from "./pages/Decks/Decks";
import Cadastro from "./pages/Cadastro/Cadastro";
import Login from "./pages/Login/Login";
import Marketplace from "./pages/Marketplace/Marketplace";
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/artigos" element={<Artigos/>}/>
          <Route path="/eventos" element={<Eventos/>}/>
          <Route path="/campeonatos" element={<Campeonatos/>}/>
          <Route path="/marketplace" element={<Marketplace/>}/>
          <Route path="/marketplace/:id" element={<Marketplace/>}/>
          <Route path="/decks/:id" element={<Decks/>}/>
          <Route path="/campeonatos/:id" element={<Campeonatos/>}/>
          <Route path="/eventos/:id" element={<Eventos/>}/>
          <Route path="/artigos/:id" element={<Artigos/>}/>
          <Route path="/cadastro" element={<Cadastro/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
