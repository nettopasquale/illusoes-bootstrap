import React from "react";
import { Link } from "react-router-dom";
import { SlArrowRight } from "react-icons/sl";

export const Navegacao = ({ itens = [] }) => {
  return (
    <div className="text-start mb-4 px-4">
      <nav className="d-flex align-items-center gap-2 flex-wrap">
        {itens.map((item, index) => (
          <React.Fragment key={index}>
            {item.to ? (
              <Link
                to={item.to}
                className="text-decoration-none text-dark fw-semibold"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-muted fw-semibold">{item.label}</span>
            )}
            {index < itens.length - 1 && <SlArrowRight size={14} />}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};
