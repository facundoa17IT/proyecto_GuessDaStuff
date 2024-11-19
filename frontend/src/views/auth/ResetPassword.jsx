import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosConfig'; // Ajustado para que use el path correcto

function ResetPassword() {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Obtener el token de la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get('token');
    console.log("tokenFromUrl"+tokenFromUrl);
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Token no proporcionado o inválido');
    }
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axiosInstance.post(`/v1/reset-password?token=${token}&newPassword=${newPassword}`);
      
      if (response.status === 200) {
        setMessage('Contraseña restablecida exitosamente');
        navigate('/login'); // Redirigir al usuario a la página de login después
      }
    } catch (error) {
      setMessage('Error al restablecer la contraseña. Por favor, intente de nuevo.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Restablecer contraseña</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar nueva contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Restablecer contraseña</button>
      </form>
    </div>
  );
}

export default ResetPassword;