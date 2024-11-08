import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useRole } from '../contextAPI/AuthContext'
import MainGameLayout from '../components/layouts/MainGamelayout';
import axiosInstance from "../utils/AxiosConfig";

const MultiplayerLobby = () => {
    const [stompClient, setStompClient] = useState(null);
    const [logs, setLogs] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [gameId, setGameId] = useState('');
    const [invitePlayerId, setInvitePlayerId] = useState('');
    const [answer, setAnswer] = useState('');
    const { userId } = useRole();  // Access the setRole function from the context

    useEffect(() => {
        // Initialize WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            setStompClient(client);

            // Subscribe to global notifications
            client.subscribe('/topic/global', (message) => {
                logMessage("Global Update: " + message.body);
            });

            // Subscribe to dynamic game updates
            client.subscribe(`/topic/game/${gameId}`, (message) => {
                logMessage("Game Update: " + message.body);
            });
        });

        return () => {
            if (stompClient) stompClient.disconnect();
        };
    }, [gameId]); // Reconnect when gameId changes

    const logMessage = (message) => {
        setLogs((prevLogs) => [...prevLogs, message]);
    };

    const handleCreateGame = async () => {
        let idGame = '';
        try {
            const response = await axiosInstance.post(`/api/game-multi/v1/create/${userId}`, { requiresAuth: true });
            idGame = response;
        } catch (error) {
            console.error('Error obteniendo datos del juego:', error);
        }

        const userHost = {
            "username" : playerName,
            "userId" : userId
        };

        const player = { userHost: userHost, idGame : idGame};
        stompClient.send("/app/game/create", {}, JSON.stringify(player));
        logMessage("Game created by player: " + playerName);
    };

    const handleSendInvite = () => {
        const invite = { gameId, fromPlayerId: playerName, toPlayerId: invitePlayerId };
        
        const userGuest = {
            "username" : "", // ESTE DATO LO VAMOS A TENER. 
            "userId" : invitePlayerId
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
                <label>
                    Player Name:
                    <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                </label>
                <label style={{ marginLeft: '10px' }}>
                    Game ID:
                    <input type="text" value={gameId} onChange={(e) => setGameId(e.target.value)} />
                </label>
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
                <button onClick={handleCreateGame}>Create Game</button>
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
