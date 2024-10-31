/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../AxiosConfig';
/** Main Layout **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const GameMatchView = () => {
    const location = useLocation();
    const { initGameBody } = location.state || {};
    const { initGameData, setinitGameData } = useContext(LoadGameContext);
    
    const GameModeComponents = {
        OBD: "Order by Date",
        OW: "Order Word",
        GP: "Guess Phrase"
    };
    const [gameModeCollection, setGameModeCollection] = useState([]);

    useEffect(() => {
        // Log de salida en el formato deseado
        console.log(JSON.stringify(initGameBody, null, 2));

        axiosInstance.post("/api/user/game/initGame", initGameBody)
            .then(response => {
                console.log("Init Game!!")
                console.log(response.data);
                setinitGameData(response.data);
                //window.location.reload();
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });

    }, [initGameBody]);

    const getSpecificInfo = (gameModeKey, index, propertyKey = null) => {
        const gameMode = initGameData.gameModes?.[gameModeKey];

        if (!gameMode) {
            //console.log(`Game mode ${gameModeKey} not found.`);
            return null;
        }

        // Determine the index based on the game mode name
        let selectedIndex = (gameMode.name === "Order By Date" && index >= 0 && index <= 2) ? index : 0;

        const infoGameItem = gameMode?.infoGame[selectedIndex];
        if (!infoGameItem) {
            //console.log(`Index ${selectedIndex} not found in game mode ${gameModeKey}.`);
            return null;
        }

        // If propertyKey is provided, return that specific property
        if (propertyKey) {
            const property = infoGameItem[propertyKey];
            if (property === undefined) {
                console.log(`Property ${propertyKey} not found in item at index ${selectedIndex} of game mode ${gameModeKey}.`);
                return null;
            }
            return property;
        }

        // If no propertyKey is provided, return the entire infoGame item
        return infoGameItem;
    };


    useEffect(() => {
        if (Object.keys(initGameData).length > 0) {
            console.log(initGameData);
            // Test the getSpecificInfo function
            console.log(getSpecificInfo("juego_1", 0, "idModeGame"));
            console.log(getSpecificInfo("juego_2", 0, "idModeGame"));
            console.log(getSpecificInfo("juego_3", 0, "idModeGame"));
        }
    }, [initGameData]);

    return (
        <MainGameLayout
            canGoBack={false}
            middleHeader={"Game Mode"}
            middleContent={
                <div style={{ width: '100%', height: '80%' }}>
                    {/* getSpecificInfo("juego_1", 0, "idModeGame") */}
                    {GameModeComponents
                        ? (<div><h2>{GameModeComponents["OBD"]}</h2></div>)
                        : (<div style={{ border: '2px dashed Black', borderRadius: '8px', padding: '90px', marginBottom: '15px' }}>
                            <h3>Contenido de la partida</h3>
                        </div>)
                    }
                    <button>Adivinar</button>
                </div>
            }
        />
    );
};

export default GameMatchView;
