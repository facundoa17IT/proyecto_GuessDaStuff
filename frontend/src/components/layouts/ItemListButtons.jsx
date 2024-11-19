/** React **/
import React from 'react';

/** Assets **/
import { FaLock, FaLockOpen, FaInfoCircle, FaEdit } from "react-icons/fa";
import { FaRegCirclePlay, FaCircleCheck } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { MdChat } from "react-icons/md";
import { ImCancelCircle } from "react-icons/im";

// Icon Button Component
export const IconButton = ({ icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        style={{ padding: '0px', fontSize: '1em', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--link-color)', border: 'none', boxShadow: 'none' }}>
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Icon style={{ fontSize: '20px' }} />
            {label && <small style={{ fontSize: 'x-small' }}>{label}</small>}
        </span>
    </button>
);

// Utility to Get Button Configuration
export const GetButton = (btnKey) => {
    if (buttonMapping[btnKey]) {
        return buttonMapping[btnKey];
    } else {
        console.warn(`Button with key ${btnKey} not found.`);
        return null;
    }
};

// Button Configuration
// Endpoints are assigned in each corresponding view
export const buttonMapping = {
    inviteBtn: {
        icon: FaRegCirclePlay,
        label: "Invitar",
    },
    infoBtn: {
        icon: FaInfoCircle,
        label: "Detalles",
    },
    addBtn: {
        icon: FiPlusCircle,
        label: "Añadir",
    },
    blockBtn: {
        icon: FaLock,
        label: "Bloquear",
    },
    unblockBtn: {
        icon: FaLockOpen,
        label: "Desbloquear",
    },
    deleteBtn: {
        icon: RiDeleteBin2Fill,
        label: "Eliminar",
    },
    chatBtn: {
        icon: MdChat,
        label: "Chat",
    },
    editBtn: {
        icon: FaEdit,
        label: "Editar",
    },
    acceptBtn: {
        icon: FaCircleCheck,
        label: "Aceptar",
    },
    cancelBtn: {
        icon: ImCancelCircle,
        label: "Cancelar",
    },
};

