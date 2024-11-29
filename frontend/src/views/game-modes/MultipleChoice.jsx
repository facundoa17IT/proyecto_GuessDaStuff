/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Assets **/
import { FaRegCheckCircle } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";

/** Styles **/
import "../../styles/multiple-choice.css"
import '../../styles/game-mode.css';

// Componente de Multiple Choice
const MultipleChoice = ({ MCinfo, hintButton }) => {
    const { setAnswer, setIsCorrectAnswer } = useContext(LoadGameContext);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [confirmedAnswer, setConfirmedAnswer] = useState(null);

    const { question, randomCorrectWord, randomWord1, randomWord2, randomWord3 } = MCinfo;

    useEffect(() => {
        setSelectedAnswer(null);
        setConfirmedAnswer(null);
        setAnswer('');
    }, [MCinfo]);

    const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

    const handleCheckAnswer = async (selectedAnswer) => {
        if (!randomCorrectWord) {
            console.warn("Este juego aún no fue implementado.");
            return;
        }

        try {
            setAnswer(selectedAnswer);
            const isCorrect = selectedAnswer === randomCorrectWord;
            console.log(isCorrect ? "Correcto!" : "Incorrecto!");
            setIsCorrectAnswer(isCorrect);
        } catch (error) {
            console.error("Error al verificar la respuesta:", error);
        }
    };

    const confirmAnswer = () => {
        if (selectedAnswer) {
            setConfirmedAnswer(selectedAnswer); // Confirma la respuesta seleccionada
            handleCheckAnswer(selectedAnswer);
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
                            className={
                                `optionButton ${selectedAnswer === option ? 'selectedOption' : ''} 
                                ${confirmedAnswer && option === randomCorrectWord ? 'correctOption' : ''} 
                                ${confirmedAnswer && selectedAnswer === option && selectedAnswer !== randomCorrectWord ? 'incorrectOption' : ''}`
                            }
                            onClick={() => setSelectedAnswer(option)}
                            disabled={confirmedAnswer !== null}
                        >
                            <span
                                className={
                                    `optionText ${selectedAnswer === option ? 'selectedOptionText' : ''} 
                                    ${confirmedAnswer && option === randomCorrectWord ? 'correctOptionText' : ''} 
                                    ${confirmedAnswer && selectedAnswer === option && selectedAnswer !== randomCorrectWord ? 'incorrectOptionText' : ''}`
                                }
                            >
                                {option}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="buttonRow">
				{hintButton}
				<button
					className="confirmButton"
					onClick={confirmAnswer}
                    disabled={confirmedAnswer !== null}
				>
					<span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
						<FaRegCheckCircle style={{ marginRight: "5px" }} name="help-outline" size={30} />Verificar
					</span>
				</button>
            </div>
        </div>
    );
};

export default MultipleChoice;