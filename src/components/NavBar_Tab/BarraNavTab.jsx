import {Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

BarraNavTab.propTypes = {
  activeKey: PropTypes.string.isRequired,
  linkRef: PropTypes.string.isRequired,
  linkName: PropTypes.string.isRequired,

}


function BarraNavTab() {
  return (
    <Nav fill variant="tabs" defaultActiveKey="/home" className='mt-3 flex-row gap-1 justify-content-around align-content-around'>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
          <Link to={"/"}>Home</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
          <Link to={"/noticias/:tipo"}>Noticias</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
        <Link to={"/noticias/:tipo"}>Artigos</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
          <Link to={"/eventos/:tipo"}>Eventos</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
          <Link to={"/eventos/:tipo"}>Campeonatos</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
        <Link to={"/colecoes"}>Coleções</Link>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link className='fw-bold fs-2'>
        <Link to={"/marketplace"}>Marketplace</Link>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default BarraNavTab;