import React, { useState, useContext, useEffect } from 'react';
import '../../styles/slot-machine.css';
import { LoadGameContext } from '../../contextAPI/LoadGameContext';
import { useNavigate } from 'react-router-dom';
const SlotMachine = () => {
    const { loadGameData } = useContext(LoadGameContext);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(`loadGameData: ${JSON.stringify(loadGameData, null, 2)}`);
        setTimeout(() => {
            spin();
        }, 1000);
    }, []);

    // Estado para almacenar el valor de cada slot
    const [slot1, setSlot1] = useState(loadGameData[0].gameModes[0]); // Inicializa con el primer modo de la primera categoría
    const [slot2, setSlot2] = useState(loadGameData[1].gameModes[0]); // Inicializa con el primer modo de la segunda categoría
    const [slot3, setSlot3] = useState(loadGameData[2].gameModes[0]); // Inicializa con el primer modo de la tercera categoría
    const [isSpinning, setIsSpinning] = useState(false); // Estado para controlar si la máquina está girando
    const [results, setResults] = useState([]); // Estado para almacenar los resultados de los slots
    const spinDuration = 3000;

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
            setSlot1(getRandomItem(loadGameData[0].gameModes)); // Cambia el slot 1 a un modo aleatorio
            setSlot2(getRandomItem(loadGameData[1].gameModes)); // Cambia el slot 2 a un modo aleatorio
            setSlot3(getRandomItem(loadGameData[2].gameModes)); // Cambia el slot 3 a un modo aleatorio
        }, spinDuration * 0.05); // Intervalo entre cambios

        // Detener el giro después de spinDuration
        setTimeout(() => {
            clearInterval(spinInterval); // Detiene el intervalo de giro

            // Selecciona el modo final para cada slot
            const finalSlot1 = getRandomItem(loadGameData[0].gameModes);
            const finalSlot2 = getRandomItem(loadGameData[1].gameModes);
            const finalSlot3 = getRandomItem(loadGameData[2].gameModes);

            setSlot1(finalSlot1); // Establece el valor final del slot 1
            setSlot2(finalSlot2); // Establece el valor final del slot 2
            setSlot3(finalSlot3); // Establece el valor final del slot 3

            // Crear objetos de resultado para cada slot
            const result1 = {
                category: loadGameData[0].name,
                mode: finalSlot1,
                id: loadGameData[0].id
            };
            const result2 = {
                category: loadGameData[1].name,
                mode: finalSlot2,
                id: loadGameData[1].id
            };
            const result3 = {
                category: loadGameData[2].name,
                mode: finalSlot3,
                id: loadGameData[2].id
            };

            // Establecer los resultados en el estado
            const resultsArray = [result1, result2, result3];
            setResults(resultsArray);

            // Crear el objeto de salida en el formato requerido
            const userId = "1234"; // Cambia esto por el ID real del usuario si es necesario
            const output = {
                userId: userId,
                parCatMod: resultsArray.map(result => ({
                    cat: result.id, // ID de la categoría
                    mod: result.mode // Modo de juego seleccionado
                }))
            };

            setIsSpinning(false); // Cambia el estado de giro a falso

            // Espera 3 segundos antes de redirigir
            setTimeout(() => {
                navigate('/init-game', {
                    state: {
                        initGameBody: output
                    }
                });
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
                {results.length > 0 && ( // Si hay resultados
                    <ul>
                        {results.map((result, index) => ( // Mapeo de resultados a lista
                            <li key={index}>
                                {result.category}: {result.mode} {/* Mostrar nombre de la categoría y modo */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SlotMachine; // Exportar el componente
