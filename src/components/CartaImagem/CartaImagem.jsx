import {useInView} from "react-intersection-observer";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";

export const CartaImagem = ({src, alt}) =>{
    const {ref, inView} = useInView({triggerOnce: true});
    return(
        <div ref={ref}>
            {inView ? (
                <Card.Img variant="top" src={src} alt={alt}/>
            ): (
                <div style={{height: "300px", background:"#222"}}></div>
            )}
        </div>
    );
}