/** React **/
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../../utils/AxiosConfig';

/** Components **/
import Modal from '../../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

export const UnlockUser = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(true);

    const { selectedItem } = useContext(ListContext);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    const handleBlockUser = async () => {
        if (selectedItem?.username) {
            try {
                await axiosInstance.put(`/users/v1/unblock/${selectedItem.username}`, {}, { requiresAuth: true });
                console.log("Usuario desbloqueado");
                navigate(-1);
            } catch (error) {
                console.error('Error unblocking user:', error);
            }
        }
    };

    return (
        <Modal onConfirm={handleBlockUser} showModal={true} closeModal={onClose} title={"Desbloquear Usuario"}>
            {selectedItem && <h2>Desea desbloquear el usuario: "<span style={{color:'green'}}>{selectedItem.username}</span>"?</h2>}
        </Modal>
    );
};