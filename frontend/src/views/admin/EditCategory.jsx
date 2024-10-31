/** React **/
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/** Utils **/
import axiosInstance from '../../AxiosConfig';

/** Components **/
import Modal from '../../components/layouts/Modal';

/** Context API **/
import { ListContext } from '../../contextAPI/ListContext';

export const EditCategory = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { title } = location.state || {};

    const [isModalOpen, setIsModalOpen] = useState(true);

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const { selectedItem } = useContext(ListContext);

    // Initialize Editable fields
    useEffect(() => {
        if(selectedItem?.name && selectedItem?.description){
            setCategoryName(selectedItem.name);
            setCategoryDescription(selectedItem.description);
        }
    }, []);

    const onClose = () => {
        setIsModalOpen(!isModalOpen);
        navigate(-1);
    }

    // Fetch available categories on mount
    const handleEditCategory = () => {
        axiosInstance.put('/auth/categories', {
            name: categoryName,
            description: categoryDescription,
        })
            .then(response => {
                console.log("La categorias se actualizo correctamente!");
                navigate(-1);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    return (
        <Modal onConfirm={handleEditCategory} showModal={true} closeModal={onClose} title={title}>
            <input disabled style={{backgroundColor:'#abb2b9'}} type="text" placeholder="Nombre" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
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