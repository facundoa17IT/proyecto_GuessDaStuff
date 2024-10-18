import React from "react"

import { useRole } from '../../contextAPI/AuthContext'

const LogoutButton = () => {
    const { setRole } = useRole();  // Access the role from context

    const LogOut = () => {
        // Remove user role from local storage & context API
        localStorage.setItem("token", null);
        localStorage.setItem("role", 'ROLE_GUESS');
        setRole('ROLE_GUESS');
        console.log("User logged out!")
    }

    return (
        <button onClick={LogOut}>Cerrar Sesion</button>
    )
}

export default LogoutButton;