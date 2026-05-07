import { Col, Card, Nav } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  fetchMeusConteudos,
  fetchMinhasColecoes,
  fetchMeusTopicos,
  fetchMinhasPostagens,
  fetchMeusComentarios,
  fetchMeusLikes,
} from "../../services/userService";

const menuToRouteMap = {
  "Minhas Notícias": "noticia",
  "Meus Artigos": "artigo",
  "Meus Eventos": "evento",
  "Meus Campeonatos": "campeonato",
  "Meus Comentários": "comentario",
  "Minhas Curtidas": "curtida",
  "Minhas Coleções": "colecao",
  "Meus Tópicos": "topico",
  "Minhas Postagens": "postagem",
  "Minhas Denúncias": "denuncias",
};

export default function MenuLateral(){
    const {id} = useParams();
    const {usuario, isAdmin} = useContext(AuthContext)
    const [submenus, setSubmenus] = useState({});
    const [conteudos, setConteudos] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState(null);

    const toggleSubmenu = (menu) => {
    const tipo = menuToRouteMap[menu] || null;

        setSubmenus((prev) => ({
          ...prev,
          [menu]: !prev[menu],
        }));

        // Se o submenu aberto corresponde a um tipo válido, carregar os conteúdos
        if (tipo) {
          setTipoSelecionado(tipo);
          buscarConteudos(tipo);
        }
    };

      // Buscar conteúdos do usuário
    const buscarConteudos = async (tipo) => {
        try {
          const response = await fetchMeusConteudos(tipo);
          setConteudos(response.data);
        } catch (err) {
          console.error("Erro ao carregar conteúdos do usuário:", err);
        }
    };
    
    
    return(
        <Card className="p-3 shadow">
            <Nav className="flex-column">
            {["Meu Perfil"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}
                </div>
            ))}
            </Nav>
            <Nav className="flex-column">
            {[
                "Minhas Notícias",
                "Meus Artigos",
                "Meus Eventos",
                "Meus Campeonatos",
            ].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link
                        as={Link}
                        to={`/userProfile/me/conteudos?tipo=${menuToRouteMap[menu]}`}
                    >
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Minhas Coleções"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/userProfile/me/colecoes`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Meus Tópicos"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me/topicos`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/userProfile/me/topicos`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Minhas Postagens"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/userProfile/me/topicos`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Minhas Curtidas"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/userProfile/me/comentarios`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Meus Comentários"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/userProfile/me/comentarios`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>

            <Nav className="flex-column">
            {["Minhas Denúncias"].map((menu) => (
                <div key={menu}>
                <Nav.Link
                    onClick={() => toggleSubmenu(menu)}
                    className="d-flex justify-content-between align-items-center fw-bold"
                >
                    {menu}
                    {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
                </Nav.Link>

                {submenus[menu] == 0 && !menuToRouteMap[menu] && (
                    <Nav.Link as={Link} to={`/userProfile/me`}>
                    Editar
                    </Nav.Link>
                )}

                {submenus[menu] && menuToRouteMap[menu] && (
                    <div className="ps-3">
                    <Nav.Link as={Link} to={`/denuncias`}>
                        Editar
                    </Nav.Link>
                    </div>
                )}
                </div>
            ))}
            </Nav>
        </Card>
    )
}
