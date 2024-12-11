/** React **/
import React from 'react';

/** Sprites **/
import idle from '../../assets/idle_brain.png'
import finishGame from '../../assets/finish-game-brain.png'
import correctAnswer from '../../assets/correct-answer-brain.png'
import wrongAnswer from '../../assets/wrong-answer-brain.png'
import hint from '../../assets/hint-brain.png'
import timeout from '../../assets/timeout-brain.png'

/** Assets */
import HintGlobe from '../../assets/hint-globe.png'

/** Animation **/
import ScaleTransition from '../anim/ScaleTransiton';
import HorizontalSlideTransition from '../anim/HorizontalSlideTransition';
/** Component**/
import Typewriter from 'typewriter-effect';

/** Style **/
import '../../styles/brain-character.css'

const BrainCharacter = ({ rerenderKey, words = "", autoStart = false, hideDialogue = false, spriteKey = 'idle', width = 'auto' }) => {
    // Define available sprites
    const sprites = {
        idle: idle,
        hint: hint,
        correct: correctAnswer,
        wrong: wrongAnswer,
        timeout: timeout,
        finish: finishGame,
    };

    // Fallback to a default sprite if the key is invalid
    const currentSprite = sprites[spriteKey] || sprites['idle'];

    return (
        <div className="character-container">
            {!hideDialogue && (
                <ScaleTransition key={words}>
                <div className="globe-hint-container">
                        <img src={HintGlobe} alt="Globe" className="globe-hint-background" />
                    <div className="globe-hint-text">
                        <Typewriter
                            options={{
                                autoStart: autoStart,
                                loop: false, // Prevents looping
                                delay: 80,   // Typing speed
                            }}
                            onInit={(typewriter) => {
                                typewriter
                                .typeString(words)
                                .start();
                            }}
                            key={rerenderKey} // Ensures re-render with new words
                            />
                    </div>
                </div>
                </ScaleTransition>
            )}
            <HorizontalSlideTransition key={spriteKey}>
                <img className="brain-character" src={currentSprite} alt="Brain Character" style={{width: `${width}`}} />
            </HorizontalSlideTransition>
        </div>
    );
};

export default BrainCharacter;