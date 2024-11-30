/** React **/
import React, { useState, useEffect, useContext } from 'react';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList';
import Modal from '../../components/layouts/Modal';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { renderListItemDetails } from '../../utils/ReactHelpers';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

const GameMatchesManagement = () => {
    const { selectedItem } = useContext(ListContext);

    /** Game Matches List **/
    const gameMatchesListId = "gameMatchesList";
    const [gameMatches, setGameMatches] = useState([]);
    const getGameId = (game) => game.itemList;
    const extraColumns = (item) => [item.finish ? "Finished" : "Active"];
    const customFilter = [
        { label: 'Finished', criteria: item => item.finish === true },
        { label: 'Active', criteria: item => item.finish === false }
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all categories
    const fetchGameMatches = async () => {
        try {
            const responseIndividual = await axiosInstance.get('/game-modes/v1/allGamesIndividual', { requiresAuth: true });
            const responseMulti = await axiosInstance.get('/game-modes/v1/allGamesMultiplayer', { requiresAuth: true });

            console.log(responseIndividual.data);

            const FinalizadasIndividual = responseIndividual.data.Finalizadas;
            const ActivasIndividual = responseIndividual.data.Activas;

            const FinalizadasMulti = responseMulti.data.Finalizadas;
            const ActivasMulti = responseMulti.data.Activas;

            const finishIndividualModify = FinalizadasIndividual.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                itemList: "Individual - " + partida.startDate // Reemplazar el id_game
            }));

            const activeIndividualModify = ActivasIndividual.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                itemList: "Individual - " + partida.startDate // Reemplazar el id_game
            }));

            const finishMultiModify = FinalizadasMulti.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                itemList: "Multiplayer - " + partida.startDate // Reemplazar el id_game
            }));

            const activeMultiModify = ActivasMulti.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                itemList: "Multiplayer - " + partida.startDate // Reemplazar el id_game
            }));


            // Combina ambas listas en un solo array
            setGameMatches([...finishIndividualModify, ...activeIndividualModify,...finishMultiModify,...activeMultiModify]);
        } catch (error) {
            console.error('Error fetching game matches:', error);
        }
    };

    useEffect(() => {
        fetchGameMatches();
    }, []);

    const handleGameMatchesListInteraction = (listId, buttonKey, item) => {
        if (listId === gameMatchesListId) {
            console.log("Game Matches List Interaction");
            if (buttonKey === 'infoBtn') {
                setIsModalOpen(!isModalOpen);
            };
        } else {
            console.warn("Action type not recognized:", buttonKey);
        }
    };

    return (
        <>
            <MainGameLayout
                canGoBack={false}
                hideLeftPanel={true}
                hideRightPanel={true}
                middleFlexGrow={2}
                middleHeader='Partidas'
                middleContent={
                    <CustomList
                        listId={gameMatchesListId}
                        listContent={gameMatches}
                        getItemLabel={getGameId}
                        extraColumns={extraColumns}
                        customFilter={customFilter}
                        buttons={["infoBtn"]}
                        onButtonInteraction={handleGameMatchesListInteraction}
                    />
                }
            />

            <Modal showModal={isModalOpen} onConfirm={() => setIsModalOpen(!isModalOpen)} closeModal={() => setIsModalOpen(!isModalOpen)} title="Detalles">
                <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    {renderListItemDetails(selectedItem)}
                </div>
            </Modal >
        </>
    );
};

export default GameMatchesManagement;
