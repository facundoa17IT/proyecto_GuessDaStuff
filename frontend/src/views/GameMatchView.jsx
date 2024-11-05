/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import GuessPhrase from './game-modes/GuessPhrase';
import OrderWord from './game-modes/OrderWord';
import CircleTimer from '../components/ui/CircleTimer';
import MultipleChoice from './game-modes/MultipleChoice';

import { FaRegQuestionCircle } from "react-icons/fa";

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import axiosInstance from '../utils/AxiosConfig';

const GameMatchView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { initGameModes, setInitGameModes, idGameSingle, setIdGameSingle, setIsCorrectAnswer, answer } = useContext(LoadGameContext);

    const [currentHeader, setCurrentHeader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(null);
    const TIME = 30;
    const [timeRemaining, setTimeRemaining] = useState(TIME);

    const [isGameReady, setIsGameReady] = useState(false);

    const [hints, setHints] = useState([]);
    const [currentHintIndex, setCurrentHintIndex] = useState(0);
    const [hintCounter, setHintCounter] = useState(3);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(true);

    useEffect(() => {
        setGameContent(null);  // Limpia el contenido del juego antes de iniciar
        setIsCorrectAnswer(null);
    }, []);

    useEffect(() => {
        if(answer){
            console.log("Answer -> "+ answer);
            sendAnswerData(answer);
        }
    }, [answer]);

    useEffect(() => {
        if (currentGameIndex !== null) console.log("Current Game Index -> " + currentGameIndex);
    }, [currentGameIndex]);

    // Actualizamos el contenido del juego cada vez que cambie el índice
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setGameContent(renderGame());
        }
    }, [currentGameIndex, initGameModes]);

    useEffect(() => {
        // Se inicia el timer cuando el contenido del juego ya esta cargado en pantalla
        if (gameContent) {
            setIsGameReady(true);
        }
    }, [gameContent]);

    useEffect(() => {
        // Se inicia el timer cuando el contenido del juego ya esta cargado en pantalla
        if (isGameReady) {
            setCurrentGameIndex(0);
            console.log("Inicia el juego!");
        }
    }, [isGameReady]);

    const sendAnswer = async (idGameSingle, userId, answer, gameId, time) => {
        try {
            // Log de cada parámetro para depuración
            console.log("idGameSingle:", idGameSingle);
            console.log("userId:", userId);
            console.log("answer:", answer);
            console.log("gameId:", gameId);
            console.log("time:", time);
    
            // Realiza la solicitud POST con axios
            const response = await axiosInstance.post("/game-single/v1/play-game", {
                idGameSingle: idGameSingle,
                idUser: userId,
                response: answer,
                idGame: gameId,
                time_playing: time
            });
    
            // Log de la respuesta de la solicitud
            console.log("response:", response.data);

            // Se define si la respuesta es correcta o no (true o false)
            setIsCorrectAnswer(response.data);
            return response.data;
        } catch (error) {
            console.error("Error:", error);
        }
    };    

    const sendAnswerData = async (answer) => {
        try {
            const gameKeys = Object.keys(initGameModes);
            const currentGameKey = gameKeys[currentGameIndex];
            const gameInfo = initGameModes[currentGameKey].infoGame[0];
            const { id } = gameInfo;
            await sendAnswer(idGameSingle, "123", answer, id, 20); // user id & time hardcoded
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleCorrectAnswer = () => {
        console.log("Respuesta correcta!!");
        setHints([]);
        setIsCorrectAnswer(null);
        setTimeRemaining(TIME);
        setCurrentGameIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= Object.keys(initGameModes).length) {
                console.log("Fin del juego!");
                // se podria enviar al jugador a la pantalla de inicio
                return prevIndex; // No cambiar el índice si hemos terminado
            }
            return nextIndex; // Cambiar al siguiente juego
        });
    };

    const handleNextGameMode = () => {
        setCurrentGameIndex(prevIndex => {
            const gameKeys = Object.keys(initGameModes);
            if (prevIndex + 1 >= gameKeys.length) {
                setGameContent(null);
                setCurrentGameIndex(null);
                console.log("Fin del juego!");
                setTimeout(() => {
                    navigate('/start-game');
                }, 200); // Breve retraso para asegurarse de que el contenido se haya limpiado
                return prevIndex;
            }
            setIsCorrectAnswer(null);
            setHints([]);
            return prevIndex + 1;
        });
        setTimeRemaining(TIME);
    }

    const showNextHint = () => {
        if (initGameModes && currentGameIndex < Object.keys(initGameModes).length && hintButtonEnabled) {
            const gameKeys = Object.keys(initGameModes);
            const currentGameKey = gameKeys[currentGameIndex];
            const gameInfo = initGameModes[currentGameKey].infoGame[0]; // Asignamos de nuevo después de vaciar

            const { idModeGame } = gameInfo;

            switch (idModeGame) {
                case 'OW':
                case 'GP':
                case 'MC':
                    setHints([gameInfo.hint1, gameInfo.hint2, gameInfo.hint3]);
                    break;
                default:
            }
            // Actualiza el índice de la pista
            setCurrentHintIndex((prevIndex) => {
                if (prevIndex < hints.length - 1) {
                    return prevIndex + 1;
                }
                return prevIndex;
            });

            // Actualiza el contador de pistas
            setHintCounter((prevCounter) => {
                if (prevCounter > 1) {
                    return prevCounter - 1;
                } else {
                    setHintButtonEnabled(false); // Desactiva el botón al llegar a cero
                    return 0;
                }
            });
        }
    };

    const renderHint = () => {
        return (
            <>
                {hints.length > 0 ? (
                    <h3>{hints[currentHintIndex]}</h3>
                ) : (
                    <h3>¡Apurate!</h3>
                )}
            </>
        );
    }

    const renderHintButton = () => (
        <>
            <button
                onClick={showNextHint}
                disabled={!hintButtonEnabled}
            >
                <FaRegQuestionCircle name="help-outline" size={50} color={hintButtonEnabled ? "var(--backround-color)" : "gray"} />
            </button>
            <p>{hintButtonEnabled ? hintCounter : 0}</p>
        </>
    );

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
                    GameComponent = <OrderWord OWinfo={gameInfo} onCorrect={handleCorrectAnswer}/>;
                    break;
                case 'GP':
                    setCurrentHeader("Adivina la Frase");
                    GameComponent = <GuessPhrase GPinfo={gameInfo} onCorrect={handleCorrectAnswer}/>;
                    break;
                case 'MC':
                    setCurrentHeader("Multiple Opcion");
                    GameComponent = <MultipleChoice MCinfo={gameInfo} onCorrect={handleCorrectAnswer}/>;
                    break;
                default:
                    GameComponent = <p>Modo de juego no reconocido.</p>;
            }

            return (
                <div>
                    {GameComponent}
                </div>
            );
        } else {
            return <p>El juego aún no está disponible.</p>;
        }
    };

    return (
        <MainGameLayout
            canGoBack={false}
            leftHeader='Pistas'
            leftContent={
                <>
                    {renderHint()}
                    {renderHintButton()}
                </>
            }
            middleHeader={currentHeader}
            middleContent={gameContent}
            rightHeader='Stats'
            rightContent={
                <CircleTimer
                    key={currentGameIndex} // El timer se reinicia cada vez que se cambia el index
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
