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
import { PLAYER_ROUTES } from '../utils/constants';
import { invitationData, setInviteAction, setResponseIdGame } from '../utils/Helpers';

/** Context API **/
import { useRole } from '../contextAPI/AuthContext'
import { SocketContext } from '../contextAPI/SocketContext';
import { ListContext } from '../contextAPI/ListContext';
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const MultiplayerLobby = () => {
    const navigate = useNavigate();

    const { users, client, invitation, implementationGameBody, setImplementationGameBody, setUsernameHost, gameId, setGameId } = useContext(SocketContext);

    const { selectedItem } = useContext(ListContext);
    const { loadGameData } = useContext(LoadGameContext);

    const getPlayerName = (player) => player.username;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    // se puede usar el userObj de local storage
    const { userId } = useRole();
    const username = localStorage.getItem("username");

    const [isHost, setIsHost] = useState(false);

    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const [playerTag, setPlayerTag] = useState(null);

    const [connectedUsers, setConnectedUsers] = useState(() => {
        const storedUsers = JSON.parse(localStorage.getItem("connectedUsers"));
        return storedUsers || [];
    });

    //Se actualiza la lista cada vez que hay un cambio de usuario
    useEffect(() => {
        setConnectedUsers(users);
        filterSelfUsername();
        console.log(users);
    }, [users]);

    // Limpiamos el local storage de host y guest
    useEffect(() => {
        localStorage.removeItem("guest");
        localStorage.removeItem("host");
        filterSelfUsername();
    }, []);

    // Remueve el propio host de la lista de usuarios conectados
    const filterSelfUsername = () => {
        const updatedList = connectedUsers.filter(item => item.username !== userObj.username);
        setConnectedUsers(updatedList);
    }

    // se ejecuta cuando el guest acepta la partida
    // Se crea el game mediante socket
    const handleCreateGame = async () => {
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

                const response = await axiosInstance.post('/game-multi/v1/create/', createGameBody, { requiresAuth: true });
                console.log(response.data);
                console.log("Partida creada! -> " + `idGame: ${JSON.stringify(response.data, null, 2)}`);

                setGameId(response.data);

                return response.data; // retorna gameId
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
            if (Object.values(item).length > 0 && buttonKey === 'inviteBtn') {
                sendInvitation(item.userId);
                localStorage.setItem("guest", item.username);
            }
            else {
                console.log(listId);
                console.log(buttonKey);
                console.log(item);
            }
        } else {
            console.log("Error list ID");
        }
    };

    // 1.1)
    // Enviar la invitación al canal del destinatario del guest
    function sendInvitation(userIdGuest) {
        setInviteAction(userObj.username, userId, userIdGuest, `${userObj.username} - Te ha invitado a jugar`);
        client.current.send(`/topic/lobby/${userIdGuest}`, {}, JSON.stringify(invitationData));
        setIsHost(true);
        setUsernameHost(userObj.username);
    }

    // 2)
    // Se gestiona que accion realizar dependiendo de la respuesta de la invitacion del socket
    useEffect(() => {
        if (invitation) {
            handleInvitationInteraction(invitation);
            console.log(invitation);
        }
    }, [invitation]);

    // 2.1)
    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            console.log(invitation.action);
            switch (invitation.action) {

                case 'INVITE_RESPONSE':
                    console.log("Se ha respondido a la invitacion!");
                    handleResponse(invitation);
                    break;

                default:
                    break;
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    // 3) solo guest si acepta (esto se gestiona en la vista de invitations)
    // solo si soy host
    // Enviar la respuesta al canal destinatario del guest
    const handleResponse = async (invitation) => {
        if (invitation.accepted) {
            setPlayerTag(localStorage.getItem("guest"));
            handleCreateGame(); // retorna y seta el gameId
        } else {
            setIsModalOpen(true);
            setModalContent(<p style={{ color: 'red' }}>El usuario ha rechazado la invitacion!</p>);
        }
    }

    // Se ejecuta cuando obtengo el valor de gameId
    useEffect(() => {
        if(gameId !== null){
            setResponseIdGame(gameId, "Se ha enviado el id de la partida");
            client.current.send(`/topic/lobby/${invitation.userIdGuest}`, {}, JSON.stringify(invitationData));
            client.current.subscribe(`/game/${gameId}/`, (message) => {
                const implementGame = JSON.parse(message.body);
                console.log(implementGame);
                setImplementationGameBody(implementGame);
            });
        }
    }, [gameId]);

    //Se actualiza la lista cada vez que hay un cambio de usuario
    useEffect(() => {
        if (implementationGameBody) {
            if (implementationGameBody.status === "INVITE_RULETA") {
                setTimeout(() => {
                    navigate(PLAYER_ROUTES.SLOT_MACHINE, {
                        state: {
                            ruletaGame: implementationGameBody.ruletaGame,
                            finalSlot1: implementationGameBody.finalSlot1,
                            finalSlot2: implementationGameBody.finalSlot2,
                            finalSlot3: implementationGameBody.finalSlot3,
                            idGame: gameId
                        }
                    });
                }, 3000); // 3000 ms para esperar 3 segundos adicionales
            }
        }
    }, [implementationGameBody]);


    const handleConfirm = () => {
        if (isHost) {
            setIsModalOpen(false);
        }
    };

    const handleClose = () => {
        if (isHost) {
            setIsModalOpen(false);
            setIsHost(false);
            localStorage.removeItem("host");
        }
    };

    // Función para obtener un elemento aleatorio de un array
    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    const initGameHost = async () => {
        try {
            loadGameData.finalSlot1 = getRandomItem(loadGameData.categories[0].gameModes);
            loadGameData.finalSlot2 = getRandomItem(loadGameData.categories[1].gameModes);
            loadGameData.finalSlot3 = getRandomItem(loadGameData.categories[2].gameModes);
            console.log(loadGameData);
            axiosInstance.post(`/game-multi/game/${gameId}/load-game/`, loadGameData, { requiresAuth: false })
        } catch (error) {
            console.error('Error con load game:', error);
        }
    }

    return (
        <>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={true}
                middleHeader="Game Lobby"
                middleContent={
                    <CustomList
                        listId={"lobbyList"}
                        listContent={connectedUsers}
                        getItemLabel={getPlayerName}
                        buttons={['inviteBtn', 'infoBtn']}
                        onButtonInteraction={handleLobbyListInteraction}
                    />
                }
                rightHeader='Sala de Espera'
                rightContent={
                    <WaitingLobby onClick={initGameHost} isHost={isHost} user1={username} user2={playerTag} />
                }
            />

            <Modal showModal={isModalOpen} onConfirm={handleConfirm} closeModal={handleClose} title="Invitacion">
                {modalContent}
            </Modal>
        </>
    );
};

export default MultiplayerLobby;