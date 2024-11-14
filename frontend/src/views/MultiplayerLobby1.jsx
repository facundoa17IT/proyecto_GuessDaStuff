/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Socket **/
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import CustomList from '../components/layouts/CustomList';
import Modal from '../components/layouts/Modal';

/** Utils **/
import axiosInstance from "../utils/AxiosConfig";
import {PLAYER_ROUTES} from "../utils/constants";

/** Context API **/
import { useRole } from '../contextAPI/AuthContext'
import { SocketContext } from '../contextAPI/SocketContext';
import { ListContext } from '../contextAPI/ListContext';

const MultiplayerLobby = () => {
    const { users, isInvitationSended } = useContext(SocketContext);
    const { selectedItem } = useContext(ListContext);

    const getPlayerName = (player) => player;

    const [stompClient, setStompClient] = useState(null);
    const [gameId, setGameId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [modalContent, setModalContent] = useState(null);

    const { userId } = useRole();  // Access the setRole function from the context

    const username = localStorage.getItem("username");

    const navigate = useNavigate();

    const [isHost, setIsHost] = useState(false);
    // Se inicializa la conexion al socket
    useEffect(() => {
        // Initialize WebSocket connection and STOMP client
        const client = Stomp.over(() => new SockJS('http://localhost:8080/ws'));

        client.connect({}, () => {
            setStompClient(client);

            // Subscribe to global notifications
            client.subscribe('/topic/global', (message) => {
                console.log("Global Update: " + message.body);
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

                const messageSocket = {
                    userHost: userHost,
                    idGame: idGame
                };

                console.log("Multiplayer Data -> " + JSON.stringify(messageSocket, null, 2));

                stompClient.send("/app/game/create", {}, JSON.stringify(messageSocket));
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
            stompClient.subscribe(`/topic/game/${gameId}`, (message) => {
                console.log("Game Update: " + message.body);
            });

            // Escuchar notificaciones de invitación
            stompClient.subscribe("/game/invitations/" + username, (message) => {
                console.log("invitacion enviada context");
                const invitation = JSON.parse(message.body);
                showInvitation(invitation);
                console.log(invitation);
            });

            // Escuchar respuestas a las invitaciones
            stompClient.subscribe("/game/invitations/responses/" + username, (message) => {
                const response = JSON.parse(message.body);
                console.log(response);
                handleResponse(response);
            });
        }
    }, [stompClient, gameId]);


    useEffect(() => {
        if (isInvitationSended) {
            console.log("se mando la inivitacion");
            isModalOpen(isInvitationSended);
        }
    }, [isInvitationSended]);

    const handleLobbyListInteraction = (listId, buttonKey, item) => {
        if (listId === "lobbyList") {
            if (item !== null && buttonKey === 'inviteBtn') {
                sendInvitation(selectedItem);
            }
        } else {
            console.log("Error list ID");
        }
    };

    function showInvitation(invitation) {
        setIsModalOpen(true);
        setModalContent(
            <>
                <h1 style={{ color: "var(--link-color)" }}>{invitation.fromPlayerId}</h1>
                <h2>Te ha invitado a jugar!</h2>
            </>
        );
        localStorage.setItem("host", invitation.fromPlayerId);
    }

    function sendInvitation(recipient) {
        const invitation = {
            gameId: gameId,
            fromPlayerId: username,
            toPlayerId: recipient
        };
        // Enviar la invitación al canal del destinatario
        stompClient.send(`/app/invite/${recipient}`, {}, JSON.stringify(invitation));
        console.log(`Invitación enviada a ${recipient}`);
        setIsHost(true);
    }

    // solo si soy invitado
    function respondToInvitation(accepted){
        const host = localStorage.getItem("host");
        const response = { host: host, guest: username, accepted: accepted };
        stompClient.send("/app/respond", {}, JSON.stringify(response));
        setIsModalOpen(false);
        navigate(PLAYER_ROUTES.MULTIPLAYER_LOBBY);
    }

    // solo si soy host
    function handleResponse(response) {
        setIsModalOpen(true);
        if (response.accepted) {
            setModalContent(<>El usuario ha aceptado la invitacion!</>);
        } else {
            setModalContent(<>El usuario ha rechazado la invitacion!</>);
            setIsHost(false);
        }
    }

    const handleConfirm = () => {
        if (isHost) {
            setIsModalOpen(false);
        } else {
            respondToInvitation(true);
        }
    };

    const handleClose = () => {
        if (isHost) {
            setIsModalOpen(false);
        } else {
            respondToInvitation(false);
        }
    };

    return (
        <>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={true}
                middleHeader="Game Lobby"
                middleContent={
                    <CustomList
                        listId={"lobbyList"}
                        listContent={users}
                        getItemLabel={getPlayerName}
                        buttons={['inviteBtn', 'infoBtn']}
                        onButtonInteraction={handleLobbyListInteraction}
                    />
                }
                rightHeader='Sala de Espera'
                rightContent={
                    <><h2>{username}</h2></>
                }
            />

            <Modal showModal={isModalOpen} onConfirm={handleConfirm} closeModal={handleClose} title="Invitacion">
                {modalContent}
            </Modal>
        </>
    );
};

export default MultiplayerLobby;