/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axiosInstance from '../AxiosConfig';
/** Main Layout **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import GuessPhrase from '../components/ui/GuessPhrase';
import OrderWord from '../components/ui/OrderWord';

const GameMatchView = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Hook para navegación
    const { initGameBody } = location.state || {};
    const { initGameData, setinitGameData } = useContext(LoadGameContext);

    const [currentHeader, setCurrentheader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(7); // Tiempo de 7 segundos para cada fase

    useEffect(() => {
        // Log de salida en el formato deseado
        console.log(JSON.stringify(initGameBody, null, 2));
        axiosInstance.post("/api/user/game/initGame", initGameBody)
            .then(response => {
                setinitGameData(response.data.gameModes);
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
    }, [initGameBody]);

    useEffect(() => {
        if (Object.keys(initGameData).length > 0) {
            console.log(initGameData);
            const interval = setInterval(() => {
                setCurrentGameIndex(prevIndex => {
                    const gameKeys = Object.keys(initGameData);

                    // Si hemos pasado por todas las fases, navegamos a StartGame
                    if (prevIndex + 1 >= gameKeys.length) {
                        clearInterval(interval); 
                        navigate('/start-game'); 
                        return prevIndex; 
                    }

                    return (prevIndex + 1) % gameKeys.length; // Cambia al siguiente juego
                });

                setTimeRemaining(7); // Resetea el temporizador
            }, 7000); // Cambia cada 7 segundos

            return () => clearInterval(interval); // Limpia el intervalo al desmontar
        }
    }, [initGameData, navigate]);

    useEffect(() => {
        let timer;
        if (timeRemaining > 0) {
            timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
        } else {
            // Cuando el tiempo se acabe, pasa al siguiente juego
            setCurrentGameIndex(prevIndex => {
                const gameKeys = Object.keys(initGameData);
                if (prevIndex + 1 >= gameKeys.length) {
                    navigate('/start-game'); // Navega a StartGame.jsx
                    return prevIndex; // Mantener el índice en el último valor
                }
                return (prevIndex + 1) % gameKeys.length; // Cambia al siguiente juego
            });
        }

        return () => clearTimeout(timer);
    }, [timeRemaining, navigate, initGameData]);

    useEffect(() => {
        if (Object.keys(initGameData).length > 0) {
            setGameContent(renderGame());
        }
    }, [currentGameIndex, initGameData]);

    const renderGame = () => {
        if (initGameData) {
            const gameKeys = Object.keys(initGameData);
            const currentGameKey = gameKeys[currentGameIndex]; // Cambia dinámicamente
            const gameInfo = initGameData[currentGameKey].infoGame[0];

            if (gameInfo) {
                const { idModeGame } = gameInfo;
                let GameComponent;

                switch (idModeGame) {
                    case 'OW':
                        setCurrentheader("Ordena la Palabra");
                        GameComponent = <OrderWord OWinfo={gameInfo}/>;
                        break;
                    case 'GP':
                        setCurrentheader("Adivina la Frase");
                        GameComponent = <GuessPhrase GPinfo={gameInfo}/>;
                        break;
                    case 'OBD':
                        setCurrentheader("Ordenar por Fecha");
                        GameComponent = <p>hola.</p>;
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
                return <p>Aún no fue implementado.</p>;
            }
        } else {
            return <p>Juego terminado. Volviendo a inicio...</p>;
        }
    };

    return (
        <MainGameLayout
            canGoBack={false}
            middleHeader={currentHeader}
            middleContent={gameContent}
        />
    );
};

export default GameMatchView;
