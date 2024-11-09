import React, { useEffect, useState ,useContext} from 'react';
import MainGameLayout from '../components/layouts/MainGamelayout';
import { SocketContext } from '../contextAPI/SocketContext';
import CustomList from '../components/layouts/CustomList';
import { useRole } from '../contextAPI/AuthContext'

const MultiplayerLobby = () => {
    const { users } = useContext(SocketContext);
    const getPlayerName = (player) => player;

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader="Comunidad"
            middleContent={
                <CustomList
                        listId={"lobbyList"}
                        listContent={users}
                        getItemLabel={getPlayerName}
                        buttons={['infoBtn']}
                        // extraColumns={extraColumns}
                        // customFilter={customFilter}
                        // addNewEntry={true}
                        // onAddNewEntry={() => setIsModalOpen(!isModalOpen)}
                        // onButtonInteraction={handleUsersListInteraction}
                    />
                // <div>
                // <h2>Lobby de Usuarios</h2>
                //     <div>
                //         <h3>Usuarios Conectados</h3>
                //         <ul>
                //             {users.map((user, index) => (
                //                 <li key={index}>{user}</li>
                //             ))}
                //         </ul>
                //     </div>
                // </div>
            }
        />
    );
};

export default MultiplayerLobby;