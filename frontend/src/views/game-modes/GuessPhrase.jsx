/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Style **/
import '../../styles/guess-phrase.css';
import '../../styles/game-mode.css';

const GuessPhrase = ({ GPinfo, onCorrect, veryfyAnswer }) => {
	const { answer, setAnswer, isCorrectAnswer } = useContext(LoadGameContext);
	const { phrase, correct_word } = GPinfo;
	const [userInput, setUserInput] = useState('');
	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
		setUserInput('');
		setResultMessage('');
	}, [GPinfo]);

	useEffect(() => {
		if (isCorrectAnswer !== null) {
			console.log("IS CORRECT ANSWER -> " + isCorrectAnswer);
			handleCheckAnswer();
		};
	}, [isCorrectAnswer]);

	const handleAnswer = () => {
		if (!correct_word) {
			setResultMessage("Este juego aún no fue implementado.");
			return;
		}
		setAnswer(userInput.trim().toUpperCase());
	}

	const handleCheckAnswer = async () => {
		try {
			if (isCorrectAnswer) {
				setResultMessage("¡Correcto!");
				await new Promise((resolve) => setTimeout(resolve, 1500));
				onCorrect();
			} else {
				setResultMessage("Incorrecto. Intenta de nuevo.");
			}
		} catch (error) {
			console.error("Error al enviar la respuesta:", error);
			setResultMessage("Hubo un error al verificar la respuesta.");
		}
	};

	return (
		<div className="game-mode-container gp-container">
			<div className="containerPhrase">
				{phrase ? (
					<p>{phrase}</p>
				) : (
					<p>Este juego aún no fue implementado.</p>
				)}
			</div>
			{resultMessage && (
				<div className={`resultMessage ${isCorrectAnswer ? 'correct' : ''}`}>
					{resultMessage}
					hola
				</div>
			)}
			<input
				className="input"
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				placeholder="Escribe tu respuesta"
			/>
			<button className="verifyButton" onClick={handleAnswer}>
				Verificar
			</button>
		</div>
	);
};

export default GuessPhrase;
