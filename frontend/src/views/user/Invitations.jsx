/** React **/
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'

/** Utils **/
import { invitationData, setInviteResponse } from '../../utils/Helpers';
import { PUBLIC_ROUTES } from '../../utils/constants';

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';
import { ListContext } from '../../contextAPI/ListContext';

const Invitations = () => {
    const navigate = useNavigate();

    const { selectedItem } = useContext(ListContext);


    /** Invitations List**/
    const { client, invitation, setInvitation, invitationCollection, setInvitationCollection, invitationCount, setInvitationCount } = useContext(SocketContext);

    const getPlayerName = (player) => player.message;

    const handleInvitationListInteraction = (listId, buttonKey, item) => {
        if (listId === "invitationsList" && Object.values(item).length > 0 ) {
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
            switch (invitation.action) {

                case 'RESPONSE_IDGAME':
                    console.log("Se iniciara la partida!");
                    client.current.subscribe(`/topic/game/${invitation.idGame}`);        
                    setTimeout(() => {
                        navigate(PUBLIC_ROUTES.SELECTION_PHASE);
                    }, 3000); // 3000 ms para esperar 3 segundos adicionales
                    break;

                default:
                    console.warn("Invitation Action type not recognized:", invitation.action);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    function respondToInvitation(response, invitation) {
        // selectedItem = invitation
        setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
        client.current.send(`/topic/lobby/${selectedItem.userIdHost}`, {}, JSON.stringify(invitationData));
        setInvitationCount(invitationCount - 1);
        removeInvitation(selectedItem.userIdHost);
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
                    buttons={['infoBtn', 'acceptBtn', 'cancelBtn']}
                    onButtonInteraction={handleInvitationListInteraction}
                />
            }
        />
    );
};

export default Invitations;