import { Container} from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import artigos from "../../data/artigos.json"

function Cards(props){
    function onClick() {
        console.log("Vai para o site!")    
    }

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {

                breakpoint: 1024,
      
                settings: {
      
                  slidesToShow: 3,
      
                  slidesToScroll: 3,
      
                  infinite: true,
      
                  dots: true
      
                }
      
              },
      
              {
      
                breakpoint: 600,
      
                settings: {
      
                  slidesToShow: 2,
      
                  slidesToScroll: 2,
      
                  initialSlide: 2
      
                }
      
              },
      
              {
      
                breakpoint: 480,
      
                settings: {
      
                  slidesToShow: 1,
      
                  slidesToScroll: 1
      
                }
      
              }
      
        ]
    };

    let dados = Array.from(props)

    return (
      <Container className="container-fluid mt-4 justify-content-center m-0">
        <Slider {...settings} className="mb-1">
          {dados.map((dado) => {
            return (
                <div className="card border-primary card-body justify-content-between align-content-around" key={dado.id} onClick={onClick}>
                    <img src={dado.image} className="card-img-top w-100 img-fluid" alt="card-img-top"/>
                    <div className="card-body">
                        <h5 className="card-title">{dado.Title}</h5>
                    <p className="card-text fs-4">{dado.SubTitle}</p>
                        <span className="card-text fs-5"><small className="text-muted">{dado.author}</small></span>
                    <span className="card-text fs-5"><small className="text-muted">{dado.data}</small></span>
                </div>
                </div>
            );
          })}
        </Slider>
      </Container>
    );
}

export default Cards
