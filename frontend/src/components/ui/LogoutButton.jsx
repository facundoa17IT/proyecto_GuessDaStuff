import React,{useContext} from "react"

import { useRole } from '../../contextAPI/AuthContext'
import axiosInstance from "../../utils/AxiosConfig";

import { ImExit } from "react-icons/im";
import { SocketContext } from '../../contextAPI/SocketContext';

const LogoutButton = () => {
    const { setRole, setUserId } = useRole();  // Access the role from context
    const { disconnect } = useContext(SocketContext);

    const logOut = async () => {
        const userObj = JSON.parse(localStorage.getItem("userObj"));

        if (userObj) {
            try {
                await axiosInstance.put(`/v1/logout/${userObj.username}`,{}, { requiresAuth: true });
                disconnect(userObj);
                localStorage.removeItem("token");
                localStorage.setItem("role", 'ROLE_GUESS');
                localStorage.setItem("username", '');
                localStorage.setItem("userId", 0);
                localStorage.setItem("dtoUserOnline", null);
                setRole('ROLE_GUESS');
                setUserId(0);
                console.log("User logged out!");
            } catch (error) {
                // Handle any errors from the request
                console.error('Logout Error:', error);
                alert('Ocurrió un error al cerrar sesión. Por favor, inténtalo de nuevo.');
            }
        } else {
            console.warn('No userObj found in localStorage for logout.');
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