/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import Modal from '../components/layouts/Modal';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

/** Utils **/
import axiosInstance from '../utils/AxiosConfig';

/** Context API**/
import { LoadGameContext } from '../contextAPI/LoadGameContext';

/** Style **/
import '../styles/start-game.css';

const StartGame = () => {
    const { setLoadGameData, selectedCategories, setSelectedCategories, setIsMultiplayer } = useContext(LoadGameContext);
    const [categories, setCategories] = useState([]);
    const [selectedGameMode, setSelectedGameMode] = useState('');
    const [loading, setLoading] = useState(true);

    const gameType = ['Single', 'Multi'];

    const navigate = useNavigate();

    const handleCategoryToggle = (category) => {
        if (selectedCategories.some((selectedCategory) => selectedCategory.id === category.id)) {
            setSelectedCategories(selectedCategories.filter((selectedCategory) => selectedCategory.id !== category.id));
        } else if (selectedCategories.length < 3) {
            setSelectedCategories([...selectedCategories, category]);
        } else {
            toast('Has alcanzado el limite de categorias!');
        }
    };

    const selectRandomCategories = () => {
        if (categories.length < 3) {
            toast('No hay suficientes categorías para seleccionar.');
            return;
        }

        const randomCategories = [];
        const selectedIndices = new Set();

        while (randomCategories.length < 3) {
            const randomIndex = Math.floor(Math.random() * categories.length);

            if (!selectedIndices.has(randomIndex)) {
                selectedIndices.add(randomIndex);
                randomCategories.push(categories[randomIndex]);
            }
        }

        setSelectedCategories(randomCategories);
    };

    const fetchActiveCategories = async () => {
        setLoading(true);
        setSelectedCategories([]);

        try {
            const response = await axiosInstance.get('/v1/categories-active');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveCategories();
    }, []);

    useEffect(() => {
        if (selectedGameMode === 'Single') {
            setIsMultiplayer(false);
        } else if (selectedGameMode === 'Multi') {
            setIsMultiplayer(true);
        }
    }, [selectedGameMode]);

    const handleConfirm = async () => {
        if (selectedCategories.length < 3) {
            toast('Por favor selecciona 3 categorias para continuar!');
            return;
        }

        const categoryIds = selectedCategories.map(category => category.id);

        try {
            const response = await axiosInstance.post('/game-single/v1/load-game', {
                categories: categoryIds,
                modeGame: selectedGameMode
            }, { requiresAuth: true });

            setLoadGameData(response.data);

            if (selectedGameMode === 'Single') {
                navigate('/selection-phase');
            } else {
                navigate('/multiplayer-lobby');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedCategories([]);
        navigate('/');
    };

    return (
        <div>
            <Modal showModal={true} onConfirm={handleConfirm} closeModal={handleCloseModal} title={''}>
                <div className="start-game-modal">
                    <h2>Categorias</h2>
                    <div>
                        <div className="categories-container">
                            {!loading ? (
                                categories.map((category) => (
                                    <div
                                        className={`chip ${selectedCategories.includes(category) ? 'selected' : ''}`}
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category)}
                                    >
                                        {category.name}
                                    </div>
                                ))
                            ) : <ClipLoader />}
                        </div>
                        <div className="category-selection-info">
                            <small>Total Seleccionadas: {selectedCategories.length}</small>
                            <button className="random-selection-btn" onClick={selectRandomCategories}>Seleccion Aleatoria</button>
                        </div>
                    </div>
                    <div style={{ margin: '20px' }}></div>
                    <h2>Estilo de Juego</h2>
                    <div className="game-type-container">
                        {gameType.map((gt) => (
                            <div className="game-type-option" key={gt}>
                                <label>
                                    <input
                                        type="radio"
                                        name="gt-options"
                                        value={gt}
                                        onChange={(e) => setSelectedGameMode(e.target.value)}
                                        required
                                    />
                                    {gt}player
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StartGame;
