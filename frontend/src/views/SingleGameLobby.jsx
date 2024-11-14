/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import { BarLoader } from 'react-spinners';

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
    const [isLoading, setIsLoading] = useState(true);

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
        if (Object.keys(initGameBody).length > 0) {
            initializeGameModes();
            console.log(`Slot: ${JSON.stringify(initGameBody, null, 2)}`);
        }
    }, [initGameBody]);

    // Se da comienzo a la partida
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0 && Object.keys(idGameSingle).length > 0) {
            initPlayGame(idGameSingle);
        }
    }, [initGameModes, idGameSingle]);

    // Setea horario de inicio de partida y devuelve true
    const initPlayGame = async (idGameSingle) => {
        try {
            axiosInstance.post(`/game-single/v1/init-play-game/${idGameSingle}`);
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

export default SingleGameLobby;
