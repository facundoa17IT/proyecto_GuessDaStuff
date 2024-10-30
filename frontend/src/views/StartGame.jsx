import { React, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosConfig';
import Modal from '../components/layouts/Modal';
import { LoadGameContext } from '../contextAPI/LoadGameContext';

const StartGame = () => {
    const { setLoadGameData, selectedCategories, setSelectedCategories } = useContext(LoadGameContext);
    // Load Stored Cateogries From DB
    const [categories, setCategories] = useState([]);

    const [selectedGameMode, setSelectedGameMode] = useState('');
    const [loading, setLoading] = useState(true); // Estado para indicar que está cargando

    const handleCategoryToggle = (category) => {
        if (selectedCategories.some((selectedCategory) => selectedCategory.id === category.id)) {
            // Elimina el objeto de la categoría si ya está en la lista
            setSelectedCategories(selectedCategories.filter((selectedCategory) => selectedCategory.id !== category.id));
        } else {
            // Agrega el objeto de la categoría si no está en la lista
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const gameType = ['Single', 'Multi'];

    const navigate = useNavigate();

    const handleGameTypeChange = (event) => {
        setSelectedGameMode(event.target.value);
    };

    // Fetch available categories when the component mounts
    useEffect(() => {
        setLoading(true); // Comienza la carga
        axiosInstance.get('/auth/activeCategories')
            .then(response => {
                setCategories(response.data);
                setLoading(false); // Finaliza la carga
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setLoading(false); // Finaliza la carga incluso si hay error
            });
    }, []);

    const handleConfirm = () => {
        if (selectedCategories.length < 3) {
            alert('Por favor seleccion 3 categorias para continuar!');
            return;
        }
        const categoryIds = selectedCategories.map(category => category.id);
        console.log(categoryIds);

        axiosInstance.post('/api/user/game/loadGame', {
            categories: categoryIds,
            modeGame: selectedGameMode
        })
            .then(response => {
                console.log('Response:', response.data.categories);
                setLoadGameData(response.data.categories);
                navigate('/selection-phase');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleCloseModal = () => {
        setSelectedCategories([]);
        navigate('/');
    }

    return (
        <div>
            <Modal showModal={true} onConfirm={handleConfirm} closeModal={handleCloseModal} title={''}>
                <div style={{ height: '100%' }}>
                    <hr />
                    <h2>Categorias</h2>
                    {loading ? (
                        <p>Cargando categorías...</p> // Mostrar mientras carga
                    ) : (
                        <div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '10px',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    overflowY: 'auto',
                                    padding: '15px 5px',
                                    height: '120px',
                                    border:'1px solid var(--border-color)',
                                    borderRadius:'8px'
                                }}>
                                {categories.map((category) => (
                                    <div
                                        className='chip'
                                        key={category.id}
                                        onClick={() => handleCategoryToggle(category)}
                                        style={{
                                            backgroundColor: selectedCategories.includes(category) ? 'var(--secondary-bg-color)' : 'transparent',
                                            color: selectedCategories.includes(category) ? 'var(--secondary-text-color)' : 'var(--link-color)',
                                            width: 'fit-content',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '20px',
                                            display: 'inline-block',
                                            transition: 'background-color 0.3s, color 0.3s, transform 0.25s, border-color 0.25s, letter-spacing 0.25s',
                                            fontSize: 'small'
                                        }}
                                    >
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                            <small style={{ margin: '5px' }}>Total Seleccionadas: {selectedCategories.length}</small>
                        </div>
                    )}
                    <h2>Estilo de Juego</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        {gameType.map((gt) => (
                            <div key={gt}>
                                <label style={{ cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="gt-options"
                                        value={gt}
                                        onChange={handleGameTypeChange}
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
