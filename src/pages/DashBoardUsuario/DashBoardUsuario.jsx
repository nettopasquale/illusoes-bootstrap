import { Container, Row, Col } from "react-bootstrap";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";
import MenuLateral from "../../components/DashBoardComponentes/MenuLateral";
import BotoesCriar from "../../components/DashBoardComponentes/BotoesCriar";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import "./Dashboard.css"

const DashboardUsuario = () => {
  return (
    <LayoutGeral>
      <section className="dashboard-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Dashboard", to: "/usuario/dashboard" },
            ]}
          />
          <Row className="g-4">
            <Col md={3}>
              <MenuLateral />
            </Col>
            <Col md={9}>
              <BotoesCriar />
            </Col>
          </Row>
        </Container>
      </section>
    </LayoutGeral>
  );
};

export default DashboardUsuario;
