/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import BrainCharacter from './BrainCharacter';

/** Context API **/
import { useRole } from '../../contextAPI/AuthContext'
import { SocketContext } from '../../contextAPI/SocketContext';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { PLAYER_ROUTES } from '../../utils/constants';

/** Style **/
import '../../styles/slot-machine.css';

const SlotMachineMulti = ({ ruletaGame, finalSlot1, finalSlot2, finalSlot3, idGame }) => {
    const navigate = useNavigate();

    const isMediumDevice = useMediaQuery({ query: '(min-width: 450px) and (max-height: 700px)' });
    
    const { userId } = useRole();  // Access the setRole function from the context

    const { usernameHost } = useContext(SocketContext);

    const userObj = JSON.parse(localStorage.getItem("userObj"));

    const [characterSprite, setCharacterSprite] = useState('thinking');

    const gameModeIcons = {
        GP: "🔤",
        OW: "🔁",
        MC: "🔢"
    };

    // Asocia cada modo de juego con su emoji correspondiente
    const mapGameModesToPairs = (gameModes) => {
        return gameModes
            .filter(mode => gameModeIcons[mode]) // Filter valid modes
            .map(mode => ({ mode, emoji: gameModeIcons[mode] })); // Create pairs
    };
    
    // Coleccion de modos de juego
    const gameModes1 = ruletaGame.categories[0].gameModes || [];
    const gameModes2 = ruletaGame.categories[1].gameModes || [];
    const gameModes3 = ruletaGame.categories[2].gameModes || [];
    
    const gameModePairs1 = mapGameModesToPairs(gameModes1);
    const gameModePairs2 = mapGameModesToPairs(gameModes2);
    const gameModePairs3 = mapGameModesToPairs(gameModes3);

    const getRandomEmoji = (gamePairs) => {
        if (!gamePairs || gamePairs.length === 0) return null; // Manejar casos vacíos o inválidos
        const randomIndex = Math.floor(Math.random() * gamePairs.length); // Índice aleatorio
        return gamePairs[randomIndex].emoji; // Retornar solo el emoji del par aleatorio
    };

    const getEmojiByKey = (key) => {
        return gameModeIcons[key] || null; // Retorna el emoji o null si la clave no existe
    };

    // Estado para almacenar el valor de cada slot
    const [slot1, setSlot1] = useState("❓");
    const [slot2, setSlot2] = useState("❓");
    const [slot3, setSlot3] = useState("❓");
    
    const [isSpinning, setIsSpinning] = useState(false); // Estado para controlar si la máquina está girando
    const [results, setResults] = useState([]); // Estado para almacenar los resultados de los slots
    const spinDuration = 1500;

    useEffect(() => {
        setTimeout(() => {
            spin();
        }, 1000);
    }, []);

    // Función para hacer girar los slots
    const spin = () => {
        setIsSpinning(true); // Establece el estado de giro a verdadero
        setResults([]); // Reinicia los resultados

        // Simulación del giro de los slots
        let spinInterval = setInterval(() => {
            setSlot1(getRandomEmoji(gameModePairs1)); // Cambia el slot 1 a un modo aleatorio
            setSlot2(getRandomEmoji(gameModePairs2)); // Cambia el slot 2 a un modo aleatorio
            setSlot3(getRandomEmoji(gameModePairs3)); // Cambia el slot 3 a un modo aleatorio
        }, spinDuration * 0.05); // Intervalo entre cambios

        // Detener el giro después de spinDuration
        setTimeout(() => {
            clearInterval(spinInterval); // Detiene el intervalo de giro

            setCharacterSprite('start');
            
            // Se asignan los  valores hardcodeados
            setSlot1(getEmojiByKey(finalSlot1)); // Establece el valor final del slot 1
            setSlot2(getEmojiByKey(finalSlot2)); // Establece el valor final del slot 2
            setSlot3(getEmojiByKey(finalSlot3)); // Establece el valor final del slot 3

            // Crear objetos de resultado para cada slot
            const result1 = {
                category: ruletaGame.categories[0].name,
                mode: finalSlot1,
                id: ruletaGame.categories[0].id
            };
            const result2 = {
                category: ruletaGame.categories[1].name,
                mode: finalSlot2,
                id: ruletaGame.categories[1].id
            };
            const result3 = {
                category: ruletaGame.categories[2].name,
                mode: finalSlot3,
                id: ruletaGame.categories[2].id
            };

            const categories = [result1.category, result2.category, result3.category];
            localStorage.setItem("categories", JSON.stringify(categories));

            // Establecer los resultados en el estado
            const resultsArray = [result1, result2, result3];
            setResults(resultsArray);

            // Crear el objeto de salida en el formato requerido
            const dtoinitGameMultiRequest = {
                idPartida: idGame,
                parCatMod: resultsArray.map(result => ({
                    cat: result.id, // ID de la categoría
                    mod: result.mode // Modo de juego seleccionado
                }))
            };
            console.log(dtoinitGameMultiRequest);
            //console.log(`Slot: ${JSON.stringify(output, null, 2)}`);
            setIsSpinning(false); // Cambia el estado de giro a falso

            if (userObj.username === usernameHost) {
                axiosInstance.post(`/game-multi/game/${idGame}/start/`, dtoinitGameMultiRequest, { requiresAuth: true });
            }

            // Espera 3 segundos antes de redirigir
            setTimeout(() => {
                navigate(PLAYER_ROUTES.LOAD_GAME);
            }, 3000); // 3000 ms para esperar 3 segundos adicionales
        }, spinDuration);
    };

    return (
        <div className="slot-machine-container"> {/* Contenedor principal de la máquina tragamonedas */}
            <BrainCharacter spriteKey={characterSprite} hideDialogue={true} width={isMediumDevice ? '60%' : '100%'}/>
            <div className="slot-machine"> {/* Contenedor de los slots */}

                {/* Tercer slot */}
                <div className="slot">
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
                        {slot3}
                    </div>
                </div>

                {/* Segundo slot */}
                <div className="slot">
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
                        {slot2}
                    </div>
                </div>

                {/* Primer slot */}
                <div className="slot">
                    <div className={`reel ${isSpinning ? 'spinning' : ''}`}>
                        {slot1}
                    </div>
                </div>
            </div>

            <div className="results">
                <table className="centered-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Modo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 ? (
                            results.slice().reverse().map((result, index) => {
                                const mensajes = {
                                    GP: "Adivina la Frase",
                                    OW: "Ordena la Palabra",
                                    MC: "Multiple Opcion"
                                };

                                const mensajePersonalizado = mensajes[result.mode];

                                return (
                                    <tr key={index}>
                                        <td>{result.category}</td>
                                        <td>{mensajePersonalizado || result.mode}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            // Mostrar tabla de 3x3 con signos de interrogación
                            Array.from({ length: 3 }).map((_, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Array.from({ length: 2 }).map((_, colIndex) => (
                                        <td key={colIndex}>?</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SlotMachineMulti;
