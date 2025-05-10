import {Tabs, Tab } from 'react-bootstrap';
import HomeCards from '../Cards/HomeCards'
import { useState } from 'react';
import artigos from "../../data/artigos.json"

function Tezte() {
    const [key, setKey] = useState('home')

    return (
        <>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mt-3 mb-3">
                <Tab eventKey="home" title="Home" className='fw-bold fs-2'>
                <HomeCards  {...artigos}></HomeCards>    
                </Tab>   
                <Tab eventKey="artigos" title="Artigos" className='fw-bold fs-2'>
                <HomeCards></HomeCards>    
                </Tab>   
                <Tab eventKey="decks" title="Decks" className='fw-bold fs-2'>
                <HomeCards></HomeCards>    
                </Tab>   
                <Tab eventKey="eventos" title="Eventos" className='fw-bold fs-2'>
                <HomeCards></HomeCards>    
                </Tab>   
                <Tab eventKey="campeonatos" title="Campeonatos" className='fw-bold fs-2'>
                <HomeCards></HomeCards>    
                </Tab>   
                <Tab eventKey="marketplace" title="Marketplace" className='fw-bold fs-2'>
                <HomeCards></HomeCards>    
                </Tab>   
            </Tabs>
      </>
  );
}

export default Tezte;