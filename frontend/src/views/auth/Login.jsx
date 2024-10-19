import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/layouts/Modal';
import axiosInstance from '../../AxiosConfig';
import {useRole} from '../../contextAPI/AuthContext'

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');

    const messageClass = isError ? 'text-error' : 'text-success';
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { setRole } = useRole();  // Access the setRole function from the context

    const onClose = () => {
        navigate("/")
    }

    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', {
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

            // Get user role
            const role = decodedToken.role[0].authority;
            console.log('Role:', role);

            // Store user Role in Local Storage & AuthContext
            localStorage.setItem('role', role);
            setRole(role);
            
            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            if (error.response && error.response.data) {
                setMessage(error.response.data.message);
                console.log('Login failed: ', error.response.data.message);
            }
            setIsError(true);
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
            <a style={{ marginBottom: '15px' }} href="">Restaurar Contraseña</a>
        </Modal>
    );
};