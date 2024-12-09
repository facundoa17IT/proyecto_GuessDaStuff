/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import Modal from '../../../components/layouts/Modal';
import { IconButton } from '../../../components/layouts/ItemListButtons';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

/** Assets **/
import { FaEdit } from 'react-icons/fa';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';
import { gameModesSchemas } from '../../../utils/JsonSchemas';
import { renderListItemDetails } from '../../../utils/ReactHelpers';

/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

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
        setModalContent(
            <>
                {renderListItemDetails(selectedItem)}
                <button onClick={() => handleListTitles()}>Titulos</button>
            </>
        )
    }, []);

    // Update modal edit categories form
    useEffect(() => {
        if (schema) {
            setJsonSchemaForm();
            setModalContent(() => renderEditTitleForm());
        }
    }, [schema]);

    const renderTitlesOfCategory = () => {
        return (
            <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                {categoryTitles && Object.keys(categoryTitles.titlesOfCategory).map((gameModeKey) => (
                    <div key={gameModeKey}>
                        <h3 style={{ margin: '1rem', backgroundColor: 'var(--secondary-bg-color)', color: 'white' }}>{gameModeKey}</h3>
                        <ul style={{ textAlign: 'left' }}>
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
                                    <span style={{ width: '80%' }}>{item.title}</span>
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
        );
    };

    const handleEditClick = async (gameModeKey, index, item) => {
        console.log(gameModeKey);
        console.log(index);
        console.log(item.title);
        console.log(item.id);

        setSelectedGameModeId(item.id);
        setSelectedGameMode(gameModeKey);

        if (item?.id) {
            try {
                const response = await axiosInstance.get(`/game-modes/v1/${item.id}`, { requiresAuth: true });
                const data = response.data.body;
                setFormData(data);
                console.log(data);

                // Choose schema based on id_Category
                if (data.idGameMode === "OW") {
                    setSchema(gameModesSchemas.OW);
                } else if (data.idGameMode === "MC") {
                    setSchema(gameModesSchemas.MC);
                } else if (data.idGameMode === "GP") {
                    setSchema(gameModesSchemas.GP);
                } else {
                    console.log("Bad Id Game Mode");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
    };

    const setJsonSchemaForm = () => {
        if (selectedGameMode) {
            if (selectedGameMode === "Order Word") setSchema(gameModesSchemas.OW);
            else if (selectedGameMode === "Multiple Choice") setSchema(gameModesSchemas.MC);
            else if (selectedGameMode === "Guess Phrase") setSchema(gameModesSchemas.GP);
            else console.log("error");
        }
        else {
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
            if (selectedGameMode === "Order Word") gameMode = 'OW';
            else if (selectedGameMode === "Multiple Choice") gameMode = 'MC';
            else if (selectedGameMode === "Guess Phrase") gameMode = 'GP';
            else console.error("Error al seleccionar Game Mode");

            try {
                const response = await axiosInstance.put(`/game-modes/v1/${gameMode}/${selectedGameModeId}`, formData, { requiresAuth: true });
                console.log('Data edited successfully!', response.data);
                setFormData({});
                navigate(-1);
            } catch (error) {
                console.error('Error al editar el titulo:', error);
            }
        }
        else console.error("Error al seleccionar Game Mode");
    };

    // Get titles of the selected category
    const handleListTitles = async () => {
        if (selectedItem?.id) {
            try {
                const response = await axiosInstance.get(`/game-modes/v1/titles/${selectedItem.id}`, { requiresAuth: true });
                setCategoryTitles(response.data);
            } catch (error) {
                setModalContent(<>No hay titulos disponibles</>);
                console.error('Error fetching:', error);
            }
        } else {
            console.error('No id found in selectedItem');
        }
    };

    return (
        <Modal onConfirm={onClose} showModal={true} closeModal={onClose} title="Detalles" innerOutline={true}>
            <div style={{ height: '350px', overflowY: 'auto', overflowX: 'hidden' }}>
                {modalContent}
            </div>
        </Modal >
    );
};