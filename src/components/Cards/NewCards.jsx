import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import noticias from '../../data/noticias.json'

const styles = {
    card: {
      backgroundColor: '#B7E0F2',
    },
    cardImage: {
        objectFit: 'cover',
        height: '100%'
    },
    cardText: {
        color: '#fff',
        textAlign: 'center',
        margin: '0 auto'
    }
}

const listaNoticias = noticias.noticiasData;

const NewCards = () => {
    return (
    <Container>
        {
            listaNoticias.map(noticia => {
                <Container>
                    <Row key={noticia.id}>
                        <Col>
                                <Card style={{width: '22rem'}}>
                                    <Card.Img variant="top" src={noticia.imageURL} style={styles.card} />
                                        <Card.ImgOverlay>
                                        <Card.Body>
                                            <Card.Title style={styles.cardText}>
                                                        {noticia.newsTitle}
                                            </Card.Title>
                                            <Card.Text style={styles.cardText}>
                                                        {noticia.newsSubTitle}
                                            </Card.Text>
                                            <Button variant="primary">Veja mais</Button>
                                        </Card.Body>
                                        </Card.ImgOverlay>
                                </Card>
                        </Col>
                    </Row>
                </Container>
            })
        }
    </Container>
  )
}

export default NewCards