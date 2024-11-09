/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import GuessPhrase from './game-modes/GuessPhrase';
import OrderWord from './game-modes/OrderWord';
import CircleTimer from '../components/ui/CircleTimer';
import MultipleChoice from './game-modes/MultipleChoice';
import BrainCharacter from '../components/ui/BrainCharacter';

/** Assets */
import { FaRegQuestionCircle } from "react-icons/fa";

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import { useRole } from '../contextAPI/AuthContext'

const GameMatchView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { initGameModes, setInitGameModes, idGameSingle, setIdGameSingle, setIsCorrectAnswer, answer } = useContext(LoadGameContext);
    const { userId } = useRole();  // Access the setRole function from the context

    const [currentHeader, setCurrentHeader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(null);
    const TIME = 30;
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(TIME);

    const [isGameReady, setIsGameReady] = useState(false);
    const [isGameFinished, setisGameFinished] = useState(false);

    const [hints, setHints] = useState([]);
    const [currentHintIndex, setCurrentHintIndex] = useState(null);
    const [hintCounter, setHintCounter] = useState(3);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(true);

    const [characterDialogue, setCharacterDialogue] = useState("");

    useEffect(() => {
        resetGameState();
    }, []);

    useEffect(() => {
        if (answer) {
            console.log("Answer -> " + answer);
            sendAnswerData(answer);
        }
    }, [answer]);

    useEffect(() => {
        setCharacterDialogue(hints[currentHintIndex]);
    }, [currentHintIndex]);

    // useEffect(() => {
    //     if(elapsedTime){
    //         console.log("Tiempo transcurrido -> "+ elapsedTime);
    //     }
    // }, [elapsedTime]);

    // initGameModes se obtiene de la pantala SingleGameLobby
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setCurrentGameIndex(0);
        }
    }, [initGameModes]);

    // Actualizamos el contenido del juego cada vez que cambie el índice
    useEffect(() => {
        setGameContent(renderGame());
        if (currentGameIndex === 0) setIsGameReady(true); // Se inicia el timer cuando el se asigna el index 0
    }, [currentGameIndex]);

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
            defaultCharacterDialogue();
            console.log("Inicia el juego!");
        }
    }, [isGameReady]);

    const defaultCharacterDialogue = () => {
        setCharacterDialogue("Puedo darte una pista!");
    }

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
            await sendAnswer(idGameSingle, userId, answer, id, elapsedTime); // time hardcoded
        } catch (error) {
            console.log("Error", error);
        }
    };

    const resetGameState = () => {
        setHints([]);
        setIsCorrectAnswer(null);
        setElapsedTime(0);
    };

    const handleTimeUpdate = (time) => {
        setElapsedTime(time); // Actualiza el tiempo transcurrido
    };

    const handleNextGameMode = () => {
        resetGameState();
        const gameKeys = Object.keys(initGameModes);
        const nextIndex = currentGameIndex + 1;

        if (nextIndex >= gameKeys.length) {
            handleFishGame();
            return;
        }
        defaultCharacterDialogue();
        setCurrentGameIndex(nextIndex);
    };

    const handleFishGame = async () => {
        try {
            const response = axiosInstance.post(`/game-single/v1/finish-play-game/${idGameSingle}`);
            console.log(response.data);
            console.log("Fin del juego!");
            setInitGameModes({});
            setisGameFinished(true);
            setCurrentHeader("Partida Finalizada");
            setGameContent(renderFinishGameStats());
        } catch (error) {
            console.error(error);
        }
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

            setCurrentHintIndex((prevIndex) => {
                // Si es la primera interacción (está en null), lo pasamos a 0
                if (prevIndex === null) {
                    return 0;
                }
                // Incrementa el índice si no estamos en la última pista
                if (prevIndex < hints.length - 1) {
                    return prevIndex + 1;
                }
                // Si estamos en la última pista, mantenemos el índice
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

    const renderHintButton = () => (
        <div>
            <button
            style={{width:'fit-content'}}
                onClick={showNextHint}
                disabled={!hintButtonEnabled}
            >
                <span style={{display:"flex", justifyContent:"center", alignItems:"center"}}>

                <FaRegQuestionCircle style={{marginRight:"5px"}} name="help-outline" size={30} color={hintButtonEnabled ? "" : "gray"} />Ayuda
                </span>
            </button>
        </div>
    );

    // Renderizar el juego basado en el índice actual
    const renderGame = () => {
        const gameKeys = Object.keys(initGameModes);
        const currentGameKey = gameKeys[currentGameIndex];
        const gameInfo = initGameModes[currentGameKey]?.infoGame[0]; // Asegúrate de que gameInfo exista

        if (!isGameFinished) {
            if (gameInfo) {
                const { idModeGame } = gameInfo;
                let GameComponent;

                // Cambiamos el componente según el modo de juego
                switch (idModeGame) {
                    case 'OW':
                        setCurrentHeader("Ordena la Palabra");
                        GameComponent = <OrderWord OWinfo={gameInfo} onCorrect={handleNextGameMode} />;
                        break;
                    case 'GP':
                        setCurrentHeader("Adivina la Frase");
                        GameComponent = <GuessPhrase GPinfo={gameInfo} onCorrect={handleNextGameMode} />;
                        break;
                    case 'MC':
                        setCurrentHeader("Multiple Opcion");
                        GameComponent = <MultipleChoice MCinfo={gameInfo} onCorrect={handleNextGameMode} />;
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
        }
    };

    const renderFinishGameStats = () => {
        return (
            <>
                <h2>Resumen de la partida</h2>
                <p>Sin contenido actual</p>
                <button onClick={() => navigate("/")}>Menu Principal</button>
            </>
        );
    }

    return (
        <MainGameLayout
            canGoBack={false}
            hideLeftPanel={isGameFinished}
            hideRightPanel={isGameFinished}
            leftHeader='Pistas'
            leftContent={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <BrainCharacter key={characterDialogue} autoStart={isGameReady} words={characterDialogue} />
                    {renderHintButton()}
                </div>
            }
            middleHeader={currentHeader}
            middleContent={gameContent}
            rightHeader='Stats'
            rightContent={
                <>
                    <h3>Ronda {currentGameIndex + 1}</h3>
                    <p>Pistas disponibles: {hintButtonEnabled ? hintCounter : 0}</p>
                    {!isGameFinished && <CircleTimer
                        key={currentGameIndex} // El timer se reinicia cada vez que se cambia el index
                        isLooping={true}
                        loopDelay={0.5}
                        isPlaying={isGameReady}
                        duration={timeRemaining}
                        onTimeUpdate={handleTimeUpdate}
                        onTimerComplete={handleNextGameMode}
                    />}
                </>
            }
        />
    );
};

export default GameMatchView;
