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
import "./Footer.css";

const Footer = () => {
  return (
    <footer
      className="site-footer container-fluid bg-black"
      style={{ width: "100%" }}
    >
      <Container fluid className="py-4 px-3 px-md-5 text-white">

        <Row className="footer-main-row align-items-start justify-content-between">
          {/* Logo */}
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <Stack className="stack align-items-center align-items-md-start">
              <Image
                src={ilusoes_logo}
                alt="logo"
                width={80}
                height={80}
                rounded
                className="site-footer-logo"
              />
              <h5 className="footer-title mt-2">Ilusões Industriais</h5>
            </Stack>
          </Col>

          {/* Seções de links — centralizadas na linha */}
          <Col xs={12} md={6}>
            <Row className="justify-content-md-start">
              {[
                {
                  title: "Como podemos ajudar?",
                  links: ["Contate o suporte", "Sobre nós"],
                },
              ].map((section, idx) => (
                <Col
                  key={idx}
                  xs={12}
                  sm={6}
                  md="auto"
                  className="text-center text-md-start mb-3 mb-md-0"
                >
                  <Nav className="flex-column align-items-center align-items-md-start">
                    <span className="footer-title">{section.title}</span>
                    {section.links.map((text, i) => (
                      <NavLink href="#" key={i} className="text-white px-0">
                        {text}
                      </NavLink>
                    ))}
                  </Nav>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* ── Copyright ── */}
        <Row className="site-footer-bottom">
          <Col className="text-center">
            <small>© {new Date().getFullYear()} Ilusões Industriais</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
