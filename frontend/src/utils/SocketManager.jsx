import React, { useEffect, useState } from 'react';
import MainGameLayout from '../components/layouts/MainGamelayout';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const MultiplayerLobby = () => {
    const [username, setUsername] = useState('');
    const [connected, setConnected] = useState(false);
    const [users, setUsers] = useState([]);
    const client = React.useRef(null);

    const connect = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        client.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                client.current.subscribe('/topic/lobby', message => {
                    setUsers(JSON.parse(message.body)); // Actualiza usuarios conectados
                });
                client.current.publish({
                    destination: '/app/join',
                    body: username
                });
            },
            onDisconnect: () => {
                setConnected(false);
                setUsers([]);
            }
        });
        client.current.activate();
    };

    const disconnect = () => {
        if (client.current) {
            client.current.publish({
                destination: '/app/leave',
                body: username
            });
            client.current.deactivate();
        }
    };

    useEffect(() => {
        return () => {
            disconnect(); // Asegura desconexión cuando el componente se desmonte
        };
    }, []);

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader=""
            middleContent={
                <div>
                    <h2>Lobby de Usuarios</h2>
                    {connected ? (
                        <div>
                            <h3>Usuarios Conectados</h3>
                            <ul>
                                {users.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                            <button onClick={disconnect}>Salir del Lobby</button>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <button onClick={connect} disabled={!username}>
                                Unirse al Lobby
                            </button>
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default MultiplayerLobby;
