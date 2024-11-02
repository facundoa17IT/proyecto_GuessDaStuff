/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import Modal from '../../components/layouts/Modal';
import { IconButton } from '../../components/layouts/ItemListButtons';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

/** Assets **/
import { FaEdit } from 'react-icons/fa';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { gameModesSchemas } from '../../utils/JsonSchemas';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

export const CategoryDetails = () => {
    const navigate = useNavigate();

    const { selectedItem } = useContext(ListContext);

    const [categoryTitles, setCategoryTitles] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [modalContent, setModalContent] = useState(null);

    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState({});

    const [selectedGameMode, setSelectedGameMode] = useState('');
    const [selectedGameModeId, setSelectedGameModeId] = useState();

    const uiSchema = {
        id_Category: {
            "ui:disabled": true  // Disable the id_Category field
        }
    };

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        setFormData({});
        navigate(-1);
    }

    // Update Modal content with Titles of Category
    useEffect(() => {
        if (categoryTitles && selectedItem) {
            console.log(categoryTitles);
            setModalContent(() => renderTitlesOfCategory());
        }
    }, [categoryTitles]);

    // Initialize the modal content with List Item Details
    useEffect(() => {
        setModalContent(() => renderListItemDetails())
    }, []);

    // Update modal edit categories form
    useEffect(() => {
        if (schema) {
            setJsonSchemaForm();
            setModalContent(()=>renderEditTitleForm());
        }
    }, [schema]);

    const renderTitlesOfCategory = () => {
        return (
            <div>
                <h2>Titulos</h2>
                <div style={{ border: '2px solid var(--border-color)', borderRadius: '8px', height: '255px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {categoryTitles && Object.keys(categoryTitles.titlesOfCategory).map((gameModeKey) => (
                        <div key={gameModeKey}>
                            <h3>{gameModeKey}</h3>
                            <ul style={{ textAlign: 'left', listStyleType: 'none' }}>
                                {categoryTitles.titlesOfCategory[gameModeKey].map((item, index) => (
                                    <li
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        <span>{item.title}</span>
                                        <IconButton
                                            icon={FaEdit}
                                            label={'Editar'}
                                            onClick={() => handleEditClick(gameModeKey, index, item)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    
    const handleEditClick = (gameModeKey, index, item) => {
        console.log(gameModeKey);
        console.log(index);
        console.log(item.title);
        console.log(item.id);
        setSelectedGameModeId(item.id);
        setSelectedGameMode(gameModeKey);
        if (item?.id) {
            axiosInstance.get(`/game-modes/v1/${item.id}`)
                .then(response => {
                    const data = response.data.body;
                    setFormData(data);
                    console.log(data);
                    // Choose schema based on id_Category
                    if (data.id_GameMode === "OW") {
                        setSchema(gameModesSchemas.OW);
                    } else if (data.id_GameMode === "OBD") {
                        setSchema(gameModesSchemas.OBD);
                    } else if (data.id_GameMode === "GP") {
                        setSchema(gameModesSchemas.GP);
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    };
    
    const setJsonSchemaForm = () => {
        if (selectedGameMode) {
            if (selectedGameMode === "Order Word") setSchema(gameModesSchemas.OW);
            else if (selectedGameMode === "Order By Date") setSchema(gameModesSchemas.OBD);
            else if (selectedGameMode === "Guess Phrase") setSchema(gameModesSchemas.GP);
            else console.log("error");
        }
        else{
            console.log("Error bad game mode key");
        }
    }

    const renderEditTitleForm = () => {
        return (
            <div>
                <Form
                    className='form'
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)} // Update local state on change
                    onSubmit={handleEditTitle}
                    validator={validator}
                >
                </Form>
            </div>
        );
    }

    const handleEditTitle = async ({ formData }) => {
        console.log(formData);
        let gameMode = "";
        if (selectedGameMode) {
            if (selectedGameMode === "Order Word") gameMode = 'OrderWord';
            else if (selectedGameMode === "Order By Date") gameMode = 'OrderByDate';
            else if (selectedGameMode === "Guess Phrase") gameMode = 'GuessPhrase';
            else console.log("error");
        }
        try {
            const response = await axiosInstance.put(`/game-modes/v1/${gameMode}/${selectedGameModeId}`, { requiresAuth: true });
            console.log('Data edited successfully!', response.data);
            setFormData({});
            navigate(-1);
        } catch (error) {
            console.error('Error during submission:', error);
        }
    };


    const renderListItemDetails = () => {
        return (
            <div>
                {selectedItem && <ul style={{ textAlign: 'left' }}>
                    {Object.entries(selectedItem).map(([key, value]) => (
                        <li key={key}>
                            {key === "icon" ? (
                                <span>
                                    <strong>{key}:</strong>
                                    {typeof value === 'string' && value.endsWith('.png') ? (
                                        <img
                                            src={value}
                                            alt={key}
                                            style={{ width: '30px', height: '30px', marginLeft: '10px' }}
                                        />
                                    ) : (
                                        React.createElement(value, { style: { marginLeft: '10px', fontSize: '30px' } })
                                    )}
                                </span>
                            ) : (
                                <span>
                                    <strong>{key}:</strong> {String(value)}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>}
                <button onClick={() => handleListTitles()}>Titulos</button>
            </div>
        );
    }

    // Get titles of the selected category
    const handleListTitles = () => {
        if (selectedItem?.id) {
            axiosInstance.get(`/game-modes/v1/titles/${selectedItem.id}`)
                .then(response => {
                    setCategoryTitles(response.data);
                })
                .catch(error => {
                    setModalContent(<>No hay titulos disponibles</>);
                    console.error('Error fetching:', error);
                });
        } else {
            console.error('No id found in selectedItem');
        }
    };

    return (
        <Modal onConfirm={null} showModal={true} closeModal={onClose} title="Detalles">
            <div style={{ height: '350px', overflowY: 'auto', overflowX: 'hidden' }}>
                {modalContent}
            </div>
        </Modal >
    );
};