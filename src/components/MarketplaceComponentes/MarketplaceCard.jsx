import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import flareon  from "../../assets/imgs/Pokemon/flareon_tcg.jpg";
import knight  from "../../assets/imgs/Digimon/1BT2-020__sasasi_jpg.jpg";

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
          src={item.capa || flareon}
          alt={item.titulo}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-1 fs-6 fw-semibold">{item.titulo}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          {item.vendedor} • {item.localizacao}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <div className="fw-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: item.currency || "BRL",
            }).format(item.preco)}
          </div>
          <Button size="sm" variant="primary" onClick={() => onView(item.id)}>
            Ver
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
