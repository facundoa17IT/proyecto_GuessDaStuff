import React, { createContext, useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'text-encoding';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [invitation, setInvitation] = useState(null);
    const [users, setUsers] = useState([]);
    const [invitationCount, setInvitationCount] = useState(0);
    const [invitationCollection, setInvitationCollection] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingData, setWaitingData] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [implementationGameBody, setImplementationGameBody] = useState(null);
    const client = useRef(null);
    const [usernameHost, setUsernameHost] = useState(null);
    const [initGameModes, setInitGameModes] = useState({});
    const [answer, setAnswer] = useState(null);
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
    const [hostWins, setHostWins] = useState(0);
    const [guestWins, setGuestWins] = useState(0);
    const [userObj, setUserObj] = useState({});

    const subscriptionRefs = useRef({}); // Objeto para almacenar referencias dinámicas de suscripción

    useEffect(() => {
        // Guarda los usuarios conectados en AsyncStorage
        AsyncStorage.setItem("connectedUsers", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        const loadUser = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('userObj');
            if (jsonValue != null) {
              const storedUser = JSON.parse(jsonValue);
              setUserObj(storedUser);
            } else {
              //console.log('No se encontró un usuario en AsyncStorage.');
            }
          } catch (error) {
            //console.error('Error al obtener el usuario de AsyncStorage:', error);
          }
        };
        loadUser();
    }, []);

    const connect = (dtoUserOnline) => {
        client.current = Stomp.over(() => new SockJS('https://proyectoguessdastuff-production.up.railway.app/ws'));

        if (dtoUserOnline === null) {
            console.error("DtoUserOnline NULL");
            return;
        }

        client.current.connect({}, () => {
            console.log("Usuario conectado!");

            client.current.subscribe('/topic/lobby', (message) => {
                console.log(message.body);
                setUsers(JSON.parse(message.body));
            });

            client.current.subscribe(`/topic/lobby/${dtoUserOnline.userId}`, (message) => {
                const invitationBody = JSON.parse(message.body);
                console.log(invitationBody);
                setInvitation(invitationBody);
            });

            client.current.send('/app/join', {}, JSON.stringify(dtoUserOnline));
        });
    };

    // Desconectar del servidor WebSocket
    const disconnect = (dtoUserOnline) => {
        if (client.current && client.current.connected) {
            //console.log("Usuario desconectado!");
            client.current.send('/app/leave', {}, JSON.stringify(dtoUserOnline));
            client.current.disconnect(() => console.log("Desconexión exitosa"));
        } else {
            console.error("No hay conexión activa para desconectar.");
        }
    };

    // Función para desuscribirse de un canal específico
    const unsubscribeFromLobby = (userId) => {
        const subscriptionId = `${userId}`; // El ID de suscripción que guardamos

        if (subscriptionRefs.current[subscriptionId]) {
            subscriptionRefs.current[subscriptionId].unsubscribe();
            delete subscriptionRefs.current[subscriptionId]; // Eliminar la referencia después de desuscribirse
            //console.log(`Desuscrito de /topic/lobby/${userId}`);
        } else {
            //console.log(`No hay suscripción activa para /topic/lobby/${userId}`);
        }
    };

    // Función para suscribirse al canal del juego
    const suscribeToGameSocket = (gameId) => {
        if (client.current) {
            const gameSubscription = client.current.subscribe(`/game/${gameId}/`, (message) => {
                const implementGame = JSON.parse(message.body);
                setImplementationGameBody(implementGame);
            });

            // Guardar la suscripción para poder desuscribirse más tarde si es necesario
            subscriptionRefs.current[`game_${gameId}`] = gameSubscription;
        }
        else {
            console.error("Error con el cliente STOMP");
        }
    };

    // Función para desuscribirse del canal de juego
    const unsubscribeFromGame = (gameId) => {
        const gameSubscriptionId = `game_${gameId}`;

        if (subscriptionRefs.current[gameSubscriptionId]) {
            subscriptionRefs.current[gameSubscriptionId].unsubscribe();
            delete subscriptionRefs.current[gameSubscriptionId]; // Eliminar la referencia después de desuscribirse
            //console.log(`Desuscrito de /game/${gameId}`);
        } else {
            //console.log(`No hay suscripción activa para /game/${gameId}`);
        }
    };

    return (
        <SocketContext.Provider
            value={{
                connect,
                disconnect,
                users,
                invitation,
                setInvitation,
                client,
                invitationCount,
                setInvitationCount,
                invitationCollection,
                setInvitationCollection,
                isWaiting,
                setIsWaiting,
                waitingData,
                setWaitingData,
                gameId,
                setGameId,
                suscribeToGameSocket,
                implementationGameBody,
                setImplementationGameBody,
                setGameId,
                usernameHost,
                setUsernameHost,
                initGameModes,
                setInitGameModes,
                setAnswer,
                setIsCorrectAnswer,
                answer,
                isCorrectAnswer,
                hostWins,
                setHostWins,
                guestWins,
                setGuestWins,
                unsubscribeFromLobby,  // Agregamos la función de desuscripción al contexto
                unsubscribeFromGame   // También agregamos la función para desuscribirse del juego
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
