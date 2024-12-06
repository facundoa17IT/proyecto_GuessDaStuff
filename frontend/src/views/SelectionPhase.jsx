/** React **/
import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../components/layouts/MainGamelayout';
import SlotMachine from '../components/ui/SlotMachine';
import SlotMachineMulti from '../components/ui/SlotMachineMulti';

/** Context API **/
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const SelectionPhase = () => {
	const location = useLocation();
	const { ruletaGame, finalSlot1, finalSlot2, finalSlot3, idGame } = location.state || {};
	const { isMultiplayer, setIsGameView } = useContext(LoadGameContext);

	useEffect(() => {
        setIsGameView(true);
    }, []);

	return (
		<MainGameLayout
			hideLeftPanel={true}
			hideRightPanel={true}
			middleHeader='Fase de Seleccion'
			middleContent={
				<>
					{isMultiplayer ? (
						<SlotMachineMulti
							ruletaGame={ruletaGame}
							finalSlot1={finalSlot1}
							finalSlot2={finalSlot2}
							finalSlot3={finalSlot3}
							idGame={idGame}
						/>
					) : (<SlotMachine />)}
				</>
			}
		/>
	);
};

export default SelectionPhase;