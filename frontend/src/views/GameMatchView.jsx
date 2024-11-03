/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import GuessPhrase from './game-modes/GuessPhrase';
import OrderWord from './game-modes/OrderWord';
import CircleTimer from '../components/ui/CircleTimer';
import MultipleChoice from './game-modes/MultipleChoice';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';
import { logObject } from '../utils/Helpers';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const GameMatchView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { initGameBody } = location.state || {};
    const { initGameModes, setInitGameModes } = useContext(LoadGameContext);

    const [currentHeader, setCurrentHeader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(7); // Tiempo de 7 segundos para cada fase

    const [isGameReady, setIsGameReady] = useState(false);

    useEffect(() => {
        setGameContent(null);  // Limpia el contenido del juego antes de iniciar
        setCurrentGameIndex(0); // Reinicia el índice del juego
        setTimeRemaining(7);    // Reinicia el temporizador
    }, []);


    const initializeGameModes = async () => {
        try {
            console.log(JSON.stringify(initGameBody, null, 2));
            logObject(initGameBody);

            // Execute the POST request without storing the response
            const response = await axiosInstance.post("/game-single/v1/init-game", initGameBody, { requiresAuth: true });

            // If the request is successful, save the game modes
            setInitGameModes(response.data.gameModes);
        } catch (error) {
            console.error('Error obteniendo datos del juego:', error);
            // Optionally, you can provide user feedback here
            alert('Ocurrió un error al inicializar el juego. Por favor, inténtalo de nuevo.');
        }
    };
    useEffect(() => {
        initializeGameModes();
    }, [initGameBody]);
    

    // Actualizamos el contenido del juego cada vez que cambie el índice
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setGameContent(renderGame());
        }
    }, [currentGameIndex, initGameModes]);

    // Se inicia el timer cuando el contenido del juego ya esta cargado en pantalla
    useEffect(() => {
        if (gameContent) {
            setIsGameReady(true);
        }
    }, [currentGameIndex, initGameModes]);

    const handleNextGameMode = () => {
        setCurrentGameIndex(prevIndex => {
            const gameKeys = Object.keys(initGameModes);
            if (prevIndex + 1 >= gameKeys.length) {
                setGameContent(null); // Limpia el contenido antes de navegar
                setTimeout(() => {
                    navigate('/start-game'); // Navegación después de limpiar
                }, 200); // Breve retraso para asegurarse de que el contenido se haya limpiado
                return prevIndex;
            }
            return prevIndex + 1;
        });
        setTimeRemaining(7); // Reiniciar el tiempo a 7 segundos
    }

    // Renderizar el juego basado en el índice actual
    const renderGame = () => {
        const gameKeys = Object.keys(initGameModes);
        const currentGameKey = gameKeys[currentGameIndex];
        const gameInfo = initGameModes[currentGameKey]?.infoGame[0]; // Asegúrate de que gameInfo exista

        if (gameInfo) {
            const { idModeGame } = gameInfo;
            let GameComponent;

            // Cambiamos el componente según el modo de juego
            switch (idModeGame) {
                case 'OW':
                    setCurrentHeader("Ordena la Palabra");
                    GameComponent = <OrderWord OWinfo={gameInfo} />;
                    break;
                case 'GP':
                    setCurrentHeader("Adivina la Frase");
                    GameComponent = <GuessPhrase GPinfo={gameInfo} />;
                    break;
                case 'MC':
                    setCurrentHeader("Multiple opcion");
                    GameComponent = <MultipleChoice MCinfo={gameInfo} />;
                    break;
                default:
                    GameComponent = <p>Modo de juego no reconocido.</p>;
            }

            return (
                <div>
                    {GameComponent}
                    <p>Tiempo restante: {timeRemaining} segundos</p>
                </div>
            );
        } else {
            return <p>El juego aún no está disponible.</p>;
        }
    };

    return (
        <MainGameLayout
            canGoBack={false}
            middleHeader={currentHeader}
            middleContent={gameContent}
            rightHeader='Stats'
            rightContent={
                <CircleTimer
                    isLooping={true}
                    loopDelay={0.5}
                    isPlaying={isGameReady}
                    duration={timeRemaining}
                    onTimerComplete={handleNextGameMode}
                />
            }
        />
    );
};

export default GameMatchView;
