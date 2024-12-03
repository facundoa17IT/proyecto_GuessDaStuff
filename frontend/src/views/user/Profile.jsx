/** React **/
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import MainGameLayout from '../../components/layouts/MainGamelayout';
import CustomList from '../../components/layouts/CustomList'; // Asegúrate de importar CustomList
import Modal from '../../components/layouts/Modal';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { renderListItemDetails } from '../../utils/ReactHelpers';

/** Icons **/
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { ImExit } from "react-icons/im";
import { FaUserCircle } from 'react-icons/fa';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';
import { SocketContext } from '../../contextAPI/SocketContext';
import { useRole } from '../../contextAPI/AuthContext'

const Profile = () => {
    const userObj = JSON.parse(localStorage.getItem("userObj"));
    const [profileImage, setProfileImage] = useState(null); // Estado para la imagen de perfil

    const { selectedItem } = useContext(ListContext);

    /** Game Matches List **/
    const gameMatchesListId = "gameMatchesList";

    const [gameMatchesOriginal, setGameMatchesOriginal] = useState([]);
    const [gameMatchesModified, setGameMatchesModified] = useState([]);

    const getGameId = (game) => game.id_game;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isModalOpenEliminar, setIsModalOpenEliminar] = useState(false); // Controla el modal

    const navigate = useNavigate();

    const { setRole, setUserId } = useRole();  // Access the role from context

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Estado para el modal de perfil

    const [selectedImage, setSelectedImage] = useState(null);

    // Manejador para abrir el modal de confirmación
    const handleDeleteAccountClick = () => {
        setIsModalOpenEliminar(true);
    };

    const { disconnect } = useContext(SocketContext);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    // Manejador para la respuesta del modal
    const handleResponse = async () => {
        try {
            await axiosInstance.put(`/users/v1/delete/${userObj.username}`, {}, { requiresAuth: true });
            
            alert('Cuenta eliminada con éxito');

            disconnect(userObj);
            localStorage.removeItem("token");
            localStorage.setItem("role", 'ROLE_GUESS');
            localStorage.setItem("username", '');
            localStorage.setItem("userId", 0);
            localStorage.setItem("dtoUserOnline", null);
            setRole('ROLE_GUESS');
            setUserId(0);

            navigate('/login');

        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
            alert('Hubo un error al eliminar la cuenta. Inténtalo nuevamente.');
        }
    };

    // Función para manejar la selección de una nueva imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    // Obtener la URL de la imagen de perfil desde el backend
    const fetchProfileImage = async () => {
        try {
            const response = await axiosInstance.get(`/users/v1/getImageProfile/${userObj.username}`, { requiresAuth: true });
            console.log(response.data);
            const data = await response.data;
            if (data === 'urlDoMacaco') {
                setProfileImage(null)
            } else {
                setProfileImage(data);
            }
        } catch (error) {
            console.error("Error de red al obtener la imagen de perfil:", error);
        }
    };

    // Obtener las partidas del jugador (individuales y multiplayer)
    const fetchMatchesOfPlayer = async () => {
        try {
            const response = await axiosInstance.get(`/users/v1/gamesOfPlayer/${userObj.userId}`, { requiresAuth: true });
            console.log(response.data.partidas);

            const partidasIndividuales = response.data.partidas.INDIVIDUAL;
            const partidasMultiplayer = response.data.partidas.MULTIPLAYER;

            const partidasModInd = partidasIndividuales.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                id_game: "Individual - ID: " + partida.id_game // Reemplazar el id_game
            }));

            const partidasModMulti = partidasMultiplayer.map(partida => ({
                ...partida, // Mantener los demás valores intactos
                id_game: "Multiplayer - ID: " + partida.id_game // Reemplazar el id_game
            }));

            
            // Combinar las dos listas
            const combinedMatchesOriginal = [...partidasIndividuales, ...partidasMultiplayer];
            const combinedMatchesModify = [...partidasModInd, ...partidasModMulti];

            setGameMatchesOriginal(combinedMatchesOriginal);
            setGameMatchesModified(combinedMatchesModify);

        } catch (error) {
            console.error('Error fetching game matches:', error);
        }
    }

    useEffect(() => {
        fetchProfileImage();
        fetchMatchesOfPlayer();
    }, [userObj.username, userObj.userId]);

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

    const handleSaveProfile = async () => {
        if (!selectedImage) {
            alert("Por favor selecciona una imagen.");
            return;
        }
        
        const formData = new FormData();
        formData.append("file", selectedImage);
        
        try {
            const response = await axiosInstance.put(`/users/v1/edit/${userObj.username}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                requiresAuth: true,
            });
            alert("Perfil actualizado con éxito.");
            setIsProfileModalOpen(false);
            fetchProfileImage(); // Actualizar la imagen de perfil
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Hubo un error al actualizar el perfil. Inténtalo nuevamente.");
        }
    };

    return (
        <>
            <MainGameLayout
                leftHeader='Perfil'
                leftContent={
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '15px' }}>
                            {/* Mostrar imagen de perfil si existe, de lo contrario el ícono */}
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Foto de perfil"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <FaUserCircle style={{ fontSize: '100px' }} />
                            )}
                        </div>

                        <h1 style={{ marginBottom: '0px' }}>{userObj.username}</h1>
                        <p>{userObj.email}</p>
                        <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <button
                            style={{ fontSize: 'small', width: '200px' }}
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            <FaEdit style={{ marginRight: '5px' }} />
                            Editar Perfil
                        </button>
                            <button onClick={handleDeleteAccountClick} style={{ fontSize: 'small', width: '200px', backgroundColor: '#DC143C' }}><RiDeleteBin2Fill style={{ marginRight: '5px' }} />Eliminar Cuenta</button>
                        </div>
                    </div>
                }
                middleFlexGrow={2}
                middleHeader='Historial'
                middleContent={
                    <CustomList
                        listId={gameMatchesListId}
                        listContent={gameMatchesModified}  // Pasa las partidas al componente CustomList
                        getItemLabel={getGameId}
                        buttons={['infoBtn']}
                        onButtonInteraction={handleGameMatchesListInteraction}
                    />
                }
                hideRightPanel={true}
            />
            <Modal showModal={isModalOpen} onConfirm={() => setIsModalOpen(!isModalOpen)} closeModal={() => setIsModalOpen(!isModalOpen)} title="Detalles">
                <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    {renderListItemDetails(selectedItem)}
                </div>
            </Modal>

            {/* Modal de confirmación */}
            <Modal
                showModal={isModalOpenEliminar}
                onConfirm={() => handleResponse()}  // Si confirma, intenta eliminar
                closeModal={() => setIsModalOpenEliminar(!isModalOpenEliminar)} // Si cancela, cierra sin acción
                title="Confirmar eliminación"
            >
                <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
            </Modal>
            <Modal
                showModal={isProfileModalOpen}
                onConfirm={handleSaveProfile}
                closeModal={() => setIsProfileModalOpen(false)}
                title="Editar Perfil"
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <label htmlFor="profileImageInput">
                        {selectedImage ? (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Previsualización"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        ) : (
                            <FaUserCircle style={{ fontSize: '100px' }} />
                        )}
                    </label>
                    <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => document.getElementById('profileImageInput').click()}
                        style={{ fontSize: 'small', width: '200px' }}
                    >
                        Seleccionar Imagen
                    </button>
                </div>
            </Modal>


        </>
    );
};

export default Profile;
