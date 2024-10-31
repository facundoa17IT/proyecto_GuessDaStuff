import React from 'react';
import { FaLock, FaLockOpen, FaInfoCircle, FaEdit } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiPlusCircle } from "react-icons/fi";
import { MdChat } from "react-icons/md";
import axios from 'axios'; // Install axios using: npm install axios

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

// Set Custom API URL from Another View
export const SetButtonEndpoint = (btnKey, customEndpoint) => {
    if (buttonMapping[btnKey]) {
        buttonMapping[btnKey].endpoint = customEndpoint;
    } else {
        console.warn(`Button with key ${btnKey} not found.`);
    }
};

// Generalized Action Handlers (with axios API requests and error handling)
const handleButtonClick = async (btnKey, itemLabel) => {
    const { endpoint } = buttonMapping[btnKey];
    const apiUrl = endpoint; // Get the API URL dynamically from the button configuration
    
    if (!apiUrl) {
        console.error(`No API URL set for ${btnKey}. Please set the endpoint before proceeding.`);
        return;
    }

    try {
        console.log(`${btnKey} clicked with param:`, itemLabel);
        switch (btnKey) {
            case 'inviteBtn':
                await axios.post(apiUrl);
                console.log("Invite sent to:", itemLabel);
                break;
            case 'infoBtn':
                const response = await axios.get(apiUrl);
                console.log("User info:", response.data);
                break;
            case 'addBtn':
                await axios.post(apiUrl, { param: itemLabel });
                console.log("Item added:", itemLabel);
                break;
            case 'blockBtn':
                await axios.put(apiUrl);
                console.log("User blocked:", itemLabel);
                break;
            case 'unblockBtn':
                await axios.put(apiUrl);
                console.log("User unblocked:", itemLabel);
                break;
            case 'deleteBtn':
                await axios.delete(apiUrl);
                console.log("Item deleted:", itemLabel);
                break;
            case 'chatBtn':
                await axios.post(apiUrl);
                console.log("Chat initiated with:", itemLabel);
                break;
            case 'editBtn':
                await axios.put(apiUrl, { param: itemLabel });
                console.log("Edit submitted for:", itemLabel);
                break;
            default:
                console.warn("Action type not recognized:", btnKey);
        }
    } catch (error) {
        console.error(`Error during ${btnKey}:`, error);
    }
};

// Button Configuration
// Endpoints are assigned in each corresponding view
export const buttonMapping = {
    inviteBtn: {
        icon: FaRegCirclePlay,
        label: "Invitar",
        action: (itemLabel) => handleButtonClick('inviteBtn', itemLabel),
        endpoint: "",
    },
    infoBtn: {
        icon: FaInfoCircle,
        label: "Detalles",
        action: (itemLabel) => handleButtonClick('infoBtn', itemLabel),
        endpoint: "",
    },
    addBtn: {
        icon: FiPlusCircle,
        label: "Añadir",
        action: (itemLabel) => handleButtonClick('addBtn', itemLabel),
        endpoint: "",
    },
    blockBtn: {
        icon: FaLock,
        label: "Bloquear",
        action: (itemLabel) => handleButtonClick('blockBtn', itemLabel),
        endpoint: "",
    },
    unblockBtn: {
        icon: FaLockOpen,
        label: "Desbloquear",
        action: (itemLabel) => handleButtonClick('unblockBtn', itemLabel),
        endpoint: "",
    },
    deleteBtn: {
        icon: RiDeleteBin2Fill,
        label: "Eliminar",
        action: (itemLabel) => handleButtonClick('deleteBtn', itemLabel),
        endpoint: "",
    },
    chatBtn: {
        icon: MdChat,
        label: "Chat",
        action: (itemLabel) => handleButtonClick('chatBtn', itemLabel),
        endpoint: "",
    },
    editBtn: {
        icon: FaEdit,
        label: "Editar",
        action: (itemLabel) => handleButtonClick('editBtn', itemLabel),
        endpoint: "",
    },
};

