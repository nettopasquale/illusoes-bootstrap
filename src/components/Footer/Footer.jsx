import {
  Container,
  Row,
  Col,
  Stack,
  Image,
  Nav,
  NavLink,
} from "react-bootstrap";
import ilusoes_logo from "../../assets/ilusoes_logo.png";
import './Footer.css'

const Footer = () => {
  return (
    <footer className="site-footer bg-black" style={{ width: "100%" }}>
      <Container fluid className="py-4 px-5 text-white">
        <Row className="footer-main-row">
          <Col md={2} sm={6}>
            <Stack className="align-items-start">
              <Image
                src={ilusoes_logo}
                alt="logo"
                width={80}
                height={80}
                rounded
                className="site-footer-logo"
              />
              <h5 className="mt-2">Ilusões Industriais</h5>
            </Stack>
          </Col>

          {[
            {
              title: "Como podemos ajudar ?",
              links: [
                "Contate o suporte",
                "Central de ajuda",
                "Acessibilidade",
                "Feedback",
                "Política de retorno",
              ],
            },
            {
              title: "Artigos e Decks",
              links: [
                "Magic",
                "Yu-Gi-Oh!",
                "Pokémon",
                "Digimon",
                "Flesh and Blood",
              ],
            },
            {
              title: "Eventos e Campeonatos",
              links: [
                "Criar e Participar",
                "Regras",
                "Planos",
                "Ajuda",
                "Política de Eventos",
              ],
            },
            {
              title: "Fórum e Comunidade",
              links: ["Como participar", "Ajuda", "Política"],
            },
            {
              title: "Coleções e Leilões",
              links: ["Como vender", "Cadastro", "Ajuda", "Política de vendas"],
            },
            {
              title: "Sobre Nós",
              links: ["Contato", "Valores", "Trabalhe Conosco", "Ética"],
            },
          ].map((section, idx) => (
            <Col key={idx} md="auto" sm={6}>
              <Nav className="flex-column fs-5 text-start text-wrap">
                <span className="footer-title">{section.title}</span>
                {section.links.map((text, i) => (
                  <NavLink href="#" key={i} className="text-white text-start">
                    {text}
                  </NavLink>
                ))}
              </Nav>
            </Col>
          ))}
        </Row>

        <Row className="site-footer-bottom">
          <Col>
            <span className="footer-title">Siga nossas redes sociais</span>
          </Col>
          <Col className="text-end">
            <small>© {new Date().getFullYear()} Ilusões Industriais</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
