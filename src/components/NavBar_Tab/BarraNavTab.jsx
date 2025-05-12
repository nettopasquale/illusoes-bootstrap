import {Nav} from 'react-bootstrap';

import PropTypes from 'prop-types';

BarraNavTab.propTypes = {
  activeKey: PropTypes.string.isRequired,
  linkRef: PropTypes.string.isRequired,
  linkName: PropTypes.string.isRequired,

}


function BarraNavTab() {
  return (
    <Nav fill variant="tabs" defaultActiveKey="/home" className='mt-3'>
      <Nav.Item>
        <Nav.Link href="/" className='fw-bold fs-2'>Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1" href="/artigos" className='fw-bold fs-2'>Artigos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2" href="/decks" className='fw-bold fs-2'>Decks</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-3" href="/eventos" className='fw-bold fs-2'>Eventos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-4" href="/campeonatos" className='fw-bold fs-2'>Campeonatos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-5" href="/marketplace" className='fw-bold fs-2'>Marketplace</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default BarraNavTab;