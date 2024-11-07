/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Socket **/
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import { BarLoader } from 'react-spinners';
import CustomList from '../components/layouts/CustomList';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';
import { logObject } from '../utils/Helpers';
import { PUBLIC_ROUTES } from '../utils/constants';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const MultiplayerLobby = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [connectedPlayers, setConnectedPlayers] = useState([]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws'); // Cambia la URL según tu configuración
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            console.log('Conectado: ' + frame);

            // Suscribirse al canal de jugadores activos
            stompClient.subscribe('/game/activePlayers', (message) => {
                const players = JSON.parse(message.body);
                setConnectedPlayers(players); // Actualiza la lista de jugadores conectados
            });
        });

        return () => {
            stompClient.disconnect();
        };
    }, []);
    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader={""}
            middleContent={
                // <CustomList
                //         listId={"onlineUsersList"}
                //         //listContent={users}
                //         //getItemLabel={getPlayerName}
                //         buttons={['inviteBtn']}
                //         //onButtonInteraction={handleUsersListInteraction}
                //     />
                <div>
                    <h2>Jugadores Conectados</h2>
                    <ul>
                        {connectedPlayers.map((player, index) => (
                            <li key={index}>{player}</li>
                        ))}
                    </ul>
                </div>
            }
        />
    );
};

export default MultiplayerLobby;