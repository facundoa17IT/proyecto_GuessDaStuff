import { ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from "react";
import Logo from '../../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonStyles } from '../../styles/buttons';
import { finishPlayGameMulti, resumeGame } from '../../CallsAPI';
import { SocketContext } from '../../WebSocketProvider';
import { setInviteAction, setInviteResponse, setResponseIdGame } from '../../Helpers';

const GameFinished = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { setGameId, setInitGameModes, unsubscribeFromGame, setInvitation, setImplementationGameBody } = useContext(SocketContext);

  const { gameId } = route.params;

  const [userId, setUserId] = useState(null);
  const [host, setHost] = useState(null);
  const [guest, setGuest] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [hostWins, setHostWins] = useState(0);
  const [guestWins, setGuestWins] = useState(0);
  const [gameResults, setGameResults] = useState([]);

  useEffect(() => {
    const fetchGameData = async () => {
      if (isFocused) {
        try {
          // Obtener el ID del usuario actual
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
            console.log("mi ID " + storedUserId)
            setUserId(storedUserId);
          }
  
          // Obtener los datos del Host y Guest
          const storedHost = await AsyncStorage.getItem('Host');
          const storedGuest = await AsyncStorage.getItem('Guest');
          
          // Asegurarse de que los datos de Host y Guest están disponibles
          if (!storedHost || !storedGuest) {
            console.error("No se han encontrado los datos de Host o Guest.");
            return;
          }
          
          // Convertir los datos JSON
          const parsedHost = JSON.parse(storedHost);
          const parsedGuest = JSON.parse(storedGuest);
  
          setHost(parsedHost);
          setGuest(parsedGuest);
  
          console.log("Host:", parsedHost);
          console.log("Guest:", parsedGuest);
  
          // Llamar a la API solo después de obtener los datos
          const response = await resumeGame(gameId);
          console.log("Respuesta de la API resumeGame:", JSON.stringify(response, null, 2));
  
          // Contar las victorias de Host y Guest
          const hostWinsCount = response.games.filter(game => game.idUserWin == parsedHost.userId).length;
          const guestWinsCount = response.games.filter(game => game.idUserWin == parsedGuest.userId).length;
  
          // Actualizar los estados de victorias
          setHostWins(hostWinsCount);
          setGuestWins(guestWinsCount);
  
          let winnerId = "0"; // Empate por defecto
          if (hostWinsCount > guestWinsCount) {
            winnerId = parsedHost.userId; // Host gana
          } else if (guestWinsCount > hostWinsCount) {
            winnerId = parsedGuest.userId; // Guest gana
          }
          console.log("winnerId:", winnerId);
  
          await handleFinishPlayGame(gameId, winnerId);
  
          const finalResponse = await resumeGame(gameId);
          console.log("Respuesta final de la API (después de obtener los resultados):", JSON.stringify(finalResponse, null, 2));
  
          // Mapeo de resultados de las rondas, invirtiendo el orden
          const roundsResults = finalResponse.games.map((game, index) => {
            let winner = 'Empate';
  
            if (game.idUserWin == parsedHost.userId) {
              winner = 'Host';
            } else if (game.idUserWin == parsedGuest.userId) {
              winner = 'Guest';
            }
            console.log('Winner:', winner);
  
            return {
              round: finalResponse.games.length - index, // Cambiar para invertir el número de ronda
              winner: winner,
              points: game.points,
              time: game.timePlaying,
            };
          });
  
          setGameResults(roundsResults.reverse()); // Invertir el orden de las rondas
  
        } catch (error) {
          console.error('Error al obtener datos o llamar a la API:', error);
        }
      }
    };
  
    fetchGameData();
  }, [isFocused, gameId]);
  

  const handleFinishPlayGame = async (gameId, winnerId) => {
    try {
      await finishPlayGameMulti(gameId, winnerId);
    } catch (error) {
      console.error("Error al finalizar el juego:", error);
    }
  };

  const handleGoHome = () => {
    unsubscribeFromGame(gameId);
    setGameId(null);
    setInviteAction(null);
    setInviteResponse(null);
    setResponseIdGame(null);
    setInvitation(null);
    setImplementationGameBody(null);
    setInitGameModes({});
    setHostWins(0); // Reinicia los puntos del host
    setGuestWins(0); // Reinicia los puntos del guest

    navigation.reset({
      index: 0, // Establece el índice de la pantalla que se desea mostrar (inicio)
      routes: [{ name: 'Home' }], // Define la pantalla a la que se desea redirigir
    });
  };

  return (
    <ImageBackground source={require('../../../assets/fondo_mobile.jpeg')} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        <Logo />
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}> 
            <Text style={styles.tableHeader}>Rondas</Text>
            <Text style={styles.tableHeader}>Ganador de ronda</Text>
            <Text style={styles.tableHeader}>Puntos</Text>
          </View>
          {gameResults.map((result, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{result.round}</Text>
              <Text style={styles.tableCell}>
                {result.winner === 'Host' ? host?.username : result.winner === 'Guest' ? guest?.username : 'Empate'}
              </Text>
              <Text style={styles.tableCell}>{result.points}</Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={styles.tableRowTotal}>Ganador</Text>
            <Text style={styles.tableRowTotal}>
              {hostWins > guestWins ? host?.username : guestWins > hostWins ? guest?.username : 'Empate'}
            </Text>
            <Text style={styles.tableRowTotal}>
              {hostWins > guestWins ? hostWins : guestWins} {/* Solo muestra los puntos del ganador */}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={buttonStyles.buttonfullwidth} onPress={handleGoHome}>
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
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  container: {
    marginTop: 80,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 60, // Ajuste de padding para que el contenido no quede tan pegado
    paddingHorizontal: 16,
  },
  tableContainer: {
    backgroundColor:"#F9F5DC",
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    width: '90%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  tableHeader: {
    padding:5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    color:"#653532"
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
    flex: 1,
     color:"#653532"
  },
  tableRowTotal:{
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
     color:"#653532"
  }
});

export default GameFinished;
