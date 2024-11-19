/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Style **/
import '../../styles/guess-phrase.css';
import '../../styles/game-mode.css';

const GuessPhrase = ({ GPinfo }) => {
	const { setAnswer, isCorrectAnswer, setIsCorrectAnswer } = useContext(LoadGameContext);
	const { phrase, correct_word } = GPinfo;
	const [userInput, setUserInput] = useState('');

	useEffect(() => {
		setUserInput('');
	}, [GPinfo]);

	const handleCheckAnswer = async () => {
		if (!correct_word) {
			console.warn("Este juego aún no fue implementado.");
			return;
		}

		try {
			setAnswer(userInput);
			const isCorrect = userInput.trim().toLowerCase() === correct_word.toLowerCase();
			setIsCorrectAnswer(isCorrect);
			console.log(isCorrect ? "Correcto!" : "Incorrecto!");
		} catch (error) {
			console.error("Error al verificar la respuesta:", error);
		}
	};

	const handleReset = () => {
		setUserInput("");
		setIsCorrectAnswer(null);
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

			<input
				className={`input ${isCorrectAnswer === null ? '' : isCorrectAnswer ? 'respuesta-correcta' : 'respuesta-incorrecta'}`}
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				placeholder="Escribe tu respuesta"
			/>

			<div className="buttonRow">
				<button className="resetButton" onClick={handleReset}>Borrar</button>
				<button className="verifyButton" onClick={handleCheckAnswer}>Verificar</button>
			</div>
		</div>
	);
};

export default GuessPhrase;
