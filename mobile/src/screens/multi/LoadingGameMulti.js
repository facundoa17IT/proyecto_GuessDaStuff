import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { SocketContext } from '../../WebSocketProvider';

const LoadingGameMulti = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { gameId, initGameModes, implementationGameBody, setGameId, setInitGameModes } = useContext(SocketContext); 
  const { dtoinitGameMultiRequest } = route.params; 
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRendered, setIsRendered] = useState(false); // Nuevo estado para controlar el render inicial

  // Marca que el componente ya se ha renderizado
  useEffect(() => {
    setIsRendered(true);
  }, []); // Solo se ejecuta al montar

  // Función para inicializar el juego multijugador
  const initializeMultiplayerGame = () => {
    if (implementationGameBody && implementationGameBody.status === "INVITE_IMPLEMENTATION") {
      setGameId(implementationGameBody.implementGame.idGameMulti);
      setInitGameModes(implementationGameBody.implementGame.gameModes);     
    }
  };

  // useEffect que se ejecuta cuando se recibe la data de implementación
  useEffect(() => {
    if (isRendered && implementationGameBody && Object.keys(implementationGameBody).length > 0) {
      initializeMultiplayerGame();
      setIsInitializing(false); // Marca que la inicialización ha terminado
    }
  }, [isRendered, implementationGameBody]);
 
  // Navega automáticamente cuando la inicialización está lista, con un retraso de 1 segundo
  useEffect(() => {
    if (!isInitializing && gameId && initGameModes) {
      const delayNavigation = setTimeout(() => {
        // Resetear la navegación y establecer una nueva ruta sin borrar el contexto
        navigation.reset({
          index: 0,  // Establece el índice de la nueva ruta como 0 (solo esta ruta)
          routes: [{ name: "GameLoadMulti" }], // Establece la ruta "GameLoadMulti" como la única ruta en la pila
        });
        setIsInitializing(true);
      }, 1000); // 1 segundo de espera

      return () => clearTimeout(delayNavigation); // Limpia el temporizador al desmontar
    }
  }, [isInitializing, gameId, initGameModes]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.circle}>
          <Text style={styles.timerText}>{isInitializing ? "..." : "¡Listo!"}</Text>
        </View>
      </View>
      <Text style={styles.text}>PREPÁRATE...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B36F6F",
  },
  timerContainer: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200, 
    height: 200, 
    borderRadius: 200, 
    borderWidth: 10, 
    borderColor: "#fff", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  timerText: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
  },
});

export default LoadingGameMulti;
