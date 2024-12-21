/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';
import { gameModesSchemas } from '../../../utils/JsonSchemas'

/** Components **/
import Modal from '../../../components/layouts/Modal';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { BsInfoCircle } from "react-icons/bs";
import { TiArrowRightThick } from "react-icons/ti";
import { FaArrowRightLong } from "react-icons/fa6";
/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

export const AddTitle = () => {
    const navigate = useNavigate();

    const [selectedAvailableCategory, setSelectedAvailableCategory] = useState('');
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedAddType, setSelectedAddType] = useState('');

    const [file, setFile] = useState(null);
    const [canUploadFile, setCanUploadFile] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [modalContent, setModalContent] = useState(null);

    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState({});

    const { selectedItem } = useContext(ListContext);

    const uiSchema = {
        id_Category: {
            "ui:disabled": true  // Disable the id_Category field
        }
    };

    // Update modal with category titles list
    useEffect(() => {
        if (selectedAddType !== '') {
            if (selectedAddType == "Individual" && selectedItem) {
                setJsonSchemaForm();

                if (schema) {
                    setModalContent(() => renderAddIndividualTitleForm());
                }
            }
            else if (selectedAddType == "Masiva" && selectedItem) {
                const gameMode = getGameModeById(selectedItem.id);
                setModalContent(() => renderAddMasiveTitle(gameMode));
            }
            else {
                console.log("Error con el tipo de carga seleccionada!");
            }
        }
    }, [selectedAddType, schema]);

    const initializeContent = async () => {
        setModalContent(() => renderAddTitleToCategory());
        try {
            const response = await axiosInstance.get('/v1/categories-availables', { requiresAuth: true });
            setAvailableCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    useEffect(() => {
        initializeContent();
    }, []);


    // Trigger upload on button click 
    useEffect(() => {
        if (canUploadFile) {
            uploadFile(file, selectedAvailableCategory);
        };
    }, [canUploadFile]);

    // Update with Available Categories
    useEffect(() => {
        if (availableCategories.length > 0) {
            setModalContent(() => renderAddTitleToCategory());
        }
    }, [availableCategories]);

    // Update formData whenever selectedAvailableCategory changes
    useEffect(() => {
        if (selectedAvailableCategory) {
            setFormData(prevData => ({
                ...prevData,
                id_Category: Number(selectedAvailableCategory)
            }));
        }
    }, [selectedAvailableCategory]);

    const getGameModeById = (id) => {
        switch (id) {
            case 1: return 'OW';
            case 2: return 'MC';
            case 3: return 'GP';
            default:
                console.log("error");
                return null;
        }
    };

    const setJsonSchemaForm = () => {
        const gameMode = getGameModeById(selectedItem?.id);
        if (gameMode) {
            setSchema(gameModesSchemas[gameMode]);
        }
    };

    const onClose = () => {
        setSelectedAddType('');
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    const handleAvailableCategorySelection = (e) => {
        console.log(e.target.value);
        setSelectedAvailableCategory(e.target.value);
    };

    const handleAddTypeSelection = (e) => {
        console.log(e.target.value);
        setSelectedAddType(e.target.value);
    };

    const handleAddGameModoToCategory = async ({ formData }) => {
        console.log(formData);
        const gameMode = getGameModeById(selectedItem?.id);

        if (gameMode) {
            try {
                const response = await axiosInstance.post(`/game-modes/v1/individual/${gameMode}`, formData, { requiresAuth: true });
                console.log('Data submitted successfully!', response.data);
                setFormData({});
                navigate(-1);
            } catch (error) {
                console.error('Error during submission:', error);
            }
        }
    };

    const renderAddTitleToCategory = () => {
        return (
            <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                <div style={{ margin: '1rem', padding: '15px', boxSizing: 'border-box', border: '3px double var(--border-color)', borderRadius: '8px' }}>
                    <small style={{ color: 'var(--link-color)' }}><BsInfoCircle fontSize={15} style={{ marginRight: '5px' }} />Agrega el modo de juego seleccionado a una categoria especifica.</small>
                </div>
                {!schema && <div>
                    {/* Menú desplegable */}
                    <h2>Categoria</h2>
                    <select
                        id="dropdown"
                        value={selectedAvailableCategory}
                        onChange={handleAvailableCategorySelection}
                        style={{
                            marginTop: '25px',
                            padding: '10px',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            color: 'black',
                            fontSize: 'medium',
                            width: '250px',
                            border: '2px solid var(--border-color)',
                            fontWeight: 'bold',
                            textAlign: 'center',
                        }}
                    >
                        <option value="" disabled>Selecciona una categoria</option>
                        {availableCategories.map((opcion, index) => (
                            <option key={opcion.id} value={String(opcion.id)}>{opcion.name}</option>
                        ))}
                    </select>

                    {/* Botones de radio */}
                    <div style={{ marginTop: '25px' }}>
                        <h2>Tipo de carga</h2>
                        <div style={{ marginTop: '25px' }}>
                            <label style={{ cursor: 'pointer', color: 'var(--link-color)', fontWeight: 'bold' }}>
                                <input
                                    type="radio"
                                    name="modo"
                                    value="Individual"
                                    checked={selectedAddType == 'Individual'}
                                    onChange={handleAddTypeSelection}
                                />
                                Individual
                            </label>
                            <label style={{ marginLeft: '20px', cursor: 'pointer', color: 'var(--link-color)', fontWeight: 'bold' }}>
                                <input
                                    type="radio"
                                    name="modo"
                                    value="Masiva"
                                    checked={selectedAddType == 'Masiva'}
                                    onChange={handleAddTypeSelection}
                                />
                                Masiva
                            </label>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }

    const renderAddIndividualTitleForm = () => {
        return (
            <div style={{height:'100%'}}>
                {renderCategoryAndGameModeName()}
                <div style={{ margin: '1rem', padding: '15px', boxSizing: 'border-box', border: '3px double var(--border-color)', borderRadius: '8px' }}>
                    <small style={{ color: 'var(--link-color)' }}><BsInfoCircle fontSize={15} style={{ marginRight: '5px' }} />Completa todos los campos y presiona el boton de Submit.</small>
                </div>
                <Form
                    className='form'
                    schema={schema}
                    uiSchema={uiSchema}
                    formData={formData}
                    onChange={(e) => setFormData(e.formData)} // Update local state on change
                    onSubmit={handleAddGameModoToCategory}
                    validator={validator}
                >
                </Form>
            </div>
        );
    }

    const uploadFile = async (file, idCategory) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("idCategory", idCategory);

        console.log('Selected file:', file.name);

        const gameMode = getGameModeById(selectedItem?.id);

        if (gameMode) {
            try {
                const response = await axiosInstance.post(`/game-modes/v1/masive/${gameMode}`, formData, {
                    requiresAuth: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                console.log(response.data);
                navigate(-1);
            } catch (error) {
                console.error("Error uploading the file", error);
            }
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        setCanUploadFile(true);
    };

    const renderAddMasiveTitle = (gameMode) => {
        let gameModeInfo;

        if (gameMode) {
            if (gameMode === "OW") {
                gameModeInfo = <p>Palabra | Pista1 | Pista2 | Pista3</p>
            }
            else if (gameMode === "MC") {
                gameModeInfo = <p>PalabraCorrecta | PalabraAleatoria1 | PalabraAleatoria2 | PalabraAleatoria3 | Pregunta | Pista1 | Pista2 | Pista3</p>
            }
            else if (gameMode === "GP") {
                gameModeInfo = <p>Frase | PalabraCorrecta | Pista1 | Pista2 | Pista3</p>
            }
            else {
                console.error("Bad id Game Mode");
            }
        }

        return (
            <div style={{ height: '100%', width: '100%' }}>
                {renderCategoryAndGameModeName()}
                <div style={{ margin: '1rem', padding: '15px', boxSizing: 'border-box', border: '3px double var(--border-color)', borderRadius: '8px' }}>
                    <small style={{ color: 'var(--link-color)' }}><BsInfoCircle fontSize={15} style={{ marginRight: '5px' }} />Seleccione un archivo en formato csv o xlsx</small>
                </div>
                <input style={{ margin: '0.5rem' }} type="file" onChange={handleFileChange} />
                <h3>Columnas requeridas</h3>
                {gameModeInfo}
            </div>
        )
    }


    const renderCategoryAndGameModeName = () => {
        const selectedCategory = availableCategories.find(
            (category) => category.id === Number(selectedAvailableCategory)
        );

        if (selectedCategory) {
            console.log(`Selected category: ${selectedCategory.name}`);
        }

        return (
            <div style={{ width: '100%'}}>
                {selectedItem && selectedCategory ? (
                    <h3 style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0'
                    }}
                    >
                        {selectedItem.name}
                        <span style={{ color: 'var(--text-color)',display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center', }}><FaArrowRightLong fontSize={20} style={{ margin: '8px', color: 'var(--link-color)' }} /></span>
                        {selectedCategory.name}
                    </h3>
                ) : (
                    <p>Category not found</p>
                )}
            </div>
        );
    }

    return (
        <Modal hideConfirmBtn={selectedAddType === "Individual"} onConfirm={selectedAddType === "Masiva" ? handleUpload : onClose} showModal={true} closeModal={onClose} title={""}>
            {modalContent}
        </Modal>
    );
};