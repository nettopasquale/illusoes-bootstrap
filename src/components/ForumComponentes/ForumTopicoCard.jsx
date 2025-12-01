import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { ChatDots, Eye } from "react-bootstrap-icons";
import PropTypes from "prop-types";

ForumTopicoCard.propTypes = {
  titulo: PropTypes.string.isRequired,
  autor: PropTypes.string,
  posts: PropTypes.number,
  visualizacoes: PropTypes.number,
  ultimoPost: PropTypes.object,
  onClick: PropTypes.func,
};

ForumTopicoCard.defaultProps = {
  autor: "Usuário",
  posts: 0,
  visualizacoes: 0,
  ultimoPost: null,
  onClick: () => {},
};

export default function ForumTopicoCard({
  titulo,
  autor,
  posts,
  visualizacoes,
  ultimoPost,
  onClick,
}) {
  const ultimaAtividade = ultimoPost
    ? new Date(ultimoPost.data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sem respostas";

  return (
    <Card
      className="shadow-sm border-0 rounded-3 topic-card hover-shadow-sm"
      onClick={onClick}
      style={{ cursor: "pointer", transition: "all 0.2s" }}
    >
      <Card.Body>
        <Row>
          <Col md={8}>
            <h5 className="fw-bold mb-1 text-primary">{titulo}</h5>
            <small className="text-muted">Criado por {autor}</small>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-end align-items-center text-muted small"
          >
            <div className="d-flex align-items-center me-3">
              <ChatDots className="me-1" />
              {posts}
            </div>
            <div className="d-flex align-items-center me-3">
              <Eye className="me-1" />
              {visualizacoes}
            </div>
            <div>
              <span>{ultimaAtividade}</span>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
