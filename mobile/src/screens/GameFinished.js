import { ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';
import { finishPlayGame, resumeGameIndi } from '../CallsAPI';

const GameFinished = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { idGameSingle } = route.params;

  const [points, setPoints] = useState(null);
  const [timePlaying, setTimePlaying] = useState(null);

  useEffect(() => {
    const finishGame = async () => {
      try {
        console.log(idGameSingle);
        await finishPlayGame(idGameSingle);
        const response = await resumeGameIndi(idGameSingle); // Llamada a la API
        console.log(response);

        if (response) {
          setPoints(response.points);
          setTimePlaying(response.timePlaying);
        }
      } catch (error) {
        console.error("Error finalizando la partida:", error);
        alert("Error al finalizar la partida. Por favor, inténtelo de nuevo.");
      }
    };
    finishGame();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/fondo_mobile.jpeg')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Logo />

        {/* Resumen en formato tabla */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Resumen</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Puntos</Text>
            <Text style={styles.tableCell}>{points !== null ? points : '-'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Tiempo</Text>
            <Text style={styles.tableCell}>{timePlaying !== null ? `${timePlaying} seg` : '-'}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={buttonStyles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 180,
    padding: 16,
  },
  tableContainer: {
    width: '80%',
    backgroundColor: '#F9F5DC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
  },
});

export default GameFinished;
