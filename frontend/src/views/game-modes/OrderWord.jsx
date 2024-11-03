/** React **/
import React, { useState, useEffect } from 'react';

/** Utils **/
import { shuffleArray } from '../../utils/Helpers';

const OrderWord = ({ OWinfo }) => {
  const { word } = OWinfo;
  const [selectedOrder, setSelectedOrder] = useState([]); // Inicialmente vacío
  const [shuffledLetters, setShuffledLetters] = useState([]);

  useEffect(() => {
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

  const handleLetterPress = (letterObj) => {
    setShuffledLetters((prev) => prev.filter(l => l.id !== letterObj.id)); // Quitar letra del arreglo de letras disponibles
    setSelectedOrder((prev) => [...prev, letterObj]); // Añadir letra al arreglo de seleccionadas
  };

  const handleSelectedPress = (letterObj) => {
    setSelectedOrder((prev) => prev.filter(l => l.id !== letterObj.id)); // Quitar letra del arreglo de seleccionadas
    setShuffledLetters((prev) => [...prev, letterObj]); // Regresar letra al arreglo de letras disponibles
  };

  const handleVerify = () => {
    const selectedString = selectedOrder.map(l => l.letter).join('');
    const isCorrect = selectedString === word;
    console.log(isCorrect ? "Correcto!" : "Incorrecto!");
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
      <h2 style={styles.title}>Ordena la palabra...</h2>

      {/* Contenedor de letras seleccionadas */}
      <div style={styles.selectedOrderContainer}>
        {selectedOrder.map((letterObj, index) => (
          <button
            key={letterObj.id}
            style={styles.selectedButton}
            onClick={() => handleSelectedPress(letterObj)}
          >
            {letterObj.letter}
          </button>
        ))}
      </div>

      {/* Contenedor de letras desordenadas */}
      <div style={styles.buttonContainer}>
        {shuffledLetters.map((letterObj) => (
          <button
            key={letterObj.id}
            style={styles.button}
            onClick={() => handleLetterPress(letterObj)}
          >
            {letterObj.letter}
          </button>
        ))}
      </div>

      <div style={styles.buttonRow}>
        <button style={styles.verifyButton} onClick={handleVerify}>
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
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  selectedOrderContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
    backgroundColor: "#B36F6F",
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
    backgroundColor: "#B36F6F",
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
