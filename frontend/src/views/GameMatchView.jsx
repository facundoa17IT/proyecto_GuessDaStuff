/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

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
import toast from 'react-hot-toast';
import { ClockLoader } from 'react-spinners';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';
import { GAME_SETTINGS } from '../utils/constants';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import { useRole } from '../contextAPI/AuthContext'
import { SocketContext } from '../contextAPI/SocketContext';

const GameMatchView = () => {
    const navigate = useNavigate();

    const { implementationGameBody, setImplementationGameBody, setInvitation, setInvitationCount, unsubscribeFromGameSocket } = useContext(SocketContext);
    const { gameId, setGameId, initGameModes, setInitGameModes, isCorrectAnswer, setIsCorrectAnswer, answer, isMultiplayer, setIsMultiplayer, hostWinsCount, setHostWinsCount, guestWinsCount, setGuestWinsCount, availibleHints, setAvailableHints } = useContext(LoadGameContext);
    const { userId } = useRole();  // Access the setRole function from the context

    const [currentHeader, setCurrentHeader] = useState('');
    const [gameContent, setGameContent] = useState(null);
    const [currentGameIndex, setCurrentGameIndex] = useState(null);

    const [elapsedTime, setElapsedTime] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(GAME_SETTINGS.TIME);
    const [isTimePlaying, setIsTimePlaying] = useState(false);

    const [isGameReady, setIsGameReady] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);

    const [hints, setHints] = useState([]);
    const [currentHintIndex, setCurrentHintIndex] = useState(null);
    const [hintCounter, setHintCounter] = useState(GAME_SETTINGS.MAX_HINTS);

    const [characterDialogue, setCharacterDialogue] = useState("");
    const [currentCharacterSprite, setCurrentCharacterSprite] = useState('idle');

    const [currentGameModeId, setCurrentGameModeId] = useState(null);
    const [currentGameModeNumericId, setCurrentGameModeNumericId] = useState(null);

    const [winner, setWinner] = useState(null);
    const [finalWinnerId, setFinalWinnerId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const host = JSON.parse(localStorage.getItem("host")) || "Undefined";
    const guest = JSON.parse(localStorage.getItem("guest")) || "Undefined";
    const userObj = JSON.parse(localStorage.getItem("userObj")) || "Undefined";

    const isDesignBreakpoint = useMediaQuery({ query: '(max-width: 1150px)' });
    const isMobile = useMediaQuery({ query: '(max-width: 535px)' });

    useEffect(() => {
        if (hintCounter === 0) {
            setAvailableHints(false); // Desactiva el botón al llegar a cero
            setCharacterDialogue("No hay mas pistas disponibles!");
            console.log("NO HAY MAS PISTAS! -> " + hintCounter);
        }
    }, [hintCounter]);

    useEffect(() => {
        resetGameState();
        setAvailableHints(true);

        if (isMultiplayer) {
            resetMultiplayerState();
        }
    }, []);

    const resetMultiplayerState = () => {
        setHostWinsCount(0);
        setGuestWinsCount(0);
        setFinalWinnerId(null);
        setWinner(null);
    }

    // useEffect(() => {
    //     console.log(availibleHints); // da undefined
    // }, [availibleHints]);

    // initGameModes se obtiene de LoadGame
    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setCurrentGameIndex(0);
            //console.log(initGameModes);
        }
    }, [initGameModes]);

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
        if (hintCounter != 0) {
            setCharacterDialogue("Puedo darte una pista!");
        }
        else {
            setCharacterDialogue("No hay mas pistas disponibles!");
        }
    }

    useEffect(() => {
        if(currentHintIndex != null){
            setCurrentCharacterSprite('hint');
            setCharacterDialogue(hints[currentHintIndex]);
        }
    }, [currentHintIndex]);

    useEffect(() => {
        if (finalWinnerId != null) {
            handleFishMultiplayerGame();
        }
    }, [finalWinnerId]);

    const handleFishMultiplayerGame = async () => {
        try{
            console.log("EL ID GANADOR FINAL ES -> " + finalWinnerId);
            axiosInstance.post(`/game-multi/game/${gameId}/finish/0`, finalWinnerId);
        }
        catch (error) {
            console.error(error);
        }
    }

    // Guarda en la BD los datos de la ronda
    // Le avisa a los demas usuarios que el juego termino
    const sendAnswer = async () => {
        try {
            const gameKeys = Object.keys(initGameModes);
            const currentGameKey = gameKeys[currentGameIndex];
            const gameInfo = initGameModes[currentGameKey].infoGame[0];
            const { id } = gameInfo; // game mode id

            // Log de cada parámetro para depuración
            console.log("userId:", userId);
            console.log("answer:", answer);
            console.log("gameId:", gameId);
            console.log("gameModeId:", id); // game mode id
            console.log("time:", elapsedTime);

            if (isMultiplayer) {
                await axiosInstance.post(`/game-multi/game/${gameId}/play/`, {
                    idUserWin: userId,
                    idGameMulti: gameId,
                    idGame: id, // game mode id
                    time_playing: elapsedTime
                });
            }
            else {
                setIsTimePlaying(false);
                await axiosInstance.post("/game-single/v1/play-game", {
                    idGameSingle: gameId,
                    idUser: userId,
                    response: answer,
                    idGame: id, // game mode id
                    time_playing: elapsedTime
                });
                handleNextGameMode();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Verificar la respuesta
    // En caso de ser correcta se llama al endpoint
    const handleVerifyAnswer = () => {
        if (isCorrectAnswer !== null) {
            console.log("Is correct answer -> " + isCorrectAnswer);
            if (isCorrectAnswer) {
                sendAnswer();
                setCharacterDialogue("Muy bien!");
                setCurrentCharacterSprite('correct');
                toast.success('Respuesta Correcta!');
            }
            else {
                toast.error('Respuesta Incorrecta!');
                setCharacterDialogue("Intenta de nuevo!");
                setCurrentCharacterSprite('wrong');
            }
        }
    }
    useEffect(() => {
        handleVerifyAnswer();
    }, [isCorrectAnswer]);

    // Se recibe el mensaje del endpoint si la respuesta es correcta
    // Verificar si hay un ganador y avanza de ronda
    useEffect(() => {
        if (implementationGameBody) {
            if (implementationGameBody.status === "FINISH_ROUND") {
                if (implementationGameBody.is_win) {
                    setIsTimePlaying(false);
                    setIsModalOpen(true);
                    if (implementationGameBody.idUserWin == host.userId) {
                        setWinner(host.username);
                        // Sumar 1 punto al host
                        setHostWinsCount(prevCount => prevCount + 1);
                    }
                    else {
                        setWinner(guest.username);
                        // Sumar 1 punto al guest
                        setGuestWinsCount(prevCount => prevCount + 1);
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

    const resetGameState = () => {
        setHints([]);
        setIsCorrectAnswer(null);
        setElapsedTime(0);
        setIsTimePlaying(false);
        setCurrentHintIndex(null);
    };

    const handleTimeUpdate = (time) => {
        setElapsedTime(time); // Actualiza el tiempo transcurrido
    };

    const handleNextGameMode = () => {
        resetGameState();

        const gameKeys = Object.keys(initGameModes);
        const nextIndex = currentGameIndex + 1;

        if (nextIndex >= gameKeys.length) {
            handleFinishGame();
            return;
        }

        setTimeout(() => {
            setIsModalOpen(false);
            defaultCharacterDialogue();
            setCurrentGameIndex(nextIndex);
            setIsTimePlaying(true);
            setCurrentCharacterSprite('idle');
        }, 3000); // 3000 ms para esperar 3 segundos adicionales
    };

    const handleTimerComplete = async () => {
        if (isMultiplayer) {
            try {
                await axiosInstance.post(`/game-multi/game/${gameId}/finish/${currentGameModeNumericId}`, '0');
            }
            catch (error) {
                console.error(error);
            }
        }
        setCharacterDialogue("Tiempo fuera!");
        setCurrentCharacterSprite('timeout');
        handleNextGameMode();
    }

    const handleFinishGame = async () => {
        try {
            if (isMultiplayer) {
                handleFinalWinner();
                setImplementationGameBody(null);
                setInvitationCount(0);
                setInvitation(null);
                unsubscribeFromGameSocket();
            }
            else {
                axiosInstance.post(`/game-single/v1/finish-play-game/${gameId}`);
            }

            setTimeout(() => {
                setIsModalOpen(false);
                console.log("Fin del juego!");
                setIsGameFinished(true);
                setCurrentHeader("Partida Finalizada");
                setInitGameModes({});
                setCurrentCharacterSprite('finish');
            }, 3000); // 3000 ms para esperar 3 segundos adicionales
        } catch (error) {
            console.error(error);
        }
    }

    const showNextHint = () => {
        const gameKeys = Object.keys(initGameModes);
        const currentGameKey = gameKeys[currentGameIndex];
        const gameInfo = initGameModes[currentGameKey].infoGame[0]; // Asignamos de nuevo después de vaciar

        const { idModeGame } = gameInfo;

        if (['OW', 'GP', 'MC'].includes(idModeGame)) {
            setHints([gameInfo.hint1, gameInfo.hint2, gameInfo.hint3]);
        }

        setCurrentHintIndex((prevIndex) => {
            if (prevIndex === null) {
                return 0;
            }
            else {
                return prevIndex + 1;
            }
        });

        // Actualiza el contador de pistas
        setHintCounter((prevCounter) => {
            if (prevCounter > 1) {
                return prevCounter - 1;
            } else {
                return 0;
            }
        });
    };

    // Renderizar el juego basado en el índice actual
    const renderGame = () => {
        const gameKeys = Object.keys(initGameModes);
        const currentGameKey = gameKeys[currentGameIndex];
        const gameInfo = initGameModes[currentGameKey]?.infoGame[0]; // Asegúrate de que gameInfo exista

        if (!isGameFinished) {
            if (gameInfo) {
                const { id, idModeGame } = gameInfo;

                let GameComponent;

                setCurrentGameModeId(idModeGame);
                setCurrentGameModeNumericId(id);

                // Cambiamos el componente según el modo de juego
                switch (idModeGame) {
                    case 'OW':
                        setCurrentHeader("🔁 Ordena la Palabra");
                        GameComponent = <OrderWord OWinfo={gameInfo} showNextHint={showNextHint} />;
                        break;
                    case 'GP':
                        setCurrentHeader("🔤 Adivina la Frase");
                        GameComponent = <GuessPhrase GPinfo={gameInfo} showNextHint={showNextHint} />;
                        break;
                    case 'MC':
                        setCurrentHeader("🔢 Multiple Opcion");
                        GameComponent = <MultipleChoice MCinfo={gameInfo} showNextHint={showNextHint} />;
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
                        <h1>No hay contenido disponible</h1>
                        <ScaleLoader color="var(--link-color)" height={30} width={15} loading={true} />
                    </div>
                );
            }
        }
        else {
            return (
                <div>
                    <ScaleLoader color="var(--link-color)" height={30} width={15} loading={true} />
                </div>
            );
        }
    };

    const onMatchClosed = () => {
        localStorage.removeItem("host");
        localStorage.removeItem("guest");
        setGameId(null);
        navigate("/");
    }

    useEffect(() => {
        if (isGameFinished) {
            console.log(isMultiplayer);
            if (isMultiplayer) {
                setGameContent(renderFinishGameStats());
                resetMultiplayerState();
                setIsMultiplayer(false);
            }
            else {
                fetchFinalGameData();
            }
        }
    }, [isGameFinished]);

    const handleFinalWinner = () => {
        const isHost = userObj.userId === host.userId;
        const isGuest = userObj.userId === guest.userId;

        if (isHost && hostWinsCount > guestWinsCount) {
            setFinalWinnerId(host.userId);
        } else if (isGuest && guestWinsCount > hostWinsCount) {
            setFinalWinnerId(guest.userId);
        } else if (hostWinsCount === guestWinsCount) {
            setFinalWinnerId('0');
        }
    }

    const fetchFinalGameData = async () => {
        try {
            const response = await axiosInstance.get(`/game-single/v1/resumeGame/${gameId}`);
            console.log(response.data);
            setGameContent(renderFinishGameStats(response.data));
        } catch (error) {
            console.error("Error fetching game resume:", error);
        }
    }

    const renderMultiplayerGameResume = () => {
        const isHost = userObj.userId === host.userId;
        const isGuest = userObj.userId === guest.userId;

        let message = "😢 DERROTA 😢";
        if (isHost && hostWinsCount > guestWinsCount) {
            message = "🎉 ¡VICTORIA! 🎉";
        } else if (isGuest && guestWinsCount > hostWinsCount) {
            message = "🎉 ¡VICTORIA! 🎉";
        } else if (hostWinsCount === guestWinsCount) {
            message = "🤝 EMPATE 🤝";
        }

        return (
            <div className="stats-container">
                <h1
                    style={{
                        color: message.includes("VICTORIA")
                            ? "#4CAF50"
                            : message.includes("EMPATE")
                                ? "#000"
                                : "red",
                    }}
                >
                    {message}
                </h1>
                <h3>
                    <span style={{ color: 'var(--link-color)' }}>{host?.username || "Cargando..."}</span> 🧠 x {hostWinsCount ?? 0}
                </h3>
                <h3>
                    <span style={{ color: 'var(--link-color)' }}>{guest?.username || "Cargando..."}</span> 🧠 x {guestWinsCount ?? 0}
                </h3>
            </div>
        );
    }

    const renderSingleplayerGameResume = (response) => {
        let score;
        let timePlaying;

        if (response) {
            score = response.points;
            timePlaying = response.timePlaying;
        }

        return (
            <>
                {response ? (
                    <div>
                        <h3 style={{ color: 'var(--link-color)' }}>Puntaje Total</h3>
                        <h3>🧠 x {score}</h3>
                        <h3 style={{ color: 'var(--link-color)' }}>Tiempo Total</h3>
                        <h3>{timePlaying} seg</h3>
                    </div>
                ) : (
                    <>No se pudo obtener la informacion</>
                )}

            </>
        );
    }

    const renderFinishGameStats = (response) => {
        const finalGameResume = isMultiplayer ? renderMultiplayerGameResume() : renderSingleplayerGameResume(response);

        return (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className='final-game-resume' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'fit-content', width: '100%' }}>
                    <BrainCharacter spriteKey={currentCharacterSprite} hideDialogue={true} />
                    <div className='final-game-resume-container' >
                        {finalGameResume}
                    </div>
                </div>
                <button onClick={onMatchClosed}>Menu Principal</button>
            </div>
        );
    };

    return (
        <div className='content-wrapper'>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={isGameFinished}
                hideRightPanel={isGameFinished || isDesignBreakpoint}
                leftHeader={isDesignBreakpoint ? '' : 'Pistas'}
                leftContent={
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        {isDesignBreakpoint && isMultiplayer && <MultiplayerHUD />}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                            <div style={{ display: 'flex', flexGrow: '1', justifyContent: 'center', alignItems: 'center' }}>
                                <BrainCharacter
                                    spriteKey={currentCharacterSprite}
                                    rerenderKey={characterDialogue}
                                    autoStart={isGameReady}
                                    words={characterDialogue}
                                />
                            </div>
                            {isDesignBreakpoint && <div style={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
                                <div>
                                    <p><b style={{ color: 'var(--link-color)' }}>Ronda</b></p>
                                    <p><b>{currentGameIndex + 1}/{GAME_SETTINGS.MAX_ROUNDS}</b></p>
                                    <p><b style={{ color: 'var(--link-color)' }}>Pistas disponibles</b></p>
                                    <p><b>{hintCounter || 0}/{GAME_SETTINGS.MAX_HINTS}</b></p>
                                </div>
                                {!isGameFinished && <CircleTimer
                                    key={currentGameIndex} // El timer se reinicia cada vez que se cambia el index
                                    isLooping={true}
                                    loopDelay={0.5}
                                    isPlaying={isTimePlaying}
                                    duration={timeRemaining}
                                    onTimeUpdate={handleTimeUpdate}
                                    onTimerComplete={handleTimerComplete}
                                    size={isMobile ? 130 : 150}
                                />}
                            </div>}
                        </div>
                    </div>
                }
                middleHeader={currentHeader}
                middleContent={gameContent}
                rightHeader='Stats'
                rightContent={
                    <div style={{ maxWidth: '90%' }}>
                        {isMultiplayer && <MultiplayerHUD />}
                        <div>
                            <p><b style={{ color: 'var(--link-color)' }}>Ronda</b></p>
                            <p><b>{currentGameIndex + 1}/{GAME_SETTINGS.MAX_ROUNDS}</b></p>
                            <p><b style={{ color: 'var(--link-color)' }}>Pistas disponibles</b></p>
                            <p style={{marginBottom:'0px'}}><b>{hintCounter || 0}/{GAME_SETTINGS.MAX_HINTS}</b></p>
                        </div>
                        <br />
                        {!isGameFinished && <CircleTimer
                            key={currentGameIndex} // El timer se reinicia cada vez que se cambia el index
                            isLooping={true}
                            loopDelay={0.5}
                            isPlaying={isTimePlaying}
                            duration={timeRemaining}
                            onTimeUpdate={handleTimeUpdate}
                            onTimerComplete={handleTimerComplete}
                        />}
                    </div>
                }
            />

            <Modal showModal={isModalOpen} hideConfirmBtn={true} hideCloseBtn={true} title="Ronda Finalizada">
                {winner && <h2><span style={{ color: 'var(--link-color)' }}>"{winner}"</span> es el ganador de la ronda!</h2>}
                {currentGameIndex < 2 && <h3>Preparate para la siguiente ronda!</h3>}
                <ClockLoader size={80} />
            </Modal>
        </div>
    );
};

export default GameMatchView;
