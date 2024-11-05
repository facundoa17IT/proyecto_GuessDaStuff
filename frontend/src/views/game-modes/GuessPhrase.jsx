import React, { useState, useEffect, useContext } from 'react';
/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

// Componente de GuessPhrase
const GuessPhrase = ({ GPinfo, onCorrect, veryfyAnswer }) => {
	const { answer, setAnswer, isCorrectAnswer } = useContext(LoadGameContext);

	const { phrase, correct_word } = GPinfo;
	const [userInput, setUserInput] = useState('');
	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
		setUserInput('');
		setResultMessage('');
	}, [GPinfo]);

	// IsCorrectAnswer recibe el valor de true o false desde el padre
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
		<div style={styles.container}>
			<div style={styles.containerPhrase}>
				{phrase ? (
					<p style={styles.phrase}>{phrase}</p>
				) : (
					<p>Este juego aún no fue implementado.</p>
				)}
			</div>
			<input
				style={styles.input}
				value={userInput}
				onChange={(e) => setUserInput(e.target.value)}
				placeholder="Escribe tu respuesta"
			/>
			{resultMessage && <p style={styles.resultMessage}>{resultMessage}</p>}
			<button style={styles.verifyButton} onClick={handleAnswer}>
				Verificar
			</button>
		</div>
	);
};

// Estilos adaptados para React.js
const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'flex-start',
		padding: '20px',
	},
	phrase: {
		fontSize: '24px',
		fontWeight: 'bold',
	},
	input: {
		backgroundColor: '#FFF',
		borderWidth: '3px',
		borderColor: '#653532',
		width: '300px',
		padding: '10px',
		marginBottom: '10px',
		fontSize: '20px',
	},
	verifyButton: {
		backgroundColor: '#B36F6F',
		padding: '15px',
		borderRadius: '8px',
		borderStyle: 'solid',
		borderWidth: '2px',
		borderColor: '#653532',
		color: '#fff',
		fontSize: '18px',
		cursor: 'pointer',
		textAlign: 'center',
	},
	resultMessage: {
		marginBottom: '50px',
		fontSize: '15px',
	},
	containerPhrase: {
		backgroundColor: '#FFF',
		padding: '10px',
		borderRadius: '8px',
		borderWidth: '3px',
		borderColor: '#653532',
		width: '300px',
		marginBottom: '50px',
	},
};

export default GuessPhrase;