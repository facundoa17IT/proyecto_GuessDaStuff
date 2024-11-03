import React, { useState, useEffect } from 'react';

const GuessPhrase = ({ GPinfo }) => {
    const { phrase, correct_word } = GPinfo;
    const [userInput, setUserInput] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const handleCheckAnswer = () => {
        if (correct_word === null) {
            setResultMessage("Este juego aún no fue implementado.");
        } else {
            const isCorrect = userInput.trim().toLowerCase() === correct_word.toLowerCase();
            setResultMessage(isCorrect ? "¡Correcto!" : "Incorrecto. Intenta de nuevo.");

        }
    };

    useEffect(() => {
      setUserInput('');
    }, [phrase]);

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
            <button style={styles.verifyButton} onClick={handleCheckAnswer}>
              Verificar
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
    },
    title: {
        fontSize: '20px',
        marginBottom: '10px',
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
