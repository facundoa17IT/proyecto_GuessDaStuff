import React from "react"

import { useRole } from '../../contextAPI/AuthContext'
import axiosInstance from "../../utils/AxiosConfig";

import { ImExit } from "react-icons/im";

const LogoutButton = () => {
    const { setRole } = useRole();  // Access the role from context

    const logOut = () => {
        const username = localStorage.getItem("username");
        axiosInstance.put(`/v1/logout/${username}`, {}, { requiresAuth: true })
            .then(response => {
                // Remove user role from local storage & context API
                localStorage.removeItem("token");
                localStorage.setItem("role", 'ROLE_GUESS');
                localStorage.setItem("username", '');
                setRole('ROLE_GUESS');
                console.log("User logged out!");
            })
            .catch(error => {
                console.error('Logout Error:', error);
            });
    };
    

    return (
        <button onClick={logOut}>
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ImExit style={{ marginRight: '5px' }} />Cerrar Sesion
            </span>
        </button>
    )
}

export default LogoutButton;