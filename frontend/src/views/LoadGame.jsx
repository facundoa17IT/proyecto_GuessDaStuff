/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import { BarLoader } from 'react-spinners';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';
import { PUBLIC_ROUTES } from '../utils/constants';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import { SocketContext } from '../contextAPI/SocketContext';

const LoadGame = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { initGameBody } = location.state || {};

    const { initGameModes, setInitGameModes, gameId, setGameId, isMultiplayer } = useContext(LoadGameContext);
    const { implementationGameBody } = useContext(SocketContext);

    const [isLoading, setIsLoading] = useState(true);

    // Multiplayer
    const initializeMultiplayerGame = () => {
        if (implementationGameBody.status === "INVITE_IMPLEMENTATION") {
            console.log("INVITE_IMPLEMENTATION");

            setGameId(implementationGameBody.implementGame.idGameMulti);
            setInitGameModes(implementationGameBody.implementGame.gameModes);
        }
    }
    useEffect(() => {
        if (isMultiplayer) {
            if (Object.keys(implementationGameBody).length > 0) {
                initializeMultiplayerGame();
            }
        }
    }, [implementationGameBody]); // Este valor se actualiza luego de ejecutar SlotMachineMulti (multiplayer)

    // Singleplayer
    const initializeSingleplayerGame = async () => {
        try {
            const response = await axiosInstance.post("/game-single/v1/init-game", initGameBody, { requiresAuth: true });
            setInitGameModes(response.data.gameModes);
            setGameId(response.data.idGameSingle);
        } catch (error) {
            console.error('Error obteniendo datos del juego:', error);
        }
    };
    useEffect(() => {
        if (!isMultiplayer) {
            if (Object.keys(initGameBody).length > 0) {
                initializeSingleplayerGame();
                // console.log(`Slot: ${JSON.stringify(initGameBody, null, 2)}`);
            }
        }
    }, [initGameBody]); // Este valor se actualiza luego de ejecutar SlotMachine (singleplayer)

    // Se da comienzo a la partida
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0 && gameId !== null) {
            initPlayGame(gameId);
        }
    }, [initGameModes, gameId]);

    const initPlayGame = async (gameId) => {
        try {
            // Setea horario de inicio de partida y devuelve true
            if (!isMultiplayer) {
                axiosInstance.post(`/game-single/v1/init-play-game/${gameId}`);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!isLoading) {
            setTimeout(() => {
                navigate(PUBLIC_ROUTES.INIT_GAME);
            }, 1500);
        }
    }, [isLoading]);

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={true}
            hideRightPanel={true}
            middleHeader={""}
            middleContent={
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                    <h1>Cargando Partida</h1>
                    <BarLoader color="var(--link-color)" height={20} width={250} loading={true} />
                </div>
            }
        />
    );
};

export default LoadGame;
