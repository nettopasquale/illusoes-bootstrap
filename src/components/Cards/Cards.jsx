import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
import agido from '../../assets/imgs/Yugioh/agido_the_ancient_sentry.png'
//import blackshadow from '../../assets/imgs/Yugioh/black_shadow_squall.png'
//import mewtwo from '../../assets/imgs/Pokemon/mewtwo_tcg.png'
//import mew from '../../assets/imgs/Pokemon/mew_tcg.png'
//import liliana from '../../assets/imgs/Magic/liliana-vess-1920_jpg.png'
import noticias from "../../data/noticias.json"

/*
const noticias = [
    {
        id: 1, 
        imageURL: import("../../assets/imgs/Yugioh/agido_the_ancient_sentry.png"),
        newsTitle: "O terror Agido em decks anciões!",
        newsSubTitle: "Agido tem feito diferença nos torneios mundiais."
    },
    {
        id: 2, 
        imageURL: import("../../assets/imgs/Yugioh/black_shadow_squall.png"),
        newsTitle: "black_shadow_squall",
        newsSubTitle: ""
    },
    {
        id: 3, 
        imageURL: import("../../assets/imgs/Yugioh/blaze_cannon_extended.jpg"),
        newsTitle: "blaze_cannon_extended",
        newsSubTitle: ""
    },
    {
        id: 4, 
        imageURL: import("../../assets/imgs/Yugioh/card_destruction.jpg"),
        newsTitle: "card_destruction",
        newsSubTitle: ""
    },
    {
        id: 5, 
        imageURL: import("../../assets/imgs/Yugioh/court_of_cards.jpg"),
        newsTitle: "court_of_cards",
        newsSubTitle: ""
    },
    {
        id: 6, 
        imageURL: import("../../assets/imgs/Yugioh/eldlich_the_golden_lord.png"),
        newsTitle: "eldlich_the_golden_lord",
        newsSubTitle: ""
    },
    {
        id: 7, 
        imageURL: import("../../assets/imgs/Yugioh/melfyy_seally.png"),
        newsTitle: "melfyy_seally",
        newsSubTitle: ""
    },
    {
        id: 8, 
        imageURL: import("../../assets/imgs/Yugioh/nibiru.jpg"),
        newsTitle: "nibiru",
        newsSubTitle: ""
    },
    {
        id: 9, 
        imageURL: import("../../assets/imgs/Yugioh/scapegoat.jpg"),
        newsTitle: "scapegoat",
        newsSubTitle: ""
    },
    {
        id: 10, 
        imageURL: import("../../assets/imgs/Yugioh/red_eyes_dark_dragoon.jpg"),
        newsTitle: "red_eyes_dark_dragoon",
        newsSubTitle: ""
    },
    {
        id: 11, 
        imageURL: import("../../assets/imgs/Yugioh/the_legendary_exodia_incarnate.jpg"),
        newsTitle: "the_legendary_exodia_incarnate",
        newsSubTitle: ""
    },
    {
        id: 12, 
        imageURL: import("../../assets/imgs/Yugioh/timaeus_the_united_dragon.png"),
        newsTitle: "timaeus_the_united_dragon",
        newsSubTitle: ""
    }
]
*/


let listaNoticias = noticias
  
const Cards = () => {
    return (
        <Container fluid className='mt-4'>
            <Row>
                {
                    listaNoticias.map(noticia => {
                        return (
                            <Col sm={4} key={noticia.id}>
                                <Card border='dark' style={{ width: '23rem' }}>
                                    <Card.Img src={agido} variant="top" className='img-fluid rounded'/>
                                        <Card.Body>
                                            <Card.Title className='text-start mt-1 mb-2 fw-bold fs-3'>O terror Agido em decks anciões!</Card.Title>
                                                <Card.Text className='text-start fs-4'>
                                                    Agido tem feito diferença nos torneios mundiais.
                                                </Card.Text>
                                                <Button variant="primary" className='mt-2 text-center fs-4'>Veja mais</Button>
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