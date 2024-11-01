import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate
import axiosInstance from '../AxiosConfig';
import MainGameLayout from '../components/layouts/MainGamelayout';
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import GuessPhrase from '../components/ui/GuessPhrase';
import OrderWord from '../components/ui/OrderWord';

const GameMatchView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { initGameBody } = location.state || {};
    const { initGameData, setinitGameData } = useContext(LoadGameContext);

    const [currentHeader, setCurrentheader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(7); // Tiempo de 7 segundos para cada fase

  
    // Llamada a la API para obtener los datos del juego
    useEffect(() => {
        console.log(JSON.stringify(initGameBody, null, 2));
        setGameContent(null);  // Limpia el contenido del juego antes de iniciar
        setCurrentGameIndex(0); // Reinicia el índice del juego
        setTimeRemaining(7);    // Reinicia el temporizador
        
        axiosInstance.post("/api/user/game/initGame", initGameBody)
            .then(response => {
                setinitGameData(response.data.gameModes); // Guarda los modos de juego
            })
            .catch(error => {
                console.error('Error obteniendo datos del juego:', error);
            });
    }, [initGameBody, setinitGameData]);

    // Manejamos el cambio de fases de juego cada 7 segundos
    useEffect(() => {
        if (Object.keys(initGameData).length > 0) {
            const interval = setInterval(() => {
                setCurrentGameIndex(prevIndex => {
                    const gameKeys = Object.keys(initGameData);

                    // Si hemos mostrado todos los juegos, redirigimos a StartGame
                    if (prevIndex + 1 >= gameKeys.length) {
                        clearInterval(interval); // Limpiar el intervalo
                        navigate('/start-game'); // Navegación al final
                        return prevIndex; // Mantenemos el índice en el último valor
                    }

                    return prevIndex + 1; // Cambiamos al siguiente juego
                });

                setTimeRemaining(7); // Reiniciamos el temporizador a 7 segundos
            }, 7000); // Cambio de fase cada 7 segundos

            return () => clearInterval(interval); // Limpiar el intervalo al desmontar
        }
    }, [initGameData, navigate]);

    // Manejamos el temporizador de cada fase
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 7000);
            return () => clearTimeout(timer); // Limpiamos el temporizador
        } else {
            setCurrentGameIndex(prevIndex => {
                const gameKeys = Object.keys(initGameData);
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
    }, [timeRemaining, initGameData, navigate]);

    // Actualizamos el contenido del juego cada vez que cambie el índice
    useEffect(() => {
        if (Object.keys(initGameData).length > 0) {
            setGameContent(renderGame());
        }
    }, [currentGameIndex, initGameData]);

    // Renderizar el juego basado en el índice actual
    const renderGame = () => {
        const gameKeys = Object.keys(initGameData);
        const currentGameKey = gameKeys[currentGameIndex];
        const gameInfo = initGameData[currentGameKey]?.infoGame[0]; // Asegúrate de que gameInfo exista

        if (gameInfo) {
            const { idModeGame } = gameInfo;
            let GameComponent;

            // Cambiamos el componente según el modo de juego
            switch (idModeGame) {
                case 'OW':
                    setCurrentheader("Ordena la Palabra");
                    GameComponent = <OrderWord OWinfo={gameInfo} />;
                    break;
                case 'GP':
                    setCurrentheader("Adivina la Frase");
                    GameComponent = <GuessPhrase GPinfo={gameInfo} />;
                    break;
                case 'OBD':
                    setCurrentheader("Ordenar por Fecha");
                    GameComponent = <p>Componente para ordenar por fecha no implementado.</p>;
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
        />
    );
};

export default GameMatchView;
