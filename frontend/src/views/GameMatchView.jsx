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

    const [currentHeader, setCurrentheader] = useState('');
    const [gameContent, setGameContent] = useState(null);

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
            setGameContent(renderGame);
        }
    }, [initGameData]);

    const renderGame = () => {
        // if (error) return <Text>{error}</Text>;
        // if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

        if (initGameData) {
            const gameKeys = Object.keys(initGameData);
            const currentGameKey = gameKeys[0]; // este valor debe ser asignado dinamicamente cuando cambia de fase
            const gameInfo = initGameData[currentGameKey].infoGame[0];

            if (gameInfo) {
                const { idModeGame } = gameInfo;
                let GameComponent;

                switch (idModeGame) {
                    case 'OW':
                        setCurrentheader("Ordena la Palabra");
                        GameComponent = <>Cargar Componente OW...</>;
                        break;
                    case 'GP':
                        setCurrentheader("Adivina la Frase");
                        GameComponent = <>Cargar Componente GP...</>;
                        break;

                    default:
                        GameComponent = <Text>Modo de juego no reconocido.</Text>;
                }

                return (
                    <>
                        {GameComponent}
                    </>
                );
            } else {
                return <>Aún no fue implementado.</>;
            }
        } else {
            return <>Juego terminado. Volviendo a inicio...</>;
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
