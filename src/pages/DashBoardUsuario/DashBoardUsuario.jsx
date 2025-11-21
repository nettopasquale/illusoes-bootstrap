import { Container, Row, Col, Button, Card, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

const menuToRouteMap = {
  "Minhas Notícias": "noticia",
  "Meus Artigos": "artigo",
  "Meus Eventos": "evento",
  "Meus Campeonatos": "campeonato",
};

const DashboardUsuario = () => {
  const [submenus, setSubmenus] = useState({});
  const [conteudos, setConteudos] = useState([]);
  const [tipoSelecionado, setTipoSelecionado] = useState(null);

  const token = localStorage.getItem("token");

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
      const response = await axios.get(
        `http://localhost:8080/user/conteudos?tipo=${tipo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConteudos(response.data);
    } catch (err) {
      console.error("Erro ao carregar conteúdos do usuário:", err);
    }
  };

  // const MenuLateral = () => (
  //   <Card className="p-3 shadow">
  //     <Nav className="flex-column">
  //       {[
  //         "Meu Perfil",
  //         "Minhas Compras",
  //         "Minhas Vendas",
  //         "Meus Anúncios",
  //         "Minhas Coleções",
  //         "Minhas Notícias",
  //         "Meus Artigos",
  //         "Meus Eventos",
  //         "Meus Campeonatos",
  //       ].map((menu) => (
  //         <div key={menu}>
  //           <Nav.Link
  //             onClick={() => toggleSubmenu(menu)}
  //             className="d-flex justify-content-between fw-bold"
  //           >
  //             {menu}
  //             {submenus[menu] ? <FaChevronUp /> : <FaChevronDown />}
  //           </Nav.Link>

  //           {/* Submenu que lista os conteúdos */}
  //           {submenus[menu] && menuToRouteMap[menu] && (
  //             <div className="ps-3">
  //               {conteudos.length === 0 && (
  //                 <p className="text-muted">Nenhum conteúdo criado.</p>
  //               )}

  //               {conteudos.map((c) => (
  //                 <Nav.Link
  //                   key={c._id}
  //                   as={Link}
  //                   to={`/conteudos/${c.tipo}/${c._id}`}
  //                   className="text-primary"
  //                 >
  //                   ✏️ {c.titulo}
  //                 </Nav.Link>
  //               ))}
  //             </div>
  //           )}
  //         </div>
  //       ))}
  //     </Nav>
  //   </Card>
  // );

  const MenuLateral = () => (
    <Card className="p-3 shadow">
      <Nav className="flex-column">
        {[
          "Meu Perfil",
          "Minhas Compras",
          "Minhas Vendas",
          "Meus Anúncios",
          "Minhas Coleções",
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
              <Nav.Link as={Link} to={`/userProfile`}>
                Editar
              </Nav.Link>
            )}

            {submenus[menu] && menuToRouteMap[menu] && (
              <div className="ps-3">
                <Nav.Link
                  as={Link}
                  to={`/user/conteudos?tipo=${menuToRouteMap[menu]}`}
                >
                  Editar
                </Nav.Link>
              </div>
            )}
          </div>
        ))}
      </Nav>
    </Card>
  );

  const BotoesCriar = () => (
    <Card className="p-4 shadow">
      <h2 className="fw-bold mb-4">Criar Conteúdo</h2>
      <Row className="g-3">
        <Col md={6}>
          <Button
            as={Link}
            to="/conteudos/noticia/criar"
            className="w-100 py-3"
          >
            Publicar Notícia
          </Button>
        </Col>
        <Col md={6}>
          <Button as={Link} to="/conteudos/artigo/criar" className="w-100 py-3">
            Publicar Artigo
          </Button>
        </Col>
        <Col md={6}>
          <Button as={Link} to="/conteudos/evento/criar" className="w-100 py-3">
            Criar Evento
          </Button>
        </Col>
        <Col md={6}>
          <Button
            as={Link}
            to="/conteudos/campeonato/criar"
            className="w-100 py-3"
          >
            Criar Campeonato
          </Button>
        </Col>
      </Row>
    </Card>
  );

  // return (
  //   <LayoutGeral>
  //     <Container fluid className="py-4">
  //       <Row>
  //         <Col md={3}>
  //           <MenuLateral />
  //         </Col>

  //         <Col md={9}>
  //           <BotoesCriar />

  //           {/* Conteúdos listados */}
  //           {tipoSelecionado && (
  //             <Card className="p-4 shadow my-4">
  //               <h3 className="fw-bold mb-3">
  //                 Conteúdos: {tipoSelecionado.toUpperCase()}
  //               </h3>

  //               {conteudos.length === 0 ? (
  //                 <p className="text-muted">
  //                   Nenhum conteúdo encontrado para este tipo.
  //                 </p>
  //               ) : (
  //                 conteudos.map((c) => (
  //                   <div key={c._id} className="border-bottom py-2">
  //                     <strong>{c.titulo}</strong>
  //                     <br />
  //                     <Link to={`/conteudos/${c.tipo}/${c._id}/editar`}>
  //                       ✏️ Editar
  //                     </Link>
  //                   </div>
  //                 ))
  //               )}
  //             </Card>
  //           )}
  //         </Col>
  //       </Row>
  //     </Container>
  //   </LayoutGeral>
  // );
  return (
    <LayoutGeral>
 <Container fluid className="py-4">
        <Row>
          <Col md={3}>
            <MenuLateral />
          </Col>
          <Col md={9}>
            <BotoesCriar />
          </Col>
        </Row>
      </Container>
    </LayoutGeral>
  );
};

export default DashboardUsuario;
