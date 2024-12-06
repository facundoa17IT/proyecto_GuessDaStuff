import React, { useState } from 'react';
import MainGameLayout from '../components/layouts/MainGamelayout';
import OW from '../assets/OW.png';
import GP from '../assets/GP.png';
import MC from '../assets/MC.png';
import Ruleta from '../assets/Ruleta.png';
import Brain from '../assets/helper.png';

const Instrucciones = () => {
    const gameModes = [
        { image: OW, text: "Este modo de juego consiste en ordenar los caracteres para formar la palabra correcta." },
        { image: GP, text: "Este modo de juego consiste en completar la frase o contestar pregunta." },
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
            leftHeader='Ruleta'
            leftContent={
                <>
                    <img style={{ width: '30rem' }} src={Ruleta} alt="Brain Character" />
                    <p style={{ marginTop: '1rem', fontSize: '1.3rem', textAlign: 'center' }}>
                        {ruleta[0].text}
                    </p>
                </>
            }
            middleFlexGrow={1}
            middleHeader='Modos de Juegos'
            middleContent={
                <>
                    <img
                        style={{ width: '30rem' }}
                        src={gameModes[currentIndex].image}
                        alt="Modo de Juego"
                    />
                    <p style={{ marginTop: '1rem', fontSize: '1.3rem', textAlign: 'center' }}>
                        {gameModes[currentIndex].text}
                    </p>
                    <button onClick={handleNext} style={{ marginTop: '1rem' }}>
                        Siguiente
                    </button>
                </>
            }
            rightHeader='Pistas'
            rightContent={
                <>
                    <img style={{ width: '20rem' }} src={Brain} alt="Brain Character" />
                    <p style={{ marginTop: '1rem', fontSize: '1.3rem', textAlign: 'center' }}>
                        {helper[0].text}
                    </p>
                </>
            }
        />
    );
};

export default Instrucciones;
