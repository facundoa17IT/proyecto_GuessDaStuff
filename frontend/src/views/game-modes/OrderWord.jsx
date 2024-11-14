/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Utils **/
import { shuffleArray } from '../../utils/Helpers';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Style **/
import '../../styles/order-word.css'; // Importa el archivo CSS
import '../../styles/game-mode.css';

const OrderWord = ({ OWinfo, onCorrect, veryfyAnswer }) => {
	const { answer, setAnswer, isCorrectAnswer } = useContext(LoadGameContext);
	const { word } = OWinfo;
	const [selectedOrder, setSelectedOrder] = useState([[]]);
	const [shuffledLetters, setShuffledLetters] = useState([]);
	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
		setSelectedOrder([[]]);
		setAnswer('');
		setResultMessage('');
		const letters = word.split('').map((letter, index) => ({
			id: `${letter}-${index}`,
			letter,
		}));
		const shuffled = shuffleArray(letters);
		setShuffledLetters(shuffled);
		setSelectedOrder([]);
	}, [word]);

	useEffect(() => {
		if (isCorrectAnswer !== null) {
			handleVerify();
		}
	}, [isCorrectAnswer]);

	const handleLetterPress = (letterObj) => {
		setShuffledLetters((prev) => prev.filter((l) => l.id !== letterObj.id));
		setSelectedOrder((prev) => [...prev, letterObj]);
	};

	const handleSelectedPress = (letterObj) => {
		setSelectedOrder((prev) => prev.filter((l) => l.id !== letterObj.id));
		setShuffledLetters((prev) => [...prev, letterObj]);
	};

	const handleAnswer = () => {
		const selectedStrings = selectedOrder.map((selected) => selected.letter);
		const resultString = selectedStrings.join('');
		setAnswer(resultString);
	};

	const handleVerify = async () => {
		try {
			if (isCorrectAnswer) {
				setResultMessage('¡Correcto!');
				await new Promise((resolve) => setTimeout(resolve, 1500));
				onCorrect();
			} else {
				setResultMessage('Incorrecto. Intenta de nuevo');
			}
		} catch (error) {
			console.error('Error al verificar la respuesta:', error);
			setResultMessage('Error en la verificación. Intenta de nuevo.');
		}
	};

	const handleReset = () => {
		setSelectedOrder([]);
		const letters = word.split('').map((letter, index) => ({
			id: `${letter}-${index}`,
			letter,
		}));
		const shuffled = shuffleArray(letters);
		setShuffledLetters(shuffled);
	};

	return (
		<div className="game-mode-container ow-container">
			<div className="selectedOrderContainer">
				{selectedOrder.map((letterObj, index) => (
					<button
						key={`${letterObj.id}-${index}`}
						className="selectedButton"
						onClick={() => handleSelectedPress(letterObj)}
					>
						{letterObj.letter}
					</button>
				))}
			</div>
			<div className="buttonContainer">
				{shuffledLetters.map((letterObj, index) => (
					<button
						key={`${letterObj.id}-${index}`}
						className="button"
						onClick={() => handleLetterPress(letterObj)}
					>
						{letterObj.letter}
					</button>
				))}
			</div>
			{resultMessage && (
				<div className={`resultMessage ${resultMessage.includes('¡Correcto!') ? 'correct' : 'incorrect'}`}>
					{resultMessage}
				</div>
			)}
			<div className="buttonRow">
				<button className="verifyButton" onClick={handleAnswer}>
					Verificar
				</button>
				<button className="resetButton" onClick={handleReset}>
					Reiniciar
				</button>
			</div>
		</div>
	);
};

export default OrderWord;
