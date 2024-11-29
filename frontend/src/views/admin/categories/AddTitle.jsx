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
        if (selectedAddType !== ''){
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
            <div style={{ height: '300px', overflowY: 'auto', overflowX: 'hidden' }}>
                {!schema && <div>
                    {/* Menú desplegable */}
                    <h2>Modo de juego</h2>
                    <select
                        id="dropdown"
                        value={selectedAvailableCategory || ""}
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
                        <option value="" disabled>Selecciona una Categoria</option>
                        {availableCategories.map((opcion, index) => (
                           <option key={opcion.id} value={String(opcion.id)}>{opcion.name}</option>
                        ))}
                    </select>

                    {/* Botones de radio */}
                    <div style={{ marginTop: '25px' }}>
                        <h2>Tipo de carga</h2>
                        <div style={{ marginTop: '25px' }}>
                            <label>
                                <input
                                    type="radio"
                                    name="modo"
                                    value="Individual"
                                    checked={selectedAddType == 'Individual'}
                                    onChange={handleAddTypeSelection}
                                />
                                Individual
                            </label>
                            <label style={{ marginLeft: '20px' }}>
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
            <>
            {renderCategoryAndGameModeName()}
            <div style={{height: '250px',overflowY: 'auto', overflowX: 'hidden'}}>
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
            </>
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

        if (gameMode){
            if(gameMode === "OW"){
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
            <div>
                {renderCategoryAndGameModeName()}
                <p>Seleccione un archivo en formato csv o xlsx</p>
                <input type="file" onChange={handleFileChange} />
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
            <div>
                {selectedItem && selectedCategory ? (
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom:'15px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: "40%", border: "1px solid black", padding: "5px" }}>Categoría</th>
                                <th style={{ width: "40%", border: "1px solid black", padding: "5px" }}>Modo de Juego</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedCategory.name}</td>
                                <td style={{ border: "1px solid black", padding: "5px" }}>{selectedItem.name}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>Category not found</p>
                )}
            </div>
        );
    }

    return (
        <Modal onConfirm={selectedAddType==="Masiva" ? handleUpload : onClose} showModal={true} closeModal={onClose} title={"Agregar Titulo"}>
            <div style={{ height: '350px' }}>
                {modalContent}
            </div>
        </Modal>
    );
};