/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';

/** Components **/
import Modal from '../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

export const AddCategory = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    // Fetch available categories on mount
    const handleAddCategory = () => {
        axiosInstance.post("/v1/categories", {
            name: categoryName,
            description: categoryDescription
        }, 
        { requiresAuth: true })
            .then(response => {
                console.log(response.data);
                navigate(-1);
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
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