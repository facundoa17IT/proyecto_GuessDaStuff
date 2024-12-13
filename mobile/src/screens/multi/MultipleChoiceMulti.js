import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SocketContext } from '../../WebSocketProvider';

const MultipleChoiceMulti = ({ MCinfo }) => {
  const { setAnswer, setIsCorrectAnswer } = useContext(SocketContext);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(null);
  const [resultMessage, setResultMessage] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const { question, randomCorrectWord, randomWord1, randomWord2, randomWord3 } = MCinfo;

  useEffect(() => {
    setSelectedAnswer(null);
    setConfirmedAnswer(null);
    setResultMessage('');
    setAnswer('');

    // Crear un array con todas las opciones
    const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

    // Mezcla las opciones de forma aleatoria
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffledOptions);
  }, [MCinfo]);



  const handleCheckAnswer = async (selectedAnswer) => {
    if (!randomCorrectWord) {
      setResultMessage("Este juego aún no fue implementado.");
      return;
    }
    try {
      const isCorrect = selectedAnswer === randomCorrectWord;
      if (isCorrect) {
        setIsCorrectAnswer(isCorrect);
        setResultMessage("¡Correcto!");
      } else {
        setResultMessage("Incorrecto. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al enviar la respuesta:", error);
    }
  };

  const confirmAnswer = () => {
    if (selectedAnswer) {
      setConfirmedAnswer(selectedAnswer); // Confirma la respuesta seleccionada
      handleCheckAnswer(selectedAnswer);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      {/* Mostrar el estado actual del juego */}
      {confirmedAnswer && (
        <Text
          style={[
            styles.answerText,
            confirmedAnswer === randomCorrectWord
              ? styles.correctAnswer
              : styles.incorrectAnswer,
          ]}
        >
          {confirmedAnswer === randomCorrectWord
            ? '¡Respuesta correcta!'
            : 'Respuesta incorrecta.'}
        </Text>
      )}

      {/* Mostrar las opciones como botones */}
      {shuffledOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === option && styles.selectedOption, // Estilo para opción seleccionada
            confirmedAnswer && option === randomCorrectWord && styles.correctOption, // Estilo para opción correcta
            confirmedAnswer &&
              selectedAnswer === option &&
              selectedAnswer !== randomCorrectWord &&
              styles.incorrectOption, // Estilo para opción incorrecta
          ]}
          onPress={() => setSelectedAnswer(option)} // Establece la respuesta seleccionada
          disabled={confirmedAnswer !== null} // Deshabilitar las opciones después de confirmar
        >
          <Text
            style={[
              styles.optionText,
              selectedAnswer === option && styles.selectedOptionText, // Estilo de texto seleccionado
              confirmedAnswer && option === randomCorrectWord && styles.correctOptionText, // Estilo de texto para opción correcta
              confirmedAnswer &&
                selectedAnswer === option &&
                selectedAnswer !== randomCorrectWord &&
                styles.incorrectOptionText, // Estilo de texto para opción incorrecta
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Botón de Confirmar Opción */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={confirmAnswer} // Llama a confirmAnswer al presionar el botón
        disabled={confirmedAnswer !== null} // Deshabilitar botón después de confirmar
      >
        <Text style={styles.confirmButtonText}>Confirmar Opción</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    padding: 10,
    borderWidth: 3,
    borderColor: '#653532',
    borderRadius: 8,
    backgroundColor: '#F9F5DC',
    width: '100%',
    fontWeight: 'bold',
    color: '#653532',
  },
  optionButton: {
    backgroundColor: '#B36F6F',
    width: 300,
    padding: 10,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#653532',
    alignItems: 'center',
    marginTop: 3,
  },
  optionText: {
    color: '#F9F5DC',
    fontSize: 18,
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#fff',
  },
  selectedOptionText: {
    color: '#653532',
  },
  correctOption: {
    backgroundColor: 'green',
  },
  correctOptionText: {
    color: '#fff',
  },
  incorrectOption: {
    backgroundColor: 'red',
  },
  incorrectOptionText: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#653532',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#B36F6F',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctAnswer: {
    color: '#006400',
  },
  incorrectAnswer: {
    color: '#8B0000',
  },
});

export default MultipleChoiceMulti;
