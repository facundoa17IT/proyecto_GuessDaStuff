/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../AxiosConfig';
import { gameModesSchemas } from '../../utils/JsonSchemas'

/** Components **/
import Modal from '../../components/layouts/Modal';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

export const AddTitle = () => {
    const navigate = useNavigate();

    const [selectedAvailableCategory, setSelectedAvailableCategory] = useState('');
    const [availableCategories, setAvailableCategories] = useState([]);
    const [selectedAddType, setSelectedAddType] = useState([]);

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
        if (selectedAddType == "individual" && selectedItem) {
            setJsonSchemaForm();

            if (schema) {
                setModalContent(() => renderAddIndividualTitleForm());
            }
        }
    }, [selectedAddType, schema]);

    // Initialize Content 
    useEffect(() => {
        setModalContent(() => renderAddTitleToCategory());
        axiosInstance.get('/api/user/availableCategories')
            .then(response => {
                setAvailableCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }, []);

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

    const setJsonSchemaForm = () => {
        if (selectedItem?.id) {
            const { id } = selectedItem;
            if (id === 1) setSchema(gameModesSchemas.OW);
            else if (id === 2) setSchema(gameModesSchemas.OBD);
            else if (id === 3) setSchema(gameModesSchemas.GP);
            else console.log("error");
        }
    }

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
        let individualEndpoint = "";
        if (selectedItem?.id) {
            const { id } = selectedItem;
            if (id === 1) individualEndpoint = 'OWIndividual';
            else if (id === 2) individualEndpoint = 'OBDIndividual';
            else if (id === 3) individualEndpoint = 'GPIndividual';
            else console.log("error");
        }
        try {
            const response = await axiosInstance.post(`/api/admin/${individualEndpoint}`, formData);
            console.log('Data submitted successfully!', response.data);
            setFormData({});
            navigate(-1);
        } catch (error) {
            console.error('Error during submission:', error);
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
                                    value="individual"
                                    checked={selectedAddType == 'individual'}
                                    onChange={handleAddTypeSelection}
                                />
                                Individual
                            </label>
                            <label style={{ marginLeft: '20px' }}>
                                <input
                                    type="radio"
                                    name="modo"
                                    value="masiva"
                                    checked={selectedAddType == 'masiva'}
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
            <div>
                {renderCategoryById()}
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

    function renderCategoryById() {
        const selectedCategory = availableCategories.find(
            (category) => category.id === Number(selectedAvailableCategory)
        );

        if (selectedCategory) {
            console.log(`Selected category: ${selectedCategory.name}`);
        }

        return (
            <div>
                {selectedItem && <p>{selectedItem.name}</p>}
                {selectedCategory ? (
                    <p>{selectedCategory.name}</p>
                ) : (
                    <p>Category not found</p>
                )}
            </div>
        );
    }

    return (
        <Modal onConfirm={null} showModal={true} closeModal={onClose} title={"Agregar Titulo"}>
            <div style={{ height: '350px', overflowY: 'auto', overflowX: 'hidden' }}>
                {modalContent}
            </div>
        </Modal>
    );
};