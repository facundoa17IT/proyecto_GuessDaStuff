/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import CustomList from '../components/layouts/CustomList';
import Modal from '../components/layouts/Modal';
import WaitingLobby from '../components/layouts/WaitingLobby';

/** Utils **/
import axiosInstance from "../utils/AxiosConfig";
import { PUBLIC_ROUTES } from '../utils/constants';

/** Context API **/
import { useRole } from '../contextAPI/AuthContext'
import { SocketContext } from '../contextAPI/SocketContext';
import { ListContext } from '../contextAPI/ListContext';

const MultiplayerLobby = () => {
    const navigate = useNavigate();

    const { users, client, invitation, invitationCount, setInvitationCount, invitationCollection, setInvitationCollection } = useContext(SocketContext);
    const { selectedItem } = useContext(ListContext);

    const getPlayerName = (player) => player.username;

    const [gameId, setGameId] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // se puede usar el userObj de local storage
    const { userId } = useRole();
    const username = localStorage.getItem("username");

    const [isHost, setIsHost] = useState(false);
    
    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const [playerTag, setPlayerTag] =useState(null);

    // Leer `connectedUsers` de `localStorage` solo una vez al cargar el componente
    const [connectedUsers, setConnectedUsers] = useState(() => {
        const storedUsers = JSON.parse(localStorage.getItem("connectedUsers"));
        return storedUsers || [];
    });

    // Se actualiza la lista cada vez que hay un cambio de usuario
    // useEffect(() => {
    //     if (users.length > 0) {
    //         setConnectedUsers(users);
    //         console.log(users);
    //     }
    // }, [users]);

    // Limpiamos el local storage de host y guest
    useEffect(() => {
        localStorage.removeItem("guest");
        localStorage.removeItem("host");
    }, []);

    useEffect(() => {
        if(invitationCollection.length > 0){
            console.log("Nueva invitacion recibida!");
            console.log(invitationCollection);
        }
    }, [invitationCollection]);

    const invitationData = {
        action:"",          // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        userIdHost:"",      // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        usernameHost:"",    // INVITE
        userIdGuest:"",     // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        usernameGuest:"",   // INVITE, INVITE_RESPONSE
        gameId: "",         // RESPONSE_IDGAME
        accepted: null,     // INVITE_RESPONSE, RESPONSE_IDGAME
        message:"",         // INVITE, INVITE_RESPONSE
    }

    // Función para actualizar la invitación
    function setInviteAction(usernameHost, userIdHost, userIdGuest, message) {
        invitationData.action = "INVITE";
        invitationData.userIdHost = userIdHost;
        invitationData.usernameHost = usernameHost;
        invitationData.userIdGuest = userIdGuest;
        invitationData.message = message;
        console.log('Datos de la invitación actualizados:', invitationData);
    }

    // Función para actualizar la respuesta de la invitación
    function setInviteResponse(accepted, usernameGuest, userIdGuest, message) {
        invitationData.action = "INVITE_RESPONSE";
        invitationData.userIdGuest = userIdGuest;
        invitationData.usernameGuest = usernameGuest;
        invitationData.accepted = accepted;
        invitationData.message = message;
        console.log('Respuesta actualizada:', invitationData);
    }

    // Función para actualizar la respuesta de la invitación
    function setResponseIdGame(idGame, message) {
        invitationData.action = "RESPONSE_IDGAME";
        invitationData.gameId = idGame;
        invitationData.message = message;
        console.log('Respuesta actualizada:', invitationData);
    }

    // se ejecuta cuando el guest acepta la partida
    // Se crea el game mediante socket
    const handleCreateGame = async () => {
        let idGame = '';
        const username = localStorage.getItem("username");
       
        if (userId && username) {
            try {
                const userHost = {
                    username: username,
                    userId: userId
                };

                const userGuest = {
                    username: selectedItem.username,
                    userId: selectedItem.id
                };

                const createGameBody = {
                    userHost: userHost,
                    userGuest: userGuest
                };

                const response = await axiosInstance.post('/game-multi/v1/create', createGameBody, { requiresAuth: true });
                idGame = response.data;
                setGameId(idGame);
                console.log("Partida creada! -> " + `idGame: ${JSON.stringify(idGame, null, 2)}`);

                console.log("Multiplayer Data -> " + JSON.stringify(messageSocket, null, 2));

                client.current.send("/app/game/create", {}, JSON.stringify(messageSocket));
            } catch (error) {
                console.error('Error obteniendo datos del juego:', error);
            }
        }
        else {
            console.error("No se pudo obtener el user Id o username")
        }
    };

    // 1)
    const handleLobbyListInteraction = (listId, buttonKey, item) => {
        if (listId === "lobbyList") {
            if (selectedItem && buttonKey === 'inviteBtn') {
                sendInvitation(selectedItem.userId);
                localStorage.setItem("guest", selectedItem.username);
            }
        } else {
            console.log("Error list ID");
        }
    };

    // 2)
    // Se gestiona que accion realizar dependiendo de la respuesta de la invitacion del socket
    useEffect(() => {
        if (invitation) {
            handleInvitationInteraction(invitation);
        }
    }, [invitation]);

    // 2.1)
    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            console.log(invitation.action);
            switch (invitation.action) {
                case 'INVITE':
                    console.log("Se ha realizado una invitacion!");
                    setInvitationCount(invitationCount+1);
                    setInvitationCollection([...invitationCollection, invitation]);
                    console.log(invitation);
                    showInvitation(invitation);
                    break;

                case 'INVITE_RESPONSE':
                    console.log("Se ha respondido a la invitacion!");
                    handleResponse(invitation);
                    break;

                case 'RESPONSE_IDGAME':
                    console.log("Se iniciara la partida!");
                    client.current.subscribe(`/topic/game/${invitation.idGame}`);
                    setTimeout(() => {
                        navigate(PUBLIC_ROUTES.SELECTION_PHASE);
                    }, 3000); // 3000 ms para esperar 3 segundos adicionales
                    break;

                default:
                    console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

   // 3)
    function showInvitation(invitation) {
        setIsModalOpen(true);
        setModalContent(
            <>
                <h1 style={{ color: "var(--link-color)" }}>"{invitation.usernameHost}"</h1>
                <h2>Te ha invitado a jugar!</h2>
            </>
        );
        localStorage.setItem("host", invitation.usernameHost);
    }

    // Enviar la invitación al canal del destinatario del guest
    function sendInvitation(userIdGuest) {
        setInviteAction(userObj.username, userId, userIdGuest, `${userObj.username} - Te ha invitado a jugar`);
        client.current.send(`/topic/lobby/${userIdGuest}`, {}, JSON.stringify(invitationData));
        setIsHost(true);
    }

    // 4)
    // Solo si soy guest
    // Enviar la respuesta al canal destinatario del host
    function respondToInvitation(response){
        setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        setIsModalOpen(false);
        setInvitationCount(invitationCount-1);
        if(response){
            setPlayerTag(localStorage.getItem("host"));
        }
    }

    // 5) solo si acepta
    // solo si soy host
    // Enviar la respuesta al canal destinatario del guest
    function handleResponse(invitation) {
        if (invitation.accepted) {
            setPlayerTag(localStorage.getItem("guest"));
            setResponseIdGame(invitation.idGame, "Se ha enviado el id de la partida")
            client.current.send(`/topic/lobby/${invitation.userIdGuest}`, {}, JSON.stringify(invitationData));
            client.current.subscribe(`/topic/game/${invitation.idGame}`);
            setTimeout(() => {
                navigate(PUBLIC_ROUTES.SELECTION_PHASE);
            }, 3000); // 3000 ms para esperar 3 segundos adicionales
        } else {
            setIsModalOpen(true);
            setModalContent(<p style={{color:'red'}}>El usuario ha rechazado la invitacion!</p>); 
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
            setIsHost(false);
            localStorage.removeItem("host");
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
                    <WaitingLobby onClick={null} isHost={isHost} user1={username} user2={playerTag} />
                }
            />

            <Modal showModal={isModalOpen} onConfirm={handleConfirm} closeModal={handleClose} title="Invitacion">
                {modalContent}
            </Modal>
        </>
    );
};

export default MultiplayerLobby;