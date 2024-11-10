/** React **/
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

/** Components **/
import Modal from '../../components/layouts/Modal';

/** Utils **/
import axiosInstance from '../../utils/AxiosConfig';
import { jwtDecode } from 'jwt-decode';

/** Context API **/
import { useRole } from '../../contextAPI/AuthContext'
import { SocketContext } from '../../contextAPI/SocketContext';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const { connect } = useContext(SocketContext);
    const { setRole, setUserId } = useRole();  // Access the setRole function from the context

    const navigate = useNavigate();

    const onClose = () => {
        navigate("/")
    }

    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/v1/login', {
                username,
                password,
            });
            
            const { token } = response.data;

            // Save token to local storage
            localStorage.setItem('token', token);
            console.log('User logged -> Token: ', token);

            // Decode token
            const decodedToken = jwtDecode(token);
            console.log('Decoded Token:', decodedToken);

            // Store user Id
            const jwtUserId = decodedToken.userId;
            localStorage.setItem('userId', jwtUserId);
            console.log('User logged -> ID: ', jwtUserId);
            setUserId(jwtUserId);

            // Get user role
            const role = decodedToken.role[0].authority;
            console.log('Role:', role);

            // Store user Role in Local Storage & AuthContext
            localStorage.setItem('role', role);
            setRole(role);

            // Get username
            const jwtUsername = decodedToken.sub;
            console.log('jwt Username:', jwtUsername);
            localStorage.setItem('username', jwtUsername);

            // Agrega el usuario a la lista de usuarios conectados usando socket 
            connect(jwtUsername);

            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response?.data) {
                setError(error.response.data.message);
                setMessage(error.response.data.message);
                console.log('Login failed: ', error.response.data.message);
            }
        }
    };

    return (
        <Modal onConfirm={login} showModal={true} closeModal={onClose} title="Iniciar Sesion">
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <a style={{ marginBottom: '15px' }} href="restaurar contraseña">Restaurar Contraseña</a>
        </Modal>
    );
};