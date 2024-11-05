import React, { useState, useEffect, useContext} from 'react';
/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';
// Función para mezclar un array
const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

const OrderWord = ({ OWinfo, onCorrect, veryfyAnswer }) => {
	const { answer, setAnswer, isCorrectAnswer } = useContext(LoadGameContext);

	const { word } = OWinfo;
	const [selectedOrder, setSelectedOrder] = useState([[]]);
	const [shuffledWords, setShuffledWords] = useState([]);
	//const [answer, setAnswer] = useState('');
	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
		const words = word.split(' ');
		const shuffled = words.map(w => shuffleArray(w.split('')));
		setShuffledWords(shuffled);

		setSelectedOrder([[]]);
		setAnswer('');
		setResultMessage('');
	}, [OWinfo]);

	// IsCorrectAnswer recibe el valor de true o false desde el padre
	useEffect(() => {
		if (isCorrectAnswer !== null) {
			console.log("IS CORRECT ANSWER -> " + isCorrectAnswer);
		  handleVerify();
		};
	  }, [isCorrectAnswer]);

	const handleLetterPress = (letter, wordIndex) => {
		const letterIndex = shuffledWords[wordIndex].findIndex(l => l === letter);
		if (letterIndex !== -1) {
			setSelectedOrder((prev) => {
				const newSelected = [...prev];
				if (!newSelected[wordIndex]) {
					newSelected[wordIndex] = [];
				}
				newSelected[wordIndex].push(letter);
				return newSelected;
			});
			setShuffledWords(prev => {
				const newWords = [...prev];
				newWords[wordIndex].splice(letterIndex, 1);
				return newWords;
			});
		}
	};

	const handleSelectedPress = (letter, wordIndex) => {
		const letterIndex = selectedOrder[wordIndex].findIndex(l => l === letter);
		if (letterIndex !== -1) {
			setSelectedOrder((prev) => {
				const newSelected = [...prev];
				newSelected[wordIndex].splice(letterIndex, 1);
				return newSelected;
			});
			setShuffledWords(prev => {
				const newWords = [...prev];
				newWords[wordIndex].push(letter);
				return newWords;
			});
		}
	};

	const handleAnswer = () => {
		const selectedStrings = selectedOrder.map(selected => selected.join(''));
		const resultString = selectedStrings.join('');
		setAnswer(resultString);
	}

	const handleVerify = async () => {
		try {
			if (isCorrectAnswer) {
				setResultMessage("¡Correcto!");
				await new Promise(resolve => setTimeout(resolve, 1500));
				onCorrect();
			} else {
				setResultMessage("Incorrecto. Intenta de nuevo");
			}
		} catch (error) {
			console.error("Error al verificar la respuesta:", error);
			setResultMessage("Error en la verificación. Intenta de nuevo.");
		}
	};

	const handleReset = () => {
		setSelectedOrder([[]]);
		const words = word.split(' ');
		const shuffled = words.map(w => shuffleArray(w.split('')));
		setShuffledWords(shuffled);
	};

	return (
		<div style={styles.container}>
			<p style={styles.title}>Ordena la palabra...</p>

			<div style={styles.buttonsContainer}>
				{/* Contenedor para botones seleccionados */}
				<div style={styles.selectedOrderContainer}>
					{selectedOrder.map((selectedLetters = [], wordIndex) => (
						<div key={wordIndex} style={styles.selectedOrderButtons}>
							{selectedLetters.map((letter, index) => (
								<button
									key={index}
									style={styles.selectedButton}
									onClick={() => handleSelectedPress(letter, wordIndex)}
								>
									{letter}
								</button>
							))}
						</div>
					))}
				</div>
				{/* Contenedor para botones de letras */}
				{shuffledWords.map((letters, wordIndex) => (
					<div key={wordIndex} style={styles.buttonContainer}>
						{letters.map((letter, index) => (
							<button
								key={index}
								style={styles.button}
								onClick={() => handleLetterPress(letter, wordIndex)}
							>
								{letter}
							</button>
						))}
					</div>
				))}
			</div>
			{resultMessage && <p style={styles.resultMessage}>{resultMessage}</p>}

			<div style={styles.buttonRow}>
				<button style={styles.verifyButton} onClick={handleAnswer}>
					Verificar
				</button>
				<button style={styles.resetButton} onClick={handleReset}>
					Reiniciar
				</button>
			</div>
		</div>
	);
};

// Estilos adaptados para React.js
const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	title: {
		fontSize: '24px',
		fontWeight: 'bold',
		marginBottom: '20px',
	},
	buttonsContainer: {
		marginTop: '30px',
		marginBottom: '40px',
		textAlign: 'center',
	},
	buttonContainer: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	button: {
		backgroundColor: '#FFFDD0',
		padding: '10px',
		margin: '5px',
		borderRadius: '5px',
		width: '50px',
		border: '2px solid black',
		textAlign: 'center',
		cursor: 'pointer',
	},
	selectedOrderContainer: {
		marginTop: '20px',
	},
	selectedOrderButtons: {
		display: 'flex',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	selectedButton: {
		backgroundColor: '#1F354A',
		padding: '10px',
		margin: '5px',
		borderRadius: '5px',
		width: '50px',
		border: '2px solid black',
		color: 'white',
		cursor: 'pointer',
	},
	buttonRow: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '80%',
		marginTop: '20px',
	},
	verifyButton: {
		backgroundColor: "#B36F6F",
		padding: '15px',
		borderRadius: '8px',
		border: '2px solid #653532',
		cursor: 'pointer',
		width: '45%',
		textAlign: 'center',
		color: 'white',
		fontWeight: 'bold',
	},
	resetButton: {
		backgroundColor: "#B36F6F",
		padding: '15px',
		borderRadius: '8px',
		border: '2px solid #653532',
		cursor: 'pointer',
		width: '45%',
		textAlign: 'center',
		color: 'white',
		fontWeight: 'bold',
	},
	resultMessage: {
		fontSize: '18px',
		color: 'red',
		marginTop: '20px',
	},
};

export default OrderWord;
