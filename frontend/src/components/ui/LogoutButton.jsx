import React from "react"

import { useRole } from '../../contextAPI/AuthContext'
import axiosInstance from "../../AxiosConfig";

import { ImExit } from "react-icons/im";

const LogoutButton = () => {
    const { setRole } = useRole();  // Access the role from context

    const logOut = () => {
        const username = localStorage.getItem("username");
        axiosInstance.put(`/auth/logout/${username}`)
            .then(response => {
                // Remove user role from local storage & context API
                localStorage.setItem("token", null);
                localStorage.setItem("role", 'ROLE_GUESS');
                localStorage.setItem("username", '');
                setRole('ROLE_GUESS');
                console.log("User logged out!");
            })
            .catch(error => {
                console.error('Logout Error:', error);
            });
    }

    return (
        <button onClick={logOut}>
            <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ImExit style={{ marginRight: '5px' }} />Cerrar Sesion
            </span>
        </button>
    )
}

export default LogoutButton;