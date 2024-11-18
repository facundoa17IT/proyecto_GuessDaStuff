/** React **/
import React, { useState } from 'react';
import axiosInstance from '../../utils/AxiosConfig';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post(`/v1/forgot-password/${email}`);
            setMessage(response.data);
            setError('');
        } catch (error) {
            console.error('Error in password recovery:', error);
            if (error.response?.data) {
                setError(error.response.data);
            } else {
                setError('An error occurred. Please try again later.');
            }
            setMessage('');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Recuperar Contraseña</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
