import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SocketContext } from '../WebSocketProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderMain from '../components/HeaderMain';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { createGame, loadGame, loadGameMulti } from '../CallsAPI';
import { invitationData, setInviteAction, setResponseIdGame, setInviteResponse, logObject } from '../Helpers';

const GameLobby = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [players, setPlayers] = useState([]); // Lista de jugadores
    const [search, setSearch] = useState(''); // Texto de búsqueda
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Lista de jugadores filtrados
    const { users, client, invitation, setInvitation, setInvitationCollection, gameId, setGameId, suscribeToGameSocket, implementationGameBody, usernameHost, setUsernameHost } = useContext(SocketContext);
    const [isWaiting, setIsWaiting] = useState(false); // Estado para mostrar la sala de espera
    const [waitingData, setWaitingData] = useState({
        host: { id: null, username: null },
        guest: { id: null, username: null },
        accepted: false, // Inicialmente en false
    });

    const [userObj, setUserObj] = useState({}); // Estado para userObj
    const [invitationSent, setInvitationSent] = useState(false);
    const [continuar, setContinuar] = useState(false);
    const route = useRoute();
    const { selectedCategoryID } = route.params;
    const [gameData, setGameData] = useState([]);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userObj');
                if (jsonValue != null) {
                    const storedUser = JSON.parse(jsonValue);
                    setUserObj(storedUser);

                    if (storedUser && storedUser.userId && storedUser.username) {
                        await AsyncStorage.setItem('Host', JSON.stringify(storedUser));
                    }
                }
            } catch (error) {
                console.error('Error al obtener el usuario de AsyncStorage:', error);
            }
        };

        loadUser();
    }, []); 

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await loadGame(selectedCategoryID, 'Multiplayer');
                setGameData(response);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los datos del juego");
            }
        };
        fetchGameData();
    }, [selectedCategoryID]);

    useEffect(() => {
        if (users && userObj.userId) {
            const filteredPlayers = users.filter(player => player.userId !== userObj.userId);
            setPlayers(filteredPlayers);
            setFilteredPlayers(filteredPlayers);
        }
    }, [users, userObj.userId]);

    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filtered = players.filter(player =>
                player.username.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers(players);
        }
    };

    function sendInvitation(userGuest) {
        setInviteAction(userObj.username, userObj.userId, userGuest.userId, `${userObj.username} - Te ha invitado a jugar`);
        client.current.send(`/topic/lobby/${userGuest.userId}`, {}, JSON.stringify(invitationData));
        setUsernameHost(userObj.username);

        AsyncStorage.setItem('Guest', JSON.stringify(userGuest));

        setWaitingData({
            host: { id: userObj.userId, username: userObj.username },
            guest: { id: userGuest.userId, username: null },
            gameId: 'pendingGameId',
        });
        setIsWaiting(true);
    }

    useEffect(() => {
        if (invitation) {
            handleInvitationInteraction(invitation);
        }
    }, [invitation]);

    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            if (invitation.action === 'INVITE_RESPONSE') {
                setWaitingData((prev) => ({
                    ...prev,
                    guest: {
                        id: invitation.userIdGuest,
                        username: invitation.usernameGuest || null,
                    },
                    accepted: invitation.accepted,
                }));
                handleResponse(invitation);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    const handleResponse = async (invitation) => {
        if (invitation.accepted) {
            handleCreateGame(invitation);
        }
    };

    const handleCreateGame = async (invitation) => {
        if (invitation.accepted) {
            const userHost = {
                username: invitation.usernameHost,
                userId: invitation.userIdHost
            };

            const userGuest = {
                username: invitation.usernameGuest,
                userId: invitation.userIdGuest
            };

            try {
                const response = await createGame(userHost, userGuest);
                if (response) {
                    const gameId = response;
                    setGameId(gameId);
                } else {
                    console.error("Error: No se recibió un gameId válido en la respuesta.");
                }
            } catch (error) {
                console.error("Error al crear el juego: ", error);
            }
        }
    };

    useEffect(() => {
        if (gameId !== null) {
            setResponseIdGame(gameId, "Se ha enviado el id de la partida");
            client.current.send(`/topic/lobby/${invitation.userIdGuest}`, {}, JSON.stringify(invitationData));
            suscribeToGameSocket(gameId);
            setInvitationSent(true);
        }
    }, [gameId]);

    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const initGameHost = async () => {
        try {
            gameData.finalSlot1 = getRandomItem(gameData.categories[0].gameModes);
            gameData.finalSlot2 = getRandomItem(gameData.categories[1].gameModes);
            gameData.finalSlot3 = getRandomItem(gameData.categories[2].gameModes);
            await loadGameMulti(gameData, gameId);
            setContinuar(true);
        } catch (error) {
            console.error("Error al inicializar el juego:", error.message);
            Alert.alert("Error", "No se pudieron cargar los datos del juego");
        }
    };

    useEffect(() => {
        if (continuar) {
            setContinuar(false);
            if (implementationGameBody) {
                if (implementationGameBody.status === "INVITE_RULETA") {
                    setTimeout(() => {
                        navigation.reset({
                            index: 0, // Reseteamos la pila de navegación
                            routes: [
                                {
                                    name: "SlotMachineMulti",
                                    params: {
                                        ruletaGame: implementationGameBody.ruletaGame,
                                        finalSlot1: implementationGameBody.finalSlot1,
                                        finalSlot2: implementationGameBody.finalSlot2,
                                        finalSlot3: implementationGameBody.finalSlot3,
                                        idGame: gameId,
                                    },
                                },
                            ],
                        });
                        // Limpiar los datos utilizados
                        setIsWaiting(false);
                        setInvitationSent(false);
                        setWaitingData({
                            host: { id: null, username: null },
                            guest: { id: null, username: null },
                            accepted: false,
                        });
                        setGameData([]);
                        setSearch('');
                        setFilteredPlayers([]);
                    }, 1000);
                }
            }
        }
    }, [continuar, implementationGameBody]);

    const WaitingRoom = () => (
        <View style={styles.waitingContainer}>
            <Text style={styles.waitingTitle}>Sala de Espera</Text>
            <TouchableOpacity
                style={[
                    styles.startButton,
                    !waitingData.accepted && styles.disabledButton,
                ]}
                onPress={initGameHost}
                disabled={!waitingData.accepted}
            >
                <Text style={styles.buttonText}>
                    {waitingData.accepted ? "Iniciar partida" : "Esperando..."}
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderPlayer = ({ item }) => (
        <View style={styles.playerContainer}>
            <View style={styles.playerInfo}>
                <Icon name="account-circle" size={40} color="#77492f" />
                <Text style={styles.playerText}>{item.username}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => sendInvitation(item)}>
                <Icon name="person-add" size={20} color="#77492f" />
                <Text style={styles.actionText}>Invitar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderMain />
            {isWaiting ? (
                <WaitingRoom />
            ) : (
                <>
                    <Text style={styles.title}>Game Lobby</Text>
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={24} color="#77492f" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar..."
                            placeholderTextColor="#77492f"
                            value={search}
                            onChangeText={handleSearch}
                        />
                    </View>
                    <FlatList
                        data={filteredPlayers}
                        renderItem={renderPlayer}
                        keyExtractor={(item) => item.userId.toString()}
                        style={styles.playerList}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems:'center',
        backgroundColor: '#f6f3d4',
        paddingHorizontal: 16,
        marginTop: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#77492f',
        textAlign: 'center',
        marginTop:80,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ede6bc',
        padding: 8, 
        borderRadius: 10, 
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        color: '#77492f',
        fontSize: 16,
        marginHorizontal: 10,
    },
    playerList: {
        marginTop: 20,
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff1d0',
        borderRadius: 8,
        marginBottom: 10,
        width: '100%', // Asegura que ocupa el 90% del ancho
        alignSelf: 'center', // Centra el contenedor horizontalmente
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Permite que el contenido se expanda dentro del 90%
    },
    
    playerText: {
        fontSize: 18,
        color: '#77492f',
        marginLeft: 10,
    },
    playerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    actionText: {
        color: '#77492f',
        fontSize: 12,
    },
    disabledButton: {
        backgroundColor: '#cccccc', 
        borderColor: '#aaaaaa',
    },
    waitingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      },
      waitingTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#653532", // Color marrón oscuro
        marginBottom: 20,
      },
      text: {
        fontSize: 18,
        color: "#333", // Color del texto
        marginBottom: 10,
      },
      startButton: {
        backgroundColor: "#B36F6F", 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
      },
      disabledButton: {
        backgroundColor: "#878787", 
      },
      buttonText: {
        fontSize: 18,
        color: "#F9F5DC", // Texto claro
        fontWeight: "bold",
        textAlign: "center",
      },
    
});

export default GameLobby;
