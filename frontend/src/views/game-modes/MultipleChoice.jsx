import React, { useState } from 'react';

const MultipleChoice = ({ MCinfo }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(null);

  const { question, randomCorrectWord, randomWord1, randomWord2, randomWord3 } = MCinfo;

  const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  const confirmAnswer = () => {
    if (selectedAnswer) {
      const answer = selectedAnswer; // Guardamos la respuesta seleccionada antes de limpiar
      setSelectedAnswer(null); // Limpiar la selección inmediatamente
      setConfirmedAnswer(answer); // Confirmar la respuesta después de limpiar
    }
  };

  return (
    <div className="container">
      <h1 className="question">{question}</h1>

      {/* Mostramos las opciones como botones */}
      {allOptions.map((option, index) => (
        <button
          key={index}
          className={`optionButton 
            ${selectedAnswer === option ? 'selectedOption' : ''} 
            ${confirmedAnswer && option === randomCorrectWord ? 'correctOption' : ''}
            ${confirmedAnswer && confirmedAnswer === option && confirmedAnswer !== randomCorrectWord ? 'incorrectOption' : ''}`}
          onClick={() => handleAnswerSelection(option)}
          disabled={confirmedAnswer !== null} // Deshabilitar las opciones después de confirmar
        >
          {option}
        </button>
      ))}

      {/* Botón de Confirmar Opción */}
      <button
        className="confirmButton"
        onClick={confirmAnswer}
        disabled={confirmedAnswer !== null} // Deshabilitar botón después de confirmar
      >
        Confirmar Opción
      </button>

      {/* Mostrar el estado actual del juego */}
      {confirmedAnswer && (
        <p className="answerText">
          {confirmedAnswer === randomCorrectWord
            ? '¡Respuesta correcta!'
            : 'Respuesta incorrecta.'}
        </p>
      )}

      {/* Estilos en línea */}
      <style>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .question {
          font-size: 20px;
          margin-bottom: 20px;
          text-align: center;
        }
        .optionButton {
          background-color: #b36f6f;
          width: 300px;
          padding: 15px;
          border-radius: 8px;
          border-style: solid;
          border-width: 3px;
          border-color: #653532;
          margin-top: 3px;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          text-align: center;
        }
        .selectedOption {
          background-color: #fff;
          color: #653532;
        }
        .correctOption {
          background-color: green;
          color: #fff;
        }
        .incorrectOption {
          background-color: red;
          color: #fff;
        }
        .confirmButton {
          background-color: #653532;
          color: #fff;
          padding: 15px 30px;
          border-radius: 8px;
          margin-top: 20px;
          border: 3px solid #b36f6f;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
        }
        .confirmButton:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .answerText {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default MultipleChoice;
