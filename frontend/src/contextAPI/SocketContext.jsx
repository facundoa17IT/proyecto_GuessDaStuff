import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [invitation, setInvitation] = useState(null);
    const [users, setUsers] = useState([]);
    const [invitationCount, setInvitationCount] = useState(0);
    const [invitationCollection, setInvitationCollection] = useState([]);
    const [implementationGameBody, setImplementationGameBody] = useState(null);
    const [usernameHost, setUsernameHost] = useState(null);
    const [gameId, setGameId] = useState(null);

    const client = useRef(null);

    useEffect(() => {
        localStorage.setItem("connectedUsers", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (invitationCollection.length > 0) {
            console.log("Nueva invitación recibida!");
            console.log(invitationCollection);
        }
    }, [invitationCollection]);
    
    const connect = (dtoUserOnline) => {
        client.current = Stomp.over(() => new SockJS('http://localhost:8080/ws'));

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

    const disconnect = (dtoUserOnline) => {
        if (client.current) {
            console.log("Usuario desconectado!");
            client.current.send('/app/leave', {}, JSON.stringify(dtoUserOnline));
            client.current.disconnect();
        }
        else{
            console.error("Error con el cliente STOMP");
        }
    };

    const suscribeToGameSocket = (gameId) => {
        if (client.current) {
            client.current.subscribe(`/game/${gameId}/`, (message) => {
                const implementGame = JSON.parse(message.body);
                console.log(implementGame);
                setImplementationGameBody(implementGame);
                console.warn("SOCKET -> /game/gameId/");
            });
        }
        else{
            console.error("Error con el cliente STOMP");
        }
    } 

    return (
        <SocketContext.Provider
            value={{
                connect,
                disconnect,
                users,
                invitation, setInvitation,
                client,
                invitationCount, setInvitationCount,
                invitationCollection, setInvitationCollection,
                implementationGameBody, setImplementationGameBody,
                usernameHost, setUsernameHost,
                gameId, setGameId,
                suscribeToGameSocket
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
