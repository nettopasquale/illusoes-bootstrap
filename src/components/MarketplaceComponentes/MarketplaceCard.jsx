import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";

MarketplaceCard.propTypes = {
  item: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
};

export default function MarketplaceCard({ item, onView }) {
  return (
    <Card className="h-100 shadow-sm border-0">
      <div style={{ height: 160, overflow: "hidden" }}>
        <Card.Img
          variant="top"
          src={item.cover || "/cards/placeholder.jpg"}
          alt={item.title}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1 fs-6 fw-semibold">{item.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {item.seller} • {item.location}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="fw-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: item.currency || "BRL",
            }).format(item.price)}
          </div>
          <Button size="sm" variant="primary" onClick={() => onView(item.id)}>
            Ver
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
