/** React **/
import React, {useContext} from 'react';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';

const Invitations = () => {
    /** Invitations List**/
    const { invitationCollection, setIsInvitationAccepted } = useContext(SocketContext);

    const getPlayerName = (player) => player.message;

    const handleInvitationListInteraction = (listId, buttonKey, item) => {
        if (listId === "invitationsList") {
            console.log("Invitations List Interaction");
            switch (buttonKey) {
                case 'acceptBtn':
                    console.log('Accept invitation');
                    //respondToInvitation(true);
                    setIsInvitationAccepted(true);
                    break;

                case 'cancelBtn':
                    console.log('Cancel invitation');
                    //respondToInvitation(false);
                    setIsInvitationAccepted(false);
                    break;

                default:
                    console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.log("Error list ID");
        }
    };

    function respondToInvitation(response){
        setInviteResponse(response, invitation.usernameGuest, invitation.userIdGuest, response ? "Ha aceptado la invitacion" : "Ha rechazado la invitacion");
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        
        setInvitationCount(invitationCount-1);
        // remove from collection
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