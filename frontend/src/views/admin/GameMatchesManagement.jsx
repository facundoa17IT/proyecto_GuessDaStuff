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

    // Fetch all matches
    const fetchGameMatches = async () => {
        try {
            const responseIndividual = await axiosInstance.get('/game-modes/v1/allGamesIndividual', { requiresAuth: true });
            const responseMulti = await axiosInstance.get('/game-modes/v1/allGamesMultiplayer', { requiresAuth: true });
    
            const FinalizadasIndividual = responseIndividual.data.Finalizadas || [];
            const ActivasIndividual = responseIndividual.data.Activas || [];
            const FinalizadasMulti = responseMulti.data.Finalizadas || [];
            const ActivasMulti = responseMulti.data.Activas || [];
    
            // Aplica `.map()` solo si el arreglo tiene elementos
            const finishIndividualModify = FinalizadasIndividual.length > 0 
                ? FinalizadasIndividual.map(partida => ({
                    ...partida,
                    itemList: "Individual - " + partida.startDate
                })) 
                : [];
            
            const activeIndividualModify = ActivasIndividual.length > 0 
                ? ActivasIndividual.map(partida => ({
                    ...partida,
                    itemList: "Individual - " + partida.startDate
                })) 
                : [];
            
            const finishMultiModify = FinalizadasMulti.length > 0 
                ? FinalizadasMulti.map(partida => ({
                    ...partida,
                    itemList: "Multiplayer - " + partida.startDate
                })) 
                : [];
            
            const activeMultiModify = ActivasMulti.length > 0 
                ? ActivasMulti.map(partida => ({
                    ...partida,
                    itemList: "Multiplayer - " + partida.startDate
                })) 
                : [];
    
            // Combina todas las listas en un solo array
            const combinedMatches = [
                ...finishIndividualModify,
                ...activeIndividualModify,
                ...finishMultiModify,
                ...activeMultiModify
            ];
    
            // Actualiza el estado solo si hay partidas
            setGameMatches(combinedMatches);
    
        } catch (error) {
            console.error('Error fetching game matches:', error.response);
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
        <div>
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

            <Modal showModal={isModalOpen} onConfirm={() => setIsModalOpen(!isModalOpen)} closeModal={() => setIsModalOpen(!isModalOpen)} title="Detalles" innerOutline={true}>
                {renderListItemDetails(selectedItem)}
            </Modal >
        </div>
    );
};

export default GameMatchesManagement;
