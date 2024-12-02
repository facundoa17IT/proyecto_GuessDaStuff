/** React **/
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';

/** Components **/
import Modal from '../../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

export const DeleteCategory = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const { selectedItem } = useContext(ListContext);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    // Fetch available categories on mount
    const handleDeleteCategory = async () => {
        if (selectedItem?.name) {
            try {
                await axiosInstance.put(`/v1/categories/delete/${selectedItem.name}`, {}, { requiresAuth: true });
                console.log("Categoría eliminada");
                navigate(-1);
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };
    

    return (
        <Modal onConfirm={handleDeleteCategory} showModal={true} closeModal={onClose} title={"Agregar Categoria"}>
            {selectedItem && <h2>Desea eliminar la categoria "<span style={{color:'red'}}>{selectedItem.name}</span>"?</h2>}
        </Modal>
    );
};