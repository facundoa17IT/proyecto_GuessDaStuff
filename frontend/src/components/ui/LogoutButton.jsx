import React from "react"

import { useRole } from '../../contextAPI/AuthContext'

import { ImExit } from "react-icons/im";

const LogoutButton = () => {
    const { setRole } = useRole();  // Access the role from context

    const logOut = () => {
        // Remove user role from local storage & context API
        localStorage.setItem("token", null);
        localStorage.setItem("role", 'ROLE_GUESS');
        setRole('ROLE_GUESS');
        console.log("User logged out!")
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