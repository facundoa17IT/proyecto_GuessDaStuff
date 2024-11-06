/** React **/
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';

/** Components **/
import Modal from '../../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

export const DeleteUser = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const { selectedItem } = useContext(ListContext);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    const handleDeleteUser = async () => {
        if (selectedItem?.username) {
            try {
                await axiosInstance.put(`/users/v1/delete/${selectedItem.username}`, {}, { requiresAuth: true });
                console.log("Usuario eliminado");
                navigate(-1);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <Modal onConfirm={handleDeleteUser} showModal={true} closeModal={onClose} title={"Eliminar Usuario"}>
            {selectedItem && <h2>Desea eliminar el usuario: "<span style={{color:'red'}}>{selectedItem.username}</span>"?</h2>}
        </Modal>
    );
};