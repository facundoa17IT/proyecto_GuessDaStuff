/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Styles **/
import "../../styles/multiple-choice.css"
import '../../styles/game-mode.css';

// Componente de Multiple Choice
const MultipleChoice = ({ MCinfo, veryfyAnswer, onCorrect }) => {
    const { answer, setAnswer, isCorrectAnswer } = useContext(LoadGameContext);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [confirmedAnswer, setConfirmedAnswer] = useState(null);
    const [resultMessage, setResultMessage] = useState('');

    const { question, randomCorrectWord, randomWord1, randomWord2, randomWord3 } = MCinfo;

    useEffect(() => {
        setSelectedAnswer(null);
        setConfirmedAnswer(null);
        setResultMessage('');
        setAnswer('');
    }, [MCinfo]);

    // IsCorrectAnswer recibe el valor de true o false desde el padre
    useEffect(() => {
        if (isCorrectAnswer !== null) {
            console.log("IS CORRECT ANSWER -> " + isCorrectAnswer);
            handleCheckAnswer(selectedAnswer);
        }
    }, [isCorrectAnswer]);

    const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

    const handleCheckAnswer = async (selectedAnswer) => {
        if (!MCinfo.randomCorrectWord) {
            setResultMessage("Este juego aún no fue implementado.");
            return;
        }
        try {
            if (isCorrectAnswer) {
                setResultMessage("¡Correcto!");
                await new Promise(resolve => setTimeout(resolve, 1500));
                onCorrect(); // Llama a la función que maneja la respuesta correcta
            } else {
                setResultMessage("Incorrecto. Intenta de nuevo.");
                await new Promise(resolve => setTimeout(resolve, 1500));
                onCorrect();
            }
        } catch (error) {
            console.error("Error al enviar la respuesta:", error);
        }
    };

    const confirmAnswer = () => {
        if (selectedAnswer) {
            setAnswer(selectedAnswer);
            setConfirmedAnswer(selectedAnswer); // Confirma la respuesta seleccionada
        }
    };

    return (
        <div className="game-mode-container mc-container">
            <div className="containerPhrase">
                <p>{question}</p>
            </div>

            <div className='optionsWrapper'>
                <div className="optionsContainer">
                    {allOptions.map((option, index) => (
                        <button
                            key={index}
                            className={`optionButton ${selectedAnswer === option ? 'selectedOption' : ''} ${confirmedAnswer && option === randomCorrectWord ? 'correctOption' : ''} ${confirmedAnswer && selectedAnswer === option && selectedAnswer !== randomCorrectWord ? 'incorrectOption' : ''}`}
                            onClick={() => setSelectedAnswer(option)}
                            disabled={confirmedAnswer !== null}
                        >
                            <span className={`optionText ${selectedAnswer === option ? 'selectedOptionText' : ''} ${confirmedAnswer && option === randomCorrectWord ? 'correctOptionText' : ''} ${confirmedAnswer && selectedAnswer === option && selectedAnswer !== randomCorrectWord ? 'incorrectOptionText' : ''}`}>
                                {option}
                            </span>
                        </button>
                    ))}
                </div>
            </div>


            <button className="confirmButton" onClick={confirmAnswer} disabled={confirmedAnswer !== null}>
                Confirmar Opción
            </button>

            {confirmedAnswer && (
                <p className="answerText">
                    {confirmedAnswer === randomCorrectWord ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}
                </p>
            )}
        </div>
    );
};

export default MultipleChoice;