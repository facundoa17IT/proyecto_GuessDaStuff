import React from "react"

import { useRole } from '../../contextAPI/AuthContext'
import axiosInstance from "../../utils/AxiosConfig";

import { ImExit } from "react-icons/im";

const LogoutButton = () => {
    const { setRole, setUserId } = useRole();  // Access the role from context

    const logOut = async () => {
        const username = localStorage.getItem("username");
        if (username) {
            try {
                await axiosInstance.put(`/v1/logout/${username}`,{}, { requiresAuth: true });
    
                localStorage.removeItem("token");
                localStorage.setItem("role", 'ROLE_GUESS');
                localStorage.setItem("username", '');
                localStorage.setItem("userId", 0);
                setRole('ROLE_GUESS');
                setUserId(0);
                console.log("User logged out!");
            } catch (error) {
                // Handle any errors from the request
                console.error('Logout Error:', error);
                alert('Ocurrió un error al cerrar sesión. Por favor, inténtalo de nuevo.');
            }
        } else {
            console.warn('No username found in localStorage for logout.');
        }
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