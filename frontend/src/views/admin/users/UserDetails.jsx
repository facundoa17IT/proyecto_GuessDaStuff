/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import Modal from '../../../components/layouts/Modal';

/** Utils **/
import { renderListItemDetails } from '../../../utils/ReactHelpers';

/** Context API **/
import { ListContext } from '../../../contextAPI/ListContext';

export const UserDetails = () => {
    const navigate = useNavigate();

    const { selectedItem } = useContext(ListContext);

    const [isModalOpen, setIsModalOpen] = useState(true);
    const [modalContent, setModalContent] = useState(null);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    // Initialize the modal content with List Item Details
    useEffect(() => {
        setModalContent(() => renderListItemDetails(selectedItem))
    }, []);

    return (
        <Modal onConfirm={onClose} showModal={true} closeModal={onClose} title="Detalles" innerOutline={true}>
            {modalContent}
        </Modal >
    );
};