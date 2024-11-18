import { Container, Row, Col, Card} from 'react-bootstrap';
import artigos from "../../data/artigos.json"

const Cards = () => {
    let listaArtigos =artigos
 
    function onClick() {
        console.log("Vai para o site!")    
    }

    return (
        <Container fluid className='mt-4 justify-content-center'>
            <Row>
                {
                    listaArtigos.map(artigo => {
                        return (
                            
                            <Col key={artigo.id} style={{cursor:'pointer'}}>
                                    <Card border='dark' style={{ width: '22rem' }} onClick={onClick}>
                                        <Card.Img src={artigo.image} variant="top" className='img-fluid rounded'/>
                                            <Card.Body>
                                                <Card.Title className='text-start mt-1 mb-2 fw-bold fs-3'>{artigo.Title} </Card.Title>
                                                    <Card.Text className='text-start fs-5'>
                                                    {artigo.SubTitle} 
                                                    </Card.Text>
                                                    <span className='text-start fs-5 p-2'>
                                                    {artigo.author} 
                                                    </span>
                                                    <span className='text-end fs-6'>
                                                    {artigo.data} 
                                                    </span>
                                            </Card.Body>
                                    </Card>
                            </Col>
                        )
                    })
                }
            </Row>
        </Container>

    );
}

export default Cards