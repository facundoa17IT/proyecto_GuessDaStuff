/** React **/
import React, { useState, useEffect } from 'react';

/** Socket **/
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

/** Utils **/
import axiosInstance from "../utils/AxiosConfig";

/** Context API **/
import { useRole } from '../contextAPI/AuthContext'

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';

const MultiplayerLobby = () => {
    const [stompClient, setStompClient] = useState(null);
    const [logs, setLogs] = useState([]);
    const [gameId, setGameId] = useState('');
    const [invitePlayerId, setInvitePlayerId] = useState('');
    const [answer, setAnswer] = useState('');

    const { userId } = useRole();  // Access the setRole function from the context

    // Se inicializa la conexion al socket
    useEffect(() => {
        // Initialize WebSocket connection and STOMP client
        const client = Stomp.over(() => new SockJS('http://localhost:8080/ws'));

        client.connect({}, () => {
            setStompClient(client);

            // Subscribe to global notifications
            client.subscribe('/topic/global', (message) => {
                logMessage("Global Update: " + message.body);
            });
        });

        // Disconnect the client when the component is unmounted
        return () => {
            if (client) client.disconnect();
        };
    }, []);

    // Se crea el game mediante socket
    const handleCreateGame = async () => {
        let idGame = '';
        const username = localStorage.getItem("username");
        if (userId && username) {
            try {
                const response = await axiosInstance.post(`/game-multi/v1/create/${userId}`, { requiresAuth: true });
                idGame = response.data;
                setGameId(idGame);
                console.log("Partida creada! -> " + `idGame: ${JSON.stringify(idGame, null, 2)}`);

                const userHost = {
                    username: username,
                    userId: userId
                };

                const player = {
                    userHost: userHost,
                    idGame: idGame
                };
                
                console.log("Multiplayer Data -> " + JSON.stringify(player, null, 2));
                logMessage("Multiplayer Data: " + JSON.stringify(player, null, 2));
                stompClient.send("/app/game/create", {}, JSON.stringify(player));

                logMessage("Game created by player: " + username);
            } catch (error) {
                console.error('Error obteniendo datos del juego:', error);
            }
        }
        else {
            console.error("No se pudo obtener el user Id o username")
        }
    };

    // Se llama la funcion una vez que se establecio la conexion con el socket
    useEffect(() => {
        if (stompClient) {
            // Execute handleCreateGame after connection is established
            handleCreateGame();
        }
    }, [stompClient]);

    // Nos suscribimos al canal restante
    useEffect(() => {
        if (stompClient && gameId) {
            // Subscribe to the dynamic game channel based on gameId
            const subscription = stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
                logMessage("Game Update: " + message.body);
            });

            // // Cleanup subscription when gameId changes
            // return () => {
            //     subscription.unsubscribe();
            // };
        }
    }, [stompClient, gameId]);

    const logMessage = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const handleSendInvite = () => {
        const invite = { gameId, fromPlayerId: playerName, toPlayerId: invitePlayerId };
        ///game-multi/v1/invite/
        const userGuest = {
            "username": "", // ESTE DATO LO VAMOS A TENER. 
            "userId": invitePlayerId
        };
        stompClient.send(`/app/game/${gameId}/invite`, {}, JSON.stringify(invite));
        logMessage("Invite sent to player: " + invitePlayerId);
    };

    const handleJoinGame = () => {
        const player = { playerId: userId, username: playerName };
        stompClient.send(`/app/game/${gameId}/join`, {});
        logMessage("Player joined game: " + gameId);
    };

    const handleStartGame = () => {
        stompClient.send(`/app/game/${gameId}/start`, {}, JSON.stringify({ gameId }));
        logMessage("Game started: " + gameId);
    };

    const handleSubmitAnswer = () => {
        const answerPayload = { gameId, playerId: playerName, answer };
        stompClient.send(`/app/game/${gameId}/answer`, {}, JSON.stringify(answerPayload));
        logMessage("Answer submitted by player: " + playerName);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>WebSocket Game Test</h1>

            <div style={{ marginBottom: '20px' }}>
                <label style={{ marginLeft: '10px' }}>
                    Invite Player ID:
                    <input type="text" value={invitePlayerId} onChange={(e) => setInvitePlayerId(e.target.value)} />
                </label>
                <label style={{ marginLeft: '10px' }}>
                    Answer:
                    <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} />
                </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button onClick={handleSendInvite}>Send Invite</button>
                <button onClick={handleJoinGame}>Join Game</button>
                <button onClick={handleStartGame}>Start Game</button>
                <button onClick={handleSubmitAnswer}>Submit Answer</button>
            </div>

            <div style={{ border: '1px solid black', padding: '10px', maxHeight: '300px', overflowY: 'scroll' }}>
                <h3>Logs</h3>
                {logs.map((log, index) => (
                    <div key={index}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default MultiplayerLobby;
