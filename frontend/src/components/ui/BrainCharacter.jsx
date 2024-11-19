import React from 'react';
import idle from '../../assets/idle_brain.png'
import HintGlobe from '../../assets/hint-globe.png'
import Typewriter from 'typewriter-effect';
import '../../styles/brain-character.css'

const BrainCharacter = ({ rerenderKey, words = "", autoStart = false, hideDialogue = false, sprite = idle }) => {
    return (
        <div className='character-container'>
            {!hideDialogue && <div className="globe-hint-container">
                <img src={HintGlobe} alt="Globe" className="globe-hint-background" />
                <div className="globe-hint-text">
                    <Typewriter
                        options={{
                            autoStart: autoStart,
                            loop: false, // Para que no se repita en bucle
                            delay: 80, // Velocidad de escritura
                        }}
                        onInit={(typewriter) => {
                            typewriter
                                .typeString(words)
                                .start();
                        }}
                        key={rerenderKey} // Importante para que re-renderice el componente con cada nueva palabra
                    />
                </div>
            </div>}
            <img className="brain-character" src={sprite} alt="" />
        </div>
    );
};

export default BrainCharacter;