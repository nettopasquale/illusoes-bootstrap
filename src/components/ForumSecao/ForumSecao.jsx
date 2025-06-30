import { Container, Col, Image } from "react-bootstrap"
//import { useState } from "react"
import agido from '../../assets/imgs/Yugioh/agido.jpg'
import LayoutGeral from "../LayoutGeral/LayoutGeral"

export default function ForumSecao(){
  const { tipo } = useParams();
  return (
      <LayoutGeral>
        <section id="artigo" className="block artigo-block">
        <Container fluid className="mt-3">
          <div className="text-start mt-5">
            <h1 className="fs-1 fw-bold">O TITULO DO ARTIGO VEM AQUI</h1>  
            <p className="fs-4">O subtítulo do artigo aqui</p>
          </div>
          <div className="text-start mt-3">
            <span>Pasquale M.</span>
            <span>01/10/2024</span>
          </div>
        </Container>
        <Container>
          <Col>
              <Image src={agido} width={ 700} height={200 } className="flex" />
          </Col>
          <Col>
              <p className="mt-4 text-start fs-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus optio aut reprehenderit vel dicta quibusdam molestiae iure corporis totam, ipsum atque blanditiis nesciunt illum magni porro. Dolor repudiandae quibusdam molestias?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus optio aut reprehenderit vel dicta quibusdam molestiae iure corporis totam, ipsum atque blanditiis nesciunt illum magni porro. Dolor repudiandae quibusdam molestias?
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus optio aut reprehenderit vel dicta quibusdam molestiae iure corporis totam, ipsum atque blanditiis nesciunt illum magni porro. Dolor repudiandae quibusdam molestias?

            </p>
          </Col>
        </Container>
        </section>
      </LayoutGeral>

  )
}