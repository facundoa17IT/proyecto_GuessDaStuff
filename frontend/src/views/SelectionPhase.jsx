/** React **/
import React from 'react';

/** Components **/
import SlotMachine from '../components/ui/SlotMachine';
import MainGameLayout from '../components/layouts/MainGamelayout'

const SelectionPhase = () => {

	return (
		<MainGameLayout
			hideLeftPanel={true}
			hideRightPanel={true}
			middleHeader='Fase de Seleccion'
			middleContent={
				<SlotMachine />
			}
		/>
	);
};

export default SelectionPhase;