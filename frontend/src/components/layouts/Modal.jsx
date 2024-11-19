import React from 'react';
import AppLogo from '../ui/AppLogo'
import { GiCancel } from "react-icons/gi";
import { FaRegCheckCircle } from "react-icons/fa";
import '../../styles/modal.css'

const Modal = ({ hideConfirmBtn = false, hideCloseBtn = false, showModal, onConfirm, closeModal, title, children }) => {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className='modal-header'>
                    <AppLogo enableAnim={false} width={'300px'} height={'50px'} bgImg={'var(--app-vertical-logo)'} />
                    <h2 style={{ marginTop: '5px' }}>{title}</h2>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className='modal-footer'>
                    {!hideCloseBtn && <button onClick={closeModal} ><GiCancel style={{ fontSize: '30px', width: '80px' }} /></button>}
                    {!hideConfirmBtn && <button onClick={onConfirm}><FaRegCheckCircle style={{ fontSize: '30px', width: '80px' }} /></button>}
                </div>
            </div>
        </div>
    );
};

export default Modal;
