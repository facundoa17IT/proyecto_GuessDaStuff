import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Cambiar a react-router-dom para la navegación
import { LoadGameContext } from '../contextAPI/LoadGameContext';
import axiosInstance from '../AxiosConfig'
import SlotMachine from '../components/ui/SlotMachine';

const SelectionPhase = () => {
	// const [results, setResults] = useState([]);
	// const [spinning, setSpinning] = useState(false);
	// const [showResults, setShowResults] = useState(false);
	// const spinAnimation = useRef(0);
	// const navigate = useNavigate(); // Cambiar a useNavigate
	// const { loadGameData } = useContext(LoadGameContext);

	return (
		<div>
			<SlotMachine/>
		</div>
	);
};

export default SelectionPhase;