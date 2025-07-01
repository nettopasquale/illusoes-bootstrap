// src/pages/Eventos/CriarEvento.jsx
import { useState } from "react";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function CriarEvento({ tipo }){
  const [formData, setFormData] = useState({
    titulo: "",
    subTitulo: "",
    conteudo: "",
    imagem: "",
    tipo: tipo || "evento",
  });

  const [dataEvento, setDataEvento] = useState("");
  const [horaEvento, setHoraEvento] = useState("");
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/eventos", formData, {
        headers: { Authorization: token },
      });

      navigate(`/eventos/${tipo}`);
    } catch (error) {
      console.error("Erro ao criar:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <h2>{tipo === "campeonato" ? "Criar Campeonato" : "Criar Evento"}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Título</Form.Label>
          <Form.Control
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Subtítulo</Form.Label>
          <Form.Control
            name="subTitulo"
            value={formData.subTitulo}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Conteúdo</Form.Label>
          <Form.Control
            as="textarea"
            name="conteudo"
            value={formData.conteudo}
            onChange={handleChange}
            rows={5}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Link da imagem</Form.Label>
          <Form.Control
            name="imagem"
            value={formData.imagem}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Campos de data e hora apenas para exibição */}
        <Form.Group>
          <Form.Label>Data do Evento</Form.Label>
          <Form.Control
            type="date"
            value={dataEvento}
            onChange={(e) => setDataEvento(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Hora do Evento</Form.Label>
          <Form.Control
            type="time"
            value={horaEvento}
            onChange={(e) => setHoraEvento(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" className="mt-3">
          Criar
        </Button>
      </Form>
    </Container>
  );
};
