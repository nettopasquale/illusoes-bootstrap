import { Container, Row, Col } from "react-bootstrap"
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral"

const Criar_Artigo = () => {
  return (
      <LayoutGeral>
          <Container>
            <div>
              <h1>Criar Evento</h1>  
              </div>
                    <Row>
                        <Col>
                            <Container className="border-primary" width={300} height={300}>
                                
                            </Container>
                        </Col>

                        <Col>
                        </Col>
                    </Row>          
          
          </Container>
      </LayoutGeral>
  )
}

export default Criar_Artigo