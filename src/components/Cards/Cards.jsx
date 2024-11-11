import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import noticias from "../../data/noticias.json";

const Cards = () => {
    const [listaNoticias, setListaNoticias] = useState(noticias)
    
    return (
        <Container>
            {
                listaNoticias.map(noticia => (
                <Row key={noticia.id}>
                    <Col>
                    <Card style={{width: '16rem'}}>
                        <Card.Img variant="top" src={noticia.imageURL} />
                            <Card.Body>
                                <Card.Title>{noticia.cardTitle}</Card.Title>
                                <Card.Text>
                                    {noticia.cardSubTitle}
                                </Card.Text>
                                <Button variant="primary">Veja mais</Button>
                            </Card.Body>
                    </Card>
                    </Col>
                </Row>
            
                ))
            }
        </Container>

    );
}

export default Cards