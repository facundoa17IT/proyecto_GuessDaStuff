/** React **/
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'

/** Utils **/
import { invitationData, setInviteResponse } from '../../utils/Helpers';
import { PLAYER_ROUTES } from '../../utils/constants';

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';
import { ListContext } from '../../contextAPI/ListContext';

const Invitations = () => {
    const navigate = useNavigate();

    const { selectedItem } = useContext(ListContext);


    /** Invitations List**/
    const { client, invitation, setInvitation, invitationCollection, setInvitationCollection, invitationCount, setInvitationCount, implementationGameBody, setImplementationGameBody } = useContext(SocketContext);

    const getPlayerName = (player) => player.message;

    const handleInvitationListInteraction = (listId, buttonKey, item) => {
        if (listId === "invitationsList" && Object.values(item).length > 0) {
            console.log("Invitations List Interaction");
            switch (buttonKey) {
                case 'acceptBtn':
                    console.log('Accept invitation');
                    respondToInvitation(true, item);
                    break;

                case 'cancelBtn':
                    console.log('Cancel invitation');
                    respondToInvitation(false, item);
                    break;

                default:
                    break;
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
            console.log(invitation.action);
            if (invitation.action === 'RESPONSE_IDGAME') {
                client.current.subscribe(`/game/${invitation.gameId}/`, (message) => {
                    const implementGame = JSON.parse(message.body);
                    console.log(implementGame);
                    setImplementationGameBody(implementGame);
                });
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
        // selectedItem = invitation
        setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        setInvitationCount(invitationCount - 1);
        removeInvitation(invitation.userIdHost);
        setInvitation(null);
        // if(response){
        //     setPlayerTag(localStorage.getItem("host"));
        // }
    }

    return (
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
    );
};

export default Invitations;