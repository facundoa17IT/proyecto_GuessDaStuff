import React, { useEffect, useState ,useContext} from 'react';
import MainGameLayout from '../components/layouts/MainGamelayout';
import { SocketContext } from '../contextAPI/SocketContext';


const MultiplayerLobby = () => {

    const { users } = useContext(SocketContext);

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader=""
            middleContent={
                <div>
                <h2>Lobby de Usuarios</h2>
                    <div>
                        <h3>Usuarios Conectados</h3>
                        <ul>
                            {users.map((user, index) => (
                                <li key={index}>{user}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        />
    );
};

export default MultiplayerLobby;