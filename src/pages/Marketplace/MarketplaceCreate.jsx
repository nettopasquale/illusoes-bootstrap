// src/pages/Marketplace/MarketplaceCreate.jsx
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Alert,
} from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { useNavigate } from "react-router-dom";
import useMarketplace from "../../hooks/useMarketplace";
import { Navegacao } from "../../components/Navegacao/Navegacao";
import LayoutGeral from "../../components/LayoutGeral/LayoutGeral";

const tipoOptions = [
  { value: "venda", label: "Venda" },
  { value: "troca", label: "Troca" },
];

export default function MarketplaceCreate() {
  const navigate = useNavigate();
  const { createListing } = useMarketplace();

  const [titulo, setTitulo] = useState("");
  const [preco, setPreco] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [condicao, setCondicao] = useState([]);
  const [capa, setCapa] = useState(null);
  const [imagem, setImagem] = useState([""]);
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState(null);
  const [frete, setFrete] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);

  const handleFile = (e) => {
    // const files = Array.from(e.target.files);
    // // Nesta versão mock, usamos URLs locais via URL.createObjectURL
    // const imagens = files.map((f) => URL.createObjectURL(f));
    // setImagem((p) => ({ ...p, imagem: [...p.imagem, ...imagem] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo) return setErro("Escolha o tipo do anuncio");
    // TODO: integrar upload de imagens e POST /api/marketplace
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("categoria", categoria);
      formData.append("condicao", condicao);
      formData.append("capa", capa);
      formData.append("descricao", descricao);
      formData.append("localizacao", localizacao);
      formData.append("frete", frete);
      if (imagem)
        formData.append(
          "imagem",
          JSON.stringify(imagem.length ? imagem.map((img) => img.value) : [])
        );

      //transformar String em Number
      const valorLimpo = preco.replace("R$", "").trim().replace(",", ".");
      const valorNumerico = parseFloat(valorLimpo);

      //transformar String em Number
      const valorLimpoF = frete.replace("R$", "").trim().replace(",", ".");
      const valorNumericoF = parseFloat(valorLimpoF);

      // depois no formData:
      formData.append("preco", isNaN(valorNumerico) ? 0 : valorNumerico);
      formData.append("frete", isNaN(valorNumericoF) ? 0 : valorNumericoF);

      setMensagem(`Publicação realizada com sucesso!`);
      setErro(null);
      setTimeout(() => navigate("/marketplace/anuncios"), 2000);
    } catch (error) {
      console.error(error);
      console.log(`Erro: ${error.data}`);
      setErro("Erro ao publicar anúncio");
    }
  };

  return (
    <LayoutGeral>
      <Container className="my-5">
        <Row className="mb-3">
          <Navegacao
            itens={[
              { label: "Home", to: "/" },
              { label: "Marketplace", to: "/marketplace/anuncios" },
              { label: "Marketplace Criar", to: "/marketplace/criar" },
            ]}
          />
          <Col>
            <h3 className="fw-bold text-primary">Criar anúncio</h3>
            {mensagem && <Alert variant="success">{mensagem}</Alert>}
            {erro && <Alert variant="danger">{erro}</Alert>}
          </Col>
        </Row>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Row>
            <Col md={8}>
              <Card className="p-3 shadow-sm">
                <Form.Group className="mb-3">
                  <Form.Label>Título</Form.Label>
                  <Form.Control
                    name="titulo"
                    value={titulo}
                    onChange={(e)=> setTitulo(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Preço (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    name="preco"
                    placeholder="Ex: R$ 0,00"
                    value={preco}
                    onChange={(e)=> setPreco(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Frete (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    name="frete"
                    placeholder="Ex: R$ 0,00"
                    value={frete}
                    onChange={(e)=> setFrete(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <CreatableSelect
                    options={tipoOptions}
                    onChange={setTipo}
                    value={tipo}
                    className="w-100"
                    style={{ width: "250px" }}
                    placeholder="Escolha o tipo"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Control
                    name="categoria"
                    value={categoria}
                    onChange={(e)=> setCategoria(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Condição</Form.Label>
                  <Form.Control
                    name="condicao"
                    value={condicao}
                    onChange={(e)=> setCondicao(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Local</Form.Label>
                  <Form.Control
                    name="localizacao"
                    value={localizacao}
                    onChange={(e)=> setLocalizacao(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="descricao"
                    rows={6}
                    value={descricao}
                    onChange={(e)=> setDescricao(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Imagens</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFile}
                  />
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {imagem.map((src, idx) => (
                      <Image
                        key={idx}
                        src={src}
                        thumbnail
                        style={{ width: 100, height: 70, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/marketplace/anuncios")}
                  >
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Publicar anúncio
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </LayoutGeral>
  );
}
