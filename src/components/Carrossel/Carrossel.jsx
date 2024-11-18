/* eslint-disable no-unused-vars */
import React from 'react'
import { Carousel, Image } from 'react-bootstrap'
import liliana from '../../assets/imgs/Magic/liliana-vess-1920_jpg.png'
import yug25 from '../../assets/imgs/Yugioh/25thniv.jpg'
import SVPok from '../../assets/imgs/Pokemon/Scarlet-Violet-English-1.jpg'

const Carrossel = () => {
  return (
    <Carousel>
      <Carousel.Item interval={1000}>
        <Image src={yug25} className='w-75'/>
        <Carousel.Caption>
          <h3 className='fw-bold text-black fs-3'>Lançamento: Set 25th Anniversary Yugioh!</h3>
          <p className='fw-bold text-black'>As cartas clássicas novamente disponíveis</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={1000}>
        <Image src={SVPok} className='w-75' />
        <Carousel.Caption>
          <h3 className='fw-bold text-black fs-3'>Campeonato Scarlet e Violet - Pokémon</h3>
          <p className='fw-bold text-black'>Para todas as idades</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={1000}>
              <Image src={liliana} className='w-75' />
        <Carousel.Caption>
          <h3 className='fw-bold text-black fs-3'>Liliana Death Wielder</h3>
          <p className='fw-bold text-black'>
            Veja como montar um Deck focado em suporte para Liliana
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default Carrossel