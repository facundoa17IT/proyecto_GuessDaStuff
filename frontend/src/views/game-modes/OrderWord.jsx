/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Utils **/
import { shuffleArray } from '../../utils/Helpers';

/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

/** Style **/
import '../../styles/order-word.css'; // Importa el archivo CSS
import '../../styles/game-mode.css';

const OrderWord = ({ OWinfo }) => {
	const { setAnswer, isCorrectAnswer, setIsCorrectAnswer } = useContext(LoadGameContext);
	const { word } = OWinfo;
	const [selectedOrder, setSelectedOrder] = useState([[]]);
	const [shuffledLetters, setShuffledLetters] = useState([]);

	useEffect(() => {
		setSelectedOrder([[]]);
		setAnswer('');
		const letters = word.split('').map((letter, index) => ({
			id: `${letter}-${index}`,
			letter,
		}));
		const shuffled = shuffleArray(letters);
		setShuffledLetters(shuffled);
		setSelectedOrder([]);
	}, [word]);

	const handleLetterPress = (letterObj) => {
		setShuffledLetters((prev) => prev.filter((l) => l.id !== letterObj.id));
		setSelectedOrder((prev) => [...prev, letterObj]);
	};

	const handleSelectedPress = (letterObj) => {
		setSelectedOrder((prev) => prev.filter((l) => l.id !== letterObj.id));
		setShuffledLetters((prev) => [...prev, letterObj]);
	};

	const handleVerify = async () => {
		if (!word) {
            console.warn("Este juego aún no fue implementado.");
            return;
        }

		try {
			const selectedString = selectedOrder.map(l => l.letter).join('');
			setAnswer(selectedString);
			const isCorrect = selectedString === word;
			console.log(isCorrect ? "Correcto!" : "Incorrecto!");
			setIsCorrectAnswer(isCorrect);	
		} catch (error) {
			console.error('Error al verificar la respuesta:', error);
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
		setIsCorrectAnswer(null);
	};

	return (
		<div className="game-mode-container ow-container">
			<div className={`selectedOrderContainer ${isCorrectAnswer === null ? '' : isCorrectAnswer ? 'respuesta-correcta' : 'respuesta-incorrecta'}`}>
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

			<div className="buttonRow">
				<button className="resetButton" onClick={handleReset}>Borrar</button>
				<button className="verifyButton" onClick={handleVerify}>Verificar</button>
			</div>
		</div>
	);
};

export default OrderWord;
