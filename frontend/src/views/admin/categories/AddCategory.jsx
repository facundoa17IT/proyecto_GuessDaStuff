/** React **/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';

/** Components **/
import Modal from '../../../components/layouts/Modal';

export const AddCategory = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    const handleAddCategory = async () => {
        try {
            const response = await axiosInstance.post("/v1/categories", {
                name: categoryName,
                description: categoryDescription
            }, 
            { requiresAuth: true });
            console.log(response.data);
            navigate(-1); // Navigate back after successfully adding the category
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };    

    return (
        <Modal onConfirm={handleAddCategory} showModal={true} closeModal={onClose} title={"Agregar Categoria"}>
            <input type="text" placeholder="Nombre" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            <textarea
                placeholder="Descripcion"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                rows="4"
                cols="50"
                style={{ whiteSpace: 'pre-wrap' }}
            />
        </Modal>
    );
};