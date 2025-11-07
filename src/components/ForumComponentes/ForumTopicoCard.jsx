import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { ChatDots, Eye } from "react-bootstrap-icons";
import PropTypes from "prop-types";

ForumTopicoCard.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  posts: PropTypes.number,
  views: PropTypes.number,
  lastPost: PropTypes.object,
  onClick: PropTypes.func,
};

ForumTopicoCard.defaultProps = {
  author: "Usuário",
  posts: 0,
  views: 0,
  lastPost: null,
  onClick: () => {},
};

export default function ForumTopicoCard({
  title,
  author,
  posts,
  views,
  lastPost,
  onClick,
}) {
  const ultimaAtividade = lastPost
    ? new Date(lastPost.data).toLocaleString("pt-BR", {
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
            <h5 className="fw-bold mb-1 text-primary">{title}</h5>
            <small className="text-muted">Criado por {author}</small>
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
              {views}
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
