import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import artigos from "../../data/artigos.json"

const Cards = ({to}) => {
    let listaArtigos =artigos
 
    function onClick() {
        console.log("Vai para o site!")    
    }

    return (
        <Container className='mt-4'>
            <Row className='g-4'>
                {
                    listaArtigos.map(artigo => {
                        return (
                            <Col key={artigo.id} xs={12} sm={6} md={3}>
                                <Link to={to}>
                                <Card
                                    style={{ cursor: 'pointer' }}
                                    onClick={onClick}
                                    className='p-0 border-black h-100 card-group'>
                                    <Card.Img src={artigo.image} className='card-img-top img-fluid' style={{width:"250px"}}/>
                                    <Card.Body className='h-50'>
                                        <Card.Title className='text-start text-wrap mt-1 mb-2 fw-bold fs-4'>
                                            {artigo.Title} 
                                        </Card.Title>
                                        <Card.Text className='text-start fs-5'>
                                            {artigo.SubTitle} 
                                        </Card.Text>
                                        <div className='d-flex justify-content-between fs-6 px-2'>
                                            <span className='text-start fs-5 p-2'>
                                                {artigo.author} 
                                            </span>
                                            <span className='fs-6'>
                                                {artigo.data} 
                                            </span>
                                        </div>
                                    </Card.Body>
                                </Card>                       
                                </Link>
                            </Col>
                        )
                    })
                }
            </Row>
        </Container>

    );
}

export default Cards