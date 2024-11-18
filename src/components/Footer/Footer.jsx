import { Container, Row, Col, Stack, Image, Nav, NavLink } from "react-bootstrap"
import dk_logo from "../../assets/Do-key_kongo.jpg"


const Footer = () => {
  return (
    <footer>
      <Container className="mt-3 w-100">
        <Row className="bg-dark text-white p-4">
          <Col className="mx-5">
            <Stack>
              <Image
                src={dk_logo}
                alt=""
                rounded
                width={150}
              height={150}/>

                <h2 className="text-center">Projeto Ilusões Industriais</h2>
              
            </Stack>
          </Col>

          <Col>
            <Nav className="flex-column fs-5 text-start">
              <span className="fw-bold fs-4">Como podemos ajudar ?</span>
                <NavLink href="#" className="text-white">Contate o suporte ao consumidor</NavLink>
                <NavLink href="#" className="text-white">Central de ajuda</NavLink>
                <NavLink href="#" className="text-white">Acessibilidade</NavLink>
                <NavLink href="#" className="text-white">Deixe um feedback</NavLink>
                <NavLink href="#" className="text-white">Política de extorno e retorno</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5 text-start">
              <span className="fw-bold fs-4">Artigos e Decks</span>
                <NavLink href="#" className="text-white">Magic the Gathering</NavLink>
                <NavLink href="#" className="text-white">Yu-Gi-Oh!</NavLink>
                <NavLink href="#" className="text-white">Pokémon</NavLink>
                <NavLink href="#" className="text-white">Digimon</NavLink>
                <NavLink href="#" className="text-white">Flesh and Blood</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5 text-start">
              <span className="fw-bold fs-4">Eventos e Campeonatos</span>
                <NavLink href="#" className="text-white">Como criar e participar</NavLink>
                <NavLink href="#" className="text-white">Regras e Condições</NavLink>
                <NavLink href="#" className="text-white">Planos de Assinatura</NavLink>
                <NavLink href="#" className="text-white">Central de Ajuda</NavLink>
                <NavLink href="#" className="text-white">Política de Eventos</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5 text-start">
              <span className="fw-bold fs-4">Forum e Comunidade</span>
                <NavLink href="#" className="text-white">Como participar</NavLink>
                <NavLink href="#" className="text-white">Central de Ajuda</NavLink>
                <NavLink href="#" className="text-white">Política de Comunidade</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5 text-start">
              <span className="fw-bold fs-4">Coleções e Leilões</span>
                <NavLink href="#" className="text-white">Como vender</NavLink>
                <NavLink href="#" className="text-white">Cadastro de Coleções</NavLink>
                <NavLink href="#" className="text-white">Central de Ajuda</NavLink>
                <NavLink href="#" className="text-white">Política de Vendas</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5 text-start w-100">
              <span className="fw-bold fs-4">Sobre Nós</span>
                <NavLink href="#" className="text-white">Contato</NavLink>
                <NavLink href="#" className="text-white">Nossos valores</NavLink>
                <NavLink href="#" className="text-white">Trabalhe Conosco</NavLink>
                <NavLink href="#" className="text-white">Ética de Trabalho</NavLink>
            </Nav>
          </Col>
        </Row>

        <Row className="bg-dark text-white p-4">
          <Col>
            <span className="fw-bold fs-5">Siga nossas redes</span> 
          </Col>
          <Col>
            <p>Projeto Ilusões Industriais</p>
          </Col>
          <Col>
            <p>Projeto Ilusões Industriais</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer