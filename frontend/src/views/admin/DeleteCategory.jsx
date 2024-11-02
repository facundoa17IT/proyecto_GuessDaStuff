/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';

/** Components **/
import Modal from '../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

export const DeleteCategory = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const { selectedItem } = useContext(ListContext);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    // Fetch available categories on mount
    const handleDeleteCategory = () => {
        if (selectedItem?.name) {
            axiosInstance.put(`/v1/categories/delete/${selectedItem.name}`,{/** Empty Body **/}, { requiresAuth: true })
                .then(response => {
                    console.log("Categoria eliminada");
                    navigate(-1);
                    //window.location.reload();
                })
                .catch(error => {
                    console.error('Error adding category:', error);
                });
        }
    };

    return (
        <Modal onConfirm={handleDeleteCategory} showModal={true} closeModal={onClose} title={"Agregar Categoria"}>
            {selectedItem && <h2>Desea eliminar la categoria "<span style={{color:'red'}}>{selectedItem.name}</span>"?</h2>}
        </Modal>
    );
};