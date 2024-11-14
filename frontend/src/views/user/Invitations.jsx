/** React **/
import React, {useContext} from 'react';

/** Components **/
import CustomList from '../../components/layouts/CustomList';
import MainGameLayout from '../../components/layouts/MainGamelayout'

/** Context API **/
import { SocketContext } from '../../contextAPI/SocketContext';

const Invitations = () => {
    /** Invitations List**/
    const { invitationCollection } = useContext(SocketContext);
    const getPlayerName = (player) => player.message;

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
                //onButtonInteraction={handleLobbyListInteraction}
                />
            }
        />
    );
};

export default Invitations;