import React, { useState, useEffect, useContext } from 'react';
/** Context API **/
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

// Función para mezclar un array
/** Utils **/
import { shuffleArray } from '../../utils/Helpers';

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
    // Separar la palabra en letras, agregar un id único a cada letra
    const letters = word.split('').map((letter, index) => ({
      id: `${letter}-${index}`, // Un id único basado en la letra y su índice
      letter,
    }));
    // Desordenar las letras
    const shuffled = shuffleArray(letters);
    setShuffledLetters(shuffled);
    setSelectedOrder([]);
  }, [word]);

  // IsCorrectAnswer recibe el valor de true o false desde el padre
  useEffect(() => {
    if (isCorrectAnswer !== null) {
      console.log('IS CORRECT ANSWER -> ' + isCorrectAnswer);
      handleVerify();
    }
  }, [isCorrectAnswer]);

  const handleLetterPress = (letterObj) => {
    setShuffledLetters((prev) => prev.filter((l) => l.id !== letterObj.id)); // Quitar letra del arreglo de letras disponibles
    setSelectedOrder((prev) => [...prev, letterObj]); // Añadir letra al arreglo de seleccionadas
  };

  const handleSelectedPress = (letterObj) => {
    setSelectedOrder((prev) => prev.filter((l) => l.id !== letterObj.id)); // Quitar letra del arreglo de seleccionadas
    setShuffledLetters((prev) => [...prev, letterObj]); // Regresar letra al arreglo de letras disponibles
  };
  const handleAnswer = () => {
	// Acceder a la propiedad 'letter' de cada objeto en selectedOrder
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
    <div style={styles.container}>
		
	{resultMessage && (
		<div style={{
			fontSize: '18px',
			fontWeight: 'bold', // Para hacer el texto en negrita
			margin: '10px 0', // Espaciado
			color: resultMessage.includes('¡Correcto!') ? '#006400' : '#8B0000', // Verde oscuro para correcto, rojo oscuro para incorrecto
		}}>
			{resultMessage}
		</div>
	)}

      {/* Contenedor de letras seleccionadas */}
      <div style={styles.selectedOrderContainer}>
        {selectedOrder.map((letterObj, index) => (
          <button
            key={`${letterObj.id}-${index}`} // Clave única corregida
            style={styles.selectedButton}
            onClick={() => handleSelectedPress(letterObj)}
          >
            {letterObj.letter}
          </button>
        ))}
      </div>

      {/* Contenedor de letras desordenadas */}
      <div style={styles.buttonContainer}>
        {shuffledLetters.map((letterObj, index) => (
          <button
            key={`${letterObj.id}-${index}`} // Clave única corregida
            style={styles.button}
            onClick={() => handleLetterPress(letterObj)}
          >
            {letterObj.letter}
          </button>
        ))}
      </div>

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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'start',
	position: 'relative', // Permite que los hijos usen 'absolute'
  },
  
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  selectedOrderContainer: {
	display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: '20px',
	
  },
  button: {
    backgroundColor: '#FFFDD0',
    padding: '10px',
    margin: '5px',
    borderRadius: '5px',
    width: '50px',
    border: '2px solid #000',
    color: '#000',
  },
  selectedButton: {
    backgroundColor: '#1F354A',
    padding: '10px',
    margin: '5px',
    borderRadius: '5px',
    width: '50px',
    border: '2px solid #000',
    color: '#000000',
    fontSize: '20px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: '20px',
  },
  verifyButton: {
    backgroundColor: '#B36F6F',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #653532',
    width: '50%',
    marginRight: '10px',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
  },
  resetButton: {
    backgroundColor: '#B36F6F',
    padding: '15px',
    borderRadius: '8px',
    border: '2px solid #653532',
    width: '50%',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default OrderWord;
