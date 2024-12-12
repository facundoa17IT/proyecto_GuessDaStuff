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
import { PUBLIC_ROUTES, ROLE } from '../utils/constants';
import { invitationData, setInviteAction, setResponseIdGame, getRandomItem } from '../utils/Helpers';

/** Context API **/
import { SocketContext } from '../contextAPI/SocketContext';
import { ListContext } from '../contextAPI/ListContext';
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const MultiplayerLobby = () => {
    const navigate = useNavigate();

    const { users, client, invitation, implementationGameBody, setUsernameHost, suscribeToGameSocket } = useContext(SocketContext);
    const { gameId, setGameId, loadGameData } = useContext(LoadGameContext);
    const { selectedItem } = useContext(ListContext);

    const getPlayerName = (player) => player.username;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const [isHost, setIsHost] = useState(false);
    const [isMatchAccepted, setIsMatchAccepted] = useState(null);

    // Almacena username, userId, email
    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const [connectedUsers, setConnectedUsers] = useState([]);

    //Se actualiza la lista cada vez que hay un cambio de usuario
    useEffect(() => {
        // Filter users whenever `users` changes
        const updatedList = users.filter(
            (item) => item.username !== userObj.username && item.status !== ROLE.ADMIN
        );
        setConnectedUsers(updatedList);
    }, [users]);

    // Limpiamos el local storage de host y guest
    useEffect(() => {
        localStorage.removeItem("host");
		localStorage.removeItem("guest");
        localStorage.setItem("host", JSON.stringify(userObj));
    }, []);

    // 1)
    // Se envia la invitacion al persionar el boton de invitar
    const handleLobbyListInteraction = (listId, buttonKey, item) => {
        if (listId === "lobbyList") {
            if (Object.values(item).length > 0 && buttonKey === 'inviteBtn') {
                sendInvitation(item);
            }
            else {
                console.error("Error onteniendo el item de la lista!");
            }
        } else {
            console.log("Error list ID");
        }
    };

    // 1.1)
    // Enviar la invitación al canal del destinatario del guest
    function sendInvitation(userGuest) {
        setInviteAction(userObj.username, userObj.userId, userGuest.userId, `${userObj.username} - Te ha invitado a jugar`);
        client.current.send(`/topic/lobby/${userGuest.userId}`, {}, JSON.stringify(invitationData));
        setIsHost(true);
        setUsernameHost(userObj.username);
        localStorage.setItem("guest", JSON.stringify(userGuest));
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
            if (invitation.action === 'INVITE_RESPONSE') {
                console.log("Se ha respondido a la invitación!");
                handleResponse(invitation);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    // se ejecuta cuando el guest acepta la partida
    // Se crea el game mediante socket
    const handleCreateGame = async () => {
        try {
            const userHost = {
                username: userObj.username,
                userId: userObj.userId
            };

            const userGuest = {
                username: selectedItem.username,
                userId: selectedItem.userId
            };

            const createGameBody = {
                userHost: userHost,
                userGuest: userGuest
            };

            console.log(createGameBody);

            const response = await axiosInstance.post('/game-multi/v1/create/', createGameBody, { requiresAuth: true });
            console.log(response.data);
            console.log("Partida creada! -> " + `idGame: ${JSON.stringify(response.data, null, 2)}`);

            setGameId(response.data);

            return response.data; // retorna gameId
        } catch (error) {
            console.error('Error obteniendo datos del juego:', error);
        }
    };

    // 3) solo guest si acepta (esto se gestiona en la vista de invitations)
    // solo si soy host
    // Enviar la respuesta al canal destinatario del guest
    const handleResponse = async (invitation) => {
        setIsMatchAccepted(invitation.accepted);
        if (invitation.accepted) {
            handleCreateGame(); // retorna y seta el gameId
        } else {
            setIsModalOpen(true);
            setModalContent(<h2 style={{ color: 'red' }}>El usuario ha rechazado la invitacion!</h2>);
        }
    }

    // 4) si el usario acepta la partida me suscribo al canal del juego y le envio al invitado el id de la partida
    // Se ejecuta cuando obtengo el valor de gameId
    useEffect(() => {
        if (gameId != null) {
            setResponseIdGame(gameId, "Se ha enviado el id de la partida");
            client.current.send(`/topic/lobby/${invitation.userIdGuest}`, {}, JSON.stringify(invitationData));
            suscribeToGameSocket(gameId);
        }
    }, [gameId]);

    // Se carga en la BD el inicio de la partida
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
    // Luego de dar inicio a la partida redirecciona al host a la vista de la ruleta
    useEffect(() => {
        if (implementationGameBody) {
            if (implementationGameBody.status === "INVITE_RULETA") {
                setTimeout(() => {
                    navigate(PUBLIC_ROUTES.SELECTION_PHASE, {
                        state: {
                            ruletaGame: implementationGameBody.ruletaGame,
                            finalSlot1: implementationGameBody.finalSlot1,
                            finalSlot2: implementationGameBody.finalSlot2,
                            finalSlot3: implementationGameBody.finalSlot3,
                            idGame: gameId
                        }
                    });
                }, 1500);
            }
        }
    }, [implementationGameBody]);

    const handleClose = () => {
        if (isHost) {
            setIsModalOpen(false);
            setIsHost(false);
            localStorage.removeItem("host");
            localStorage.removeItem("guest");
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
                        listContent={connectedUsers}
                        getItemLabel={getPlayerName}
                        buttons={['inviteBtn', 'infoBtn']}
                        onButtonInteraction={handleLobbyListInteraction}
                    />
                }
                rightHeader='Sala de Espera'
                rightContent={
                    <WaitingLobby
                        onClick={initGameHost}
                        isHost={isHost}
                        isMatchAccepted={isMatchAccepted}
                    />
                }
            />

            <Modal showModal={isModalOpen} hideConfirmBtn={true} closeModal={handleClose} title="Aviso">
                {modalContent}
            </Modal>
        </>
    );
};

export default MultiplayerLobby;