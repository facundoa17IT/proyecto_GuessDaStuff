import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator, Animated } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackImage from "../../styles/BackImage";
import { SocketContext } from "../../WebSocketProvider";
import { fetchMultiplayerGame } from "../../CallsAPI";

const dialogbubble = require("../../../assets/hint-globe.png");
const brainpointing = require("../../../assets/brain_pointing.png");

const MultiplayerGameSet = () => {
  const { usernameHost, setGameId } = useContext(SocketContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { ruletaGame, finalSlot1, finalSlot2, finalSlot3, idGame } = route.params;

  const [slot1, setSlot1] = useState(ruletaGame.categories[0].gameModes[0]);
  const [slot2, setSlot2] = useState(ruletaGame.categories[1].gameModes[0]);
  const [slot3, setSlot3] = useState(ruletaGame.categories[2].gameModes[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false); // Nuevo estado para mostrar la tabla

  const spinDuration = 1500;

  useEffect(() => {
    const fetchUserId = async () => {
      await AsyncStorage.getItem("userId");
      setLoading(false);
    };

    fetchUserId();
    spin();
  }, []);

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const spin = async () => {
    setIsSpinning(true);

    const spinInterval = setInterval(() => {
      setSlot1(getRandomItem(ruletaGame.categories[0].gameModes));
      setSlot2(getRandomItem(ruletaGame.categories[1].gameModes));
      setSlot3(getRandomItem(ruletaGame.categories[2].gameModes));
    }, spinDuration * 0.05);

    setTimeout(async () => {
      clearInterval(spinInterval);

      setSlot1(finalSlot1);
      setSlot2(finalSlot2);
      setSlot3(finalSlot3);

      const dtoinitGameMultiRequest = {
        idPartida: idGame,
        parCatMod: [
          { cat: ruletaGame.categories[0].id, mod: finalSlot1 },
          { cat: ruletaGame.categories[1].id, mod: finalSlot2 },
          { cat: ruletaGame.categories[2].id, mod: finalSlot3 },
        ],
      };

      setIsSpinning(false);
      setShowTable(true); // Mostrar la tabla después de que termine de girar

      if (usernameHost) {
        try {
          setGameId(idGame);
          await fetchMultiplayerGame(idGame, dtoinitGameMultiRequest);
        } catch (error) {
          console.error("Error al iniciar la partida:", error.message);
        }
        setTimeout(() => {
          // Resetear la navegación y limpiar los datos antes de navegar
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "LoadingGameMulti",
                params: { dtoinitGameMultiRequest },
              },
            ],
          });

          
          // Puedes limpiar aquí también otros estados si lo deseas
        }, 4000);
      } else {
        setTimeout(() => {
          // Resetear la navegación y limpiar los datos antes de navegar
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "LoadingGameMulti",
                params: { dtoinitGameMultiRequest },
              },
            ],
          });

          // Puedes limpiar aquí también otros estados si lo deseas
        }, 4000);
      }
    }, spinDuration);
  };

  const getFullModeName = (abbreviation) => {
    switch (abbreviation) {
      case 'GP':
        return 'Guess Phrase';
      case 'MC':
        return 'Multiple Choice';
      case 'OW':
        return 'Order Word';
      default:
        return abbreviation; // Si no es ninguna de las abreviaciones, devolvemos la abreviación tal cual
    }
  };

  return (
    <BackImage>
      <View style={styles.container}>
        <Image source={brainpointing} resizeMode="contain" style={styles.brainDialog} />
        <View style={styles.speechBubbleContainer}>
          <Image source={dialogbubble} resizeMode="contain" style={styles.speechBubble} />
          <View style={styles.textContainer}>
            <Text style={styles.bubbleText}>Los juegos serán...</Text>
          </View>
        </View>
        <View style={styles.slotRow}>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot3}</Text>
          </View>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot2}</Text>
          </View>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot1}</Text>
          </View>
        </View>

        {isSpinning && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
        {showTable && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeader}>Categoría</Text>
            <Text style={styles.tableHeader}>Modo</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{ruletaGame.categories[2].name}</Text>
            <Text style={styles.tableCell}>{getFullModeName(finalSlot3)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{ruletaGame.categories[1].name}</Text>
            <Text style={styles.tableCell}>{getFullModeName(finalSlot2)}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{ruletaGame.categories[0].name}</Text>
            <Text style={styles.tableCell}>{getFullModeName(finalSlot1)}</Text> 
          </View>
        </View>
      )}
      </View>
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brainDialog: {
    position: "absolute",
    height: 1300,
    width: 1300,
    top: -600,
  },
  speechBubbleContainer: {
    position: "absolute",
    top: -120,
    right: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  speechBubble: {
    width: 170,
    height: 170,
  },
  textContainer: {
    position: "absolute",
    top: 45,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  bubbleText: {
    color: "#333",
    fontSize: 20,
    textAlign: "center",
  },
  slotRow: {
    flexDirection: "row",
    marginTop: 120,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#653532",
    padding: 10,
    borderRadius: 10,
  },
  slotBox: {
    width: 100,
    height: 80,
    borderWidth: 4,
    borderColor: "#F9F5DC",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#B36F6F",
  },
  slotText: {
    color: "#F9F5DC",
    fontSize: 24,
    textAlign: "center",
  },
  tableContainer: {
    marginTop: 30,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#F9F5DC",
    padding: 10,
    borderRadius: 10,
    width: 250,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 5,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  tableCell: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  
  loader: {
    marginTop: 20,
  },
});

export default MultiplayerGameSet;
