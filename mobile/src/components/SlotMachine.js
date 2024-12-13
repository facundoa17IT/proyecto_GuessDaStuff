import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SlotMachine = ({ items }) => {
  const [results, setResults] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId
  const [loading, setLoading] = useState(true); // Estado de carga para esperar el userId
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const [showTable, setShowTable] = useState(false); // Estado para mostrar la tabla
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId); // Guardamos el userId en el estado
      setLoading(false); // Cambiamos el estado a 'false' cuando el userId esté listo
    };

    fetchUserId();
  }, []); // Solo ejecuta esto una vez cuando el componente se monte

  useEffect(() => {
    if (items.length > 0 && userId) {
      // Filtrar categorías con gameModes
      const categoriesWithGameModes = items.filter(item => item.gameModes && item.gameModes.length > 0);
      const initialResults = categoriesWithGameModes.length > 0 ? [categoriesWithGameModes[0].gameModes[0]] : [];
      setResults(initialResults);
      spinSlots(categoriesWithGameModes);
    }
  }, [items, userId]); // Este useEffect se ejecutará cuando 'items' o 'userId' cambien

  const spinSlots = (categoriesWithGameModes) => {
    if (spinning) return;
    setSpinning(true);
    setShowResults(false);

    spinAnimation.setValue(0);
    const spins = 10;
    let currentSpin = 0;

    const spin = () => {
      const newResults = categoriesWithGameModes.map(item => {
        const modes = item.gameModes;
        const randomIndex = Math.floor(Math.random() * modes.length);
        return modes[randomIndex];
      });

      setResults(newResults);

      const duration = Math.max(200 - (currentSpin * 15), 100);
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        currentSpin++;
        if (currentSpin < spins) {
          spinAnimation.setValue(0);
          spin();
        } else {
          setShowTable(true); // Mostrar la tabla después de girar
          setSpinning(false);
          setShowResults(true);

          // Esperar 2 segundos antes de navegar
          setTimeout(() => {
            logResults(newResults, categoriesWithGameModes);
          }, 3300);
        }
      });
    };

    spin();
  };

  const logResults = (finalResults, categoriesWithGameModes) => {
    if (userId) {
      const parCatMod = categoriesWithGameModes.map((item, index) => {
        const categoryId = item.id; // Obtener la id de la categoría
        const resultMode = finalResults[index];
        return {
          cat: categoryId, // ID de la categoría
          mod: resultMode   // Modo del juego
        };
      }).reverse();
      
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoadingGame',
            params: {
              userId: userId,
              parCatMod,
            },
          },
        ],
      });
      
    } else {
      console.error("User ID is not available");
    }
  };

  const translateY = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const translateYBottom = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  // Si el userId no está disponible, no renderizamos el SlotMachine
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.slotContainer}>
      <View style={styles.slotRow}>
        {results.map((result, index) => (
          <View key={index} style={styles.slotBox}>
            <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY }] }]}>
              <Text style={styles.slotText}>{result}</Text>
            </Animated.View>
            {showResults && (
              <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY: translateYBottom }] }]}>
                <Text style={styles.slotText}>{results[index]}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
  
      {showTable && (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeader}>Categoría</Text>
            <Text style={styles.tableHeader}>Modo</Text>
          </View>
          {items.map((item, index) => {
            if (item.gameModes.length > 0) {
              const modeNames = {
                OW: "Order Word",
                MC: "Multiple Choice",
                GP: "Guess Phrase",
              };
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>{modeNames[results[index]] || results[index]}</Text>
                </View>
              );
            }
            return null;
          })}
        </View>
      )}
    </View>
  );
  
  
};

const styles = StyleSheet.create({
  slotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    borderWidth: 2,      // Borde
    borderColor: 'black',// Color del borde
    backgroundColor: '#653532', // Fondo blanco
    padding: 10,          // Espaciado interno (opcional)
    borderRadius: 10,     // Bordes redondeados (opcional)
  },
  slotBox: {
    width: 100,
    height: 80,
    borderWidth: 4,
    borderColor: '#F9F5DC',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  slotTextContainer: {
    backgroundColor:"#B36F6F",
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center', 
  },
  slotText: {
    color: "#F9F5DC",
    fontSize: 48,
  },
  resultContainer: {
    marginTop:5,
    borderWidth: 2,      // Borde
    borderColor: 'black',// Color del borde
    backgroundColor: '#653532', // Fondo blanco
    padding: 10,          // Espaciado interno (opcional)
    borderRadius: 10,     // Bordes redondeados (opcional)
  },
  resultText: {
    fontSize: 30,
    color: '#F9F5DC'
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
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "black",
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
  
}); 


export default SlotMachine;
