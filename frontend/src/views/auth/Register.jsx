import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/layouts/Modal';
import idle from '../../assets/profile-icon-placeholder.png';
import { MdDriveFolderUpload } from "react-icons/md";
import axiosInstance from '../../AxiosConfig';
export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(0);
    
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onClose = () => {
        navigate("/")
    }

    const register = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/register', {
                username,
                password,
                email,
                role
            });
            console.log('Registration successful!');
            console.log(response.data);

            navigate('/login');
        } catch (error) {
            console.error('Error registering:', error.response.data.message);
        }
    };

    const goToLogIn = () => {
        navigate('/login');
    };

    return (
        <Modal showModal={true} onConfirm={register} closeModal={onClose} title="Registrarse">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '325px', margin: '5px' }}>
                <img src={imagePreview ? imagePreview : idle} alt="Profile Preview" style={{ width: '120px', height: '80px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', border: '2px solid var(--border-color)', backgroundColor: 'var(--secondary-bg-color)', padding: '10px' }} htmlFor="file-upload" className="custom-file-upload">
                    <MdDriveFolderUpload style={{ fontSize: '20px', marginRight: '5px' }} />Seleccionar Imagen
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} />
            </div>
            <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </Modal>
    );
};