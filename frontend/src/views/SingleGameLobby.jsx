/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import CircleTimer from '../components/ui/CircleTimer';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';
import { logObject } from '../utils/Helpers';
import { PUBLIC_ROUTES } from '../utils/constants';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const SingleGameLobby = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { initGameBody } = location.state || {};
    const { initGameModes, setInitGameModes, idGameSingle, setIdGameSingle } = useContext(LoadGameContext);
    const [isGameReady, setIsGameReady] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(5);

    const initializeGameModes = async () => {
        try {
            const response = await axiosInstance.post("/game-single/v1/init-game", initGameBody, { requiresAuth: true });

            setInitGameModes(response.data.gameModes);
            setIdGameSingle(response.data.idGameSingle);

        } catch (error) {
            console.error('Error obteniendo datos del juego:', error);
        }
    };
    useEffect(() => {
        if (initGameBody) {
            logObject(initGameBody);
            initializeGameModes();
        }
    }, [initGameBody]);

    // Se da comienzo a la partida
    useEffect(() => {
        if (!isGameReady){
            if (initGameModes && idGameSingle) {
                initPlayGame(idGameSingle);
            }
        }
    }, [initGameModes, idGameSingle]);

    // Setea horario de inicio de partida y devuelve true
    const initPlayGame = async (idGameSingle) => {
        try {
            const response = axiosInstance.post(`/game-single/v1/init-play-game/${idGameSingle}`);
            setIsGameReady(true);
        } catch (error) {
            console.error(error);
        }
    }

    const handleTimerComplete = () => {
        navigate(PUBLIC_ROUTES.INIT_GAME);
    }

    return (
        <MainGameLayout
            canGoBack={false}
            middleHeader={"Cargando la partida..."}
            middleContent={<CircleTimer
                isLooping={false}
                loopDelay={0}
                isPlaying={isGameReady}
                duration={timeRemaining}
                onTimerComplete={handleTimerComplete}
            />}
        />
    );
};

export default SingleGameLobby;
