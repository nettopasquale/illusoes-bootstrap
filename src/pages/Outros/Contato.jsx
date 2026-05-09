import React from 'react'
import LayoutGeral from '../../components/LayoutGeral/LayoutGeral'
import { Navegacao } from '../../components/Navegacao/Navegacao'
import { Container, Col, Row, Image, Button, Form } from "react-bootstrap";

export default function Contato() {
  return (
    <LayoutGeral>
      <section className="forum-section">
        <Container fluid="lg">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Contato", to: "/contato" },
            ]}
          />
        </Container>
        
      </section>
    </LayoutGeral>
  );
}