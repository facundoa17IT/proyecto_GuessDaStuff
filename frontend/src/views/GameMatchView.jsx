/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import GuessPhrase from './game-modes/GuessPhrase';
import OrderWord from './game-modes/OrderWord';
import CircleTimer from '../components/ui/CircleTimer';
import MultipleChoice from './game-modes/MultipleChoice';
import BrainCharacter from '../components/ui/BrainCharacter';
import { ScaleLoader } from 'react-spinners';
import MultiplayerHUD from '../components/layouts/MultiplayerHUD';
import Modal from '../components/layouts/Modal';

/** Assets */
import { FaRegQuestionCircle } from "react-icons/fa";

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import { useRole } from '../contextAPI/AuthContext'
import { SocketContext } from '../contextAPI/SocketContext';

const GameMatchView = () => {
    const navigate = useNavigate();

    const { implementationGameBody, setImplementationGameBody, setInvitation, setInvitationCount, unsubscribeFromGameSocket } = useContext(SocketContext);
    const { gameId, setGameId, initGameModes, setInitGameModes, isCorrectAnswer, setIsCorrectAnswer, answer, isMultiplayer, setIsMultiplayer } = useContext(LoadGameContext);
    const { userId } = useRole();  // Access the setRole function from the context

    const [currentHeader, setCurrentHeader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(null);
    const TIME = 30;
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(TIME);
    const [isTimePlaying, setIsTimePlaying] = useState(false);

    const [isGameReady, setIsGameReady] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const [hints, setHints] = useState([]);
    const [currentHintIndex, setCurrentHintIndex] = useState(null);
    const [hintCounter, setHintCounter] = useState(3);
    const [hintButtonEnabled, setHintButtonEnabled] = useState(true);

    const [characterDialogue, setCharacterDialogue] = useState("");

    // Almacena username, userId, email
    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const [currentGameModeId, setCurrentGameModeId] = useState(null);

    const [winner, setWinner] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const host = JSON.parse(localStorage.getItem("host")) || "Undefined";
    const guest = JSON.parse(localStorage.getItem("guest")) || "Undefined";

    useEffect(() => {
        resetGameState();
    }, []);

    useEffect(() => {
        if (isCorrectAnswer) {
            console.log("Answer -> " + answer);
            sendAnswerData(answer);
        }
    }, [isCorrectAnswer]);

    useEffect(() => {
        setCharacterDialogue(hints[currentHintIndex]);
    }, [currentHintIndex]);

    /*useEffect(() => {
        if(elapsedTime){
            console.log("Tiempo transcurrido -> "+ elapsedTime);
        }
    }, [elapsedTime]);*/

    // initGameModes se obtiene de la pantala SingleGameLobby
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setCurrentGameIndex(0);
        }
        console.log(initGameModes);
    }, [initGameModes]);

    // solo para multiplayer
    useEffect(() => {
        if (implementationGameBody) {
            if (implementationGameBody.status === "FINISH_ROUND") {
                if (implementationGameBody.is_win) {
                    setIsTimePlaying(false);
                    setIsModalOpen(true);
                    if (implementationGameBody.idUserWin == host.userId) {
                        setWinner(host.username);
                        console.log("Ganador: " + host.username);
                    }
                    else {
                        setWinner(guest.username);
                        console.log("Ganador: " + guest.username);
                    }
                    console.log("Ganador Id: " + implementationGameBody.idUserWin);
                }
                else {
                    console.log("EMPATE!");
                }
                handleNextGameMode();
                console.log("FINISH ROUND!");
            }
        }
    }, [implementationGameBody]);

    // Se actualiza el contenido del juego cada vez que cambie el índice
    useEffect(() => {
        if (currentGameIndex >= 0) {
            setGameContent(renderGame());
        }
    }, [currentGameIndex]);

    // Se inicia el timer cuando el contenido del juego ya esta cargado en pantalla
    // Se inicia el timer cuando el se asigna el index 0
    useEffect(() => {
        if (gameContent && currentGameIndex === 0) {
            setIsGameReady(true);
        }
    }, [gameContent]);

    // Se inicia el timer cuando el contenido del juego ya esta cargado en pantalla
    useEffect(() => {
        if (isGameReady) {
            defaultCharacterDialogue();
            console.log("Inicia el juego!");
            setIsTimePlaying(true);
        }
    }, [isGameReady]);

    const defaultCharacterDialogue = () => {
        setCharacterDialogue("Puedo darte una pista!");
    }

    const sendAnswerData = async (answer) => {
        try {
            const gameKeys = Object.keys(initGameModes);
            const currentGameKey = gameKeys[currentGameIndex];
            const gameInfo = initGameModes[currentGameKey].infoGame[0];
            const { id } = gameInfo;
            await sendAnswer(userId, answer, gameId, id, elapsedTime);
        } catch (error) {
            console.log("Error", error);
        }
    };

    // Guarda en la BD el ganador
    // le avisa a los demas usuarios que el juego termino
    const sendAnswer = async (userId, answer, gameId, gameModeId, time) => {
        try {
            // Log de cada parámetro para depuración
            console.log("userId:", userId);
            console.log("answer:", answer);
            console.log("gameId:", gameId);
            console.log("gameModeId:", gameModeId);
            console.log("time:", time);

            if (isMultiplayer) {
                await axiosInstance.post(`/game-multi/game/${gameId}/play/`, {
                    idUserWin: userId,
                    idGameMulti: gameId,
                    idGame: gameModeId,
                    time_playing: time
                });
            }
            else {
                await axiosInstance.post("/game-single/v1/play-game", {
                    idGameSingle: gameId,
                    idUser: userId,
                    response: answer,
                    idGame: gameModeId,
                    time_playing: time
                });
            }
        } catch (error) {
            console.error("Error:", error);
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
        setGameContent(renderGame());
        resetGameState();
        const gameKeys = Object.keys(initGameModes);
        const nextIndex = currentGameIndex + 1;

        if (nextIndex >= gameKeys.length) {
            handleFishGame();
            return;
        }

        setTimeout(() => {
            setIsModalOpen(false);
            defaultCharacterDialogue();
            setCurrentGameIndex(nextIndex);
            setIsTimePlaying(true);
        }, 3000); // 3000 ms para esperar 3 segundos adicionales
    };

    const handleTimerComplete = async () => {
        try {
            axiosInstance.post(`/game-multi/game/${gameId}/finish/${currentGameModeId}`);
            handleNextGameMode();
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleFishGame = async () => {
        try {
            setTimeout(() => {
                setIsModalOpen(false);
            }, 3000); // 3000 ms para esperar 3 segundos adicionales

            console.log("Fin del juego!");
            setInitGameModes({});
            setIsGameFinished(true);
            setCurrentHeader("Partida Finalizada");
            setGameContent(renderFinishGameStats());

            if (isMultiplayer) {
                setImplementationGameBody(null);
                setInvitationCount(0);
                setInvitation(null);
                unsubscribeFromGameSocket();
                setIsMultiplayer(false);
                axiosInstance.post(`/game-multi/game/${gameId}/finish/0`);
            }
            else {
                axiosInstance.post(`/game-single/v1/finish-play-game/${gameId}`);
            }
            localStorage.removeItem("host");
            localStorage.removeItem("guest");
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
                style={{ width: 'fit-content' }}
                onClick={showNextHint}
                disabled={!hintButtonEnabled}
            >
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <FaRegQuestionCircle style={{ marginRight: "5px" }} name="help-outline" size={30} color={hintButtonEnabled ? "" : "gray"} />Ayuda
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

                setCurrentGameModeId(idModeGame);

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
                        setCurrentHeader("Multiple Opcion");
                        GameComponent = <MultipleChoice MCinfo={gameInfo} />;
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
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                        <h1>Cargando Partida</h1>
                        <ScaleLoader color="var(--link-color)" height={30} width={15} loading={true} />
                    </div>
                );
            }
        }
    };

    const renderFinishGameStats = () => {
        return (
            <>
                <h2>Resumen de la partida</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Modos de Juego</th>
                            <th>Categorías</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Modo 1</td>
                            <td>Categoría 1</td>
                        </tr>
                        <tr>
                            <td>Modo 2</td>
                            <td>Categoría 2</td>
                        </tr>
                        <tr>
                            <td>Modo 3</td>
                            <td>Categoría 3</td>
                        </tr>
                    </tbody>
                </table>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Puntaje Total</th>
                            <th>Duración Total</th>
                            <th>Posición Ranking</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0</td>
                            <td>0</td>
                            <td>0</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => navigate("/")}>Menu Principal</button>
            </>
        );
    }

    return (
        <>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={isGameFinished}
                hideRightPanel={isGameFinished}
                leftHeader='Pistas'
                leftContent={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <BrainCharacter rerenderKey={characterDialogue} autoStart={isGameReady} words={characterDialogue} />
                        {renderHintButton()}
                    </div>
                }
                middleHeader={currentHeader}
                middleContent={gameContent}
                rightHeader='Stats'
                rightContent={
                    <>
                        {isMultiplayer && <MultiplayerHUD />}
                        <h3 style={{ marginBottom: '0' }}>Ronda {currentGameIndex + 1}</h3>
                        <p>Pistas disponibles: {hintButtonEnabled ? hintCounter : 0}</p>
                        {!isGameFinished && <CircleTimer
                            key={currentGameIndex} // El timer se reinicia cada vez que se cambia el index
                            isLooping={true}
                            loopDelay={0.5}
                            isPlaying={isTimePlaying}
                            duration={timeRemaining}
                            onTimeUpdate={handleTimeUpdate}
                            onTimerComplete={handleTimerComplete}
                        />}
                        <button onClick={handleNextGameMode}>Next Round</button>
                    </>
                }
            />

            <Modal showModal={isModalOpen} hideConfirmBtn={true} hideCloseBtn={true} title="Ronda Finalizada">
                {winner && <h2>"{winner}" es el ganador de la ronda!</h2>}
                <h3>Preparate para la siguiente ronda!</h3>
            </Modal>
        </>
    );
};

export default GameMatchView;
