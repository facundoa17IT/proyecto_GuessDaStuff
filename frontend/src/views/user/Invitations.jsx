/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'
import Modal from '../../components/layouts/Modal';
import { ClipLoader } from 'react-spinners';

/** Utils **/
import { invitationData, setInviteResponse } from '../../utils/Helpers';
import { PLAYER_ROUTES } from '../../utils/constants';

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';
import { LoadGameContext } from '../../contextAPI/LoadGameContext';

const Invitations = () => {
    const navigate = useNavigate();

    const { client, invitation, setInvitation, invitationCollection, setInvitationCollection, invitationCount, setInvitationCount, implementationGameBody, suscribeToGameSocket } = useContext(SocketContext);
    const { isMultiplayer, setIsMultiplayer } = useContext(LoadGameContext);

    const [acceptMatch, setAcceptMatch] = useState(false);

    const getPlayerName = (player) => player.message;

    const handleInvitationListInteraction = (listId, buttonKey, item) => {
        if (listId === "invitationsList" && Object.values(item).length > 0) {
            console.log("Invitations List Interaction");
            switch (buttonKey) {
                case 'acceptBtn':
                    console.log('Accept invitation');
                    respondToInvitation(true, item);
                    setAcceptMatch(true);
                    setIsMultiplayer(true);
                    localStorage.setItem("host", item.usernameHost);
                    break;

                case 'cancelBtn':
                    console.log('Cancel invitation');
                    respondToInvitation(false, item);
                    setAcceptMatch(false);
                    break;

                default:
                    break;
            }
        } else {
            console.log("Error list ID");
        }
    };

    useEffect(() => {
        if (isMultiplayer || !isMultiplayer) console.log("Is multiplayer: " + isMultiplayer);
    }, [isMultiplayer]);

    // 2)
    // Se gestiona que accion realizar dependiendo de la respuesta de la invitacion del socket
    useEffect(() => {
        if (invitation) {
            handleInvitationInteraction(invitation);
            console.log(invitation);
        }
    }, [invitation]);

    const removeInvitation = (userIdHost) => {
        // Filtra el array para excluir el elemento en el índice dado
        const updatedList = invitationCollection.filter(item => item.userIdHost !== userIdHost);
        setInvitationCollection(updatedList);
    };

    // 2.1)
    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            if (invitation.action === 'RESPONSE_IDGAME') {
                suscribeToGameSocket(invitation.gameId);
            } else {
                console.warn("Invitation Action type not recognized:", invitation.action);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    // 2.2)
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
                            idGame: invitation.gameId // Agrega el `idGame` también
                        }
                    });
                }, 3000); // Espera 3 segundos adicionales para navegar
            }
        }
    }, [implementationGameBody]);

    function respondToInvitation(response, invitation) {
        setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        setInvitationCount(invitationCount - 1);
        removeInvitation(invitation.userIdHost);
        setInvitation(null);
    }

    return (
        <>
            <MainGameLayout
                hideLeftPanel={true}
                hideRightPanel={true}
                middleHeader='Invitaciones'
                middleContent={
                    <CustomList
                        listId={"invitationsList"}
                        listContent={invitationCollection}
                        getItemLabel={getPlayerName}
                        buttons={['acceptBtn', 'cancelBtn']}
                        onButtonInteraction={handleInvitationListInteraction}
                    />
                }
            />

            <Modal showModal={acceptMatch} closeModal={() => setAcceptMatch(false)} title="Sala de Espera" hideConfirmBtn={true}>
                <h2>Espere a que el host inicie la partida!</h2>
                <ClipLoader speedMultiplier={0.5} color="var(--link-color)" size={50} loading={true} />
            </Modal>
        </>
    );
};

export default Invitations;