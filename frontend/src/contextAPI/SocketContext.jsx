import React, { createContext, useContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    //const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);

    const client = React.useRef(null);

    const connect = (username) => {
        const socket = new SockJS('http://localhost:8080/ws');
        client.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.current.subscribe('/topic/lobby', message => {
                    setUsers(JSON.parse(message.body)); // Actualizar usuarios conectados
                });
                client.current.publish({
                    destination: '/app/join',
                    body: username
                });
            }
        });
        client.current.activate();
    };
    
    const disconnect = (username) => {
        if (client.current) {
            client.current.publish({
                destination: '/app/leave',
                body: username
            });
            client.current.deactivate();
        }
    };

    return (
        <SocketContext.Provider value={{connect, disconnect, users}}>
            {children}
        </SocketContext.Provider>
    );
};


