/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Context API **/
import { useRole } from '../../contextAPI/AuthContext'
import axiosInstance from '../../utils/AxiosConfig';
import { SocketContext } from '../../contextAPI/SocketContext';

/** Utils **/
import { PLAYER_ROUTES } from '../../utils/constants';

/** Style **/
import '../../styles/slot-machine.css';

const SlotMachineMulti = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { userId } = useRole();  // Access the setRole function from the context

    const { ruletaGame, finalSlot1, finalSlot2, finalSlot3, idGame } = location.state || {};


    const { usernameHost } = useContext(SocketContext);

    const userObj = JSON.parse(localStorage.getItem("userObj"));

    useEffect(() => {
        //console.log(`loadGameData: ${JSON.stringify(loadGameData, null, 2)}`);
        console.log("user id slot machine -> " + userId);
        setTimeout(() => {
            spin();
        }, 1000);
    }, []);

    // Estado para almacenar el valor de cada slot
    const [slot1, setSlot1] = useState(ruletaGame.categories[0].gameModes[0]); // Inicializa con el primer modo de la primera categoría
    const [slot2, setSlot2] = useState(ruletaGame.categories[1].gameModes[0]); // Inicializa con el primer modo de la segunda categoría
    const [slot3, setSlot3] = useState(ruletaGame.categories[2].gameModes[0]); // Inicializa con el primer modo de la tercera categoría
    const [isSpinning, setIsSpinning] = useState(false); // Estado para controlar si la máquina está girando
    const [results, setResults] = useState([]); // Estado para almacenar los resultados de los slots
    const spinDuration = 1500;

    // Función para obtener un elemento aleatorio de un array
    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    // Función para hacer girar los slots
    const spin = () => {
        setIsSpinning(true); // Establece el estado de giro a verdadero
        setResults([]); // Reinicia los resultados

        // Simulación del giro de los slots
        let spinInterval = setInterval(() => {
            setSlot1(getRandomItem(ruletaGame.categories[0].gameModes)); // Cambia el slot 1 a un modo aleatorio
            setSlot2(getRandomItem(ruletaGame.categories[1].gameModes)); // Cambia el slot 2 a un modo aleatorio
            setSlot3(getRandomItem(ruletaGame.categories[2].gameModes)); // Cambia el slot 3 a un modo aleatorio
        }, spinDuration * 0.05); // Intervalo entre cambios

        // Detener el giro después de spinDuration
        setTimeout(() => {
            clearInterval(spinInterval); // Detiene el intervalo de giro

            // Se asignan los  valores hardcodeados
            setSlot1(finalSlot1);
            setSlot2(finalSlot2);
            setSlot3(finalSlot3);

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
            console.log(finalSlot1);
            console.log(finalSlot2);
            console.log(finalSlot3);

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
        }, spinDuration); // Duración del giro (2 segundos)
    };

    return (
        <div className="slot-machine-container"> {/* Contenedor principal de la máquina tragamonedas */}
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

            <div className="results"> {/* Contenedor para mostrar los resultados */}
                {results.length > 0 && (
                    <ul>
                        {results.slice().reverse().map((result, index) => (
                            <li key={index}>
                                {result.category}: {result.mode}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SlotMachineMulti; // Exportar el componente
