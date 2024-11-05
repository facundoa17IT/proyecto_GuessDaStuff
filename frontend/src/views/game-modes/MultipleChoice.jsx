import React, { useState, useEffect, useContext } from 'react';
/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

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
        <div style={styles.container}>

            <div style={styles.containerPhrase}>
                <p style={styles.question}>{question}</p>
            </div>

            {/* Contenedor para las opciones */}
            <div style={styles.optionsContainer}>
                {/* Mostramos las opciones como botones */}
                {allOptions.map((option, index) => (
                    <button
                        key={index}
                        style={{
                            ...styles.optionButton,
                            ...(selectedAnswer === option && styles.selectedOption), // Estilo para opción seleccionada
                            ...(confirmedAnswer && option === randomCorrectWord && styles.correctOption), // Estilo para opción correcta
                            ...(confirmedAnswer &&
                                selectedAnswer === option &&
                                selectedAnswer !== randomCorrectWord &&
                                styles.incorrectOption), // Estilo para opción incorrecta
                        }}
                        onClick={() => setSelectedAnswer(option)} // Solo establece la respuesta seleccionada
                        disabled={confirmedAnswer !== null} // Deshabilitar las opciones después de confirmar
                    >
                        <span
                            style={{
                                ...styles.optionText,
                                ...(selectedAnswer === option && styles.selectedOptionText), // Estilo de texto seleccionado
                                ...(confirmedAnswer && option === randomCorrectWord && styles.correctOptionText), // Estilo de texto para la opción correcta
                                ...(confirmedAnswer &&
                                    selectedAnswer === option &&
                                    selectedAnswer !== randomCorrectWord &&
                                    styles.incorrectOptionText), // Estilo de texto para la opción incorrecta
                            }}
                        >
                            {option}
                        </span>
                    </button>
                ))}
            </div>

            {/* Botón de Confirmar Opción con estilos personalizados */}
            <button
                style={styles.confirmButton}
                onClick={confirmAnswer} // Llama a confirmAnswer al presionar el botón
                disabled={confirmedAnswer !== null} // Deshabilitar botón después de confirmar
            >
                Confirmar Opción
            </button>

            {/* Mostrar el estado actual del juego */}
            {confirmedAnswer && (
                <p style={styles.answerText}>
                    {confirmedAnswer === randomCorrectWord
                        ? '¡Respuesta correcta!'
                        : 'Respuesta incorrecta.'}
                </p>
            )}
        </div>
    );
};

// Estilos adaptados para React.js
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: -30,
    },
    containerPhrase: {
		backgroundColor: '#FFF',
		
		borderRadius: '8px',
		borderWidth: '3px',
		borderColor: '#653532',
        borderStyle: 'solid',
		width: '390px',
		marginBottom: '10px',
        marginTop: 10,
	},
    
    question: {
        fontSize: '20px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    optionsContainer: {
        display: 'grid', // Cambia a grid para facilitar la distribución
        gridTemplateColumns: 'repeat(2, 1fr)', // Dos columnas
        gap: '10px', // Espacio entre los botones
        width: '400px', // Ancho completo para el contenedor
        maxWidth: '600px', // Ancho máximo
    },
    optionButton: {
        backgroundColor: '#B36F6F',
        padding: '15px',
        borderRadius: '8px',
        borderStyle: 'solid',
        borderWidth: '3px',
        borderColor: '#653532',
        cursor: 'pointer',
        textAlign: 'center',
    },
    optionText: {
        color: '#fff',
        fontSize: '18px',
    },
    selectedOption: {
        backgroundColor: '#fff',
    },
    selectedOptionText: {
        color: '#653532',
    },
    correctOption: {
        backgroundColor: 'green', // Fondo verde para opción correcta
    },
    correctOptionText: {
        color: '#fff', // Texto blanco para opción correcta
    },
    incorrectOption: {
        backgroundColor: 'red', // Fondo rojo para opción incorrecta
    },
    incorrectOptionText: {
        color: '#fff', // Texto blanco para opción incorrecta
    },
    confirmButton: {
        backgroundColor: '#653532',
        padding: '15px 30px',
        borderRadius: '8px',
        marginTop: '20px',
        borderWidth: '3px',
        borderColor: '#B36F6F', // Borde del botón de confirmar
        color: '#fff',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    answerText: {
        marginTop: '20px',
        fontSize: '18px',
        fontWeight: 'bold',
    },
};

export default MultipleChoice;
