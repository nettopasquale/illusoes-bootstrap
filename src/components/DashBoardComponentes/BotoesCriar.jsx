import { Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BotoesCriar(){
    return (
      <>
        <Card className="p-4 shadow">
          <h2 className="fw-bold mb-4">Conteúdos</h2>
          <Row className="g-3">
            <Col md={6}>
              <Button
                as={Link}
                to="/conteudos/noticia/criar"
                className="w-100 py-3 fw-bold bg-black"
              >
                Publicar Notícia
              </Button>
            </Col>
            <Col md={6}>
              <Button
                as={Link}
                to="/conteudos/artigo/criar"
                className="w-100 py-3 fw-bold bg-black"
              >
                Publicar Artigo
              </Button>
            </Col>
            <Col md={6}>
              <Button
                as={Link}
                to="/conteudos/evento/criar"
                className="w-100 py-3 fw-bold bg-black"
              >
                Criar Evento
              </Button>
            </Col>
            <Col md={6}>
              <Button
                as={Link}
                to="/conteudos/campeonato/criar"
                className="w-100 py-3 fw-bold bg-black"
              >
                Criar Campeonato
              </Button>
            </Col>
          </Row>
        </Card>

        <Card className="p-4 shadow">
          <h2 className="fw-bold mt-4 mb-4">Coleções</h2>
          <Row className="g-3">
            <Col className="d-flex justify-content-center">
              <Button
                as={Link}
                to="/colecoes/criar"
                className="w-50 py-3 fw-bold bg-black"
              >
                Cadastrar nova coleção
              </Button>
            </Col>
          </Row>
        </Card>

        <Card className="p-4 shadow">
          <h2 className="fw-bold mt-4 mb-4">Fórum</h2>
          <Row className="g-3">
            <Col className="d-flex justify-content-center">
              <Button
                as={Link}
                to="/forum/topicos/criar"
                className="w-50 py-3 fw-bold bg-black"
              >
                Publicar novo tópico
              </Button>
            </Col>
          </Row>
        </Card>
      </>
    );
}

