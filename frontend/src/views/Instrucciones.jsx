/** React **/
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';

/** Assets **/
import OW from '../assets/OW.png';
import GP from '../assets/GP.png';
import MC from '../assets/MC.png';
import Ruleta from '../assets/Ruleta.png';
import Brain from '../assets/helper.png';

/** Style **/
import '../styles/instructions.css'

const Instrucciones = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 450px)' });
    const isMediumDevice = useMediaQuery({ query: '(max-width: 1550px)' });

    const gameModes = [
        { image: OW, text: "Este modo de juego consiste en ordenar los caracteres para formar la palabra correcta." },
        { image: GP, text: "Este modo de juego consiste en completar la frase o contestar la pregunta." },
        { image: MC, text: "Este modo de juego consiste en seleccionar unicamente la opcion correcta." }
    ];

    const ruleta = [
        { image: Ruleta, text: "Se deben seleccionar 3 categorias entre las disponibles, las cuales seran emparejadas mediante la ruleta para definir el modo de juego asociado." }
    ];

    const helper = [
        { image: Brain, text: "En la partida tendras podrás solicitar ayuda a nuestro ayudante, el cual podrá brindarte una maximo de 3 pistas por partida." }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % gameModes.length);
    };

    return (
        <MainGameLayout
            canGoBack={false}
            leftHeader='Fase de Seleccion'
            leftContent={
                <div className='info-container'>
                    {/* <img className='img-col-1' src={Ruleta} alt="Brain Character" /> */}
                    <div className='img-col-2-container'>
                        <img
                            className='img-col-1' style={{ width: '100%' }}
                            src={Ruleta}
                            alt="Modo de Juego"
                        />
                        
                    </div>
                    <p>{ruleta[0].text}</p>
                </div>
            }
            middleFlexGrow={1}
            middleHeader='Modos de Juegos'
            middleContent={
                <div className='info-container'>
                    <div className='img-col-2-container'>
                        <img
                            className='img-col-2' style={{ width: '100%' }}
                            src={gameModes[currentIndex].image}
                            alt="Modo de Juego"
                        />
                        
                    </div>
                    <p>{gameModes[currentIndex].text}</p>
                    <button onClick={handleNext} style={{ fontSize: isMediumDevice ? 'small' : 'large' }}>
                        Siguiente
                    </button>
                </div>
            }
            rightHeader='Partida'
            rightContent={
                <div className='info-container'>
                    {/* <img className='img-col-3' src={Brain} alt="Brain Character" /> */}
                    <div className='img-col-2-container'>
                        <img
                            className='img-col-3' style={{ width: '100%' }}
                            src={Brain}
                            alt="Modo de Juego"
                        />
                        
                    </div>
                    <p>{helper[0].text}</p>
                </div>
            }
        />
    );
};

export default Instrucciones;
